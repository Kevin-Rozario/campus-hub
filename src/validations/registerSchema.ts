import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .toLowerCase()
    .trim(),
  role: z.enum(["Student", "Faculty", "Admin"]),
  phoneNUmber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .trim()
    .optional(),
});

export default registerSchema;
