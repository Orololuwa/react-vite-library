import React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="border border-green-500 px-2 py-4 text-2xl rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      {...props}
    />
  );
}
