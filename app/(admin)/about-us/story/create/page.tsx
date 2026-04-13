/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Layers3,
  CheckCircle2,
  Type,
  Target,
  Telescope,
} from "lucide-react"

type StoryStatus = "Aktif" | "Pasif"

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const STORY_ENDPOINT = `${API_BASE}/about-us/story`

export default function CreateAboutStoryPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    storyEyebrow: "Hikâyemiz",
    storyTitle: "",
    storyParagraph1: "",
    storyParagraph2: "",
    missionEyebrow: "Misyon",
    missionDescription: "",
    visionEyebrow: "Vizyon",
    visionDescription: "",
    status: "Aktif" as StoryStatus,
    sortOrder: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const preview = useMemo(() => {
    return {
      storyEyebrow: form.storyEyebrow || "Hikâyemiz",
      storyTitle:
        form.storyTitle ||
        "Yazılımı sadece teknik bir çıktı olarak değil, deneyim ve değer üretme aracı olarak görüyoruz.",
      storyParagraph1:
        form.storyParagraph1 ||
        "ERVIX LABS; kendi ürünlerini geliştiren, müşteri projeleri üreten ve markaların dijital alandaki varlığını daha güçlü hale getirmeyi hedefleyen modern bir yapı olarak konumlanır.",
      storyParagraph2:
        form.storyParagraph2 ||
        "Bizim için iyi bir proje; yalnızca çalışan bir sistem değil, aynı zamanda güçlü bir his bırakan, kullanıcıyla doğru iletişim kuran ve uzun vadede sürdürülebilir olan bir yapıdır.",
      missionEyebrow: form.missionEyebrow || "Misyon",
      missionDescription:
        form.missionDescription ||
        "Markalar ve ürünler için modern, güçlü ve etkili dijital deneyimler tasarlamak; bunu teknik kalite, tasarım disiplini ve ürün mantığı ile desteklemek.",
      visionEyebrow: form.visionEyebrow || "Vizyon",
      visionDescription:
        form.visionDescription ||
        "Web, mobil ve interaktif deneyim alanlarında sadece estetik değil, aynı zamanda sürdürülebilir ve fark yaratan dijital sistemler inşa eden güçlü bir ürün/yazılım stüdyosu olmak.",
      status: form.status,
      sortOrder: form.sortOrder,
    }
  }, [form])

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        no: String(form.sortOrder ?? 1),
        title: String(form.storyTitle || "").trim(),
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
      }

      if (!payload.title) {
        throw new Error("Başlık alanı zorunlu.")
      }

      if (payload.no.length > 20) {
        throw new Error("no alanı en fazla 20 karakter olabilir.")
      }

      if (payload.title.length > 255) {
        throw new Error("title alanı en fazla 255 karakter olabilir.")
      }

      const res = await fetch(STORY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Story kaydı oluşturulamadı.")
      }

      router.push("/about-us/story")
    } catch (error: any) {
      console.error("Create about story error:", error)
      alert(error?.message || "Story kaydı oluşturulurken hata oluştu.")
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
              <Layers3 className="h-3.5 w-3.5" />
              About Us / Story
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Yeni Story Kaydı Oluştur
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Hikâyemiz, misyon ve vizyon bloklarını buradan oluşturabilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-us/story"
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
                  Hikâyemiz Alanı
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sol büyük kartta görünecek alanları doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.storyEyebrow}
                onChange={(e) => updateField("storyEyebrow", e.target.value)}
                placeholder="Story eyebrow"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.storyTitle}
                onChange={(e) => updateField("storyTitle", e.target.value)}
                rows={3}
                placeholder="Story başlığı"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.storyParagraph1}
                onChange={(e) => updateField("storyParagraph1", e.target.value)}
                rows={4}
                placeholder="1. paragraf"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.storyParagraph2}
                onChange={(e) => updateField("storyParagraph2", e.target.value)}
                rows={4}
                placeholder="2. paragraf"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Misyon Alanı
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sağ üst kartta görünecek alanları doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.missionEyebrow}
                onChange={(e) => updateField("missionEyebrow", e.target.value)}
                placeholder="Misyon eyebrow"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.missionDescription}
                onChange={(e) => updateField("missionDescription", e.target.value)}
                rows={4}
                placeholder="Misyon açıklaması"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Telescope className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Vizyon Alanı
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sağ alt kartta görünecek alanları doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.visionEyebrow}
                onChange={(e) => updateField("visionEyebrow", e.target.value)}
                placeholder="Vizyon eyebrow"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.visionDescription}
                onChange={(e) => updateField("visionDescription", e.target.value)}
                rows={4}
                placeholder="Vizyon açıklaması"
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as StoryStatus)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Sıralama
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.sortOrder}
                  onChange={(e) =>
                    updateField("sortOrder", Number(e.target.value || 1))
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Kaydetmeye hazır</h3>
              <p className="mt-1 text-sm text-slate-500">
                Form bilgilerini kontrol edip yeni story kaydını oluşturabilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about-us/story"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Vazgeç
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Kaydediliyor..." : "Story Kaydet"}
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
                    Story section yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="grid gap-4">
                  <div className="min-w-0 max-w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-white">
                    <div className="flex min-w-0 max-w-full items-center gap-2 text-violet-300">
                      <Layers3 className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 max-w-full truncate text-[11px] uppercase tracking-[0.18em]">
                        {preview.storyEyebrow}
                      </span>
                    </div>

                    <h3 className="mt-4 w-full max-w-full break-all text-xl font-bold leading-tight">
                      {preview.storyTitle}
                    </h3>

                    <p className="mt-4 w-full max-w-full break-all whitespace-pre-wrap text-sm leading-7 text-white/60">
                      {preview.storyParagraph1}
                    </p>

                    <p className="mt-4 w-full max-w-full break-all whitespace-pre-wrap text-sm leading-7 text-white/60">
                      {preview.storyParagraph2}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className="min-w-0 max-w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-white">
                      <div className="flex min-w-0 max-w-full items-center gap-2 text-violet-300">
                        <Target className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 max-w-full truncate text-[11px] uppercase tracking-[0.18em]">
                          {preview.missionEyebrow}
                        </span>
                      </div>

                      <p className="mt-4 w-full max-w-full break-all whitespace-pre-wrap text-sm leading-7 text-white/60">
                        {preview.missionDescription}
                      </p>
                    </div>

                    <div className="min-w-0 max-w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-white">
                      <div className="flex min-w-0 max-w-full items-center gap-2 text-violet-300">
                        <Telescope className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 max-w-full truncate text-[11px] uppercase tracking-[0.18em]">
                          {preview.visionEyebrow}
                        </span>
                      </div>

                      <p className="mt-4 w-full max-w-full break-all whitespace-pre-wrap text-sm leading-7 text-white/60">
                        {preview.visionDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <h3 className="text-lg font-bold text-slate-900">Özet Bilgiler</h3>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Durum</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.status}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Sıralama</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.sortOrder}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Story Eyebrow</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.storyEyebrow}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )
}