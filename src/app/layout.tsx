import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "C-withLove | Nền Tảng Từ Thiện Minh Bạch",
  description:
    "Nền tảng công nghệ giúp minh bạch hóa hoạt động từ thiện - theo dõi dòng tiền và tiến độ dự án theo thời gian thực.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
