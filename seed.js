"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Import Prisma Client and the models
var client_1 = require("@prisma/client");
// Create an instance of Prisma Client
var prisma = new client_1.PrismaClient();
// Define some sample data
var userId = "user_2U2bAj671WGQVfsXZRhacOBSKaE";
var accounts = [
    {
        userId: userId,
        name: "Checking",
        balance: 1000,
        type: "CHECKING"
    },
    {
        userId: userId,
        name: "Savings",
        balance: 5000,
        type: "SAVINGS"
    },
];
var budgets = [
    {
        accountId: 1,
        amount: new client_1.Prisma.Decimal(200),
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-01-31"),
        name: "Groceries"
    },
    {
        accountId: 1,
        amount: new client_1.Prisma.Decimal(100),
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-01-31"),
        name: "Entertainment"
    },
];
var transactions = [
    {
        accountId: 1,
        budgetId: 1,
        amount: new client_1.Prisma.Decimal(50),
        date: new Date("2023-01-05"),
        "for": "Supermarket",
        type: "EXPENSE"
    },
    {
        accountId: 1,
        budgetId: null,
        amount: 20,
        date: new Date("2023-01-10"),
        "for": "Netflix",
        type: "EXPENSE"
    },
    {
        accountId: 1,
        budgetId: null,
        amount: 1000,
        date: new Date("2023-01-15"),
        "for": "Salary",
        type: "INCOME"
    },
];
// Define an async function to seed the data
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, accounts_1, account, _a, budgets_1, budget, _b, transactions_1, transaction;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, accounts_1 = accounts;
                    _c.label = 1;
                case 1:
                    if (!(_i < accounts_1.length)) return [3 /*break*/, 4];
                    account = accounts_1[_i];
                    return [4 /*yield*/, prisma.account.create({
                            data: {
                                balance: account.balance,
                                name: account.name,
                                type: account.type,
                                userId: account.userId
                            }
                        })];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _a = 0, budgets_1 = budgets;
                    _c.label = 5;
                case 5:
                    if (!(_a < budgets_1.length)) return [3 /*break*/, 8];
                    budget = budgets_1[_a];
                    return [4 /*yield*/, prisma.budget.create({
                            data: budget
                        })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    _b = 0, transactions_1 = transactions;
                    _c.label = 9;
                case 9:
                    if (!(_b < transactions_1.length)) return [3 /*break*/, 12];
                    transaction = transactions_1[_b];
                    return [4 /*yield*/, prisma.transaction.create({
                            data: {
                                amount: transaction.amount,
                                date: transaction.date,
                                type: transaction.type,
                                accountId: transaction.accountId,
                                "for": transaction["for"]
                            }
                        })];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 9];
                case 12: return [2 /*return*/];
            }
        });
    });
}
// Call the seed function and catch any errors
seed()["catch"](function (error) {
    console.error(error);
    process.exit(1);
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Disconnect from the database when done
            return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                // Disconnect from the database when done
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
