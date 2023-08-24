"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "@/local-api/accounts";
import DataTable from "../components/dataTable";
import { Account, AccountType } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorAlert from "../components/errorAlert";
import { GetAccountsReturnType } from "@/functions/accounts";
import { formatCurrency } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreateAccountSchema,
  CreateAccountType,
  UpdateAccountType,
} from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import SearchBar from "../components/searchBar";

export default function Account() {
  const columns: ColumnDef<GetAccountsReturnType["accounts"][0]>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.getValue("name");

        return (
          <div className="flex text-gray-500 underline underline-offset-1 font-medium items-center space-x-1 ">
            <Link href={`/dashboard/accounts/${id}`}>{name as string}</Link>{" "}
            <FiExternalLink />
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const balance = parseFloat(row.getValue("balance"));
        const formatted = formatCurrency(balance);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return dayjs(row.getValue("createdAt")).format("MMMM DD, YYYY");
      },
    },
    {
      accessorKey: "",
      header: " ",
      cell: function ({ row }) {
        return (
          <UpdateAccount
            mutate={updateAccountMutation}
            id={row.original.id}
            name={row.original.name}
            balance={Number(row.original.balance)}
            type={row.original.type}
          />
        );
      },
    },
    {
      accessorKey: "",
      header: "  ",
      cell: function ({ row }) {
        return (
          <AlertDialog>
            <AlertDialogTrigger className="text-red-500">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account, all associated transactions and budgets.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteAccountMutation({ id: row.original.id });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  const [take, setTake] = useState(10);
  const [nameQuery, setNameQuery] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [cursorStack, setcursorStack] = useState<number[]>([]);
  const [cursor, setCursor] = useState<undefined | number>();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery(
    [cursor, take, nameQuery],
    () => getAccounts({ cursor, take, name: nameQuery })
  );
  const { mutate: createAccountMutation } = useMutation(createAccount, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating your account.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Account created successfully.",
      });
      refetch();
    },
  });

  const { mutate: deleteAccountMutation } = useMutation(deleteAccount, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting your account.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Account deleted successfully.",
      });
      refetch();
    },
  });
  const { mutate: updateAccountMutation } = useMutation(updateAccount, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating your account.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Account updated successfully.",
      });
      refetch();
    },
  });

  useEffect(() => {
    setCursor(cursorStack[cursorStack.length - 1]);
  }, [cursorStack]);

  if (isError)
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Accounts</h2>
        <ErrorAlert message="Something went wrong trying to get your accounts." />
      </div>
    );
  if (isLoading)
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Accounts</h2>
        <Skeleton className="h-[250px]" />
      </div>
    );
  if (data == undefined || data.accounts?.length <= 0)
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Accounts</h2>
        <CreateAccount mutate={createAccountMutation} />
        <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
        <br />
        <DataTable
          columns={columns}
          data={[]}
          hasNextPage={false}
          cursorStack={[]}
          setcursorStack={setcursorStack}
          lastCursor={undefined}
        />
      </div>
    );

  return (
    <div className="mt-4">
      <h2 className=" text-3xl mb-4 font-bold tracking-tight">Accounts</h2>
      <CreateAccount mutate={createAccountMutation} />
      <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
      <br />
      <DataTable
        columns={columns}
        data={data.accounts}
        hasNextPage={data.hasNextPage}
        cursorStack={cursorStack}
        setcursorStack={setcursorStack}
        lastCursor={data.lastCursor}
      />
    </div>
  );
}

function CreateAccount({ mutate }: { mutate: Function }) {
  const form = useForm<CreateAccountType>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: "",
      balance: 0,
      type: "CHECKING",
    },
  });
  return (
    <Dialog>
      <DialogTrigger className="bg-[#0F172A] text-white py-2 px-3 rounded-sm mb-4 text-sm">
        Create
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create An Account</DialogTitle>
          <DialogDescription>
            This action will create a new a Account with the following details
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((val) => {
                mutate(val);
                form.setValue("balance", 0);
                form.setValue("name", "");
                form.setValue("type", "CHECKING");
              })}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Checking" {...field} />
                    </FormControl>
                    <FormDescription>Name of account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1200.12"
                        {...form.register("balance", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      Current balance in account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AccountType.CHECKING}>
                            Checking
                          </SelectItem>
                          <SelectItem value={AccountType.SAVINGS}>
                            Savings
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormDescription>Type of account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
function UpdateAccount({
  id,
  mutate,
  name,
  balance,
  type,
}: { mutate: Function } & UpdateAccountType) {
  const form = useForm<CreateAccountType>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: name,
      balance: balance,
      type: type,
    },
  });
  return (
    <Dialog>
      <DialogTrigger className=" text-green-500">Update</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Update Account</DialogTitle>
          <DialogDescription>
            This action will update the existing Account with the following
            details.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((val) => {
                mutate({ ...val, id });
                form.setValue("balance", 0);
                form.setValue("name", "");
                form.setValue("type", "CHECKING");
              })}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Checking" {...field} />
                    </FormControl>
                    <FormDescription>Name of account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1200.12"
                        {...form.register("balance", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      Current balance in account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AccountType.CHECKING}>
                            Checking
                          </SelectItem>
                          <SelectItem value={AccountType.SAVINGS}>
                            Savings
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormDescription>Type of account</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
