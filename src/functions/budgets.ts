import prisma from "@/db";
import { CreateBudgetType, GetBudgetsType } from "@/lib/types";
import { findAccountOrThrow } from "./accounts";
import { Prisma } from "@prisma/client";

export type GetBudgetIdsReturnType = Awaited<ReturnType<typeof getBudgetsIds>>;
export async function getBudgetsIds(userId: string, accountId: number) {
  return await prisma.budget.findMany({
    where: { account: { userId: userId, id: accountId } },
    select: { name: true, id: true, amount: true },
  });
}

export async function createBudget({
  budget,
  userId,
}: {
  budget: CreateBudgetType;
  userId: string;
}) {
  await findAccountOrThrow({
    userId: userId,
    accountId: budget.accountId,
  });
  await prisma.budget.create({ data: budget });
}

export type GetBudgetsReturnType = Awaited<ReturnType<typeof getBudgets>>;
export async function getBudgets({
  params,
  userId,
}: {
  userId: string;
  params: GetBudgetsType;
}) {
  const where: Prisma.BudgetWhereInput = {
    account: { userId: { equals: userId }, id: { equals: params.accountId } },
  };

  if (params.name) where.name = { contains: params.name, mode: "insensitive" };

  const budgets = await prisma.budget.findMany({
    take: params.take + 1,
    skip: params.cursor == undefined ? undefined : 1,
    cursor: params.cursor !== undefined ? { id: params.cursor } : undefined,
    where: where,
    include: { Transaction: { select: { amount: true } } },
  });
  const hasNextPage = budgets.length > params.take;

  return {
    budgets: budgets.slice(0, params.take),
    hasNextPage,
    lastCursor: hasNextPage ? budgets[params.take - 1].id : params.cursor,
  };
}

export async function deleteBudget({
  id,
  userId,
}: {
  id: number;
  userId: string;
}) {
  await prisma.budget.delete({
    where: { id, account: { userId: { equals: userId } } },
  });
}
