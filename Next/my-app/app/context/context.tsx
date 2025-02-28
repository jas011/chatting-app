"use client";

import { createContext, useContext, useState } from "react";
import { Chats } from "../Data/structure";
const MessageContext = createContext<any>(null);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [MessageObj, setMessageObj] = useState<Object>(new Chats("japjeet"));

  return (
    <MessageContext.Provider value={{ MessageObj, setMessageObj }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
