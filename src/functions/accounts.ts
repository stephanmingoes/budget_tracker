import prisma from "@/db";
import {
  CreateAccountType,
  DeleteAccountType,
  GetAccountsType,
} from "@/lib/types";
import { Prisma } from "@prisma/client";

export type GetAccountsReturnType = Awaited<ReturnType<typeof getAccounts>>;

export async function getAccounts({
  take,
  userId,
  cursor,
  name,
}: GetAccountsType) {
  const where: Prisma.AccountWhereInput = { userId: { equals: userId } };
  if (name) where.name = { contains: name, mode: "insensitive" };
  const accounts = await prisma.account.findMany({
    take: take + 1,
    skip: cursor == undefined ? undefined : 1,
    cursor: cursor !== undefined ? { id: cursor } : undefined,
    where: where,
    include: {
      Transaction: true,
      Budget: true,
    },
  });
  const hasNextPage = accounts.length > take;

  return {
    accounts: accounts.slice(0, take),
    hasNextPage,
    lastCursor: hasNextPage ? accounts[take - 1].id : cursor,
  };
}

export type GetAccountByIdReturnType = Awaited<
  ReturnType<typeof getAccountById>
>;
export async function getAccountById(id: number, userId: string) {
  return await prisma.account.findUnique({
    where: { id, userId },
    include: { _count: { select: { Budget: true, Transaction: true } } },
  });
}
export async function createAccount(
  account: CreateAccountType & { userId: string }
) {
  await prisma.account.create({
    data: account,
  });
}

export async function deleteAccount({
  id,
  userId,
}: DeleteAccountType & { userId: string }) {
  await prisma.account.delete({
    where: { id: id, userId: { equals: userId } },
  });
}

export async function updateAccount(
  account: Prisma.AccountUpdateInput & { id: number } & { userId: string }
) {
  await prisma.account.update({
    where: {
      id: account.id,
      userId: { equals: account.userId },
    },
    data: account,
  });
}

export async function findAccountOrThrow({
  userId,
  accountId,
}: {
  userId: string;
  accountId: number;
}) {
  await prisma.account.findUniqueOrThrow({
    where: { userId: userId, id: accountId },
  });
}
