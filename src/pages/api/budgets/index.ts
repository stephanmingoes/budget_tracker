import { createBudget, deleteBudget, getBudgets } from "@/functions/budgets";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "@/functions/transactions";
import {
  CreateBudgetSchema,
  CreateTransactionSchema,
  DeleteBudgetSchema,
  DeleteTransactionSchema,
} from "@/lib/types";

import { parseCursor, parseTake } from "@/lib/utils";

import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
      const { cursor, take, accountId, name } = req.query;
      const parsedTake = parseTake(take);
      const parsedCursor = parseCursor(cursor);
      const parsedAccountId = Number(accountId);
      if (typeof parsedAccountId !== "number")
        return res.status(401).json({ message: "Bad Request" });

      return res.status(200).json({
        message: "Budgets fetched successfully",
        data: await getBudgets({
          params: {
            take: parsedTake,
            cursor: parsedCursor,
            accountId: parsedAccountId,
            name: typeof name == "string" ? name : undefined,
          },
          userId,
        }),
      });
    } else if (req.method === "POST") {
      const body = req.body;
      const parseCreateBudgetBody = CreateBudgetSchema.safeParse(body);

      if (!parseCreateBudgetBody.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Budget created successfully",
        data: await createBudget({
          budget: parseCreateBudgetBody.data,
          userId,
        }),
      });
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      const parseDeleteBudgetQuery = DeleteBudgetSchema.safeParse({
        id: Number(id),
      });

      if (!parseDeleteBudgetQuery.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Transaction Delete successfully",
        data: await deleteBudget({ id: Number(id), userId }),
      });
    } else {
      return res.status(405).json({ message: "HTTP method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong, try again" });
  }
}
