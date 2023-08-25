import {
  GetBudgetIdsReturnType,
  GetBudgetsReturnType,
} from "@/functions/budgets";
import {
  CreateBudgetType,
  DeleteBudgetType,
  GetBudgetsType,
} from "@/lib/types";
import axios from "axios";

export async function getBudgetIds(accountId: number) {
  let queryString = `/api/budgets/getBudgetIds?accountId=${accountId}`;
  const { data } = await axios.get(queryString);
  return data.data as GetBudgetIdsReturnType;
}

export async function getBudgets(body: GetBudgetsType) {
  let queryString = `/api/budgets?take=${body.take}`;
  if (body.accountId) queryString += `&accountId=${body.accountId}`;
  if (body.cursor) queryString += `&cursor=${body.cursor}`;
  if (body.name) queryString += `&name=${body.name}`;
  const { data } = await axios.get(queryString);
  return data.data as GetBudgetsReturnType;
}

export async function createBudget(body: CreateBudgetType) {
  const { data } = await axios.post(`/api/budgets`, { ...body });
  return data as { message: string };
}
export async function deleteBudget(query: DeleteBudgetType) {
  const { data } = await axios.delete(`/api/budgets?id=${query.id}`);
  return data as { message: string };
}
