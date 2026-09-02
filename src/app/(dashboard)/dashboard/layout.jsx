"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  School,
  Users,
  Images,
  CalendarDays,
  MessageSquare,
  Mail,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Hero",
      href: "/dashboard/hero",
      icon: Home,
    },
    {
      name: "About",
      href: "/dashboard/about",
      icon: BookOpen,
    },
    {
      name: "Facilities",
      href: "/dashboard/facilities",
      icon: School,
    },
    {
      name: "Teachers",
      href: "/dashboard/teachers",
      icon: Users,
    },
    {
      name: "Gallery",
      href: "/dashboard/gallery",
      icon: Images,
    },
    {
      name: "Message",
      href: "/dashboard/message",
      icon: MessageSquare,
    },
    {
      name: "Contact",
      href: "/dashboard/contact",
      icon: Mail,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-white border-r border-gray-200">

        {/* Brand */}
        <div className="px-7 py-7 border-b border-gray-100">
          <h1 className="font-serif text-2xl font-bold text-blue-900">
            Texas Academy
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-4 py-3
                           text-gray-600 transition-all duration-200
                           hover:bg-blue-50 hover:text-blue-900"
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className="text-gray-400 group-hover:text-blue-900"
                />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 w-full border-t border-gray-100 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3
                       text-red-600 transition hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span className="font-medium">Logout</span>
          </button>

        </div>

      </aside>


      {/* Main Content */}
      <main className="ml-72 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center
                           justify-between border-b border-gray-200
                           bg-white px-8">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back, Admin
            </p>
          </div>


          {/* Admin Profile */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center
                            rounded-full bg-blue-100 text-sm font-bold
                            text-blue-900">
              A
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Administrator
              </p>

              <p className="text-xs text-gray-400">
                Texas Academy
              </p>
            </div>

          </div>

        </header>


        {/* Page Content */}
        <section className="p-8">
          {children}
        </section>

      </main>

    </div>
  );
}