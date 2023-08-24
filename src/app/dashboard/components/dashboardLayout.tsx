"use client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <section className="w-11/12 lg:w-9/12 mx-auto my-4">
        <div className="flex items-center justify-between space-y-2 mb-4">
          <h2 className="hidden md:inline text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          {/* <CalendarDateRangePicker /> */}
        </div>
        <Navigation />
        <MobileNavigation />
        {children}
      </section>
    </>
  );
}

function Header() {
  return (
    <nav className="flex justify-center flex-row items-center py-3 border-solid border-b-[1px]">
      <section className="flex justify-between flex-row items-center w-11/12 lg:w-9/12">
        <div className=" flex text-lg justify-center items-center space-x-1">
          <BsFillPiggyBankFill />
          <h1 className="hidden lg:inline">buget_tracker</h1>
        </div>

        <UserButton afterSignOutUrl="/" />
      </section>
    </nav>
  );
}

const menuLinks: Array<{ name: string; link: string }> = [
  { name: "Overview", link: "/dashboard" },
  { name: "Accounts", link: "/dashboard/accounts" },
  // { name: "Budgets", link: "/dashboard/budgets" },
  // { name: "Transactions", link: "/dashboard/transactions" },
];

function Navigation() {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "hidden md:flex items-center space-x-4 lg:space-x-6 bg-[#F4F4F5] w-fit py-2 px-2 rounded-md "
      )}
    >
      {menuLinks.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className={`text-sm font  ${
            pathname == item.link
              ? "text-[#0F172A] bg-[#FFFFFF] drop-shadow-md"
              : "text-[#B4B4B9]"
          } px-2 py-1 rounded-md`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-[#0F172A] text-white py-2 px-3 rounded-sm mb-4 text-sm">
          Navigate
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Links</DropdownMenuLabel>
          {menuLinks.map((item) => (
            <Link key={item.link} href={item.link}>
              <DropdownMenuItem
                className={`${pathname == item.link ? "font-bold" : ""}`}
              >
                {item.name}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
