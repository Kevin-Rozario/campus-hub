const permissions = {
  "/all-announcements": {
    GET: ["Student", "Faculty", "Admin"],
    POST: ["Admin", "Faculty"],
  },
  "/take-attendance": {
    POST: ["Faculty"],
  },
  "/student-attendance/:studentId": {
    GET: ["Student", "Admin", "Faculty"],
  },
  "/course-attendance/:courseId": {
    GET: ["Admin", "Faculty"],
  },
  "/all-courses": {
    GET: ["Student", "Faculty", "Admin"],
    POST: ["Admin"],
  },
  "/:courseId/materials": {
    GET: ["Student", "Faculty"],
    POST: ["Faculty"],
  },
  "/all-enrollments": {
    GET: ["Admin"],
    POST: ["Admin"],
  },
  "/students-enrollments/:studentId": {
    GET: ["Student", "Admin"],
  },
  "/course-enrollments/:courseId": {
    GET: ["Faculty", "Admin"],
  },
  "/all-events": {
    GET: ["Student", "Faculty", "Admin"],
    POST: ["Admin"],
  },
  "/upload-results": {
    POST: ["Admin"],
  },
  "/student-results/:studentId": {
    GET: ["Student", "Faculty", "Admin"],
  },
  "/users": {
    GET: ["Admin"],
  },
  "/users/:id/role": {
    PUT: ["Admin"],
  },
};

export default permissions;
