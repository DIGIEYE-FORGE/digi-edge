import { z } from "zod";
import { sign, verify } from "jsonwebtoken";
import env from "../common/env";
import { genSalt, hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import prisma from "../common/prisma";

export const isMin = (min: number) =>
  z.string().min(min, {
    message: `Must be at least ${min} characters long`,
  });

export const isMax = (max: number) =>
  z.string().max(max, {
    message: `Must be at most ${max} characters long`,
  });

export const isBetween = (min: number, max: number) =>
  z
    .string()
    .min(min, {
      message: `Must be at least ${min} characters long`,
    })
    .max(max, {
      message: `Must be at most ${max} characters long`,
    });

export const isId = () =>
  z
    .number()
    .int({
      message: "Must be an integer",
    })
    .positive({
      message: "Must be a positive integer",
    });

export const isEmail = () => z.string();
// 8 chars with lower and upper case letters, numbers and special chars
export const isPassword = () => z.string();

// string or number ... and not null
export async function hashPassword(password: string) {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export function generateAccessToken({ id }: { id: number }) {
  return sign({ id }, env.JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function generateRefreshToken(user: { id: number }) {
  const { id } = user;
  return sign({ id }, env.JWT_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
}

export async function verifyToken(token: string) {
  try {
    return verify(token, env.JWT_SECRET) as DecodedToken;
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid refresh token",
    });
  }
}

export type DecodedToken = {
  id: number;
  exp?: number;
  iat?: number;
};

export const generateRandomNumber = async (
  min: number,
  max: number
): Promise<number> => {
  const rand = Math.floor(Math.random() * (max - min + 1) + min);
  const exist = await prisma.mqttServer.findUnique({
    where: {
      pid: rand,
    },
  });

  if (exist) {
    return generateRandomNumber(min, max);
  }
  return rand;
};
