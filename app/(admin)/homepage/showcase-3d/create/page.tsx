"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Eye,
  Layers3,
  CheckCircle2,
  Plus,
  Trash2,
  Box,
  Code2,
} from "lucide-react"

type ShowcaseStatus = "Aktif" | "Pasif"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

export default function CreateShowcase3DPage() {
  const [form, setForm] = useState({
    badge: "",
    title: "",
    description: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    previewLabel: "",
    previewTitle: "",
    embedHtml: "",
    status: "Aktif" as ShowcaseStatus,
    sortOrder: 1,
  })

  const [spots, setSpots] = useState([
    {
      title: "Interactive Scene",
      description: "Gerçek zamanlı etkileşim ve modern görsel deneyim.",
    },
    {
      title: "Brand Impact",
      description: "Markayı klasik arayüzlerin ötesine taşıyan sunum biçimi.",
    },
    {
      title: "High Performance",
      description: "Optimize edilmiş, akıcı ve dikkat çekici deneyim yapısı.",
    },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const preview = useMemo(() => {
    return {
      badge: form.badge || "3D Showcase",
      title:
        form.title || "Etkileşimli deneyimlerle markanı dijitalde farklılaştır.",
      description:
        form.description ||
        "Three.js, WebGL ve modern frontend teknikleriyle interaktif 3D web deneyimleri geliştiriyoruz.",
      primaryButtonText: form.primaryButtonText || "Projeleri Gör",
      primaryButtonUrl: form.primaryButtonUrl || "/anasayfa#projects",
      secondaryButtonText: form.secondaryButtonText || "İletişime Geç",
      secondaryButtonUrl: form.secondaryButtonUrl || "/anasayfa#contact",
      previewLabel: form.previewLabel || "Live Preview",
      previewTitle: form.previewTitle || "3D Experience Area",
      embedHtml:
        form.embedHtml ||
        `<div style="height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f172a,#312e81,#701a75);color:white;font-family:Arial,sans-serif;">
  <div style="text-align:center;padding:24px;">
    <div style="font-size:14px;opacity:.7;margin-bottom:8px;">ERVIX LABS</div>
    <div style="font-size:28px;font-weight:700;">3D Showcase Preview</div>
    <div style="margin-top:10px;font-size:14px;opacity:.75;">Three.js / WebGL / Interactive Scene</div>
  </div>
</div>`,
      status: form.status,
      sortOrder: form.sortOrder,
      spots,
    }
  }, [form, spots])

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function updateSpot(index: number, key: "title" | "description", value: string) {
    setSpots((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  function addSpot() {
    setSpots((prev) => [...prev, { title: "", description: "" }])
  }

  function removeSpot(index: number) {
    setSpots((prev) => prev.filter((_, i) => i !== index))
  }

  function mapStatusToApi(status: ShowcaseStatus) {
    return status === "Aktif" ? "AKTIF" : "PASIF"
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        badge: form.badge.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        primaryButtonText: form.primaryButtonText.trim(),
        primaryButtonUrl: form.primaryButtonUrl.trim(),
        secondaryButtonText: form.secondaryButtonText.trim(),
        secondaryButtonUrl: form.secondaryButtonUrl.trim(),
        previewLabel: form.previewLabel.trim(),
        previewTitle: form.previewTitle.trim(),
        embedHtml: form.embedHtml.trim(),
        status: mapStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
        spots: spots
          .map((spot) => ({
            title: spot.title.trim(),
            description: spot.description.trim(),
          }))
          .filter((spot) => spot.title || spot.description),
      }

      const response = await fetch(`${API_BASE}/homepage/showcase-3d`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          Array.isArray(result?.message)
            ? result.message.join(", ")
            : result?.message || "3D showcase kaydı oluşturulamadı."
        )
      }

      alert("3D showcase kaydı başarıyla oluşturuldu.")
      window.location.href = "/homepage/showcase-3d"
    } catch (error: any) {
      console.error("Showcase 3D create error:", error)
      alert(error?.message || "Bir hata oluştu.")
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
              HomePage / 3D Showcase
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Yeni 3D Showcase Oluştur
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              3D showcase alanındaki içerikleri, spot kartları ve embed HTML preview kodunu buradan oluşturabilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/showcase-3d"
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
                <Box className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Ana İçerik
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Başlık, açıklama ve CTA alanlarını doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.badge}
                onChange={(e) => updateField("badge", e.target.value)}
                placeholder="Badge"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                rows={3}
                placeholder="Başlık"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                placeholder="Açıklama"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.primaryButtonText}
                  onChange={(e) => updateField("primaryButtonText", e.target.value)}
                  placeholder="Primary button text"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
                <input
                  value={form.primaryButtonUrl}
                  onChange={(e) => updateField("primaryButtonUrl", e.target.value)}
                  placeholder="Primary button url"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.secondaryButtonText}
                  onChange={(e) => updateField("secondaryButtonText", e.target.value)}
                  placeholder="Secondary button text"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
                <input
                  value={form.secondaryButtonUrl}
                  onChange={(e) => updateField("secondaryButtonUrl", e.target.value)}
                  placeholder="Secondary button url"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Embed HTML Preview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Web tarafında preview olarak gösterilecek HTML kodunu ekle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.previewLabel}
                onChange={(e) => updateField("previewLabel", e.target.value)}
                placeholder="Preview label"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <input
                value={form.previewTitle}
                onChange={(e) => updateField("previewTitle", e.target.value)}
                placeholder="Preview title"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.embedHtml}
                onChange={(e) => updateField("embedHtml", e.target.value)}
                rows={14}
                placeholder="<iframe ...></iframe> veya custom html snippet"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-indigo-400"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Info Spot Alanları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Preview altındaki bilgi kutuları
                </p>
              </div>

              <button
                type="button"
                onClick={addSpot}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                <Plus className="h-4 w-4" />
                Spot Ekle
              </button>
            </div>

            <div className="space-y-4">
              {spots.map((spot, index) => (
                <div
                  key={index}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      Spot #{index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeSpot(index)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      value={spot.title}
                      onChange={(e) => updateSpot(index, "title", e.target.value)}
                      placeholder="Spot başlığı"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                    />

                    <textarea
                      value={spot.description}
                      onChange={(e) =>
                        updateSpot(index, "description", e.target.value)
                      }
                      rows={4}
                      placeholder="Spot açıklaması"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as ShowcaseStatus)
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
                Form bilgilerini kontrol edip yeni showcase kaydını oluşturabilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/homepage/showcase-3d"
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
                {isSubmitting ? "Kaydediliyor..." : "Showcase Kaydet"}
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
                    3D showcase yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] bg-[#0d0d13] p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                  {preview.badge}
                </div>

                <h3 className="mt-4 text-2xl font-bold leading-tight">
                  {preview.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  {preview.description}
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-medium text-white"
                  >
                    {preview.primaryButtonText}
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white"
                  >
                    {preview.secondaryButtonText}
                  </button>
                </div>

                <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-violet-300">
                    {preview.previewLabel}
                  </div>
                  <div className="mt-2 text-lg font-semibold">{preview.previewTitle}</div>

                  <div className="mt-4 overflow-hidden rounded-[18px] border border-white/10 bg-black/30">
                    <iframe
                      title="showcase-embed-preview"
                      srcDoc={preview.embedHtml}
                      className="h-[280px] w-full border-0 bg-transparent"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {preview.spots.map((spot, index) => (
                    <div
                      key={index}
                      className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="text-sm font-semibold text-white">{spot.title}</div>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {spot.description}
                      </p>
                    </div>
                  ))}
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
                  <p className="text-xs text-slate-400">Spot Sayısı</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.spots.length}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Embed Türü</p>
                  <p className="mt-1 font-semibold text-slate-800">HTML Snippet</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )
}