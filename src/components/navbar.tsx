import { Button } from "@/components/ui/button";
import Link from "next/link";

import { BsFillPiggyBankFill } from "react-icons/bs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { currentUser, SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

export default async function NavBar() {
  const user = await currentUser();

  return (
    <nav className="flex justify-center flex-row items-center py-3 border-solid border-b-[1px]">
      <div className="flex justify-between flex-row items-center w-11/12 lg:w-9/12">
        <div className=" flex text-lg justify-center items-center space-x-1">
          <BsFillPiggyBankFill />
          <h1 className="hidden lg:inline">buget_tracker</h1>
        </div>

        <div className="space-x-3">
          {!user ? (
            <div>
              {" "}
              <Link href={"/sign-up"}>
                <Button variant="secondary">Sign Up</Button>
              </Link>
              <Link href={"/sign-in"}>
                {" "}
                <Button>Sign In</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {" "}
                <Avatar>
                  <AvatarImage src={user.imageUrl} />
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {user.emailAddresses.length > 0 && (
                  <DropdownMenuLabel>
                    <div> {user.emailAddresses[0].emailAddress}</div>
                  </DropdownMenuLabel>
                )}
                <Link href={"/dashboard"} className="cursor-pointer">
                  {" "}
                  <DropdownMenuItem className="flex flex-row space-x-1">
                    <MdOutlineSpaceDashboard /> <span> Dashboard</span>
                  </DropdownMenuItem>
                </Link>{" "}
                <DropdownMenuItem>
                  <SignOutButton
                    // eslint-disable-next-line react/no-children-prop
                    children={
                      <span className="flex  flex-row space-x-1 items-center  text-red-500">
                        <FiLogOut /> <span>Logout</span>
                      </span>
                    }
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
