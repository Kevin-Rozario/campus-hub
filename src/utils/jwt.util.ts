import jwt from "jsonwebtoken";

export interface IUser {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (user: IUser): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || "1h";

  if (!secret) {
    throw new Error("Access token secret is not defined");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET!;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || "7d";

  if (!secret) {
    throw new Error("Refresh token secret is not defined");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    }
  );
};

export const verifyToken = (token: string, tokenType: string): IUser => {
  let secret: string;

  if (tokenType === "access") {
    secret = process.env.ACCESS_TOKEN_SECRET!;
    if (!secret) throw new Error("Access token secret is not defined");
  } else {
    secret = process.env.REFRESH_TOKEN_SECRET!;
    if (!secret) throw new Error("Refresh token secret is not defined");
  }

  const decoded = jwt.verify(token, secret);
  if (
    typeof decoded === "object" &&
    decoded !== null &&
    "id" in decoded &&
    "email" in decoded &&
    "role" in decoded
  ) {
    return decoded as IUser;
  }

  throw new Error("Invalid token payload");
};
