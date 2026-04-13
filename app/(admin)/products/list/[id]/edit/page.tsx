/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Package,
  CheckCircle2,
  Type,
  Pencil,
  RefreshCw,
  Plus,
  X,
  Tags,
  Layers3,
  MonitorSmartphone,
  Boxes,
} from "lucide-react"

type ProductStatus = "Aktif" | "Pasif"
type IconKey = "MonitorSmartphone" | "Layers3"

const iconMap = {
  MonitorSmartphone,
  Layers3,
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const PRODUCTS_ENDPOINT = `${API_BASE}/products/list`

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = String(params?.id || "")

  const [form, setForm] = useState({
    title: "",
    icon: "MonitorSmartphone" as IconKey,
    category: "",
    description: "",
    longDescription: "",
    accent: "",
    status: "Aktif" as ProductStatus,
    sortOrder: 1,
    features: [""] as string[],
    goals: [""] as string[],
    technologies: [""] as string[],
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

        const res = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
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
          title: item.title ?? "",
          icon: (item.icon as IconKey) ?? "MonitorSmartphone",
          category: item.category ?? "",
          description: item.description ?? "",
          longDescription: item.longDescription ?? "",
          accent: item.accent ?? "",
          status:
            item.status === "ACTIVE" || item.status === "Aktif"
              ? "Aktif"
              : "Pasif",
          sortOrder: Number(item.sortOrder ?? 1),
          features:
            Array.isArray(item.features) && item.features.length
              ? item.features
              : [""],
          goals:
            Array.isArray(item.goals) && item.goals.length
              ? item.goals
              : [""],
          technologies:
            Array.isArray(item.technologies) && item.technologies.length
              ? item.technologies
              : [""],
        })
      } catch (error) {
        console.error("Edit product fetch error:", error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    return {
      title: form.title || "NovaMe",
      icon: form.icon,
      category: form.category || "Digital Product",
      description:
        form.description ||
        "Modern kullanıcı deneyimi, güçlü teknik altyapı ve sürdürülebilir ürün yaklaşımı ile geliştirilen dijital ürün ekosistemi.",
      longDescription:
        form.longDescription ||
        "NovaMe, ERVIX LABS’in ürün odaklı düşünme biçimini temsil eden yapılardan biridir. Sade ama güçlü arayüz dili, ölçeklenebilir sistem yapısı ve kullanıcı merkezli yaklaşımı ile hem tasarım hem teknik tarafta rafine bir ürün mantığı sunar.",
      accent: form.accent || "from-violet-500/20 via-fuchsia-500/10 to-white/5",
      status: form.status,
      sortOrder: form.sortOrder,
      features: form.features.filter((x) => x.trim()),
      goals: form.goals.filter((x) => x.trim()),
      technologies: form.technologies.filter((x) => x.trim()),
    }
  }, [form])

  const PreviewIcon = iconMap[preview.icon] || MonitorSmartphone

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateArrayField(
    key: "features" | "goals" | "technologies",
    index: number,
    value: string
  ) {
    setForm((prev) => {
      const next = [...prev[key]]
      next[index] = value
      return { ...prev, [key]: next }
    })
  }

  function addArrayItem(key: "features" | "goals" | "technologies") {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], ""],
    }))
  }

  function removeArrayItem(
    key: "features" | "goals" | "technologies",
    index: number
  ) {
    setForm((prev) => {
      const next = prev[key].filter((_, i) => i !== index)
      return {
        ...prev,
        [key]: next.length ? next : [""],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...form,
        features: form.features.filter((x) => x.trim()),
        goals: form.goals.filter((x) => x.trim()),
        technologies: form.technologies.filter((x) => x.trim()),
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder),
      }

      const res = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Ürün kaydı güncellenemedi.")
      }

      router.push("/products/list")
    } catch (error) {
      console.error("Edit product submit error:", error)
      alert("Ürün kaydı güncellenirken hata oluştu.")
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
        <h1 className="text-2xl font-bold text-slate-900">Ürün kaydı bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil veya silinmiş olabilir.
        </p>

        <div className="mt-6">
          <Link
            href="/products/list"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Listeye Dön
          </Link>
        </div>
      </div>
    )
  }

  const arraySections: Array<{
    key: "features" | "goals" | "technologies"
    title: string
    icon: React.ComponentType<{ className?: string }>
    placeholder: string
  }> = [
    {
      key: "features",
      title: "Features",
      icon: Layers3,
      placeholder: "Özellik gir",
    },
    {
      key: "goals",
      title: "Goals",
      icon: Boxes,
      placeholder: "Hedef gir",
    },
    {
      key: "technologies",
      title: "Technologies",
      icon: Tags,
      placeholder: "Teknoloji gir",
    },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Package className="h-3.5 w-3.5" />
              Products / List
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Product Kaydını Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Products sayfasında yer alan ürün kaydını ve çoklu içerik alanlarını
              güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products/list"
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
                  Temel Bilgiler
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ürün adı, ikon, kategori ve açıklamaları güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ürün Adı
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Örn: NovaMe"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  İkon
                </label>
                <select
                  value={form.icon}
                  onChange={(e) => updateField("icon", e.target.value as IconKey)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                >
                  <option value="MonitorSmartphone">MonitorSmartphone</option>
                  <option value="Layers3">Layers3</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kategori
                </label>
                <input
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  placeholder="Örn: Digital Product"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Kısa Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  placeholder="Kısa açıklama"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Uzun Açıklama
                </label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => updateField("longDescription", e.target.value)}
                  rows={6}
                  placeholder="Uzun açıklama"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Accent Class
                </label>
                <input
                  value={form.accent}
                  onChange={(e) => updateField("accent", e.target.value)}
                  placeholder="Örn: from-violet-500/20 via-fuchsia-500/10 to-white/5"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          {arraySections.map((section) => {
            const SectionIcon = section.icon

            return (
              <section
                key={section.key}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <SectionIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                      {section.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Çoklu alanları düzenleyebilirsin
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {form[section.key].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        value={item}
                        onChange={(e) =>
                          updateArrayField(section.key, index, e.target.value)
                        }
                        placeholder={`${section.placeholder} ${index + 1}`}
                        className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(section.key, index)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayItem(section.key)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                    Alan Ekle
                  </button>
                </div>
              </section>
            )
          })}

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
              <h3 className="text-lg font-bold text-slate-900">Güncellemeye hazır</h3>
              <p className="mt-1 text-sm text-slate-500">
                Form bilgilerini kontrol edip ürün kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products/list"
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
                    Product kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-violet-500/10 text-violet-300">
                    <PreviewIcon className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-violet-300">
                      {preview.category}
                    </div>
                    <h3 className="mt-1 text-2xl font-bold text-white">
                      {preview.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/60">
                  {preview.description}
                </p>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  {preview.longDescription}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {preview.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/75"
                    >
                      {tech}
                    </span>
                  ))}
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
                  <p className="text-xs text-slate-400">Kategori</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.category}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">İkon</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.icon}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Features</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.features.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Goals</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.goals.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Technologies</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.technologies.length}
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