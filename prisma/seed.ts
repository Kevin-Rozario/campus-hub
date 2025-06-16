import { faker } from "@faker-js/faker";
import prisma from "../src/config/db.config.js";

const RECORD_COUNT = {
  users: 10,
  events: 10,
  courses: 10,
  attendance: 10,
  enrollments: 10,
  announcements: 10,
  results: 10,
};

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding the database", e);
    await prisma.$disconnect();
    process.exit(1);
  });
