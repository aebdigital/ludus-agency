import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = {
  title: "Ludus · Databáza divadelnej školy",
  description:
    "Záznamy študentov, atribúty pre obsadenie, dokumenty a médiá pre modernú divadelnú školu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full">
        <Sidebar />
        <div className="lg:pl-64">
          <Topbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </body>
    </html>
  );
}
