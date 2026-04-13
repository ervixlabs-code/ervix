"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Type,
  Layers3,
  CheckCircle2,
  Pencil,
} from "lucide-react"

type StatStatus = "Aktif" | "Pasif"

type ApiStatItem = {
  id: number
  value: string
  title: string
  description: string
  status: StatStatus | "AKTIF" | "PASIF"
  sortOrder: number
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

function mapApiStatusToUi(status?: string): StatStatus {
  return status === "Pasif" || status === "PASIF" ? "Pasif" : "Aktif"
}

function mapUiStatusToApi(status: StatStatus) {
  return status === "Aktif" ? "AKTIF" : "PASIF"
}

export default function EditStatsPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)

  const [form, setForm] = useState({
    value: "",
    title: "",
    description: "",
    status: "Aktif" as StatStatus,
    sortOrder: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchItem() {
      if (!id || Number.isNaN(id)) {
        setNotFound(true)
        setIsLoaded(true)
        return
      }

      try {
        setIsLoaded(false)
        setNotFound(false)

        const response = await fetch(`${API_BASE}/homepage/stats/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        })

        const result = await response.json().catch(() => null)

        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true)
            return
          }

          throw new Error(
            Array.isArray(result?.message)
              ? result.message.join(", ")
              : result?.message || "İstatistik kaydı getirilemedi."
          )
        }

        const item = result as ApiStatItem

        setForm({
          value: item.value || "",
          title: item.title || "",
          description: item.description || "",
          status: mapApiStatusToUi(item.status),
          sortOrder: Number(item.sortOrder || 1),
        })
      } catch (error: any) {
        console.error("Stats detail fetch error:", error)
        alert(error?.message || "İstatistik kaydı getirilemedi.")
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    return {
      value: form.value || "10+",
      title: form.title || "Tamamlanan Proje",
      description:
        form.description ||
        "Kurumsal web, ürün geliştirme ve özel yazılım tarafında teslim edilen projeler.",
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
        value: form.value.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        status: mapUiStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
      }

      const response = await fetch(`${API_BASE}/homepage/stats/${id}`, {
        method: "PATCH",
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
            : result?.message || "İstatistik kaydı güncellenemedi."
        )
      }

      alert("İstatistik kaydı başarıyla güncellendi.")
      router.push("/homepage/stats")
    } catch (error: any) {
      console.error("Stats update error:", error)
      alert(error?.message || "Bir hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (notFound) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h1 className="text-2xl font-bold text-slate-900">İstatistik bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil.
        </p>

        <div className="mt-6">
          <Link
            href="/homepage/stats"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Listeye Dön
          </Link>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <p className="text-sm font-medium text-slate-600">Yükleniyor...</p>
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
              <Layers3 className="h-3.5 w-3.5" />
              HomePage / Stats
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              İstatistik Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Seçtiğin stats kartının değer, başlık ve açıklama alanlarını buradan
              güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/stats"
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
                  İstatistik kartı alanlarını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Value
                </label>
                <input
                  value={form.value}
                  onChange={(e) => updateField("value", e.target.value)}
                  placeholder="Örn: 10+, 2+, Uçtan Uca"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Başlık
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Örn: Tamamlanan Proje"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="İstatistik kartı açıklamasını yaz..."
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
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
                  Yayın Ayarları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Durum ve sıralama bilgisini güncelle
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
                    updateField("status", e.target.value as StatStatus)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
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
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Güncellemeye hazır</h3>
              <p className="mt-1 text-sm text-slate-500">
                Form bilgilerini kontrol edip istatistik kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/homepage/stats"
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
                    Stats kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.16),transparent_35%)]" />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      Preview
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-violet-300">
                      {preview.status}
                    </div>
                  </div>

                  <div className="break-words text-3xl font-semibold leading-tight tracking-tight text-white">
                    {preview.value}
                  </div>

                  <div className="mt-3 text-sm font-semibold text-violet-300">
                    {preview.title}
                  </div>

                  <p className="mt-4 text-sm leading-7 text-white/58">
                    {preview.description}
                  </p>

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
                  <p className="text-xs text-slate-400">Value</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.value}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Durum</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.status}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Sıralama</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.sortOrder}
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