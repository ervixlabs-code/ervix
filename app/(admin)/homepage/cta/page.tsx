"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Rocket,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  PauseCircle,
  ArrowUpDown,
} from "lucide-react"

type Status = "Aktif" | "Pasif"

type CTAItem = {
  id: number
  badge: string
  title: string
  description: string
  primaryText: string
  primaryUrl: string
  secondaryText: string
  secondaryUrl: string
  background: string
  status: Status
  sortOrder: number
}

const data: CTAItem[] = [
  {
    id: 1,
    badge: "Start Now",
    title: "Projeni birlikte büyütelim 🚀",
    description:
      "Ervix ile dijital dünyada fark yaratacak projeni bugün başlat.",
    primaryText: "Hemen Başla",
    primaryUrl: "/contact",
    secondaryText: "Detaylı İncele",
    secondaryUrl: "/services",
    background:
      "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
    status: "Aktif",
    sortOrder: 1,
  },
]

export default function CTAPage() {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-[28px] p-6 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
        <h1 className="text-3xl font-bold">CTA Yönetimi</h1>
        <p className="text-white/80 mt-2">
          Kullanıcıyı aksiyona yönlendiren ana bölüm
        </p>
      </div>

      {/* ACTION */}
      <div className="flex justify-between items-center">
        <input
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl"
        />

        <Link
          href="/homepage/cta/create"
          className="bg-black text-white px-4 py-2 rounded-xl flex gap-2 items-center"
        >
          <Plus size={16} />
          Yeni CTA
        </Link>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl border bg-white flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400">{item.badge}</p>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>

            <div className="flex gap-2">
              <Link href={`/homepage/cta/${item.id}`}>
                <Eye />
              </Link>
              <Link href={`/homepage/cta/${item.id}/edit`}>
                <Pencil />
              </Link>
              <button>
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}