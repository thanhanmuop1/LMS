cd backend
npm install bcrypt cors express jsonwebtoken multer mysql2 nodemon

nhập vào mysql workbench hay xampp:

CREATE TABLE chapters (
  id int(11) NOT NULL,
  course_id int(11) DEFAULT NULL,
  title varchar(255) DEFAULT NULL,
  order_index int(11) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE courses (
  id int(11) NOT NULL,
  title varchar(200) NOT NULL,
  description text DEFAULT NULL,
  thumbnail varchar(255) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  is_public tinyint(4) NOT NULL,
  teacher_id int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE course_enrollments (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  course_id int(11) NOT NULL,
  enrolled_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE documents (
  id int(11) NOT NULL,
  title varchar(255) NOT NULL,
  file_path varchar(255) NOT NULL,
  file_type varchar(50) NOT NULL,
  course_id int(11) NOT NULL,
  chapter_id int(11) DEFAULT NULL,
  video_id int(11) DEFAULT NULL,
  uploaded_at timestamp NOT NULL DEFAULT current_timestamp(),
  teacher_id int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quizzes (
  id int(11) NOT NULL,
  title varchar(255) NOT NULL,
  course_id int(11) DEFAULT NULL,
  chapter_id int(11) DEFAULT NULL,
  video_id int(11) DEFAULT NULL,
  duration_minutes int(11) DEFAULT 30,
  passing_score int(11) DEFAULT 60,
  quiz_type enum('video','chapter') DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  teacher_id int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quiz_answers (
  id int(11) NOT NULL,
  attempt_id int(11) NOT NULL,
  question_id int(11) NOT NULL,
  selected_option_id int(11) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quiz_attempts (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  quiz_id int(11) NOT NULL,
  score int(11) NOT NULL,
  status enum('completed','failed') NOT NULL,
  end_time timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quiz_options (
  id int(11) NOT NULL,
  question_id int(11) NOT NULL,
  option_text text NOT NULL,
  is_correct tinyint(1) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quiz_questions (
  id int(11) NOT NULL,
  quiz_id int(11) NOT NULL,
  question_text text NOT NULL,
  points int(11) DEFAULT 1,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  allows_multiple_correct tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quiz_tags (
  id int(11) NOT NULL,
  name varchar(50) NOT NULL,
  type enum('subject','topic','skill','level') NOT NULL,
  description text DEFAULT NULL,
  parent_id int(11) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE quiz_tag_relations (
  quiz_id int(11) NOT NULL,
  tag_id int(11) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE users (
  id int(11) NOT NULL,
  username varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  full_name varchar(100) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  role enum('admin','student','teacher') DEFAULT 'student',
  email_verified tinyint(1) DEFAULT 0,
  verification_token varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE videos (
  id int(11) NOT NULL,
  title varchar(200) NOT NULL,
  course_id int(11) NOT NULL,
  video_url varchar(255) NOT NULL,
  chapter_id int(11) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE video_completion (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  video_id int(11) NOT NULL,
  is_completed tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE chapters
  ADD PRIMARY KEY (id),
  ADD KEY course_id (course_id);

ALTER TABLE courses
  ADD PRIMARY KEY (id),
  ADD KEY idx_teacher_id (teacher_id);

ALTER TABLE course_enrollments
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY unique_enrollment (user_id,course_id),
  ADD KEY course_id (course_id);

ALTER TABLE documents
  ADD PRIMARY KEY (id),
  ADD KEY course_id (course_id),
  ADD KEY chapter_id (chapter_id),
  ADD KEY video_id (video_id);

ALTER TABLE quizzes
  ADD PRIMARY KEY (id),
  ADD KEY course_id (course_id),
  ADD KEY chapter_id (chapter_id),
  ADD KEY video_id (video_id) USING BTREE;

ALTER TABLE quiz_answers
  ADD PRIMARY KEY (id),
  ADD KEY attempt_id (attempt_id),
  ADD KEY question_id (question_id),
  ADD KEY selected_option_id (selected_option_id);

ALTER TABLE quiz_attempts
  ADD PRIMARY KEY (id),
  ADD KEY user_id (user_id),
  ADD KEY quiz_id (quiz_id);

ALTER TABLE quiz_options
  ADD PRIMARY KEY (id),
  ADD KEY question_id (question_id);

ALTER TABLE quiz_questions
  ADD PRIMARY KEY (id),
  ADD KEY quiz_id (quiz_id);

ALTER TABLE quiz_tags
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY name_type (name,type),
  ADD KEY parent_id (parent_id);

ALTER TABLE quiz_tag_relations
  ADD PRIMARY KEY (quiz_id,tag_id),
  ADD KEY tag_id (tag_id);

ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY username (username),
  ADD UNIQUE KEY email (email);

ALTER TABLE videos
  ADD PRIMARY KEY (id),
  ADD KEY course_id (course_id),
  ADD KEY chapter_id (chapter_id);

ALTER TABLE video_completion
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY user_video (user_id,video_id),
  ADD KEY video_completion_ibfk_2 (video_id);


ALTER TABLE chapters
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE courses
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE course_enrollments
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE documents
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE quizzes
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE quiz_answers
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE quiz_attempts
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE quiz_options
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE quiz_questions
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE quiz_tags
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE videos
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE video_completion
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE chapters
  ADD CONSTRAINT chapters_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses (id);

ALTER TABLE courses
  ADD CONSTRAINT courses_ibfk_1 FOREIGN KEY (teacher_id) REFERENCES `users` (id),
  ADD CONSTRAINT quizzes_ibfk_4 FOREIGN KEY (teacher_id) REFERENCES `users` (id);

ALTER TABLE course_enrollments
  ADD CONSTRAINT course_enrollments_ibfk_1 FOREIGN KEY (user_id) REFERENCES `users` (id) ON DELETE CASCADE,
  ADD CONSTRAINT course_enrollments_ibfk_2 FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE;

ALTER TABLE documents
  ADD CONSTRAINT documents_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses (id),
  ADD CONSTRAINT documents_ibfk_2 FOREIGN KEY (chapter_id) REFERENCES chapters (id),
  ADD CONSTRAINT documents_ibfk_3 FOREIGN KEY (video_id) REFERENCES videos (id);

ALTER TABLE quizzes
  ADD CONSTRAINT quizzes_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
  ADD CONSTRAINT quizzes_ibfk_2 FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE SET NULL,
  ADD CONSTRAINT quizzes_ibfk_3 FOREIGN KEY (video_id) REFERENCES videos (id) ON DELETE SET NULL;

ALTER TABLE quiz_answers
  ADD CONSTRAINT quiz_answers_ibfk_1 FOREIGN KEY (attempt_id) REFERENCES quiz_attempts (id) ON DELETE CASCADE,
  ADD CONSTRAINT quiz_answers_ibfk_2 FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE,
  ADD CONSTRAINT quiz_answers_ibfk_3 FOREIGN KEY (selected_option_id) REFERENCES quiz_options (id) ON DELETE CASCADE;

ALTER TABLE quiz_attempts
  ADD CONSTRAINT quiz_attempts_ibfk_1 FOREIGN KEY (user_id) REFERENCES `users` (id),
  ADD CONSTRAINT quiz_attempts_ibfk_2 FOREIGN KEY (quiz_id) REFERENCES quizzes (id);

ALTER TABLE quiz_options
  ADD CONSTRAINT quiz_options_ibfk_1 FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE;

ALTER TABLE quiz_questions
  ADD CONSTRAINT quiz_questions_ibfk_1 FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE;

ALTER TABLE quiz_tags
  ADD CONSTRAINT quiz_tags_ibfk_1 FOREIGN KEY (parent_id) REFERENCES quiz_tags (id);

ALTER TABLE quiz_tag_relations
  ADD CONSTRAINT quiz_tag_relations_ibfk_1 FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE,
  ADD CONSTRAINT quiz_tag_relations_ibfk_2 FOREIGN KEY (tag_id) REFERENCES quiz_tags (id) ON DELETE CASCADE;

ALTER TABLE videos
  ADD CONSTRAINT videos_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses (id),
  ADD CONSTRAINT videos_ibfk_2 FOREIGN KEY (chapter_id) REFERENCES chapters (id);

ALTER TABLE video_completion
  ADD CONSTRAINT video_completion_ibfk_1 FOREIGN KEY (user_id) REFERENCES `users` (id),
  ADD CONSTRAINT video_completion_ibfk_2 FOREIGN KEY (video_id) REFERENCES videos (id);