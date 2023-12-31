import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LoadProvider } from "@/context/LoadContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "평가 시스템",
  description: "평가를 진행합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LoadProvider>
      </body>
    </html>
  );
}
