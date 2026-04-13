"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Boxes,
  CheckCircle2,
  Type,
  Plus,
  RefreshCw,
} from "lucide-react"

type StrengthStatus = "Aktif" | "Pasif"

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

function mapUiStatusToApi(value: StrengthStatus) {
  return value === "Aktif" ? "ACTIVE" : "PASSIVE"
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
  if (!parsed) return rawText || "Strength kaydı oluşturulamadı."

  if (Array.isArray(parsed?.message)) {
    return parsed.message.join(", ")
  }

  if (typeof parsed?.message === "string") {
    return parsed.message
  }

  return rawText || "Strength kaydı oluşturulamadı."
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const STRENGTHS_ENDPOINT = `${API_BASE}/about-us/strengths`

export default function CreateStrengthPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    eyebrow: "Güçlü Olduğumuz Alanlar",
    title: "",
    description: "",
    itemText: "",
    status: "Aktif" as StrengthStatus,
    sortOrder: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const preview = useMemo(() => {
    return {
      eyebrow: form.eyebrow || "Güçlü Olduğumuz Alanlar",
      title:
        form.title ||
        "Ürün geliştirme ile kurumsal yazılım ihtiyaçları arasında güçlü bir köprü kuruyoruz.",
      description:
        form.description ||
        "Sadece tek tip proje geliştirmiyoruz. Hem kendi ürün tarafımızı büyütüyor hem de markaların gerçek ihtiyaçlarına göre özel çözümler üretiyoruz.",
      itemText: form.itemText || "Kurumsal web sitesi geliştirme",
      status: form.status,
      sortOrder: form.sortOrder,
    }
  }, [form])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function createWithPayload(payload: Record<string, any>) {
    const res = await fetch(STRENGTHS_ENDPOINT, {
      method: "POST",
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
        await createWithPayload(fullPayload)
      } catch (error: any) {
        const message = String(error?.message || "")
        const dtoReject =
          message.includes("should not exist") ||
          message.includes("Bad Request") ||
          message.includes("property ")

        if (!dtoReject) {
          throw error
        }

        let created = false
        let lastError: any = error

        for (const payload of minimalPayloads) {
          try {
            await createWithPayload(payload)
            created = true
            break
          } catch (innerError) {
            lastError = innerError
          }
        }

        if (!created) {
          throw lastError
        }
      }

      router.push("/about-us/strengths")
    } catch (error: any) {
      console.error("Create strengths error:", error)
      alert(error?.message || "Strength kaydı oluşturulurken hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
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
              Yeni Strength Kaydı Oluştur
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Sol intro alanı ve sağ taraftaki strength item için yeni kayıt oluştur.
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
                  Intro tarafındaki içerikleri doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.eyebrow}
                onChange={(e) => update("eyebrow", e.target.value)}
                placeholder="Eyebrow"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                rows={3}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Başlık"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Açıklama"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Strength Item
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sağ tarafta listelenecek item metnini gir
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <textarea
                rows={3}
                value={form.itemText}
                onChange={(e) => update("itemText", e.target.value)}
                placeholder="Strength item metni"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
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
                  Durum ve sıralama değerlerini ayarla
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
              <h3 className="text-lg font-bold text-slate-900">Kaydetmeye hazır</h3>
              <p className="mt-1 text-sm text-slate-500">
                Form bilgilerini kontrol edip yeni strength kaydını oluşturabilirsin.
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
                {isSubmitting ? "Kaydediliyor..." : "Strength Kaydet"}
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
          </div>
        </div>
      </form>
    </div>
  )
}