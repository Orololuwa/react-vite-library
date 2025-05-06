import * as React from "react";
import "../styles/index.css";

export interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return <>{children}</>;
}
