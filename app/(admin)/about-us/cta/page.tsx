"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
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
  Loader2,
  RefreshCw,
} from "lucide-react"

type Status = "ACTIVE" | "PASSIVE" | "DRAFT"

type CTAItem = {
  id: number
  badge: string | null
  title: string
  description: string | null
  primaryText: string | null
  primaryUrl: string | null
  secondaryText: string | null
  secondaryUrl: string | null
  background: string | null
  status: Status
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CTA_ENDPOINT = `${API_BASE}/admin/about-us/cta`

function mapStatusLabel(status: Status) {
  switch (status) {
    case "ACTIVE":
      return "Aktif"
    case "PASSIVE":
      return "Pasif"
    case "DRAFT":
      return "Taslak"
    default:
      return status
  }
}

function statusBadgeClass(status: Status) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "PASSIVE":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "DRAFT":
      return "bg-slate-100 text-slate-700 border-slate-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export default function AboutCtaPage() {
  const [items, setItems] = useState<CTAItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState("")

  async function fetchItems() {
    try {
      setLoading(true)
      setError("")

      const res = await fetch(CTA_ENDPOINT, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kayıtları alınamadı.")
      }

      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("About CTA list error:", err)
      setError("CTA kayıtları yüklenirken hata oluştu.")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  async function handleDelete(id: number) {
    const ok = window.confirm("Bu CTA kaydını silmek istediğine emin misin?")
    if (!ok) return

    try {
      setDeletingId(id)

      const res = await fetch(`${CTA_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kaydı silinemedi.")
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Delete CTA error:", err)
      alert("CTA kaydı silinirken hata oluştu.")
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return items

    return items.filter((item) => {
      return [
        item.badge || "",
        item.title || "",
        item.description || "",
        item.primaryText || "",
        item.secondaryText || "",
        mapStatusLabel(item.status),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
  }, [items, search])

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Rocket className="h-3.5 w-3.5" />
              About Us / CTA
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              CTA Yönetimi
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              About Us sayfasında kullanıcıyı aksiyona yönlendiren CTA bölümünü
              buradan yönetebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchItems}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              <RefreshCw className="h-4 w-4" />
              Yenile
            </button>

            <Link
              href="/about-us/cta/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
            >
              <Plus className="h-4 w-4" />
              Yeni CTA
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Başlık, badge, açıklama veya durum ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort order artan, sonra yeni kayıtlar</span>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">CTA kayıtları yükleniyor...</p>
          </div>
        </section>
      ) : error ? (
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="font-semibold">Bir hata oluştu</p>
          <p className="mt-1 text-sm">{error}</p>
        </section>
      ) : filtered.length === 0 ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Kayıt bulunamadı
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Arama kriterine uygun CTA kaydı yok ya da henüz kayıt eklenmemiş.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => {
            const statusLabel = mapStatusLabel(item.status)

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
              >
                <div
                  className="h-2 w-full"
                  style={{
                    background:
                      item.background ||
                      "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
                  }}
                />

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                          {item.badge || "Badge yok"}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                            item.status,
                          )}`}
                        >
                          {item.status === "ACTIVE" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <PauseCircle className="h-3.5 w-3.5" />
                          )}
                          {statusLabel}
                        </span>

                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                          Sıra: {item.sortOrder}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold tracking-[-0.02em] text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-7 text-slate-500">
                        {item.description || "Açıklama girilmemiş."}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs text-slate-400">Primary CTA</p>
                          <p className="mt-1 truncate font-semibold text-slate-800">
                            {item.primaryText || "-"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {item.primaryUrl || "-"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                          <p className="text-xs text-slate-400">Secondary CTA</p>
                          <p className="mt-1 truncate font-semibold text-slate-800">
                            {item.secondaryText || "-"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {item.secondaryUrl || "-"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 px-4 py-3 md:col-span-2">
                          <p className="text-xs text-slate-400">Background</p>
                          <p className="mt-1 truncate font-semibold text-slate-800">
                            {item.background || "Tanımlı değil"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">
                      <Link
                        href={`/about-us/cta/${item.id}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                        title="Detay"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/about-us/cta/${item.id}/edit`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                        title="Düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        title="Sil"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}