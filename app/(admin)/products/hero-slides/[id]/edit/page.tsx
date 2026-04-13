/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  CheckCircle2,
  Type,
  Pencil,
  RefreshCw,
  Link2,
  LayoutPanelTop,
  Tags,
  Plus,
  X,
} from "lucide-react"

type SlideStatus = "Aktif" | "Pasif"

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const HERO_SLIDES_ENDPOINT = `${API_BASE}/products/hero-slides`

export default function EditProductsHeroSlidePage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params?.id || "")

  const [form, setForm] = useState({
    eyebrow: "",
    title: "",
    description: "",
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    panelTitle: "",
    panelDescription: "",
    status: "Aktif" as SlideStatus,
    sortOrder: 1,
    tags: [""] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchItem = async () => {
      try {
        setIsLoaded(false)
        setNotFound(false)

        const res = await fetch(`${HERO_SLIDES_ENDPOINT}/${id}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true)
            return
          }
          throw new Error("Kayıt getirilemedi.")
        }

        const text = await res.text()
        let data: any = null

        try {
          data = JSON.parse(text)
        } catch {
          data = null
        }

        const item = data?.data ?? data

        if (!item) {
          setNotFound(true)
          return
        }

        setForm({
          eyebrow: item.eyebrow ?? "",
          title: item.title ?? "",
          description: item.description ?? "",
          primaryCtaLabel: item.primaryCta?.label ?? "",
          primaryCtaHref: item.primaryCta?.href ?? "",
          secondaryCtaLabel: item.secondaryCta?.label ?? "",
          secondaryCtaHref: item.secondaryCta?.href ?? "",
          panelTitle: item.panelTitle ?? "",
          panelDescription: item.panelDescription ?? "",
          status:
            item.status === "ACTIVE" || item.status === "Aktif"
              ? "Aktif"
              : "Pasif",
          sortOrder: Number(item.sortOrder ?? 1),
          tags:
            Array.isArray(item.tags) && item.tags.length
              ? item.tags
              : [""],
        })
      } catch (error) {
        console.error("Edit products hero slide fetch error:", error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    return {
      eyebrow: form.eyebrow || "PRODUCTS",
      title:
        form.title ||
        "Kendi geliştirdiğimiz ürünlerle sadece hizmet sunmuyor, dijital ekosistem inşa ediyoruz.",
      description:
        form.description ||
        "ERVIX LABS olarak ürün geliştirmeyi yalnızca teknik bir üretim alanı değil, uzun vadeli değer ve marka oluşturma süreci olarak görüyoruz.",
      primaryCta: {
        label: form.primaryCtaLabel || "Ürünleri İncele",
        href: form.primaryCtaHref || "#product-list",
      },
      secondaryCta: {
        label: form.secondaryCtaLabel || "İletişime Geç",
        href: form.secondaryCtaHref || "/contact",
      },
      panelTitle: form.panelTitle || "Internal products, external value.",
      panelDescription:
        form.panelDescription ||
        "Kendi ürünlerimizi geliştirmek, müşterilerimiz için daha iyi sistemler düşünmemizi ve daha güçlü çözümler üretmemizi sağlıyor.",
      status: form.status,
      sortOrder: form.sortOrder,
      tags: form.tags.filter((tag) => tag.trim().length > 0).length
        ? form.tags.filter((tag) => tag.trim().length > 0)
        : ["NovaMe", "EcoChef", "Product Thinking", "Scalable Systems"],
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

  function updateTag(index: number, value: string) {
    setForm((prev) => {
      const next = [...prev.tags]
      next[index] = value
      return { ...prev, tags: next }
    })
  }

  function addTag() {
    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }))
  }

  function removeTag(index: number) {
    setForm((prev) => {
      const next = prev.tags.filter((_, i) => i !== index)
      return { ...prev, tags: next.length ? next : [""] }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        eyebrow: form.eyebrow,
        title: form.title,
        description: form.description,
        primaryCta: {
          label: form.primaryCtaLabel,
          href: form.primaryCtaHref,
        },
        secondaryCta: {
          label: form.secondaryCtaLabel,
          href: form.secondaryCtaHref,
        },
        panelTitle: form.panelTitle,
        panelDescription: form.panelDescription,
        tags: form.tags.filter((tag) => tag.trim().length > 0),
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder),
      }

      const res = await fetch(`${HERO_SLIDES_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Hero slide kaydı güncellenemedi.")
      }

      router.push("/products/hero-slides")
    } catch (error) {
      console.error("Edit products hero slide submit error:", error)
      alert("Hero slide kaydı güncellenirken hata oluştu.")
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
        <h1 className="text-2xl font-bold text-slate-900">
          Hero slide kaydı bulunamadı
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil veya silinmiş olabilir.
        </p>

        <div className="mt-6">
          <Link
            href="/products/hero-slides"
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
              <Sparkles className="h-3.5 w-3.5" />
              Products / Hero Slides
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Hero Slide Kaydını Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Products sayfasındaki üst slider alanında yer alan hero slide
              içeriğini güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products/hero-slides"
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
                  Temel İçerik Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Eyebrow, başlık ve açıklama alanlarını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Eyebrow
                </label>
                <input
                  value={form.eyebrow}
                  onChange={(e) => updateField("eyebrow", e.target.value)}
                  placeholder="Örn: PRODUCTS"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
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
                  placeholder="Slide başlığı"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={5}
                  placeholder="Slide açıklaması"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  CTA Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Birincil ve ikincil buton alanlarını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Primary CTA Label
                </label>
                <input
                  value={form.primaryCtaLabel}
                  onChange={(e) => updateField("primaryCtaLabel", e.target.value)}
                  placeholder="Örn: Ürünleri İncele"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Primary CTA Href
                </label>
                <input
                  value={form.primaryCtaHref}
                  onChange={(e) => updateField("primaryCtaHref", e.target.value)}
                  placeholder="Örn: #product-list"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Secondary CTA Label
                </label>
                <input
                  value={form.secondaryCtaLabel}
                  onChange={(e) => updateField("secondaryCtaLabel", e.target.value)}
                  placeholder="Örn: İletişime Geç"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Secondary CTA Href
                </label>
                <input
                  value={form.secondaryCtaHref}
                  onChange={(e) => updateField("secondaryCtaHref", e.target.value)}
                  placeholder="Örn: /contact"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <LayoutPanelTop className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Sağ Panel Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Panel başlığı ve açıklama alanını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Panel Başlığı
                </label>
                <input
                  value={form.panelTitle}
                  onChange={(e) => updateField("panelTitle", e.target.value)}
                  placeholder="Örn: Internal products, external value."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Panel Açıklaması
                </label>
                <textarea
                  value={form.panelDescription}
                  onChange={(e) => updateField("panelDescription", e.target.value)}
                  rows={4}
                  placeholder="Panel açıklaması"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Tag Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Slider içinde gösterilecek etiketleri düzenle
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {form.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    placeholder={`Tag ${index + 1}`}
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" />
                Tag Ekle
              </button>
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
                  Durum ve sıralama değerlerini güncelle
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
                    updateField("status", e.target.value as SlideStatus)
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
              <h3 className="text-lg font-bold text-slate-900">Güncellemeye hazır</h3>
              <p className="mt-1 text-sm text-slate-500">
                Form bilgilerini kontrol edip hero slide kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products/hero-slides"
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
                    Hero slide yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  {preview.eyebrow}
                </div>

                <h3 className="text-2xl font-bold leading-tight text-white">
                  {preview.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  {preview.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {preview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                      Panel Title
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {preview.panelTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {preview.panelDescription}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    {preview.status}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    Sıra: {preview.sortOrder}
                  </span>
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
                  <p className="mt-1 font-semibold text-slate-800">{id}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Eyebrow</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.eyebrow}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Primary CTA</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.primaryCta.label} — {preview.primaryCta.href}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Secondary CTA</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.secondaryCta.label} — {preview.secondaryCta.href}
                  </p>
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