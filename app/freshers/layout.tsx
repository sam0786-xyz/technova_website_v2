import type { Metadata } from "next";
import "./freshers.css";

export const metadata: Metadata = {
  title: "FRESHER // 26",
  description: "Your first six days at Sharda, figured out.",
};

export default function FreshersLayout({ children }: { children: React.ReactNode }) {
  return <div className="freshers-app">{children}</div>;
}
