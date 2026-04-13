"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Eye,
  Layers3,
  Tag,
  Plus,
  Trash2,
  ShoppingBag,
  ExternalLink,
} from "lucide-react"

type ProductStatus = "Aktif" | "Pasif"

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

export default function CreateProductsPage() {
  const [form, setForm] = useState({
    title: "",
    badge: "",
    description: "",
    previewTitle: "",
    previewSubtitle: "",
    categoryText: "",
    focusText: "",
    detailButtonText: "",
    detailButtonUrl: "",
    status: "Aktif" as ProductStatus,
    sortOrder: 1,
  })

  const [tags, setTags] = useState<string[]>([
    "Mobile App",
    "Product Design",
    "Scalable System",
  ])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const preview = useMemo(() => {
    return {
      title: form.title || "NovaMe",
      badge: form.badge || "Digital Product",
      description:
        form.description ||
        "Modern kullanıcı deneyimi ve güçlü teknik altyapı ile geliştirilen yenilikçi dijital ürün.",
      previewTitle: form.previewTitle || form.title || "NovaMe",
      previewSubtitle:
        form.previewSubtitle || "Showcase alanı / ürün görseli burada yer alacak",
      categoryText: form.categoryText || form.badge || "Digital Product",
      focusText: form.focusText || "Mobile App • Product Design",
      detailButtonText: form.detailButtonText || "Detayları Gör",
      detailButtonUrl: form.detailButtonUrl || "/anasayfa#products",
      status: form.status,
      sortOrder: form.sortOrder,
      tags,
    }
  }, [form, tags])

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

  function mapStatusToApi(status: ProductStatus) {
    return status === "Aktif" ? "AKTIF" : "PASIF"
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        title: form.title.trim(),
        badge: form.badge.trim(),
        description: form.description.trim(),
        previewTitle: form.previewTitle.trim(),
        previewSubtitle: form.previewSubtitle.trim(),
        categoryText: form.categoryText.trim(),
        focusText: form.focusText.trim(),
        detailButtonText: form.detailButtonText.trim(),
        detailButtonUrl: form.detailButtonUrl.trim(),
        status: mapStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
        tags: tags
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((value) => ({ value })),
      }

      const response = await fetch(`${API_BASE}/homepage/products`, {
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
            : result?.message || "Ürün kaydı oluşturulamadı."
        )
      }

      alert("Ürün kaydı başarıyla oluşturuldu.")
      window.location.href = "/homepage/products"
    } catch (error: any) {
      console.error("Products create error:", error)
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
              HomePage / Products
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Yeni Ürün Kaydı Oluştur
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Products alanındaki ürün kartı, tag alanı ve preview içeriklerini buradan oluşturabilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/products"
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
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Ana Ürün Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Başlık, badge ve açıklamayı doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Ürün adı"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <input
                value={form.badge}
                onChange={(e) => updateField("badge", e.target.value)}
                placeholder="Badge"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                placeholder="Ürün açıklaması"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
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
                  Ürün kartında görünecek tagleri yönet
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Yeni tag ekle..."
                className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
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
                <ExternalLink className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Preview ve Buton Alanı
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Kart içindeki alt preview alanlarını doldur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.previewTitle}
                onChange={(e) => updateField("previewTitle", e.target.value)}
                placeholder="Preview title"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.previewSubtitle}
                onChange={(e) => updateField("previewSubtitle", e.target.value)}
                rows={3}
                placeholder="Preview subtitle"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.categoryText}
                  onChange={(e) => updateField("categoryText", e.target.value)}
                  placeholder="Category text"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />

                <input
                  value={form.focusText}
                  onChange={(e) => updateField("focusText", e.target.value)}
                  placeholder="Focus text"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.detailButtonText}
                  onChange={(e) => updateField("detailButtonText", e.target.value)}
                  placeholder="Detay butonu metni"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />

                <input
                  value={form.detailButtonUrl}
                  onChange={(e) => updateField("detailButtonUrl", e.target.value)}
                  placeholder="Detay butonu linki"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
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
                    updateField("status", e.target.value as ProductStatus)
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
                Form bilgilerini kontrol edip yeni ürün kaydını oluşturabilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/homepage/products"
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
                {isSubmitting ? "Kaydediliyor..." : "Ürün Kaydet"}
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
                    Product kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.16),transparent_35%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-violet-300">
                      {preview.badge}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                      {preview.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-white">
                    {preview.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    {preview.description}
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
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Product Preview
                    </div>

                    <div className="mt-3 text-lg font-semibold text-white">
                      {preview.previewTitle}
                    </div>

                    <div className="mt-2 text-sm text-white/55">
                      {preview.previewSubtitle}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <div className="text-[11px] text-white/35">Category</div>
                        <div className="mt-1 text-sm font-medium text-white">
                          {preview.categoryText}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <div className="text-[11px] text-white/35">Focus</div>
                        <div className="mt-1 text-sm font-medium text-white">
                          {preview.focusText}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white"
                  >
                    {preview.detailButtonText}
                  </button>
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
                  <p className="text-xs text-slate-400">Detay Linki</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {preview.detailButtonUrl}
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