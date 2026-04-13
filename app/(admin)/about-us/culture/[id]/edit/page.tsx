"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Workflow,
  Users,
  CheckCircle2,
  Type,
  Pencil,
  RefreshCw,
  Layers3,
  Tags,
  Loader2,
} from "lucide-react"

type CultureStatus = "Aktif" | "Pasif"
type IconKey = "Workflow" | "Users"

type ApiCultureItem = {
  id: number
  sectionLabel: string | null
  badge: string | null
  title: string
  description: string | null
  icon: IconKey | null
  status: "ACTIVE" | "PASSIVE" | "DRAFT"
  sortOrder: number
}

const iconMap = {
  Workflow,
  Users,
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CULTURE_ENDPOINT = `${API_BASE}/about-us/culture`

export default function EditAboutCulturePage() {
  const params = useParams()
  const router = useRouter()
  const id = Array.isArray(params?.id) ? params.id[0] : String(params?.id || "")

  const [form, setForm] = useState({
    sectionLabel: "",
    badge: "",
    title: "",
    description: "",
    icon: "Workflow" as IconKey,
    status: "Aktif" as CultureStatus,
    sortOrder: 1,
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

        const res = await fetch(`${CULTURE_ENDPOINT}/${id}`, {
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

        const data: ApiCultureItem = await res.json()

        if (!data) {
          setNotFound(true)
          return
        }

        setForm({
          sectionLabel: data.sectionLabel ?? "",
          badge: data.badge ?? "",
          title: data.title ?? "",
          description: data.description ?? "",
          icon: data.icon ?? "Workflow",
          status: data.status === "ACTIVE" ? "Aktif" : "Pasif",
          sortOrder: Number(data.sortOrder ?? 1),
        })
      } catch (error) {
        console.error("Edit about culture fetch error:", error)
        setNotFound(true)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    return {
      sectionLabel: form.sectionLabel || "Çalışma Kültürü",
      badge: form.badge || "Culture",
      title:
        form.title || "Hızlı olmak bizim için yüzeysel olmak anlamına gelmez.",
      description:
        form.description ||
        "Hızlı aksiyon almayı seviyoruz; ama bunu düşünmeden değil, net bir tasarım mantığı ve teknik omurga üzerinden yapıyoruz. Bu sayede hem hızlı ilerliyor hem de kaliteyi koruyoruz.",
      icon: form.icon,
      status: form.status,
      sortOrder: form.sortOrder,
    }
  }, [form])

  const PreviewIcon = iconMap[preview.icon] || Workflow

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!form.title.trim()) {
      alert("Lütfen başlık alanını doldur.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        sectionLabel: form.sectionLabel.trim() || null,
        badge: form.badge.trim() || null,
        title: form.title.trim(),
        description: form.description.trim() || null,
        icon: form.icon,
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder) > 0 ? Number(form.sortOrder) : 1,
      }

      const res = await fetch(`${CULTURE_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Culture kaydı güncellenemedi.")
      }

      router.push("/about-us/culture")
    } catch (error) {
      console.error("Edit about culture submit error:", error)
      alert("Culture kaydı güncellenirken hata oluştu.")
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
        <h1 className="text-2xl font-bold text-slate-900">Culture kaydı bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil veya silinmiş olabilir.
        </p>

        <div className="mt-6">
          <Link
            href="/about-us/culture"
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
              <Workflow className="h-3.5 w-3.5" />
              About Us / Culture
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Culture Kaydını Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              About sayfasındaki çalışma kültürü ve yaklaşım kartlarını
              güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-us/culture"
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
                  İçerik Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Section adı, badge, başlık ve açıklama alanlarını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Section Label
                </label>
                <input
                  value={form.sectionLabel}
                  onChange={(e) => updateField("sectionLabel", e.target.value)}
                  placeholder="Örn: Çalışma Kültürü"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Badge
                </label>
                <input
                  value={form.badge}
                  onChange={(e) => updateField("badge", e.target.value)}
                  placeholder="Örn: Culture"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Başlık
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Kart başlığı"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={6}
                  placeholder="Kart açıklaması"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
              </div>
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
                  İkon, durum ve sıralama değerlerini güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  İkon
                </label>
                <select
                  value={form.icon}
                  onChange={(e) => updateField("icon", e.target.value as IconKey)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                >
                  <option value="Workflow">Workflow</option>
                  <option value="Users">Users</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as CultureStatus)
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
                Form bilgilerini kontrol edip culture kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about-us/culture"
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
                    Culture kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.16),transparent_35%)]" />

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-violet-500/10 text-violet-300">
                      <PreviewIcon className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                        {preview.sectionLabel}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        {preview.badge}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-white">
                    {preview.title}
                  </h3>

                  <p className="mt-4 text-sm leading-8 text-white/60">
                    {preview.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                      {preview.status}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                      Sıra: {preview.sortOrder}
                    </span>
                  </div>

                  <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-violet-500/40 via-white/10 to-transparent" />
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
                  <p className="text-xs text-slate-400">Section Label</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.sectionLabel}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Badge</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.badge}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">İkon</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.icon}</p>
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

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Tags className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">İçerik Notu</h3>
                  <p className="text-sm text-slate-500">Web tarafı ile uyum bilgisi</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                Bu alan genelde iki bloktan oluşur: <b>Çalışma Kültürü</b> ve{" "}
                <b>Yaklaşımımız</b>. Section label, badge, başlık ve açıklama
                içeriklerini web tarafındaki structure ile birebir uyumlu şekilde
                güncellemen önerilir.
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )
}