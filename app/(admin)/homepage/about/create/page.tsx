"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Eye,
  Type,
  Layers3,
  Tag,
  LayoutPanelTop,
  Plus,
  Trash2,
} from "lucide-react"

type AboutStatus = "Aktif" | "Pasif"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

export default function CreateAboutPage() {
  const [form, setForm] = useState({
    badge: "",
    title: "",
    description1: "",
    description2: "",
    featuredLabel: "",
    featuredTitle: "",
    featuredDescription: "",
    focusValue: "",
    modelValue: "",
    status: "Aktif" as AboutStatus,
    sortOrder: 1,
  })

  const [tags, setTags] = useState<string[]>([
    "Web & Mobile",
    "Product Studio",
    "3D Experience",
    "Scalable Systems",
  ])

  const [newTag, setNewTag] = useState("")

  const [infoCards, setInfoCards] = useState([
    {
      title: "Product Thinking",
      text: "Sadece proje teslim etmiyor, ürün mantığıyla uzun ömürlü ve daha güçlü dijital yapılar kuruyoruz.",
    },
    {
      title: "Technical Excellence",
      text: "Modern frontend, backend ve ölçeklenebilir sistem yaklaşımıyla sağlam altyapılar geliştiriyoruz.",
    },
    {
      title: "Scalable Delivery",
      text: "Büyümeye uygun, sürdürülebilir ve iş hedeflerine uyumlu dijital çözümler sunuyoruz.",
    },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const preview = useMemo(() => {
    return {
      badge: form.badge || "About Us",
      title:
        form.title ||
        "Yalnızca yazılım üretmiyoruz, markalar için güçlü dijital deneyimler inşa ediyoruz.",
      description1:
        form.description1 ||
        "ERVIX LABS; kendi ürün ekosistemini büyüten, aynı zamanda markalar için güçlü teknik altyapıya sahip kurumsal projeler geliştiren modern bir yazılım stüdyosudur.",
      description2:
        form.description2 ||
        "Tasarım, mühendislik ve ürün düşüncesini aynı çatı altında birleştirerek; web, mobil ve interaktif deneyim tarafında daha etkili, daha ölçeklenebilir ve daha çağdaş çözümler sunuyoruz.",
      featuredLabel: form.featuredLabel || "ERVIX LABS",
      featuredTitle: form.featuredTitle || "Product-driven software studio",
      featuredDescription:
        form.featuredDescription ||
        "Kendi ürünlerini geliştiren, müşteri projeleri üreten ve modern teknolojiyle kurumsal dijital deneyimler tasarlayan bir yapı.",
      focusValue: form.focusValue || "Web • Mobile • 3D",
      modelValue: form.modelValue || "Product + Service",
      status: form.status,
      sortOrder: form.sortOrder,
      tags,
      infoCards,
    }
  }, [form, tags, infoCards])

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function addTag() {
    const value = newTag.trim()
    if (!value) return
    setTags((prev) => [...prev, value])
    setNewTag("")
  }

  function removeTag(index: number) {
    setTags((prev) => prev.filter((_, i) => i !== index))
  }

  function updateInfoCard(index: number, key: "title" | "text", value: string) {
    setInfoCards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  function addInfoCard() {
    setInfoCards((prev) => [...prev, { title: "", text: "" }])
  }

  function removeInfoCard(index: number) {
    setInfoCards((prev) => prev.filter((_, i) => i !== index))
  }

  function mapStatusToApi(status: AboutStatus) {
    return status === "Aktif" ? "AKTIF" : "PASIF"
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        badge: form.badge.trim(),
        title: form.title.trim(),
        description1: form.description1.trim(),
        description2: form.description2.trim(),
        featuredLabel: form.featuredLabel.trim(),
        featuredTitle: form.featuredTitle.trim(),
        featuredDescription: form.featuredDescription.trim(),
        focusValue: form.focusValue.trim(),
        modelValue: form.modelValue.trim(),
        status: mapStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
        tags: tags
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((value) => ({ value })),
        infoCards: infoCards
          .map((card) => ({
            title: card.title.trim(),
            text: card.text.trim(),
          }))
          .filter((card) => card.title || card.text),
      }

      const response = await fetch(`${API_BASE}/homepage/about`, {
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
            : result?.message || "About kaydı oluşturulamadı."
        )
      }

      alert("About kaydı başarıyla oluşturuldu.")
      window.location.href = "/homepage/about"
    } catch (error: any) {
      console.error("About create error:", error)
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
              HomePage / About
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Yeni About Kaydı Oluştur
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              About bölümündeki ana içerik, tagler, featured card ve alt kartları buradan oluşturabilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/about"
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
                  Ana İçerik
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Badge, başlık ve açıklamaları doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Badge
                </label>
                <input
                  value={form.badge}
                  onChange={(e) => updateField("badge", e.target.value)}
                  placeholder="Örn: About Us"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Başlık
                </label>
                <textarea
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  rows={4}
                  placeholder="Ana başlığı yaz..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama 1
                </label>
                <textarea
                  value={form.description1}
                  onChange={(e) => updateField("description1", e.target.value)}
                  rows={4}
                  placeholder="İlk paragraf..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama 2
                </label>
                <textarea
                  value={form.description2}
                  onChange={(e) => updateField("description2", e.target.value)}
                  rows={4}
                  placeholder="İkinci paragraf..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Tag Alanı
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  About bölümünde görünecek etiketleri yönet
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Yeni tag ekle..."
                className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={addTag}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Tag Ekle
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="rounded-full p-1 text-rose-500 transition hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <LayoutPanelTop className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Featured Card
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sağ taraftaki büyük kart içeriği
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.featuredLabel}
                onChange={(e) => updateField("featuredLabel", e.target.value)}
                placeholder="Featured label"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />
              <input
                value={form.featuredTitle}
                onChange={(e) => updateField("featuredTitle", e.target.value)}
                placeholder="Featured title"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />
              <textarea
                value={form.featuredDescription}
                onChange={(e) => updateField("featuredDescription", e.target.value)}
                rows={4}
                placeholder="Featured description"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.focusValue}
                  onChange={(e) => updateField("focusValue", e.target.value)}
                  placeholder="Focus value"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
                <input
                  value={form.modelValue}
                  onChange={(e) => updateField("modelValue", e.target.value)}
                  placeholder="Model value"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Alt Bilgi Kartları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  About alanındaki küçük bilgi kartları
                </p>
              </div>

              <button
                type="button"
                onClick={addInfoCard}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                <Plus className="h-4 w-4" />
                Kart Ekle
              </button>
            </div>

            <div className="space-y-4">
              {infoCards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">
                      Kart #{index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeInfoCard(index)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      value={card.title}
                      onChange={(e) =>
                        updateInfoCard(index, "title", e.target.value)
                      }
                      placeholder="Kart başlığı"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                    />

                    <textarea
                      value={card.text}
                      onChange={(e) =>
                        updateInfoCard(index, "text", e.target.value)
                      }
                      rows={4}
                      placeholder="Kart açıklaması"
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
                    updateField("status", e.target.value as AboutStatus)
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
                Form bilgilerini kontrol edip yeni about kaydını oluşturabilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/homepage/about"
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
                {isSubmitting ? "Kaydediliyor..." : "About Kaydet"}
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
                    About alanı yaklaşık görünüm
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
                  {preview.description1}
                </p>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  {preview.description2}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {preview.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-violet-300">
                    {preview.featuredLabel}
                  </div>
                  <div className="mt-2 text-lg font-semibold">{preview.featuredTitle}</div>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {preview.featuredDescription}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div className="text-[11px] text-white/35">Focus</div>
                      <div className="mt-1 text-sm font-medium text-white">
                        {preview.focusValue}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div className="text-[11px] text-white/35">Model</div>
                      <div className="mt-1 text-sm font-medium text-white">
                        {preview.modelValue}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {preview.infoCards.map((card, index) => (
                    <div
                      key={index}
                      className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="text-sm font-semibold text-white">{card.title}</div>
                      <p className="mt-2 text-sm leading-6 text-white/60">{card.text}</p>
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
                  <p className="text-xs text-slate-400">Tag Sayısı</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.tags.length}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Alt Kart Sayısı</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.infoCards.length}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )
}