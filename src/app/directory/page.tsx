import type { Metadata } from "next";
import DirectoryClient from "./directory-client";

export const metadata: Metadata = {
  title: "Professional Directory | TaxCode",
  description: "Find and compare verified tax professionals with NGO-grade transparency.",
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}
