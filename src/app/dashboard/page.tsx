import CardSummaries from "@/app/dashboard/components/cardSummaries";
import ChartSummary from "@/app/dashboard/components/chartSummary";
import RecentTransactions from "@/app/dashboard/components/recentTransactions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default function Page() {
  const { userId: userIdClerk } = auth();
  if (!userIdClerk) return NextResponse.redirect("/");
  return (
    <>
      <CardSummaries userIdClerk={userIdClerk} />
      <div className="flex flex-col lg:flex-row lg:space-x-4 lg:space-y-0 space-y-4">
        <ChartSummary userIdClerk={userIdClerk} />

        <RecentTransactions userIdClerk={userIdClerk} />
      </div>
    </>
  );
}
