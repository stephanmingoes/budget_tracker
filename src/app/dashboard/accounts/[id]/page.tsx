"use client";
import { getAccountById } from "@/local-api/accounts";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutateFunction,
  useMutation,
  useQuery,
} from "react-query";
import ErrorAlert from "../../components/errorAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { FaDollarSign, FaPiggyBank } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "@/local-api/transactions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  GetBudgetIdsReturnType,
  GetBudgetsReturnType,
} from "@/functions/budgets";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  createBudget,
  deleteBudget,
  getBudgetIds,
  getBudgets,
} from "@/local-api/budgets";
import DataTable from "../../components/dataTable";
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
import { GetTransactionsReturnType } from "@/functions/transactions";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown, CalendarIcon, Terminal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CreateTransactionType,
  CreateTransactionSchema,
  CreateBudgetType,
  CreateBudgetSchema,
} from "@/lib/types";
import { TransactionType } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import SearchBar from "../../components/searchBar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page({ params }: { params: { id: string } }) {
  const [budgetId, setBudgetId] = useState<number | undefined>();
  const [budgetIds, setbudgetIds] = useState<GetBudgetIdsReturnType>([]);
  const { data, isError, isLoading, refetch } = useQuery([params.id], () =>
    getAccountById(Number(params.id))
  );
  const { toast } = useToast();
  const {
    data: budgetsData,
    isLoading: isBudgetsLoading,
    isError: isBudgetsError,
    refetch: budgetsRefetch,
  } = useQuery("budgetIds", () => getBudgetIds(), {
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching your budgets data",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              budgetsRefetch();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    },
    onSuccess(data) {
      setbudgetIds(data);
    },
  });

  if (isError)
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Account</h2>
        <ErrorAlert message="Something went wrong trying to get your account." />
      </div>
    );
  if (isLoading)
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4 mb-4 ">
          {" "}
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </>
    );

  if (!data)
    return (
      <Alert className="mt-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Oh no!</AlertTitle>
        <AlertDescription>
          The account you are looking for does not exist.
        </AlertDescription>
      </Alert>
    );
  return (
    <>
      <h2 className=" text-3xl mb-4 font-bold tracking-tight mt-4">
        Account: {data.name}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4 mb-4 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <FaDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(data.balance))}
            </div>
            <p className="text-xs text-muted-foreground">Current Balance.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budgets</CardTitle>
            <FaPiggyBank />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data._count.Budget}</div>
            <p className="text-xs text-muted-foreground">
              You created {data._count.Budget} Budget(s).
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <GrTransaction />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data._count.Transaction}</div>
            <p className="text-xs text-muted-foreground">
              You have {data._count.Transaction} transaction(s).
            </p>
          </CardContent>
        </Card>
      </div>
      <TransactionComponent
        budgetId={budgetId}
        budgetIds={budgetIds}
        setBudgetId={setBudgetId}
        refetchAccountData={refetch}
        accountId={Number(params.id)}
      />
      <BudgetComponent
        budgetRefresh={budgetsRefetch}
        refetchAccountData={refetch}
        accountId={Number(params.id)}
      />
    </>
  );
}

