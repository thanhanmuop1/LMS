cd backend
npm install bcrypt cors express jsonwebtoken multer mysql2 nodemon

nhập vào mysql workbench hay xampp:


ALTER TABLE users 
	ADD COLUMN timestamp NOT NULL DEFAULT current_timestamp()
 	ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
  	ADD COLUMN verification_token VARCHAR(255);

-- Tạo bảng course_enrollments để thống kê
CREATE TABLE course_enrollments (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  course_id int(11) NOT NULL,
  enrolled_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_enrollment (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;