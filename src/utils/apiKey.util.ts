import crypto from "crypto";

export const hashApiKey: (key: string) => string = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};
export const generateApiKey: () => string = () => {
  return crypto.randomBytes(16).toString("hex");
};
