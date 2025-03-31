"use client";

import React, {
  useContext,
  useEffect,
  useState,
  createContext,
  FC,
} from "react";

import { GlobalContextType } from "./globalcontext.types";
import { AccountResult } from "../appwrite/appwrite.types";
import useSocket from "../hooks/useSocket";
import { getAccount } from "../appwrite/appwrite.config";

type Props = {
  children: React.ReactNode;
};

const GlobalContext = createContext<GlobalContextType>({
  user: null,
  setUser: (usr) => usr,
  isLoading: false,
  isLoggedIn: false,
  setIsLoggedIn: (bool) => bool,
  rooms: [],
  setRooms: (rooms) => rooms,
});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<AccountResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState<GlobalContextType["rooms"]>([]);
  const socket = useSocket();

  useEffect(() => {
    async function checkLogging() {
      setIsLoading(true);
      try {
        const response: any = await getAccount();
        if (response) {
          setUser(response);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log(e);

        setIsLoading(false);
      }
    }
    checkLogging();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("rooms");
    setTimeout(() => {
      socket.on("roomList", (roomlist) => {
        setChatRooms(roomlist.documents);
      });
    });
    return () => {
      socket.off("rooms");
    };
  }, [socket, user]);
  return (
    <GlobalContext.Provider
      value={{
        user: user as AccountResult,
        setUser,
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        rooms: chatRooms,
        setRooms: setChatRooms,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