function TransactionComponent({
  accountId,
  refetchAccountData,
  budgetId,
  setBudgetId,
  budgetIds,
}: {
  budgetIds: GetBudgetIdsReturnType;
  budgetId: number | undefined;
  setBudgetId: Dispatch<SetStateAction<number | undefined>>;
  accountId: number;

  refetchAccountData: Function;
}) {
  const columns: ColumnDef<GetTransactionsReturnType["transactions"][0]>[] = [
    {
      accessorKey: "for",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            For
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = formatCurrency(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "date",
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
        return dayjs(row.getValue("date")).format("MMMM DD, YYYY");
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
                  your transaction and reverse the balance on your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast({
                      description: "Deleting Transaction...",
                    });
                    DeleteTransactionMutation({ id: row.original.id });
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
  const [take, setTake] = useState(6);
  const [cursorStack, setcursorStack] = useState<number[]>([]);
  const [nameQuery, setNameQuery] = useState<string | undefined>();
  const [name, setName] = useState<string>("");

  const [cursor, setCursor] = useState<undefined | number>();
  const { toast } = useToast();

  useEffect(() => {
    setCursor(cursorStack[cursorStack.length - 1]);
  }, [cursorStack]);

  const { data, isLoading, isError, refetch } = useQuery(
    [cursor, take, accountId, budgetId, nameQuery],
    () =>
      getTransactions({ cursor, take, accountId, budgetId, name: nameQuery })
  );

  const { mutate: DeleteTransactionMutation } = useMutation(deleteTransaction, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem deleting your transaction, try again.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Transaction deleted successfully.",
      });
      refetch();
      refetchAccountData();
    },
  });
  const { mutate: CreateTransactionMutation } = useMutation(createTransaction, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem creating your transaction, try again.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Transaction created successfully.",
      });
      refetch();
      refetchAccountData();
    },
  });

  if (isError) {
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">
          Transactions
        </h2>
        <ErrorAlert message="Something went wrong trying to get your Transactions, try refreshing" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">
          Transactions
        </h2>
        <div className="flex flex-row space-x-1 mb-4 justify-between">
          <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
          <SelectBudgets budgets={budgetIds} setBudgetId={setBudgetId} />
        </div>
        <CreateTransaction
          accountId={accountId}
          budgetIds={budgetIds}
          mutate={CreateTransactionMutation}
        />
        <Skeleton className="h-[250px]" />
      </div>
    );
  }

  if (data == undefined || data.transactions.length <= 0) {
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">
          Transactions
        </h2>
        <div className="flex flex-row space-x-1 mb-4 justify-between">
          <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
          <SelectBudgets budgets={budgetIds} setBudgetId={setBudgetId} />
        </div>
        <CreateTransaction
          accountId={accountId}
          budgetIds={budgetIds}
          mutate={CreateTransactionMutation}
        />

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
  }

  return (
    <div className="mt-4">
      <h2 className=" text-3xl mb-4 font-bold tracking-tight">Transactions</h2>
      <div className="flex flex-row space-x-1 mb-4 justify-between">
        <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
        <SelectBudgets budgets={budgetIds} setBudgetId={setBudgetId} />
      </div>
      <CreateTransaction
        accountId={accountId}
        budgetIds={budgetIds}
        mutate={CreateTransactionMutation}
      />
      <DataTable
        columns={columns}
        data={data.transactions}
        hasNextPage={data.hasNextPage}
        cursorStack={cursorStack}
        setcursorStack={setcursorStack}
        lastCursor={data.lastCursor}
      />
    </div>
  );
}

