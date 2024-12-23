import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoManagementBase from '../../common/course/VideoManagementBase';
import VideoManagementProvider from '../../common/course/VideoManagementProvider';
import AddChapter from '../../admin/courses/manage_chapter/add_chapter';
import EditChapter from '../../admin/courses/manage_chapter/edit_chapter';
import AddVideo from '../../admin/courses/manage_video/add_video';
import EditVideo from '../../admin/courses/manage_video/edit_video';
import DocumentManagement from './manage_document/document_management';
import Navbar from '../../navbar/navbar';
import Sidebar from '../../sidebar/sidebar';
import '../teacher_page.css';

const VideoManagement = () => {
  const { courseId } = useParams();
  const [isAddChapterVisible, setIsAddChapterVisible] = useState(false);
  const [isEditChapterVisible, setIsEditChapterVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isAddVideoVisible, setIsAddVideoVisible] = useState(false);
  const [isEditVideoVisible, setIsEditVideoVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedChapterForVideo, setSelectedChapterForVideo] = useState(null);
  const [isAssignQuizVisible, setIsAssignQuizVisible] = useState(false);
  const [selectedVideoForQuiz, setSelectedVideoForQuiz] = useState(null);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [selectedVideoForDocs, setSelectedVideoForDocs] = useState(null);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content teacher-container">
          <div className="course-management">
            <VideoManagementProvider courseId={courseId} role="teacher">
              {({
                videos,
                chapters,
                loading,
                courseInfo,
                availableQuizzes,
                handleDeleteVideo,
                handleDeleteChapter,
                handleAssignQuiz,
                handleUnassignQuiz,
                fetchAvailableQuizzes,
                fetchCourseData
              }) => (
                <>
                  <VideoManagementBase
                    courseInfo={courseInfo}
                    chapters={chapters}
                    videos={videos}
                    loading={loading}
                    onAddChapter={() => setIsAddChapterVisible(true)}
                    onEditChapter={(chapter) => {
                      setSelectedChapter(chapter);
                      setIsEditChapterVisible(true);
                    }}
                    onDeleteChapter={handleDeleteChapter}
                    onAddVideo={(chapter) => {
                      setSelectedChapterForVideo(chapter);
                      setIsAddVideoVisible(true);
                    }}
                    onEditVideo={(video) => {
                      setSelectedVideo(video);
                      setIsEditVideoVisible(true);
                    }}
                    onDeleteVideo={handleDeleteVideo}
                    onManageDocuments={(video) => {
                      setSelectedVideoForDocs(video);
                      setIsDocumentModalVisible(true);
                    }}
                    onAssignQuiz={(video) => {
                      setSelectedVideoForQuiz(video);
                      setIsAssignQuizVisible(true);
                      fetchAvailableQuizzes(video.id);
                    }}
                    availableQuizzes={availableQuizzes}
                    selectedVideoForQuiz={selectedVideoForQuiz}
                    isAssignQuizVisible={isAssignQuizVisible}
                    onAssignQuizModalClose={() => {
                      setIsAssignQuizVisible(false);
                      setSelectedVideoForQuiz(null);
                    }}
                    onQuizAssign={(quizId) => handleAssignQuiz(selectedVideoForQuiz.id, quizId)}
                    onQuizUnassign={(quizId) => handleUnassignQuiz(selectedVideoForQuiz.id, quizId)}
                  />

                  {/* Các modal components */}
                  <AddChapter
                    visible={isAddChapterVisible}
                    onCancel={() => setIsAddChapterVisible(false)}
                    onSuccess={() => {
                      setIsAddChapterVisible(false);
                      fetchCourseData();
                    }}
                    courseId={courseId}
                  />

                  <EditChapter
                    visible={isEditChapterVisible}
                    onCancel={() => {
                      setIsEditChapterVisible(false);
                      setSelectedChapter(null);
                    }}
                    onSuccess={() => {
                      setIsEditChapterVisible(false);
                      setSelectedChapter(null);
                      fetchCourseData();
                    }}
                    chapterData={selectedChapter}
                  />

                  <AddVideo
                    visible={isAddVideoVisible}
                    onCancel={() => {
                      setIsAddVideoVisible(false);
                      setSelectedChapterForVideo(null);
                    }}
                    onSuccess={() => {
                      setIsAddVideoVisible(false);
                      setSelectedChapterForVideo(null);
                      fetchCourseData();
                    }}
                    courseId={courseId}
                    chapterId={selectedChapterForVideo?.id}
                  />

                  <EditVideo
                    visible={isEditVideoVisible}
                    onCancel={() => {
                      setIsEditVideoVisible(false);
                      setSelectedVideo(null);
                    }}
                    onSuccess={() => {
                      setIsEditVideoVisible(false);
                      setSelectedVideo(null);
                      fetchCourseData();
                    }}
                    videoData={selectedVideo}
                  />

                  <DocumentManagement
                    visible={isDocumentModalVisible}
                    onCancel={() => {
                      setIsDocumentModalVisible(false);
                      setSelectedVideoForDocs(null);
                    }}
                    courseId={courseId}
                    chapterId={selectedVideoForDocs?.chapter_id}
                    videoId={selectedVideoForDocs?.id}
                  />
                </>
              )}
            </VideoManagementProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoManagement; 