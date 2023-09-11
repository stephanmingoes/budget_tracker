import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { GrTransaction } from "react-icons/gr";
import { TbZoomMoney } from "react-icons/tb";
import { GiBank } from "react-icons/gi";

export default function Landing() {
  return (
    <div>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href="#"
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            Finance
          </Link>
          <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Take Control of Your Finances with Our Budget Tracking App
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Manage your money effortlessly using our budget tracking
            application. Keep track of your income, expenses, and budgets all in
            one place.
          </p>

          <div className="space-x-4">
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Get Started
            </Link>
            <Link
              href="https://github.com/stephanmingoes/budget_tracker"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            This app provide simple features that allow you to manage your
            finances.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <GiBank className="text-4xl" />
              <div className="space-y-2">
                <h3 className="font-bold">Account</h3>
                <p className="text-sm text-muted-foreground">
                  Create an Account and add a balance 💵.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <GrTransaction className="text-4xl" />
              <div className="space-y-2">
                <h3 className="font-bold">Transactions</h3>
                <p className="text-sm">
                  Add you daily transactions, whether income or expense 💹
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <TbZoomMoney className="text-4xl /" />
              <div className="space-y-2">
                <h3 className="font-bold">Budget</h3>
                <p className="text-sm text-muted-foreground">
                  Set a budget for a specified period 💰
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Create by{" "}
            <Link
              href="https://www.stephanmingoes.me"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              @stephanmingoes
            </Link>
            .{" "}
          </p>
        </div>
      </section>
    </div>
  );
}
