import { AccountResult } from "../appwrite/appwrite.types";

export interface GlobalContextType {
  user: AccountResult;
  setUser: React.Dispatch<React.SetStateAction<AccountResult | null>>;
  isLoading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setRooms?: React.Dispatch<React.SetStateAction<{ name: string }[]>>;
  rooms: { name: string }[];
}

export interface ModalTypes {
  variant: "success" | "error" | "warning";
  delay: number;
  message: string;
}
