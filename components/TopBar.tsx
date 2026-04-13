"use client"

import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import {
  Bell,
  Search,
  Settings,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react"

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Kullanıcılar",
  "/contents": "İçerikler",
  "/products": "Ürünler",
  "/reports": "Raporlar",
  "/permissions": "Yetkiler",
  "/settings": "Ayarlar",
  "/support": "Destek",
}

export default function TopBar() {
  const pathname = usePathname()
  const [profileOpen, setProfileOpen] = useState(false)

  const title = useMemo(() => {
    const match = Object.keys(routeTitles).find(
      (route) =>
        pathname === route || pathname.startsWith(route + "/")
    )
    return match ? routeTitles[match] : "Ervix Admin"
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-slate-200/70">
      <div className="flex items-center justify-between h-[80px] px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-indigo-500 font-semibold">
            Admin Panel
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SEARCH */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2.5 shadow-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              placeholder="Ara..."
              className="bg-transparent outline-none text-sm w-[160px] lg:w-[220px]"
            />
          </div>

          {/* NOTIFICATION */}
          <button className="relative w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition">
            <Bell className="w-5 h-5 text-slate-700" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full" />
          </button>

          {/* SETTINGS */}
          <button className="w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition">
            <Settings className="w-5 h-5 text-slate-700" />
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800">
                  Admin
                </p>
                <p className="text-xs text-slate-500">
                  admin@ervix.com
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-[220px] bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100">
                  <User className="w-4 h-4" />
                  Profil
                </button>

                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-100">
                  <Settings className="w-4 h-4" />
                  Ayarlar
                </button>

                <div className="my-2 border-t border-slate-200" />

                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}