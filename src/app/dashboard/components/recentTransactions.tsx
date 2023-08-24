import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import { formatCurrency } from "@/lib/utils";
import prisma from "@/db";

export default async function RecentTransactions({
  userIdClerk,
}: {
  userIdClerk: string;
}) {
  const transactions = await prisma.transaction.findMany({
    where: { account: { userId: { equals: userIdClerk } } },
    select: {
      account: { select: { name: true } },
      id: true,
      for: true,
      amount: true,
      type: true,
    },
    take: 6,
    orderBy: { date: "desc" },
  });

  return (
    <Card className="flex-1 lg:flex-[1]">
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
        <CardDescription>
          {transactions.length} most recent transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              <div className=" space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.for}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.account.name}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {transaction.type == "EXPENSE" ? "-" : "+"}
                {formatCurrency(transaction.amount as unknown as number)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
