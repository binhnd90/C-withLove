"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  FolderOpen,
  Receipt,
  QrCode,
  CalendarClock,
  Vote,
  Shield,
  ShieldAlert,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/projects", label: "Dự án", icon: FolderOpen },
  { href: "/proposals", label: "Bình chọn", icon: Vote },
  { href: "/financials", label: "Tài chính", icon: Receipt },
  { href: "/progress", label: "Tiến độ", icon: CalendarClock },
  { href: "/anomalies", label: "AI Cảnh báo", icon: ShieldAlert },
  { href: "/portal", label: "Cộng tác viên", icon: Shield },
  { href: "/scan", label: "Quét mã", icon: QrCode },
];

const mobileLinks = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/projects", label: "Dự án", icon: FolderOpen },
  { href: "/proposals", label: "Bình chọn", icon: Vote },
  { href: "/financials", label: "Tài chính", icon: Receipt },
  { href: "/scan", label: "Quét mã", icon: QrCode },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed left-0 top-0 z-30">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-5 border-b border-border"
        >
          <Heart className="w-7 h-7 text-primary" fill="currentColor" />
          <span className="text-xl font-bold text-foreground">
            C-withLove
          </span>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-light text-primary-dark"
                    : "text-muted hover:bg-gray-100 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-border text-xs text-muted">
          Minh bạch &middot; Tin cậy &middot; Nhân ái
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 flex justify-around py-2">
        {mobileLinks.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
                active ? "text-primary-dark" : "text-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
