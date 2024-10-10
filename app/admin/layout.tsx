"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart, MessageCircle, DollarSign, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "User Requests", href: "/admin/userrequest", icon: CheckCircle },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
    {
      name: "Price Finalization",
      href: "/admin/price-finalization",
      icon: DollarSign,
    },
    {
      name: "Details Confirmation",
      href: "/admin/details-confirmation",
      icon: CheckCircle,
    },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <ul className="space-y-2 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-800", // Add text-gray-800 for better visibility
                  pathname === item.href && "bg-gray-100"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
