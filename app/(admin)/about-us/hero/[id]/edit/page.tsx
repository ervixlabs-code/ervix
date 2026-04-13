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
  Tag,
  Plus,
  Trash2,
  ExternalLink,
  Pencil,
  LayoutPanelTop,
  Type,
  RefreshCw,
  Loader2,
} from "lucide-react"

type HeroStatus = "Aktif" | "Pasif"

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const HERO_ENDPOINT = `${API_BASE}/about-us/hero`

export default function EditAboutHeroPage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : String(params?.id || "")

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
    status: "Aktif" as HeroStatus,
    sortOrder: 1,
  })

  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchItem = async () => {
      try {
        setIsLoaded(false)
        setNotFound(false)

        const res = await fetch(`${HERO_ENDPOINT}/${id}`, {
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
          throw new Error(text || "Kayıt getirilemedi.")
        }

        const data: any = await res.json()
        const item = data?.data ?? data

        if (!item) {
          setNotFound(true)
          return
        }

        setForm({
          eyebrow: item.eyebrow ?? "",
          title: item.title ?? "",
          description: item.description ?? "",
          primaryCtaLabel: item.primaryCtaLabel ?? "",
          primaryCtaHref: item.primaryCtaHref ?? "",
          secondaryCtaLabel: item.secondaryCtaLabel ?? "",
          secondaryCtaHref: item.secondaryCtaHref ?? "",
          panelTitle: item.panelTitle ?? "",
          panelDescription: item.panelDescription ?? "",
          status: item.status === "ACTIVE" ? "Aktif" : "Pasif",
          sortOrder: Number(item.sortOrder ?? 1),
        })

        setTags(Array.isArray(item.tags) ? item.tags : [])
      } catch (error) {
        console.error("Edit about hero fetch error:", error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    return {
      eyebrow: form.eyebrow || "ERVIX LABS",
      title:
        form.title ||
        "Yalnızca yazılım üretmiyoruz, markalar için güçlü dijital değer inşa ediyoruz.",
      description:
        form.description ||
        "ERVIX LABS; kendi ürün ekosistemini büyüten, aynı zamanda markalar için modern, güçlü ve ölçeklenebilir dijital çözümler geliştiren product-driven bir yazılım stüdyosudur.",
      primaryCtaLabel: form.primaryCtaLabel || "Projeleri İncele",
      primaryCtaHref: form.primaryCtaHref || "/projects",
      secondaryCtaLabel: form.secondaryCtaLabel || "İletişime Geç",
      secondaryCtaHref: form.secondaryCtaHref || "/anasayfa#contact",
      panelTitle: form.panelTitle || "Product-first",
      panelDescription:
        form.panelDescription ||
        "Sadece çalışan sistemler değil, uzun vadeli değer üreten ürün ve deneyimler tasarlıyoruz.",
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
    if (tags.includes(value)) {
      setNewTag("")
      return
    }
    setTags((prev) => [...prev, value])
    setNewTag("")
  }

  function removeTag(index: number) {
    setTags((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.title.trim()) {
      alert("Lütfen hero başlığını gir.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        eyebrow: form.eyebrow.trim() || null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        primaryCtaLabel: form.primaryCtaLabel.trim() || null,
        primaryCtaHref: form.primaryCtaHref.trim() || null,
        secondaryCtaLabel: form.secondaryCtaLabel.trim() || null,
        secondaryCtaHref: form.secondaryCtaHref.trim() || null,
        tags,
        panelTitle: form.panelTitle.trim() || null,
        panelDescription: form.panelDescription.trim() || null,
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder) > 0 ? Number(form.sortOrder) : 1,
      }

      const res = await fetch(`${HERO_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Hero kaydı güncellenemedi.")
      }

      router.push("/about-us/hero")
    } catch (error) {
      console.error("Edit about hero submit error:", error)
      alert("Hero kaydı güncellenirken hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h1 className="text-2xl font-bold text-slate-900">Hero kaydı bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil veya silinmiş olabilir.
        </p>

        <div className="mt-6">
          <Link
            href="/about-us/hero"
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
              About Us / Hero
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Hero Kaydını Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Seçtiğin hero kaydının başlık, açıklama, CTA, tag ve sağ panel
              içeriklerini güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-us/hero"
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
                  Ana Hero Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Eyebrow, başlık ve açıklama alanlarını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.eyebrow}
                onChange={(e) => updateField("eyebrow", e.target.value)}
                placeholder="Eyebrow"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                rows={3}
                placeholder="Hero başlığı"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                placeholder="Hero açıklaması"
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
                  Hero üstünde görünecek tagleri yönet
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
                  CTA Buton Alanı
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Primary ve secondary buton içeriklerini güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.primaryCtaLabel}
                  onChange={(e) => updateField("primaryCtaLabel", e.target.value)}
                  placeholder="Primary CTA text"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />

                <input
                  value={form.primaryCtaHref}
                  onChange={(e) => updateField("primaryCtaHref", e.target.value)}
                  placeholder="Primary CTA link"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.secondaryCtaLabel}
                  onChange={(e) => updateField("secondaryCtaLabel", e.target.value)}
                  placeholder="Secondary CTA text"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />

                <input
                  value={form.secondaryCtaHref}
                  onChange={(e) => updateField("secondaryCtaHref", e.target.value)}
                  placeholder="Secondary CTA link"
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
                  Sağ Panel İçeriği
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sağ tarafta görünen panel başlığı ve açıklamasını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.panelTitle}
                onChange={(e) => updateField("panelTitle", e.target.value)}
                placeholder="Panel title"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.panelDescription}
                onChange={(e) => updateField("panelDescription", e.target.value)}
                rows={4}
                placeholder="Panel description"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
              />
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
                    updateField("status", e.target.value as HeroStatus)
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
                Form bilgilerini kontrol edip hero kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about-us/hero"
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
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Değişiklikleri Kaydet
                  </>
                )}
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
                    About Hero kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.16),transparent_35%)]" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-violet-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {preview.eyebrow}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                      {preview.status}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                      Sıra: {preview.sortOrder}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold leading-tight text-white">
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

                  <div className="mt-6 flex flex-col gap-3">
                    <div className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white">
                      {preview.primaryCtaLabel}
                    </div>

                    <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                      {preview.secondaryCtaLabel}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Hero Panel
                    </div>

                    <div className="mt-3 text-lg font-semibold text-white">
                      {preview.panelTitle}
                    </div>

                    <div className="mt-2 text-sm leading-7 text-white/55">
                      {preview.panelDescription}
                    </div>
                  </div>
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
                  <p className="text-xs text-slate-400">Primary Link</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {preview.primaryCtaHref}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Secondary Link</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {preview.secondaryCtaHref}
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