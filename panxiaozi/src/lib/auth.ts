import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { findUserById } from "./db/queries/user";

export type UserSession = {
  id: number;
  username: string;
};

export async function getSession(): Promise<UserSession | null> {
  const token = (await cookies()).get("admin-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key",
    );
    const decoded = await jwtVerify(token, secret);
    return decoded.payload as UserSession;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const currentUser = await findUserById(session.id);
  if (!currentUser) {
    return null;
  }

  return {
    id: currentUser.id,
    username: currentUser.username,
  };
}
