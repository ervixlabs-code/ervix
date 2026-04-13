"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Save } from "lucide-react"

type FormState = {
  badge: string
  title: string
  description: string
  primaryText: string
  primaryUrl: string
  secondaryText: string
  secondaryUrl: string
  background: string
  status: "Aktif" | "Pasif"
  sortOrder: number
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CTA_ENDPOINT = `${API_BASE}/admin/about-us/cta`

export default function CreateCTA() {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    badge: "",
    title: "",
    description: "",
    primaryText: "",
    primaryUrl: "",
    secondaryText: "",
    secondaryUrl: "",
    background: "",
    status: "Aktif",
    sortOrder: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const previewBackground =
    form.background || "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)"

  const isValid = useMemo(() => {
    return form.title.trim().length > 0
  }, [form.title])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!isValid) {
      alert("Lütfen en az CTA başlığını gir.")
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        badge: form.badge.trim() || null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        primaryText: form.primaryText.trim() || null,
        primaryUrl: form.primaryUrl.trim() || null,
        secondaryText: form.secondaryText.trim() || null,
        secondaryUrl: form.secondaryUrl.trim() || null,
        background: form.background.trim() || null,
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder) > 0 ? Number(form.sortOrder) : 1,
      }

      const res = await fetch(CTA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kaydı oluşturulamadı.")
      }

      router.push("/about-us/cta")
    } catch (error) {
      console.error("Create CTA error:", error)
      alert("CTA kaydı oluşturulurken hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Yeni CTA Oluştur</h1>
            <p className="mt-2 text-white/80">
              About Us sayfasındaki CTA alanı için yeni kayıt oluştur.
            </p>
          </div>

          <Link
            href="/about-us/cta"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Listeye Dön
          </Link>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* FORM */}
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Badge
            </label>
            <input
              value={form.badge}
              onChange={(e) => updateField("badge", e.target.value)}
              placeholder="Badge"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Title"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Description"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Primary Button Text
              </label>
              <input
                value={form.primaryText}
                onChange={(e) => updateField("primaryText", e.target.value)}
                placeholder="Primary Button Text"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Primary URL
              </label>
              <input
                value={form.primaryUrl}
                onChange={(e) => updateField("primaryUrl", e.target.value)}
                placeholder="Primary URL"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Secondary Button Text
              </label>
              <input
                value={form.secondaryText}
                onChange={(e) => updateField("secondaryText", e.target.value)}
                placeholder="Secondary Button Text"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Secondary URL
              </label>
              <input
                value={form.secondaryUrl}
                onChange={(e) => updateField("secondaryUrl", e.target.value)}
                placeholder="Secondary URL"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Background (gradient/css)
            </label>
            <input
              value={form.background}
              onChange={(e) => updateField("background", e.target.value)}
              placeholder="linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as "Aktif" | "Pasif")
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              >
                <option value="Aktif">Aktif</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sort Order
              </label>
              <input
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(e) =>
                  updateField("sortOrder", Number(e.target.value || 1))
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Kaydet
              </>
            )}
          </button>
        </div>

        {/* PREVIEW */}
        <div
          className="flex flex-col gap-4 rounded-[28px] p-10 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
          style={{ background: previewBackground }}
        >
          <p className="text-sm opacity-70">{form.badge || "Start Now"}</p>

          <h2 className="text-3xl font-bold">
            {form.title || "Projeni birlikte büyütelim 🚀"}
          </h2>

          <p className="opacity-80">
            {form.description || "CTA açıklaması burada görünecek"}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg bg-white px-4 py-2 text-black"
            >
              {form.primaryText || "Hemen Başla"}
            </button>

            <button
              type="button"
              className="rounded-lg border px-4 py-2"
            >
              {form.secondaryText || "Detaylı İncele"}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              {form.status}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
              Sıra: {form.sortOrder}
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}