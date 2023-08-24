import { getAccountById } from "@/functions/accounts";

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
      const { id } = req.query;
      return res.status(200).json({
        message: "Accounts fetched successfully",
        data: await getAccountById(Number(id), userId),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong, try again" });
  }
}
