"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "database";

export async function getMembershipData() {
  const { userId } = auth();

  if (!userId) return null;

  const membership = await db.membership.findUnique({
    where: {
      userId,
    },
  });

  if (!membership)
    return {
      credits: null,
      status: "active",
      type: "hobby",
    } as const;

  return {
    credits: (
      await db.transaction.findMany({
        where: {
          userId,
        },
        select: {
          credits: true,
        },
      })
    ).reduce((acc, current) => acc + current.credits, 0),
    status: membership.status,
    type: membership.type,
  };
}
