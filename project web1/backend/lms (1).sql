SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE chapters (
  id int(11) NOT NULL,
  course_id int(11) DEFAULT NULL,
  title varchar(255) DEFAULT NULL,
  order_index int(11) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO chapters (id, course_id, title, order_index, created_at) VALUES
(1, 1, 'Chương 1', 1, '2024-11-22 03:19:38'),
(2, 1, 'Chương 2', 2, '2024-11-22 03:21:46');

CREATE TABLE courses (
  id int(11) NOT NULL,
  title varchar(200) NOT NULL,
  description text DEFAULT NULL,
  thumbnail varchar(255) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO courses (id, title, description, thumbnail, created_at) VALUES
(1, 'Triết học Mac', 'sad', 'https://lms.ptit.edu.vn/web/image/slide.channel/2/image_1024?unique=845783c', '2024-11-20 04:39:01');

CREATE TABLE users (
  id int(11) NOT NULL,
  username varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  full_name varchar(100) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  role enum('admin','student','teacher') DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO users (id, username, email, password, full_name, created_at, role) VALUES
(1, 'thanhanmuop@gmail.com', 'thanhanmuop@gmail.com', '$2b$10$PdsZIgi72FKX5TreyZAduOQ7kqCCVMTasW6wMwCYSq6vppElnb1pK', 'thành', '2024-11-27 01:33:45', 'student'),
(2, 'thanhanmuop', 'thanhanmuop1@gmail.com', '$2b$10$LspKUNuIvH/QtwIioaAcIO/Sjx/IhxHlmy5TBT92Vrkmg9pwQ/hny', 'thành', '2024-11-28 01:40:28', 'admin');

CREATE TABLE videos (
  id int(11) NOT NULL,
  title varchar(200) NOT NULL,
  course_id int(11) NOT NULL,
  video_url varchar(255) NOT NULL,
  chapter_id int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO videos (id, title, course_id, video_url, chapter_id) VALUES
(1, 'Machiot', 1, 'https://www.youtube.com/watch?v=aZGVs9ScLpA', 1),
(2, 'LIVE SET | ON A TRIP BY QUAN ADN | MIXSET HOUSELAK TRÊN XE Ô TÔ 2024', 1, 'https://www.youtube.com/watch?v=WZUTGermWzU', 1),
(4, 'LUÔN VUI TƯƠI #22', 1, 'https://www.youtube.com/watch?v=hxtNgWP_9t4', 2);

CREATE TABLE video_progress (
  id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  video_id int(11) NOT NULL,
  completed tinyint(1) DEFAULT 0,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE chapters
  ADD PRIMARY KEY (id),
  ADD KEY course_id (course_id);

ALTER TABLE courses
  ADD PRIMARY KEY (id);

ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY username (username),
  ADD UNIQUE KEY email (email);

ALTER TABLE videos
  ADD PRIMARY KEY (id),
  ADD KEY course_id (course_id),
  ADD KEY chapter_id (chapter_id);

ALTER TABLE video_progress
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY user_video_unique (user_id,video_id),
  ADD KEY video_id (video_id);


ALTER TABLE chapters
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE courses
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE users
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE videos
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE video_progress
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE chapters
  ADD CONSTRAINT chapters_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses (id);

ALTER TABLE videos
  ADD CONSTRAINT videos_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses (id),
  ADD CONSTRAINT videos_ibfk_2 FOREIGN KEY (chapter_id) REFERENCES chapters (id);

ALTER TABLE video_progress
  ADD CONSTRAINT video_progress_ibfk_1 FOREIGN KEY (user_id) REFERENCES `users` (id),
  ADD CONSTRAINT video_progress_ibfk_2 FOREIGN KEY (video_id) REFERENCES videos (id);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
