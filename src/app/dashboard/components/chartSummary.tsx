import { BarChart } from "@tremor/react";
import { CardTitle, Card } from "../../../components/ui/card";
import prisma from "@/db";
import { formatCurrency } from "@/lib/utils";

export default async function ChartSummary({
  userIdClerk,
}: {
  userIdClerk: string;
}) {
  let accounts = await prisma.account.findMany({
    where: { userId: { equals: userIdClerk } },
    select: { name: true, balance: true },
  });

  return (
    <Card className="flex-1 lg:flex-[3] p-4">
      <CardTitle className="text-base">Account Summary</CardTitle>
      <BarChart
        className="mt-6"
        data={accounts}
        index="name"
        categories={["balance"]}
        colors={["blue"]}
        yAxisWidth={48}
      />
    </Card>
  );
}
