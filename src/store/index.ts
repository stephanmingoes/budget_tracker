import { CreateAccountType } from "@/lib/types";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

type DateAction = {
  setDate: (state: DateRange) => void;
};
type CreateAcccountAction = {
  updateCreateAccountStore: (state: CreateAccountType) => void;
};

export const useDateStore = create<DateRange & DateAction>((set) => ({
  from: new Date(),
  to: addDays(new Date(), 20),
  setDate: (state) => set(() => ({ ...state })),
}));

export const useCreateAccountStore = create<
  CreateAccountType & CreateAcccountAction
>((set) => ({
  balance: 0,
  name: "",
  type: "CHECKING",
  updateCreateAccountStore: (state) => set(() => ({ ...state })),
}));
