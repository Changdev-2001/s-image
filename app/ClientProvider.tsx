"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect } from "react";
import { initializeSettings } from "@/store/settingsSlice";

function StoreInitializer({ children }: { children: React.ReactNode }) {
  // We can't use hooks inside the Provider creation itself easily without splitting components,
  // but we can dispatch initialization here.
  // Actually, dispatching in a child component is cleaner.
  return <>{children}</>;
}

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StoreInitializerWrapper>{children}</StoreInitializerWrapper>
    </Provider>
  );
}

// Little wrapper to use dispatch
import { useDispatch } from "react-redux";

function StoreInitializerWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeSettings());
  }, [dispatch]);

  return <>{children}</>;
}
