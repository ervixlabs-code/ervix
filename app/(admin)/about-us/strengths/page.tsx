"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Boxes,
  Plus,
  Search,
  Eye,
  Pencil,
  MoreHorizontal,
  CheckCircle2,
  PauseCircle,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react"

type StrengthStatus = "Aktif" | "Pasif"

type StrengthSection = {
  eyebrow: string
  title: string
  description: string
}

type StrengthItem = {
  id: number
  text: string
  status: StrengthStatus
  sortOrder: number
  createdAt?: string
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function mapApiStatusToUi(value: any): StrengthStatus {
  if (
    value === "ACTIVE" ||
    value === "Aktif" ||
    value === "active" ||
    value === "YAYINDA" ||
    value === "PUBLISHED"
  ) {
    return "Aktif"
  }
  return "Pasif"
}

function statusClasses(status: StrengthStatus) {
  return status === "Aktif"
    ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
    : "border border-slate-200 bg-slate-100 text-slate-600"
}

function formatDate(value?: string) {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat("tr-TR").format(d)
}

function extractList(payload: any): any[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

function mapStrengthItem(raw: any, index: number): StrengthItem {
  return {
    id: Number(raw?.id ?? raw?._id ?? index + 1),
    text:
      raw?.text ??
      raw?.title ??
      raw?.name ??
      raw?.label ??
      raw?.strengthText ??
      raw?.description ??
      `Strength ${index + 1}`,
    status: mapApiStatusToUi(raw?.status),
    sortOrder: Number(raw?.sortOrder ?? raw?.sort_order ?? raw?.order ?? index + 1),
    createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.updatedAt ?? raw?.updated_at,
  }
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const STRENGTHS_ENDPOINT = `${API_BASE}/about-us/strengths`

const fallbackSection: StrengthSection = {
  eyebrow: "Güçlü Olduğumuz Alanlar",
  title:
    "Ürün geliştirme ile kurumsal yazılım ihtiyaçları arasında güçlü bir köprü kuruyoruz.",
  description:
    "Sadece tek tip proje geliştirmiyoruz. Hem kendi ürün tarafımızı büyütüyor hem de markaların gerçek ihtiyaçlarına göre özel çözümler üretiyoruz.",
}

export default function AboutUsStrengthsListPage() {
  const [items, setItems] = useState<StrengthItem[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tümü")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)

  const pageSize = 6

  async function fetchStrengths() {
    try {
      setIsLoading(true)

      const res = await fetch(STRENGTHS_ENDPOINT, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Strength kayıtları getirilemedi.")
      }

      const text = await res.text()
      const parsed = safeJsonParse(text)
      const rawList = extractList(parsed)
      const mapped = rawList.map(mapStrengthItem).sort((a, b) => a.sortOrder - b.sortOrder)

      setItems(mapped)
    } catch (error) {
      console.error("About strengths fetch error:", error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStrengths()
  }, [])

  async function handleDelete(id: number) {
    const ok = window.confirm("Bu strength kaydını silmek istediğine emin misin?")
    if (!ok) return

    try {
      setIsDeletingId(id)

      const res = await fetch(`${STRENGTHS_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Strength kaydı silinemedi.")
      }

      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error: any) {
      console.error("About strengths delete error:", error)
      alert(error?.message || "Strength kaydı silinirken hata oluştu.")
    } finally {
      setIsDeletingId(null)
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = search.trim().toLowerCase()
      const matchesSearch = item.text.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === "Tümü" || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [items, search, statusFilter])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [filteredItems, currentPage])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage])

  const totalItems = items.length
  const activeItems = items.filter((item) => item.status === "Aktif").length
  const passiveItems = items.filter((item) => item.status === "Pasif").length
  const highestOrder = items.length
    ? Math.max(...items.map((item) => item.sortOrder))
    : 0

  const section = useMemo<StrengthSection>(() => {
    const first = items[0] as any

    return {
      eyebrow: fallbackSection.eyebrow,
      title:
        (first as any)?.sectionTitle ||
        (first as any)?.groupTitle ||
        fallbackSection.title,
      description:
        (first as any)?.sectionDescription ||
        (first as any)?.groupDescription ||
        fallbackSection.description,
    }
  }, [items])

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Boxes className="h-3.5 w-3.5" />
              About Us / Strengths
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Strengths Alanını Yönet
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Sol intro alanını ve sağ tarafta yer alan strength kartlarını buradan yönetebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchStrengths}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              type="button"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Yenile
            </button>

            <Link
              href="/about-us/strengths/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
            >
              <Plus className="h-4 w-4" />
              Yeni Strength Ekle
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Toplam Kayıt",
            value: totalItems.toString(),
            note: "Strength item kayıtları",
            icon: Boxes,
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-600">
            <Boxes className="h-3.5 w-3.5" />
            {section.eyebrow}
          </div>

          <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-900">
            {section.title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {section.description}
          </p>

          <Link
            href="/about-us/strengths/create"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
          >
            <Pencil className="h-4 w-4" />
            Alanı Düzenle
          </Link>
        </div>

        <div className="xl:col-span-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-5">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                Strengths Listesi
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Arama yap, filtrele ve strength itemlarını yönet
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
                  placeholder="Strength ara..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:w-[240px]"
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

          {isLoading ? (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Strength kayıtları yükleniyor...
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-[22px] border border-slate-200 xl:block">
                <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <div className="col-span-6">Strength Item</div>
                  <div className="col-span-2 text-center">Durum</div>
                  <div className="col-span-1 text-center">Sıra</div>
                  <div className="col-span-2 text-center">Tarih</div>
                  <div className="col-span-1 text-right">İşlem</div>
                </div>

                <div className="divide-y divide-slate-200">
                  {paginatedItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 items-center px-4 py-3 transition hover:bg-slate-50/80"
                    >
                      <div className="col-span-6 min-w-0 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                            <Boxes className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-slate-900">
                              {item.text}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Strength item kaydı
                            </p>
                          </div>
                        </div>
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

                      <div className="col-span-1 text-center">
                        <span className="inline-flex min-w-[32px] items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {item.sortOrder}
                        </span>
                      </div>

                      <div className="col-span-2 text-center text-xs text-slate-500">
                        {formatDate(item.createdAt) || "-"}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/about-us/strengths/${item.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/about-us/strengths/${item.id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeletingId === item.id}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:hidden">
                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-6 text-slate-900">
                          {item.text}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
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

                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                            {formatDate(item.createdAt) || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/about-us/strengths/${item.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/about-us/strengths/${item.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeletingId === item.id}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-60"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {paginatedItems.length === 0 && (
                <div className="mt-4 rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
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
        </div>
      </section>
    </div>
  )
}