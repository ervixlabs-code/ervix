"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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

type ApiItem = {
  id: number
  badge: string | null
  title: string
  description: string | null
  primaryText: string | null
  primaryUrl: string | null
  secondaryText: string | null
  secondaryUrl: string | null
  background: string | null
  status: "ACTIVE" | "PASSIVE" | "DRAFT"
  sortOrder: number
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)

export default function EditCTA() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [form, setForm] = useState<FormState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const endpoint = `${API_BASE}/admin/about-us/cta/${id}`

  useEffect(() => {
    async function fetchItem() {
      if (!id) return

      try {
        setLoading(true)

        const res = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "CTA kaydı alınamadı.")
        }

        const data: ApiItem = await res.json()

        setForm({
          badge: data.badge || "",
          title: data.title || "",
          description: data.description || "",
          primaryText: data.primaryText || "",
          primaryUrl: data.primaryUrl || "",
          secondaryText: data.secondaryText || "",
          secondaryUrl: data.secondaryUrl || "",
          background:
            data.background || "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
          status: data.status === "ACTIVE" ? "Aktif" : "Pasif",
          sortOrder: data.sortOrder || 1,
        })
      } catch (error) {
        console.error("Edit CTA fetch error:", error)
        alert("CTA kaydı yüklenirken hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [endpoint, id])

  const isValid = useMemo(() => {
    return !!form?.title.trim()
  }, [form])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form || !isValid) {
      alert("Lütfen en az CTA başlığını gir.")
      return
    }

    try {
      setSaving(true)

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

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kaydı güncellenemedi.")
      }

      router.push("/about-us/cta")
    } catch (error) {
      console.error("Edit CTA update error:", error)
      alert("CTA kaydı güncellenirken hata oluştu.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-10 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">CTA kaydı yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
        CTA kaydı bulunamadı.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">CTA Düzenle</h1>
            <p className="mt-2 text-white/80">
              Mevcut CTA kaydını düzenleyip güncelleyebilirsin.
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
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Badge
            </label>
            <input
              value={form.badge}
              onChange={(e) => updateField("badge", e.target.value)}
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
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Background
            </label>
            <input
              value={form.background}
              onChange={(e) => updateField("background", e.target.value)}
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
            disabled={saving || !isValid}
            className="inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Güncelle
              </>
            )}
          </button>
        </div>

        <div
          className="rounded-[28px] p-10 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
          style={{
            background:
              form.background ||
              "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
          }}
        >
          <p className="text-sm opacity-70">{form.badge || "Start Now"}</p>

          <h2 className="mt-2 text-3xl font-bold">
            {form.title || "Projeni birlikte büyütelim 🚀"}
          </h2>

          <p className="mt-3 opacity-80">
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