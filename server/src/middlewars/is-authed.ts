import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { verifyToken } from "../utils";
import prisma from "../common/prisma";

const isAuthed = middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const accessToken = req.headers?.authorization?.split(" ")?.[1];
  if (!accessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do that.",
    });
  }
  const { id } = await verifyToken(accessToken);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    // console.log('no user found');

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to do that.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        id: user.id,
        role: user.role,
      },
    },
  });
});

export default isAuthed;
