"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Box,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  PauseCircle,
  ArrowUpDown,
  Code2,
  Sparkles,
} from "lucide-react"

type ShowcaseStatus = "Aktif" | "Pasif"

type ShowcaseItem = {
  id: number
  badge: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  previewLabel: string
  previewTitle: string
  embedHtml: string
  spots: {
    title: string
    description: string
  }[]
  status: ShowcaseStatus
  sortOrder: number
  createdAt: string
}

type ApiShowcaseItem = {
  id: number
  badge: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  previewLabel: string
  previewTitle: string
  embedHtml: string
  spots?: {
    id?: number
    title: string
    description: string
    sortOrder?: number
  }[]
  status: ShowcaseStatus | "AKTIF" | "PASIF"
  sortOrder: number
  createdAt: string
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function statusClasses(status: ShowcaseStatus) {
  return status === "Aktif"
    ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
    : "border border-slate-200 bg-slate-100 text-slate-600"
}

function mapApiStatusToUi(status?: string): ShowcaseStatus {
  return status === "Pasif" || status === "PASIF" ? "Pasif" : "Aktif"
}

function formatDate(value?: string) {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("tr-TR")
}

function mapApiItem(item: ApiShowcaseItem): ShowcaseItem {
  return {
    id: Number(item.id),
    badge: item.badge || "",
    title: item.title || "",
    description: item.description || "",
    primaryButtonText: item.primaryButtonText || "",
    primaryButtonUrl: item.primaryButtonUrl || "",
    secondaryButtonText: item.secondaryButtonText || "",
    secondaryButtonUrl: item.secondaryButtonUrl || "",
    previewLabel: item.previewLabel || "",
    previewTitle: item.previewTitle || "",
    embedHtml: item.embedHtml || "",
    spots: Array.isArray(item.spots)
      ? item.spots.map((spot) => ({
          title: spot.title || "",
          description: spot.description || "",
        }))
      : [],
    status: mapApiStatusToUi(item.status),
    sortOrder: Number(item.sortOrder || 0),
    createdAt: formatDate(item.createdAt),
  }
}

export default function HomePageShowcase3DListPage() {
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tümü")
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  async function fetchShowcases() {
    try {
      setLoading(true)

      const response = await fetch(`${API_BASE}/homepage/showcase-3d`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      const result = await response.json().catch(() => [])

      if (!response.ok) {
        throw new Error(
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message || "3D showcase verileri alınamadı."
        )
      }

      const mapped = Array.isArray(result) ? result.map(mapApiItem) : []
      setShowcaseItems(mapped)
    } catch (error: any) {
      console.error("Showcase 3D list fetch error:", error)
      alert(error?.message || "3D showcase verileri alınamadı.")
      setShowcaseItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShowcases()
  }, [])

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Bu 3D showcase kaydını silmek istediğine emin misin?")
    if (!confirmed) return

    try {
      setDeletingId(id)

      const response = await fetch(`${API_BASE}/homepage/showcase-3d/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message || "3D showcase kaydı silinemedi."
        )
      }

      setShowcaseItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error: any) {
      console.error("Showcase 3D delete error:", error)
      alert(error?.message || "3D showcase kaydı silinemedi.")
    } finally {
      setDeletingId(null)
    }
  }

  const filteredItems = useMemo(() => {
    return showcaseItems.filter((item) => {
      const q = search.trim().toLowerCase()

      const matchesSearch =
        item.badge.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.previewLabel.toLowerCase().includes(q) ||
        item.previewTitle.toLowerCase().includes(q) ||
        item.primaryButtonText.toLowerCase().includes(q) ||
        item.secondaryButtonText.toLowerCase().includes(q) ||
        item.spots.some(
          (spot) =>
            spot.title.toLowerCase().includes(q) ||
            spot.description.toLowerCase().includes(q)
        )

      const matchesStatus =
        statusFilter === "Tümü" || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [showcaseItems, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))

  const paginatedItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage, totalPages])

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages))
  }, [totalPages])

  const totalItems = showcaseItems.length
  const activeItems = showcaseItems.filter((item) => item.status === "Aktif").length
  const passiveItems = showcaseItems.filter((item) => item.status === "Pasif").length
  const highestOrder =
    showcaseItems.length > 0 ? Math.max(...showcaseItems.map((item) => item.sortOrder)) : 0

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Box className="h-3.5 w-3.5" />
              HomePage Yönetimi
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              3D Showcase Alanını Yönet
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              3D showcase bölümündeki içerikleri, CTA’ları, info spot alanlarını ve embed HTML preview kodunu buradan yönetebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/showcase-3d/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
            >
              <Plus className="h-4 w-4" />
              Yeni Showcase Ekle
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Toplam Kayıt",
            value: totalItems.toString(),
            note: "Showcase kayıtları",
            icon: Box,
          },
          {
            title: "Aktif Kayıt",
            value: activeItems.toString(),
            note: "Yayında olanlar",
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
                    {loading ? "-" : item.value}
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
              3D Showcase Listesi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Arama yap, filtrele ve showcase içeriklerini yönet
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
                placeholder="Badge, başlık veya açıklama ara..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:w-[300px]"
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
            </select>
          </div>
        </div>

        {loading && (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-slate-700">Yükleniyor...</p>
            <p className="mt-2 text-sm text-slate-500">
              3D showcase kayıtları getiriliyor, lütfen bekleyin.
            </p>
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 gap-4 xl:hidden">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {item.badge}
                    </span>

                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        statusClasses(item.status)
                      )}
                    >
                      {item.status}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      Sıra: {item.sortOrder}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>

                  <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200 bg-white">
                    <iframe
                      title={`showcase-preview-${item.id}`}
                      srcDoc={item.embedHtml}
                      className="h-[220px] w-full border-0"
                      sandbox="allow-scripts"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-xs text-slate-400">Preview Title</p>
                      <p className="mt-1 font-medium text-slate-700">{item.previewTitle}</p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-xs text-slate-400">Spot Sayısı</p>
                      <p className="mt-1 font-medium text-slate-700">{item.spots.length}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/homepage/showcase-3d/${item.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                      Gör
                    </Link>

                    <Link
                      href={`/homepage/showcase-3d/${item.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === item.id ? "Siliniyor..." : "Sil"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[22px] border border-slate-200 xl:block">
              <div className="grid grid-cols-12 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <div className="col-span-4">Showcase</div>
                <div className="col-span-2 text-center">Durum</div>
                <div className="col-span-1 text-center">Sıra</div>
                <div className="col-span-2 text-center">Embed</div>
                <div className="col-span-2 text-center">Spot Sayısı</div>
                <div className="col-span-1 text-right">İşlem</div>
              </div>

              <div className="divide-y divide-slate-200">
                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center px-5 py-4 transition hover:bg-slate-50/80"
                  >
                    <div className="col-span-4 min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                          {item.badge}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          statusClasses(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="col-span-1 text-center text-sm font-semibold text-slate-700">
                      {item.sortOrder}
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                        <Code2 className="h-3.5 w-3.5" />
                        HTML Embed
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        {item.spots.length} Spot
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/homepage/showcase-3d/${item.id}`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/homepage/showcase-3d/${item.id}/edit`}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Sil"
                        >
                          {deletingId === item.id ? (
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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