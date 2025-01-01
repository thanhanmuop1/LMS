import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoManagementBase from '../../../common/course/VideoManagementBase';
import VideoManagementProvider from '../../../common/course/VideoManagementProvider';
import AddChapter from '../manage_chapter/add_chapter';
import EditChapter from '../manage_chapter/edit_chapter';
import EditVideoModal from '../../../common/video/EditVideoModal';
import AddVideoModal from '../../../common/video/AddVideoModal';
import Navbar from '../../../navbar/navbar';
import Sidebar from '../../../sidebar/sidebar';

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

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content">
          <div className="course-management">
            <VideoManagementProvider courseId={courseId} role="admin">
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

                  <AddVideoModal
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
                    role="admin"
                  />

                  <EditVideoModal
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
                    role="admin"
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