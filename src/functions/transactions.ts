import prisma from "@/db";
import {
  CreateTransactionType,
  DeleteTransactionType,
  GetTransactionsType,
} from "@/lib/types";
import { Prisma } from "@prisma/client";
import { findAccountOrThrow } from "./accounts";

export type GetTransactionsReturnType = Awaited<
  ReturnType<typeof getTransactions>
>;
export async function getTransactions({
  userId,
  accountId,
  budgetId,
  take,
  name,
  cursor,
}: GetTransactionsType & { userId: string }) {
  const where: Prisma.TransactionWhereInput = {
    account: { userId: { equals: userId }, id: { equals: accountId } },
  };

  if (budgetId) where.budgetId = { equals: budgetId };
  if (name) where.for = { contains: name, mode: "insensitive" };
  const transactions = await prisma.transaction.findMany({
    take: take + 1,
    skip: cursor == undefined ? undefined : 1,
    cursor: cursor !== undefined ? { id: cursor } : undefined,
    where: where,
  });
  const hasNextPage = transactions.length > take;

  return {
    transactions: transactions.slice(0, take),
    hasNextPage,
    lastCursor: hasNextPage ? transactions[take - 1].id : cursor,
  };
}

export async function createTransaction(
  transaction: CreateTransactionType & { userId: string }
) {
  const { userId, ...transactionInsert } = transaction;
  await findAccountOrThrow({
    userId: userId,
    accountId: transaction.accountId,
  });
  await prisma.transaction.create({
    data: transactionInsert,
  });

  const updateInput: Prisma.AccountUpdateArgs = {
    where: { id: transaction.accountId },
    data: {},
  };

  if (transaction.type == "EXPENSE") {
    updateInput.data = { balance: { decrement: transaction.amount } };
  } else {
    updateInput.data = { balance: { increment: transaction.amount } };
  }
  await prisma.account.update(updateInput);
}

export async function deleteTransaction({
  id,
  userId,
}: DeleteTransactionType & { userId: string }) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: id },
  });

  if (!transaction) throw new Error("Transaction not found");

  const updateInput: Prisma.AccountUpdateArgs = {
    where: { id: transaction.accountId },
    data: {},
  };

  if (transaction.type == "EXPENSE") {
    updateInput.data = {
      balance: { increment: Number(transaction.amount) },
    };
  } else {
    updateInput.data = {
      balance: { decrement: Number(transaction.amount) },
    };
  }
  await prisma.account.update(updateInput);

  await prisma.transaction.delete({
    where: { id: id, account: { userId: { equals: userId } } },
  });
}
