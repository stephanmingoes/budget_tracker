import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdOutlineAccountBalance } from "react-icons/md";
import { FaPiggyBank, FaDollarSign } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { Decimal } from "decimal.js";

import prisma from "@/db";
import { formatCurrency } from "@/lib/utils";

export default async function CardSummaries({
  userIdClerk,
}: {
  userIdClerk: string;
}) {
  const userAccountsInformation = await prisma.account.findMany({
    where: { userId: { equals: userIdClerk } },
    select: {
      balance: true,
      Transaction: { select: { id: true } },
      Budget: { select: { id: true } },
      id: true,
    },
  });

  const CardInformation: {
    accountsCount: number;
    overallBalance: Decimal;
    budgetCount: number;
    transactionCount: number;
  } = {
    accountsCount: userAccountsInformation.length,
    overallBalance: new Decimal(0),
    budgetCount: 0,
    transactionCount: 0,
  };

  userAccountsInformation.forEach((account) => {
    CardInformation.budgetCount += account.Budget.length;
    CardInformation.transactionCount += account.Transaction.length;
    CardInformation.overallBalance = CardInformation.overallBalance.plus(
      Number(account.balance)
    );
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4 mb-4 ">
      {" "}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Balance</CardTitle>
          <FaDollarSign />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(Number(CardInformation.overallBalance))}
          </div>
          <p className="text-xs text-muted-foreground">
            You overall balance across all accounts.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accounts</CardTitle>
          <MdOutlineAccountBalance />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {CardInformation.accountsCount}
          </div>
          <p className="text-xs text-muted-foreground">Number of account(s).</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budgets</CardTitle>
          <FaPiggyBank />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {CardInformation.budgetCount}
          </div>
          <p className="text-xs text-muted-foreground">
            You created {CardInformation.budgetCount} Budget(s).
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <GrTransaction />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {CardInformation.transactionCount}
          </div>
          <p className="text-xs text-muted-foreground">
            You have {CardInformation.transactionCount} transaction(s).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
