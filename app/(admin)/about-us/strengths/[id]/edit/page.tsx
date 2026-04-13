"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Eye,
  Boxes,
  CheckCircle2,
  Type,
  Pencil,
  RefreshCw,
} from "lucide-react"

type StrengthStatus = "Aktif" | "Pasif"

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

function extractErrorMessage(rawText: string) {
  const parsed = safeJsonParse(rawText)
  if (!parsed) return rawText || "Strength kaydı güncellenemedi."

  if (Array.isArray(parsed?.message)) return parsed.message.join(", ")
  if (typeof parsed?.message === "string") return parsed.message

  return rawText || "Strength kaydı güncellenemedi."
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

function mapUiStatusToApi(value: StrengthStatus) {
  return value === "Aktif" ? "ACTIVE" : "PASSIVE"
}

function pickItem(payload: any) {
  if (!payload) return null
  if (payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data
  }
  if (Array.isArray(payload?.data)) return payload.data[0] ?? null
  if (Array.isArray(payload)) return payload[0] ?? null
  if (typeof payload === "object") return payload
  return null
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const STRENGTHS_ENDPOINT = `${API_BASE}/about-us/strengths`

export default function EditStrengthPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params?.id || "")

  const [form, setForm] = useState({
    eyebrow: "Güçlü Olduğumuz Alanlar",
    title: "",
    description: "",
    itemText: "",
    status: "Aktif" as StrengthStatus,
    sortOrder: 1,
  })

  const [isLoaded, setIsLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchItem = async () => {
      try {
        setIsLoaded(false)
        setNotFound(false)

        const res = await fetch(`${STRENGTHS_ENDPOINT}/${id}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true)
            return
          }

          const text = await res.text()
          throw new Error(text || "Strength kaydı getirilemedi.")
        }

        const text = await res.text()
        const parsed = safeJsonParse(text)
        const item = pickItem(parsed)

        if (!item) {
          setNotFound(true)
          return
        }

        setForm({
          eyebrow:
            item.eyebrow ??
            item.sectionEyebrow ??
            item.groupEyebrow ??
            "Güçlü Olduğumuz Alanlar",
          title:
            item.title ??
            item.sectionTitle ??
            item.groupTitle ??
            "",
          description:
            item.description ??
            item.sectionDescription ??
            item.groupDescription ??
            "",
          itemText:
            item.text ??
            item.name ??
            item.label ??
            item.strengthText ??
            item.title ??
            "",
          status: mapApiStatusToUi(item.status),
          sortOrder: Number(item.sortOrder ?? item.sort_order ?? item.order ?? 1),
        })
      } catch (error) {
        console.error("Edit strengths fetch error:", error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => form, [form])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function updateWithPayload(payload: Record<string, any>) {
    const res = await fetch(`${STRENGTHS_ENDPOINT}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) return res

    const rawText = await res.text()
    const errorMessage = extractErrorMessage(rawText)
    throw new Error(errorMessage)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!String(form.itemText || "").trim()) {
        throw new Error("Strength item metni zorunlu.")
      }

      const fullPayload = {
        eyebrow: String(form.eyebrow || "").trim(),
        title: String(form.title || "").trim(),
        description: String(form.description || "").trim(),
        text: String(form.itemText || "").trim(),
        status: mapUiStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
      }

      const minimalPayloads = [
        {
          text: String(form.itemText || "").trim(),
          status: mapUiStatusToApi(form.status),
          sortOrder: Number(form.sortOrder || 1),
        },
        {
          title: String(form.itemText || "").trim(),
          status: mapUiStatusToApi(form.status),
          sortOrder: Number(form.sortOrder || 1),
        },
        {
          name: String(form.itemText || "").trim(),
          status: mapUiStatusToApi(form.status),
          sortOrder: Number(form.sortOrder || 1),
        },
      ]

      try {
        await updateWithPayload(fullPayload)
      } catch (error: any) {
        const message = String(error?.message || "")
        const dtoReject =
          message.includes("should not exist") ||
          message.includes("Bad Request") ||
          message.includes("property ")

        if (!dtoReject) {
          throw error
        }

        let updated = false
        let lastError: any = error

        for (const payload of minimalPayloads) {
          try {
            await updateWithPayload(payload)
            updated = true
            break
          } catch (innerError) {
            lastError = innerError
          }
        }

        if (!updated) {
          throw lastError
        }
      }

      router.push("/about-us/strengths")
    } catch (error: any) {
      console.error("Edit strengths submit error:", error)
      alert(error?.message || "Strength kaydı güncellenirken hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h1 className="text-2xl font-bold text-slate-900">Strength kaydı bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil veya silinmiş olabilir.
        </p>

        <div className="mt-6">
          <Link
            href="/about-us/strengths"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Listeye Dön
          </Link>
        </div>
      </div>
    )
  }

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
              Strength Kaydını Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Strength alanını buradan güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-us/strengths"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
            >
              <ArrowLeft className="h-4 w-4" />
              Listeye Dön
            </Link>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-7 space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Type className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Sol Alan Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Intro tarafındaki içerikleri düzenle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.eyebrow}
                onChange={(e) => update("eyebrow", e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                placeholder="Eyebrow"
              />

              <textarea
                rows={3}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                placeholder="Başlık"
              />

              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                placeholder="Açıklama"
              />

              <textarea
                rows={3}
                value={form.itemText}
                onChange={(e) => update("itemText", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                placeholder="Strength item metni"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Yayın Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Durum ve sıralama değerlerini düzenle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value as StrengthStatus)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              >
                <option>Aktif</option>
                <option>Pasif</option>
              </select>

              <input
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(e) => update("sortOrder", Number(e.target.value || 1))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Güncellemeye hazır</h3>
              <p className="mt-1 text-sm text-slate-500">
                Form bilgilerini kontrol edip strength kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about-us/strengths"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Vazgeç
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
              </button>
            </div>
          </section>
        </div>

        <div className="2xl:col-span-5">
          <div className="sticky top-24 space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                    Canlı Önizleme
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Strength section yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="min-w-0 max-w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-violet-300">
                    <Boxes className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{preview.eyebrow}</span>
                  </div>

                  <h3 className="mt-5 break-all text-2xl font-bold leading-tight">
                    {preview.title}
                  </h3>

                  <p className="mt-4 break-all whitespace-pre-wrap text-sm leading-7 text-white/60">
                    {preview.description}
                  </p>
                </div>

                <div className="min-w-0 max-w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white px-5 py-5 text-sm leading-7 text-slate-700 shadow-sm">
                  <p className="break-all whitespace-pre-wrap">{preview.itemText}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Özet Bilgiler</h3>
                  <p className="text-sm text-slate-500">Düzenlenen kayıt özeti</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Kayıt ID</p>
                  <p className="mt-1 font-semibold text-slate-800">{String(id)}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Durum</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.status}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Sıralama</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.sortOrder}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )
}