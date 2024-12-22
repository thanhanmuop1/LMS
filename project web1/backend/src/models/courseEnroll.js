const db = require('../configs/database');

const checkEnrollment = (userId, courseId, callback) => {
  db.query(
    'SELECT * FROM course_enrollments WHERE user_id = ? AND course_id = ?',
    [userId, courseId],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results.length > 0);
    }
  );
};

const enrollUserInCourse = (userId, courseId, callback) => {
  db.query(
    'INSERT INTO course_enrollments (user_id, course_id) VALUES (?, ?)',
    [userId, courseId],
    (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const getTeacherStats = (teacherId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.id as course_id,
                c.title as course_title,
                COUNT(DISTINCT ce.user_id) as student_count
            FROM courses c
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            WHERE c.teacher_id = ?
            GROUP BY c.id, c.title
        `;

        db.query(query, [teacherId], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

module.exports = { checkEnrollment,
     enrollUserInCourse,
     getTeacherStats }; 