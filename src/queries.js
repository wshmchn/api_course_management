/* eslint-disable consistent-return */
const { pool } = require('./dbConnection');

const getAllCourses = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM courses
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const getAvailableCourses = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT courses.CourseID, courses.Title, users.Name as TeacherName
      FROM courses 
      LEFT JOIN users ON courses.TeacherID = users.UserID
      WHERE isAvailable = 1
    `);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const getCourse = async (courseId) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM courses WHERE CourseID = ?
    `, [courseId]);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (userId) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM users WHERE UserID = ?
    `, [userId]);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
};

const toggleCourseAvailability = async (courseId) => {
  try {
    const [result] = await pool.execute(`
      UPDATE courses
      SET isAvailable = if(isAvailable = 0, 1, 0)
      WHERE CourseID = ?
    `, [courseId]);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const assignCoursesToTeacher = async (courseId, teacherId) => {
  try {
    const [result] = await pool.execute(`
      UPDATE courses
      SET TeacherID = ?
      WHERE CourseID = ?
    `, [teacherId, courseId]);
    return result;
  } catch (error) {
    console.error('Error assigning courses:', error);
    throw error;
  }
};

const toggleStudentEnrolment = async (courseID, userID) => {
  try {
    // Check if the student is already enrolled in the specified course
    const [existingEnrollment] = await pool.execute(`
      SELECT * FROM enrolments
      WHERE CourseID = ? AND UserID = ?
    `, [courseID, userID]);

    // If the student is already enrolled, return a message
    if (existingEnrollment.length > 0) {
      return "You are already enrolled in this course.";
    }

    // If the student is not enrolled, insert a new enrollment record
    const [enrolmentStatus] = await pool.execute(`
      INSERT INTO enrolments (CourseID, UserID)
      VALUES (?, ?)
    `, [courseID, userID]);

    return enrolmentStatus;
  } catch (err) {
    console.log(err);
  }
};

const getAllEnrolments = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM enrolments
      `);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const getEnrolment = async (enrolmentID) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM enrolments WHERE EnrolmentID = ?
      `, [enrolmentID]);
    return rows[0];
  } catch (err) {
    console.log(err);
  }
};

const giveMark = async (enrolmentID, markValue) => {
  try {
    const [result] = await pool.execute(`
      UPDATE enrolments 
      SET Mark = ?
      WHERE EnrolmentID = ?
    `, [markValue, enrolmentID]);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAllCourses,
  getAvailableCourses,
  getUser,
  getCourse,
  toggleCourseAvailability,
  getAllEnrolments,
  getEnrolment,
  giveMark,
  assignCoursesToTeacher,
  toggleStudentEnrolment,
};
