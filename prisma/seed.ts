import { faker } from "@faker-js/faker";
import prisma from "../src/config/db.config.js";

const RECORD_COUNT = {
  users: 30,
  announcements: 10,
  courses: 10,
  materials: 10,
  results: 20,
  enrollments: 20,
  attendances: 20,
  events: 5,
};

const GradeType = [
  "A_PLUS",
  "A",
  "A_MINUS",
  "B_PLUS",
  "B",
  "B_MINUS",
  "C_PLUS",
  "C",
  "C_MINUS",
  "D_PLUS",
  "D",
  "D_MINUS",
  "F",
  "INCOMPLETE",
  "PASS",
  "FAIL",
] as const;

const AttendanceStatus = ["Present", "Absent", "Late", "Excused"] as const;

let studentIds: string[] = [];
let facultyIds: string[] = [];
let adminIds: string[] = [];
let courseIds: string[] = [];

const seedUsers = async () => {
  const usersData = Array.from({ length: RECORD_COUNT.users }).map(() => {
    const role = faker.helpers.arrayElement([
      "Student",
      "Faculty",
      "Admin",
    ] as const);
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role,
    };
  });

  const users = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  });

  // Fetch created users with roles
  const createdUsers = await prisma.user.findMany({
    select: { id: true, role: true },
  });

  for (const user of createdUsers) {
    if (user.role === "Student") studentIds.push(user.id);
    else if (user.role === "Faculty") facultyIds.push(user.id);
    else adminIds.push(user.id);
  }
};

const seedCourses = async () => {
  const courses = await prisma.course.createMany({
    data: Array.from({ length: RECORD_COUNT.courses }).map(() => ({
      code: faker.string.alphanumeric(6).toUpperCase(),
      name: faker.word.noun(),
      description: faker.lorem.paragraph(),
      credits: faker.number.int({ min: 1, max: 5 }),
      createdById: faker.helpers.arrayElement(adminIds),
    })),
  });

  const allCourses = await prisma.course.findMany({ select: { id: true } });
  courseIds = allCourses.map((c) => c.id);
};

const seedAnnouncements = async () => {
  await prisma.announcement.createMany({
    data: Array.from({ length: RECORD_COUNT.announcements }).map(() => ({
      title: faker.lorem.words(5),
      body: faker.lorem.paragraph(),
      postedById: faker.helpers.arrayElement([...adminIds, ...facultyIds]),
    })),
  });
};

const seedMaterials = async () => {
  await prisma.material.createMany({
    data: Array.from({ length: RECORD_COUNT.materials }).map(() => ({
      title: faker.lorem.sentence(),
      url: faker.internet.url(),
      fileSize: faker.number.int({ min: 500, max: 2000 }),
      mimeType: faker.helpers.arrayElement([
        "application/pdf",
        "image/png",
        "image/jpeg",
        "text/plain",
      ]),
      courseId: faker.helpers.arrayElement(courseIds),
      uploadedById: faker.helpers.arrayElement(facultyIds),
    })),
  });
};

const seedResults = async () => {
  await Promise.all(
    Array.from({ length: RECORD_COUNT.results }).map(() =>
      prisma.result.create({
        data: {
          studentId: faker.helpers.arrayElement(studentIds),
          courseId: faker.helpers.arrayElement(courseIds),
          grade: faker.helpers.arrayElement(GradeType),
          numericGrade: faker.number.float({ min: 0, max: 100 }),
          maxPoints: 100,
          examType: faker.helpers.arrayElement(["Midterm", "Final", "Quiz"]),
          declaredById: faker.helpers.arrayElement(adminIds),
        },
      })
    )
  );
};

const seedEnrollments = async () => {
  await Promise.all(
    Array.from({ length: RECORD_COUNT.enrollments }).map(() =>
      prisma.enrollment.create({
        data: {
          studentId: faker.helpers.arrayElement(studentIds),
          courseId: faker.helpers.arrayElement(courseIds),
        },
      })
    )
  );
};

const seedAttendances = async () => {
  await Promise.all(
    Array.from({ length: RECORD_COUNT.attendances }).map(() =>
      prisma.attendance.create({
        data: {
          studentId: faker.helpers.arrayElement(studentIds),
          courseId: faker.helpers.arrayElement(courseIds),
          status: faker.helpers.arrayElement(AttendanceStatus),
          facultyId: faker.helpers.arrayElement(facultyIds),
          date: faker.date.recent({ days: 30 }),
        },
      })
    )
  );
};

const seedEvents = async () => {
  await prisma.event.createMany({
    data: Array.from({ length: RECORD_COUNT.events }).map(() => ({
      title: faker.company.buzzPhrase(),
      description: faker.lorem.paragraph(),
      startDate: faker.date.future(),
      endDate: faker.date.future({ years: 1 }),
      location: faker.location.city(),
      organizerId: faker.helpers.arrayElement([...facultyIds, ...adminIds]),
      eventForRole: [
        faker.helpers.arrayElement(["Student", "Faculty", "Admin"]),
      ],
    })),
  });
};

const main = async () => {
  console.log("🌱 Seeding database...");
  await seedUsers();
  await seedCourses();
  await Promise.all([
    seedAnnouncements(),
    seedMaterials(),
    seedResults(),
    seedEnrollments(),
    seedAttendances(),
    seedEvents(),
  ]);
  console.log("✅ Done seeding.");
};

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
