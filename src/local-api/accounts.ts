import {
  GetAccountByIdReturnType,
  GetAccountsReturnType,
} from "@/functions/accounts";
import {
  CreateAccountType,
  DeleteAccountType,
  GetAccountsType,
  UpdateAccountType,
} from "@/lib/types";
import axios from "axios";

export async function getAccounts(body: Omit<GetAccountsType, "userId">) {
  let queryString = `/api/accounts?take=${body.take}`;
  if (body.name) queryString += `&name=${body.name}`;
  if (body.cursor) queryString += `&cursor=${body.cursor}`;
  const { data } = await axios.get(queryString);
  return data.data as GetAccountsReturnType;
}
export async function getAccountById(id: number) {
  let queryString = `/api/accounts/${id}`;
  const { data } = await axios.get(queryString);
  return data.data as GetAccountByIdReturnType;
}
export async function createAccount(body: CreateAccountType) {
  const { data } = await axios.post(`/api/accounts`, { ...body });
  return data as { message: string };
}
export async function deleteAccount(query: DeleteAccountType) {
  const { data } = await axios.delete(`/api/accounts?id=${query.id}`);
  return data as { message: string };
}
export async function updateAccount(body: UpdateAccountType) {
  const { data } = await axios.put(`/api/accounts`, body);
  return data as { message: string };
}
