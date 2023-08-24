import { GetTransactionsReturnType } from "@/functions/transactions";
import {
  CreateTransactionType,
  DeleteTransactionType,
  GetTransactionsType,
} from "@/lib/types";
import axios from "axios";

export async function getTransactions(body: GetTransactionsType) {
  let queryString = `/api/transactions?take=${body.take}`;
  if (body.accountId) queryString += `&accountId=${body.accountId}`;
  if (body.budgetId) queryString += `&budgetId=${body.budgetId}`;
  if (body.cursor) queryString += `&cursor=${body.cursor}`;
  if (body.name) queryString += `&name=${body.name}`;
  const { data } = await axios.get(queryString);
  return data.data as GetTransactionsReturnType;
}

export async function createTransaction(body: CreateTransactionType) {
  const { data } = await axios.post(`/api/transactions`, { ...body });
  return data as { message: string };
}
export async function deleteTransaction(query: DeleteTransactionType) {
  const { data } = await axios.delete(`/api/transactions?id=${query.id}`);
  return data as { message: string };
}
