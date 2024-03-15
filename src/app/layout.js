import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ display: "flex", overflow: "hidden", height: "100vh" }}
      >
        <Sidebar />
        <div className="overflow-y-scroll h-screen flex-1 hideScrollbar min-w-[900px]">{children}</div>
      </body>
    </html>
  );
}
