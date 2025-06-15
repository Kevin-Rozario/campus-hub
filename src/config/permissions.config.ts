const permissions = {
  "/announcements": {
    GET: ["Student", "Faculty", "Admin"],
    POST: ["Admin", "Faculty"],
  },
  results: {
    POST: ["Admin"],
  },
  "/results/:studentId": {
    GET: ["Student", "Faculty", "Admin"],
  },
  "/courses": {
    GET: ["Student", "Faculty", "Admin"],
    POST: ["Admin"],
  },
  "/courses/:courseId/materials": {
    GET: ["Student", "Faculty"],
    POST: ["Faculty"],
  },
  "/admin/users": {
    GET: ["Admin"],
  },
  "/admin/users/:id/role": {
    PUT: ["Admin"],
  },
};

export default permissions;
