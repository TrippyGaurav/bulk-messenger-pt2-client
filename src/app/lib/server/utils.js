"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getCookie = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  return token;
};

export const getCurrentUser = async () => {
  const token = await getCookie();
  const user = jwt.decode(token);
  return user;
};
