"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Workflow,
  Users,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  PauseCircle,
  ArrowUpDown,
  Loader2,
  RefreshCw,
} from "lucide-react"

type CultureStatusApi = "ACTIVE" | "PASSIVE" | "DRAFT"
type CultureStatusUi = "Aktif" | "Pasif" | "Taslak"
type IconKey = "Workflow" | "Users"

type CultureItem = {
  id: number
  sectionLabel: string | null
  badge: string | null
  title: string
  description: string | null
  icon: IconKey | string | null
  status: CultureStatusApi
  sortOrder: number
  createdAt?: string
}

const iconMap = {
  Workflow,
  Users,
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CULTURE_ENDPOINT = `${API_BASE}/about-us/culture`

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function toUiStatus(status: CultureStatusApi): CultureStatusUi {
  switch (status) {
    case "ACTIVE":
      return "Aktif"
    case "PASSIVE":
      return "Pasif"
    case "DRAFT":
      return "Taslak"
    default:
      return "Pasif"
  }
}

function statusClasses(status: CultureStatusUi) {
  if (status === "Aktif") {
    return "border border-emerald-100 bg-emerald-50 text-emerald-600"
  }

  if (status === "Taslak") {
    return "border border-amber-100 bg-amber-50 text-amber-600"
  }

  return "border border-slate-200 bg-slate-100 text-slate-600"
}

export default function AboutUsCultureListPage() {
  const [items, setItems] = useState<CultureItem[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tümü")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const pageSize = 6

  async function fetchItems() {
    try {
      setLoading(true)
      setError("")

      const res = await fetch(CULTURE_ENDPOINT, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Culture kayıtları alınamadı.")
      }

      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("About culture list error:", err)
      setError("Culture kayıtları yüklenirken hata oluştu.")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  async function handleDelete(id: number) {
    const ok = window.confirm("Bu kültür kaydını silmek istediğine emin misin?")
    if (!ok) return

    try {
      setDeletingId(id)

      const res = await fetch(`${CULTURE_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Culture kaydı silinemedi.")
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Delete culture error:", err)
      alert("Culture kaydı silinirken hata oluştu.")
    } finally {
      setDeletingId(null)
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = search.trim().toLowerCase()
      const uiStatus = toUiStatus(item.status)

      const matchesSearch =
        (item.sectionLabel || "").toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.icon || "").toLowerCase().includes(q) ||
        (item.badge || "").toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === "Tümü" || uiStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [items, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage])

  const totalItems = items.length
  const activeItems = items.filter((item) => item.status === "ACTIVE").length
  const passiveItems = items.filter((item) => item.status === "PASSIVE").length
  const highestOrder = items.length
    ? Math.max(...items.map((item) => item.sortOrder))
    : 0

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Workflow className="h-3.5 w-3.5" />
              About Us / Culture
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Culture Alanını Yönet
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              About sayfasındaki çalışma kültürü ve yaklaşım kartlarını buradan
              yönetebilirsin.
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
              href="/about-us/culture/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
            >
              <Plus className="h-4 w-4" />
              Yeni Culture Kaydı Ekle
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Toplam Kayıt",
            value: totalItems.toString(),
            note: "Culture alanı kayıtları",
            icon: Workflow,
          },
          {
            title: "Aktif Kayıt",
            value: activeItems.toString(),
            note: "Yayında olan kayıtlar",
            icon: CheckCircle2,
          },
          {
            title: "Pasif Kayıt",
            value: passiveItems.toString(),
            note: "Gizli durumda olanlar",
            icon: PauseCircle,
          },
          {
            title: "Son Sıra",
            value: highestOrder.toString(),
            note: "Maksimum sıralama değeri",
            icon: ArrowUpDown,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.title}</p>
                  <h3 className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500">{item.note}</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(99,102,241,0.28)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
              Culture Listesi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Arama yap, filtrele ve kültür kartlarını yönet
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Başlık veya açıklama ara..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:w-[320px]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option>Tümü</option>
              <option>Aktif</option>
              <option>Pasif</option>
              <option>Taslak</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Culture kayıtları yükleniyor...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-6 py-14 text-center text-rose-700">
            <p className="text-lg font-semibold">Bir hata oluştu</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 xl:hidden">
              {paginatedItems.map((item) => {
                const Icon =
                  iconMap[item.icon as keyof typeof iconMap] || Workflow
                const uiStatus = toUiStatus(item.status)

                return (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {item.sectionLabel || "Section yok"}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          statusClasses(uiStatus)
                        )}
                      >
                        {uiStatus}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        Sıra: {item.sortOrder}
                      </span>
                    </div>

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {item.badge || "Badge yok"}
                    </p>

                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description || "Açıklama yok"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/about-us/culture/${item.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                        Gör
                      </Link>

                      <Link
                        href={`/about-us/culture/${item.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                        Düzenle
                      </Link>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 disabled:opacity-60"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Sil
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="hidden overflow-hidden rounded-[22px] border border-slate-200 xl:block">
              <div className="grid grid-cols-12 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <div className="col-span-5">Culture İçeriği</div>
                <div className="col-span-2 text-center">İkon</div>
                <div className="col-span-2 text-center">Durum</div>
                <div className="col-span-1 text-center">Sıra</div>
                <div className="col-span-2 text-right">İşlem</div>
              </div>

              <div className="divide-y divide-slate-200">
                {paginatedItems.map((item) => {
                  const Icon =
                    iconMap[item.icon as keyof typeof iconMap] || Workflow
                  const uiStatus = toUiStatus(item.status)

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 items-center px-5 py-4 transition hover:bg-slate-50/80"
                    >
                      <div className="col-span-5 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                            {item.sectionLabel || "Section yok"}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            {item.badge || "Badge yok"}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {item.description || "Açıklama yok"}
                        </p>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
                          <Icon className="h-4 w-4 text-violet-600" />
                          {item.icon || "Workflow"}
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            statusClasses(uiStatus)
                          )}
                        >
                          {uiStatus}
                        </span>
                      </div>

                      <div className="col-span-1 text-center text-sm font-semibold text-slate-700">
                        {item.sortOrder}
                      </div>

                      <div className="col-span-2 flex justify-end">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/about-us/culture/${item.id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/about-us/culture/${item.id}/edit`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {paginatedItems.length === 0 && (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <p className="text-lg font-semibold text-slate-700">Kayıt bulunamadı</p>
                <p className="mt-2 text-sm text-slate-500">
                  Arama veya filtre kriterlerini değiştirerek tekrar deneyebilirsin.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Toplam{" "}
                <span className="font-semibold text-slate-900">
                  {filteredItems.length}
                </span>{" "}
                kayıt listeleniyor
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Geri
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1
                  const isActive = currentPage === page

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "h-10 min-w-[40px] rounded-xl px-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  İleri
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}