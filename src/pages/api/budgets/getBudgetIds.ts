import { getBudgetsIds } from "@/functions/budgets";

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
      const { accountId } = req.query;
      if (typeof Number(accountId) !== "number")
        return res.status(401).json({ message: "Bad Request" });
      return res.status(200).json({
        message: "Budgets fetched successfully",
        data: await getBudgetsIds(userId, Number(accountId)),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong, try again" });
  }
}
