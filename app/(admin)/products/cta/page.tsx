"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"

type Status = "Aktif" | "Pasif"

type CTAItem = {
  id: string
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

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CTA_ENDPOINT = `${API_BASE}/products/cta`

function mapApiItemToUi(item: any): CTAItem {
  return {
    id: String(item.id),
    badge: item.badge || "",
    title: item.title || "",
    description: item.description || "",
    primaryText: item.primaryText || "",
    primaryUrl: item.primaryUrl || "",
    secondaryText: item.secondaryText || "",
    secondaryUrl: item.secondaryUrl || "",
    background:
      item.background ||
      "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
    status: item.status === "ACTIVE" ? "Aktif" : "Pasif",
    sortOrder: Number(item.sortOrder || 0),
  }
}

export default function CTAPage() {
  const [items, setItems] = useState<CTAItem[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  async function fetchCtas() {
    setIsLoading(true)

    try {
      const res = await fetch(CTA_ENDPOINT, {
        cache: "no-store",
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kayıtları alınamadı.")
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
      setItems(list.map(mapApiItemToUi))
    } catch (error) {
      console.error("Fetch CTA error:", error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCtas()
  }, [])

  async function handleDelete(id: string) {
    const ok = window.confirm("Bu CTA kaydını silmek istediğine emin misin?")
    if (!ok) return

    try {
      const res = await fetch(`${CTA_ENDPOINT}/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kaydı silinemedi.")
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Delete CTA error:", error)
      alert("CTA kaydı silinirken hata oluştu.")
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.primaryText.toLowerCase().includes(q) ||
        item.secondaryText.toLowerCase().includes(q)
      )
    })
  }, [items, search])

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
      <div className="flex justify-between items-center gap-4">
        <input
          placeholder="Ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-xl w-full max-w-[320px]"
        />

        <Link
          href="/homepage/cta/create"
          className="bg-black text-white px-4 py-2 rounded-xl flex gap-2 items-center shrink-0"
        >
          <Plus size={16} />
          Yeni CTA
        </Link>
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="p-10 rounded-xl border bg-white text-center">
          <p className="text-base font-semibold text-slate-700">Yükleniyor...</p>
          <p className="text-sm text-slate-500 mt-2">CTA kayıtları getiriliyor.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-xl border bg-white text-center">
          <p className="text-base font-semibold text-slate-700">Kayıt bulunamadı</p>
          <p className="text-sm text-slate-500 mt-2">
            Arama kriterine uygun CTA kaydı bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border bg-white flex justify-between items-center gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm text-gray-400">{item.badge}</p>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link href={`/homepage/cta/${item.id}`}>
                  <Eye />
                </Link>
                <Link href={`/homepage/cta/${item.id}/edit`}>
                  <Pencil />
                </Link>
                <button onClick={() => handleDelete(item.id)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}