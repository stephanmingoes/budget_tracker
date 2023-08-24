import { AccountType, TransactionType } from "@prisma/client";
import { z } from "zod";

export const CreateAccountSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name must be at most 10 characters"),
  balance: z.number().nonnegative(),
  type: z.nativeEnum(AccountType),
});

export const UpdateAccountSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name must be at most 10 characters"),
  balance: z.number().nonnegative(),
  type: z.nativeEnum(AccountType),
  id: z.number(),
});

export const DeleteAccountSchema = z.object({
  id: z.number(),
});

export type GetAccountsType = {
  name?: string;
  userId: string;
  take: number;
  cursor?: number;
};

export type DeleteAccountType = z.infer<typeof DeleteAccountSchema>;
export type CreateAccountType = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountType = z.infer<typeof UpdateAccountSchema>;

// Transactions

export const CreateTransactionSchema = z.object({
  accountId: z.number(),
  budgetId: z.number().nullish(),
  amount: z.number(),
  date: z.string().datetime({ offset: true }),
  for: z
    .string()
    .min(3, "Must have at least 3 characters")
    .max(20, "Must have more than 20 characters"),
  type: z.nativeEnum(TransactionType),
});

export const DeleteTransactionSchema = z.object({
  id: z.number(),
});

export type GetTransactionsType = {
  accountId: number;
  budgetId?: number;
  name?: string;
  take: number;
  cursor?: number;
};
export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>;
export type DeleteTransactionType = z.infer<typeof DeleteTransactionSchema>;

// Budgets

export const CreateBudgetSchema = z.object({
  accountId: z.number(),
  amount: z.number(),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  name: z
    .string()
    .min(3, "Must have at least 3 characters")
    .max(20, "Must have more than 20 characters"),
});

export const DeleteBudgetSchema = z.object({
  id: z.number(),
});

export type GetBudgetsType = {
  accountId: number;
  take: number;
  name?: string;
  cursor?: number;
};

export type CreateBudgetType = z.infer<typeof CreateBudgetSchema>;
export type DeleteBudgetType = z.infer<typeof DeleteBudgetSchema>;