function SelectBudgets({
  budgets,
  setBudgetId,
}: {
  budgets: GetBudgetIdsReturnType;
  setBudgetId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  return (
    <Select
      onValueChange={(value) => {
        if (value == "") {
          setBudgetId(undefined);
          return;
        }
        setBudgetId(Number(value));
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by Budget" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Budgets</SelectLabel>
          <SelectItem value="">All</SelectItem>
          {budgets.map(({ id, name, amount }) => (
            <SelectItem key={id} value={id.toString()}>
              {name} ({formatCurrency(Number(amount))})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function CreateTransaction({
  mutate,
  budgetIds,
  accountId,
}: {
  accountId: number;
  mutate: UseMutateFunction<
    {
      message: string;
    },
    unknown,
    {
      accountId: number;
      amount: number;
      date: string;
      for: string;
      type: "EXPENSE" | "INCOME";
      budgetId?: number | null | undefined;
    },
    unknown
  >;
  budgetIds: GetBudgetIdsReturnType;
}) {
  const form = useForm<CreateTransactionType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      accountId: accountId,
      amount: 0,
      date: new Date().toISOString(),
      for: "",
      type: "EXPENSE",
    },
  });
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger className="bg-[#0F172A] text-white py-2 px-3 rounded-sm  text-sm mb-4">
        Create New
      </DialogTrigger>
      <DialogContent className={cn("max-h-96 overflow-x-scroll ")}>
        <DialogHeader>
          <DialogTitle>Create A Transaction</DialogTitle>
          <DialogDescription>
            This action will create a new a Transaction with the following
            details.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((val) => {
                if (form.getValues("type") == "INCOME") {
                  val.budgetId = undefined;
                }

                toast({
                  description: "Creating Transaction...",
                });
                mutate(val);
                form.setValue("amount", 0);
                form.setValue("date", new Date().toISOString());
                form.setValue("type", "EXPENSE");
                form.setValue("for", "");
                form.setValue("budgetId", undefined);
              })}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !form.getValues("date") && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.getValues("date") ? (
                              format(new Date(form.getValues("date")), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(form.getValues("date"))}
                            onSelect={(date) => {
                              form.setValue("date", date!.toISOString());
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>Date of transaction</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="for"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>For</FormLabel>
                    <FormControl>
                      <Input placeholder="Netflix" {...field} />
                    </FormControl>
                    <FormDescription>Purpose of transaction</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1200.12"
                        {...form.register("amount", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>Transaction Amount</FormDescription>
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
                          <SelectItem value={TransactionType.EXPENSE}>
                            Expense
                          </SelectItem>
                          <SelectItem value={TransactionType.INCOME}>
                            Income
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormDescription>Type of Transaction</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          form.setValue("budgetId", Number(value));
                        }}
                        defaultValue={undefined}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetIds.map(({ id, name, amount }) => (
                            <SelectItem key={id} value={id.toString()}>
                              {name} ({formatCurrency(Number(amount))})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormDescription>
                      If you wish to apply this transaction to a Budget (This
                      wont apply to &quot;INCOME&quot; transaction).
                    </FormDescription>
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

function BudgetComponent({
  accountId,
  refetchAccountData,
  budgetRefresh,
}: {
  budgetRefresh: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<
      {
        id: number;
        name: string;
      }[],
      unknown
    >
  >;
  accountId: number;
  refetchAccountData: Function;
}) {
  const columns: ColumnDef<GetBudgetsReturnType["budgets"][0]>[] = [
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
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = formatCurrency(amount);

        return <div className="font-medium">{formatted}</div>;
      },
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
        return dayjs(row.original.createdAt).format("MMMM DD, YYYY");
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            From
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return dayjs(row.original.startDate).format("MMMM DD, YYYY");
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            To
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return dayjs(row.original.endDate).format("MMMM DD, YYYY");
      },
    },
    {
      accessorKey: "%used",
      header: "% Used",
      cell: ({ row }) => {
        if (row.original.Transaction.length <= 0) {
          return (
            <span className="bg-green-500  py-1 px-2 text-white">%{0}</span>
          );
        }

        let transactionSum = 0;

        row.original.Transaction.forEach((t) => {
          transactionSum += Number(t.amount);
        });

        const percentage = (transactionSum / Number(row.original.amount)) * 100;

        return (
          <span
            className={`${
              percentage < 33
                ? "bg-green-500"
                : percentage < 66
                ? "bg-orange-500"
                : "bg-red-600"
            } py-1 px-2 text-white`}
          >
            %{Math.round(percentage * 10) / 10}
          </span>
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
                  your budegt and remove the transactions from your budget.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast({
                      description: "Deleting Budget...",
                    });
                    DeletBudgetMutation({ id: row.original.id });
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
  const [take, setTake] = useState(6);
  const [cursorStack, setcursorStack] = useState<number[]>([]);
  const [nameQuery, setNameQuery] = useState<string | undefined>();
  const [name, setName] = useState<string>("");
  const [cursor, setCursor] = useState<undefined | number>();
  const { toast } = useToast();

  useEffect(() => {
    setCursor(cursorStack[cursorStack.length - 1]);
  }, [cursorStack]);

  const { data, isLoading, isError, refetch } = useQuery(
    [cursor, take, accountId, nameQuery],
    () => getBudgets({ cursor, take, accountId, name: nameQuery })
  );

  const { mutate: DeletBudgetMutation } = useMutation(deleteBudget, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting your budget, try again.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Budget deleted successfully.",
      });
      refetch();
      refetchAccountData();
      budgetRefresh();
    },
  });
  const { mutate: CreateBudgetMutation } = useMutation(createBudget, {
    onError: (data) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating your Budget, try again.",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Awesome",
        description: "Budget created successfully.",
      });
      refetch();
      refetchAccountData();
      budgetRefresh();
    },
  });

  if (isError) {
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Budgets</h2>
        <ErrorAlert message="Something went wrong trying to get your Transactions, try refreshing" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Budgets</h2>
        <div className="flex flex-row space-x-1 mb-4 justify-between">
          <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
        </div>
        <div className="flex flex-row space-x-1">
          <CreateBudget accountId={accountId} mutate={CreateBudgetMutation} />
        </div>

        <Skeleton className="h-[250px]" />
      </div>
    );
  }

  if (data == undefined || data.budgets.length <= 0) {
    return (
      <div className="mt-4">
        <h2 className=" text-3xl mb-4 font-bold tracking-tight">Budgets</h2>
        <div className="flex flex-row space-x-1 mb-4 justify-between">
          <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
        </div>
        <div className="flex flex-row space-x-1">
          <CreateBudget accountId={accountId} mutate={CreateBudgetMutation} />
          <Button
            onClick={() => {
              refetch();
            }}
          >
            <BiRefresh />
          </Button>
        </div>
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
  }

  return (
    <div className="mt-4">
      <h2 className=" text-3xl mb-4 font-bold tracking-tight">Budgets</h2>
      <div className="flex flex-row space-x-1 mb-4 justify-between">
        <SearchBar query={name} setQuery={setName} setQuery2={setNameQuery} />
      </div>
      <div className="flex flex-row space-x-1">
        <CreateBudget accountId={accountId} mutate={CreateBudgetMutation} />
        <Button
          onClick={() => {
            refetch();
          }}
        >
          <BiRefresh />
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data.budgets}
        hasNextPage={data.hasNextPage}
        cursorStack={cursorStack}
        setcursorStack={setcursorStack}
        lastCursor={data.lastCursor}
      />
    </div>
  );
}

function CreateBudget({
  mutate,
  accountId,
}: {
  accountId: number;
  mutate: UseMutateFunction<
    {
      message: string;
    },
    unknown,
    {
      name: string;
      accountId: number;
      amount: number;
      startDate: string;
      endDate: string;
    },
    unknown
  >;
}) {
  const form = useForm<CreateBudgetType>({
    resolver: zodResolver(CreateBudgetSchema),
    defaultValues: {
      accountId: accountId,
      amount: 0,
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 31).toISOString(),
      name: "",
    },
  });
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger className="bg-[#0F172A] text-white py-[0.64rem] px-3 rounded-sm  text-sm mb-4">
        Create New
      </DialogTrigger>
      <DialogContent className={cn("max-h-96 overflow-x-scroll ")}>
        <DialogHeader>
          <DialogTitle>Create A Budget</DialogTitle>
          <DialogDescription>
            This action will create a new a Budget with the following details.
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((val) => {
                toast({
                  description: "Creating Budget...",
                });
                if (new Date(val.endDate) < new Date(val.startDate)) {
                  toast({
                    variant: "destructive",
                    description:
                      "Start Date must be less than or equl to End Date",
                  });
                  return;
                }

                mutate(val);
                form.setValue("amount", 0);
                form.setValue("startDate", new Date().toISOString());
                form.setValue("endDate", addDays(new Date(), 31).toISOString());
                form.setValue("name", "");
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
                      <Input placeholder="Groceries" {...field} />
                    </FormControl>
                    <FormDescription>Name of Budget</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !form.getValues("startDate") &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.getValues("startDate") ? (
                              format(
                                new Date(form.getValues("startDate")),
                                "PPP"
                              )
                            ) : (
                              <span>Pick a Start Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(form.getValues("startDate"))}
                            onSelect={(date) => {
                              form.setValue("startDate", date!.toISOString());
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Start Date of Budget (Start Date must be less than End
                      Date)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !form.getValues("endDate") &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.getValues("endDate") ? (
                              format(new Date(form.getValues("endDate")), "PPP")
                            ) : (
                              <span>Pick a End Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(form.getValues("endDate"))}
                            onSelect={(date) => {
                              form.setValue("endDate", date!.toISOString());
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      End Date of Budget (End Date must be greater than Start
                      Date)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10000"
                        {...form.register("amount", { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>Value of Budget</FormDescription>
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
