import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "@/functions/transactions";
import { CreateTransactionSchema, DeleteTransactionSchema } from "@/lib/types";

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
      const { cursor, take, accountId, budgetId, name } = req.query;
      const parsedTake = parseTake(take);
      const parsedCursor = parseCursor(cursor);
      const parsedAccountId = Number(accountId);
      const parserdBudgetId = Number(budgetId);
      if (typeof parsedAccountId !== "number")
        return res.status(401).json({ message: "Bad Request" });

      return res.status(200).json({
        message: "Transactions fetched successfully",
        data: await getTransactions({
          userId,
          take: parsedTake,
          cursor: parsedCursor,
          accountId: parsedAccountId,
          budgetId: isNaN(parserdBudgetId) ? undefined : parserdBudgetId,
          name: typeof name == "string" ? name : undefined,
        }),
      });
    } else if (req.method === "POST") {
      const body = req.body;
      const parseCreateTransactionBody =
        CreateTransactionSchema.safeParse(body);

      if (!parseCreateTransactionBody.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Transaction created successfully",
        data: await createTransaction({
          userId,
          ...parseCreateTransactionBody.data,
        }),
      });
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      const parseDeleteAccountQuery = DeleteTransactionSchema.safeParse({
        id: Number(id),
      });

      if (!parseDeleteAccountQuery.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Transaction Delete successfully",
        data: await deleteTransaction({ id: Number(id), userId }),
      });
    } else {
      return res.status(405).json({ message: "HTTP method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong, try again" });
  }
}
