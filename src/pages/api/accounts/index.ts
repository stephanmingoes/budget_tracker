import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "@/functions/accounts";
import {
  CreateAccountSchema,
  DeleteAccountSchema,
  UpdateAccountSchema,
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
      const { cursor, take, name } = req.query;
      const parsedTake = parseTake(take);
      const parsedCursor = parseCursor(cursor);

      return res.status(200).json({
        message: "Accounts fetched successfully",
        data: await getAccounts({
          take: parsedTake,
          cursor: parsedCursor,
          name: typeof name == "string" ? name : undefined,
          userId,
        }),
      });
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      const parseDeleteAccountQuery = DeleteAccountSchema.safeParse({
        id: Number(id),
      });

      if (!parseDeleteAccountQuery.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Account Delete successfully",
        data: await deleteAccount({ id: Number(id), userId }),
      });
    } else if (req.method === "POST") {
      const body = req.body;
      const parseCreateAccountBody = CreateAccountSchema.safeParse(body);

      if (!parseCreateAccountBody.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Account created successfully",
        data: await createAccount({ userId, ...parseCreateAccountBody.data }),
      });
    } else if (req.method === "PUT") {
      const body = req.body;
      const parseUpdateAccountBody = UpdateAccountSchema.safeParse(body);

      if (!parseUpdateAccountBody.success) {
        return res.status(400).json({ message: "Bad Request" });
      }

      return res.status(200).json({
        message: "Account updated successfully",
        data: await updateAccount({ userId, ...parseUpdateAccountBody.data }),
      });
    } else {
      return res.status(405).json({ message: "HTTP method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong, try again" });
  }
}
