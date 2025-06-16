import express from "express";
import authRoutes from "./routes/auth.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import courseRoutes from "./routes/courses.route.js";
import enrollmentRoutes from "./routes/enrollments.route.js";
import eventRoutes from "./routes/events.route.js";
import resultRoutes from "./routes/results.route.js";
import announcementRoutes from "./routes/announcements.route.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/attendances", attendanceRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/admin", adminRoutes);

export default app;
