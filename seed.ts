// Import Prisma Client and the models
import {
  PrismaClient,
  Prisma,
  AccountType,
  TransactionType,
} from "@prisma/client";

// Create an instance of Prisma Client
const prisma = new PrismaClient();

// Define some sample data
const userId = "user_2U2bAj671WGQVfsXZRhacOBSKaE";
const accounts = [
  {
    userId,
    name: "Checking",
    balance: 1000,
    type: "CHECKING",
  },
  {
    userId,
    name: "Savings",
    balance: 5000,
    type: "SAVINGS",
  },
];

const budgets = [
  {
    accountId: 1,
    amount: new Prisma.Decimal(200),
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-01-31"),
    name: "Groceries",
  },
  {
    accountId: 1,
    amount: new Prisma.Decimal(100),
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-01-31"),
    name: "Entertainment",
  },
];

const transactions = [
  {
    accountId: 1,
    budgetId: 1,
    amount: new Prisma.Decimal(50),
    date: new Date("2023-01-05"),
    for: "Supermarket",
    type: "EXPENSE",
  },
  {
    accountId: 1,
    budgetId: null,
    amount: 20,
    date: new Date("2023-01-10"),
    for: "Netflix",
    type: "EXPENSE",
  },
  {
    accountId: 1,
    budgetId: null,
    amount: 1000,
    date: new Date("2023-01-15"),
    for: "Salary",
    type: "INCOME",
  },
];

// Define an async function to seed the data
async function seed() {
  // Loop through the accounts and create them with Prisma Client
  for (const account of accounts) {
    await prisma.account.create({
      data: {
        balance: account.balance,
        name: account.name,
        type: account.type as AccountType,
        userId: account.userId,
      },
    });
  }

  // Loop through the budgets and create them with Prisma Client
  for (const budget of budgets) {
    await prisma.budget.create({
      data: budget,
    });
  }

  // Loop through the transactions and create them with Prisma Client
  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type as TransactionType,
        accountId: transaction.accountId,
        for: transaction.for,
      },
    });
  }
}

// Call the seed function and catch any errors
seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect from the database when done
    await prisma.$disconnect();
  });
