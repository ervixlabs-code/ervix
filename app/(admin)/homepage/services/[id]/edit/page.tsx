"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Layers3,
  Tag,
  Plus,
  Trash2,
  Briefcase,
  Globe,
  Code2,
  MonitorSmartphone,
  Cuboid,
  Pencil,
  CheckCircle2,
} from "lucide-react"

type ServiceStatus = "Aktif" | "Pasif"
type ServiceIconKey = "globe" | "code2" | "mobile" | "cuboid"

type ApiServiceItem = {
  id: number
  no: string
  iconKey: ServiceIconKey
  title: string
  description: string
  tags?: { id?: number; value: string; sortOrder?: number }[]
  scopeValue: string
  outputValue: string
  deliveryValue: string
  status: ServiceStatus | "AKTIF" | "PASIF"
  sortOrder: number
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

function getServiceIcon(iconKey: ServiceIconKey) {
  switch (iconKey) {
    case "globe":
      return Globe
    case "code2":
      return Code2
    case "mobile":
      return MonitorSmartphone
    case "cuboid":
      return Cuboid
    default:
      return Briefcase
  }
}

function mapApiStatusToUi(status?: string): ServiceStatus {
  return status === "Pasif" || status === "PASIF" ? "Pasif" : "Aktif"
}

function mapUiStatusToApi(status: ServiceStatus) {
  return status === "Aktif" ? "AKTIF" : "PASIF"
}

export default function EditServicesPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)

  const [form, setForm] = useState({
    no: "01",
    iconKey: "globe" as ServiceIconKey,
    title: "",
    description: "",
    scopeValue: "",
    outputValue: "",
    deliveryValue: "",
    status: "Aktif" as ServiceStatus,
    sortOrder: 1,
  })

  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
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

        const response = await fetch(`${API_BASE}/homepage/services/${id}`, {
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
              : result?.message || "Servis kaydı getirilemedi."
          )
        }

        const item = result as ApiServiceItem

        setForm({
          no: item.no || "01",
          iconKey: (item.iconKey || "globe") as ServiceIconKey,
          title: item.title || "",
          description: item.description || "",
          scopeValue: item.scopeValue || "",
          outputValue: item.outputValue || "",
          deliveryValue: item.deliveryValue || "",
          status: mapApiStatusToUi(item.status),
          sortOrder: Number(item.sortOrder || 1),
        })

        setTags(Array.isArray(item.tags) ? item.tags.map((tag) => tag.value) : [])
      } catch (error: any) {
        console.error("Services detail fetch error:", error)
        alert(error?.message || "Servis kaydı getirilemedi.")
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    return {
      no: form.no || "01",
      iconKey: form.iconKey,
      title: form.title || "Kurumsal Web Siteleri",
      description:
        form.description ||
        "Marka kimliğinizi yansıtan, hızlı, modern ve güçlü kullanıcı deneyimine sahip web çözümleri.",
      scopeValue: form.scopeValue || "Design + Development",
      outputValue: form.outputValue || "Modern Digital Experience",
      deliveryValue: form.deliveryValue || "Scalable & Sustainable",
      status: form.status,
      sortOrder: form.sortOrder,
      tags,
    }
  }, [form, tags])

  const PreviewIcon = getServiceIcon(preview.iconKey)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        no: form.no.trim(),
        iconKey: form.iconKey,
        title: form.title.trim(),
        description: form.description.trim(),
        scopeValue: form.scopeValue.trim(),
        outputValue: form.outputValue.trim(),
        deliveryValue: form.deliveryValue.trim(),
        status: mapUiStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
        tags: tags
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((value) => ({ value })),
      }

      const response = await fetch(`${API_BASE}/homepage/services/${id}`, {
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
            : result?.message || "Servis kaydı güncellenemedi."
        )
      }

      alert("Servis kaydı başarıyla güncellendi.")
      router.push("/homepage/services")
    } catch (error: any) {
      console.error("Services update error:", error)
      alert(error?.message || "Bir hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (notFound) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h1 className="text-2xl font-bold text-slate-900">Servis kaydı bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin kayıt mevcut değil.
        </p>

        <div className="mt-6">
          <Link
            href="/homepage/services"
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
              HomePage / Services
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Servis Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Seçtiğin servis kartının içerik, ikon, tag ve alt bilgi alanlarını güncelleyebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/services"
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
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Ana Servis Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Servis numarası, ikon, başlık ve açıklamayı güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <input
                  value={form.no}
                  onChange={(e) => updateField("no", e.target.value)}
                  placeholder="Servis numarası"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                />

                <select
                  value={form.iconKey}
                  onChange={(e) =>
                    updateField("iconKey", e.target.value as ServiceIconKey)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
                >
                  <option value="globe">Globe</option>
                  <option value="code2">Code2</option>
                  <option value="mobile">Mobile</option>
                  <option value="cuboid">Cuboid</option>
                </select>
              </div>

              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Servis adı"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                placeholder="Servis açıklaması"
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
                  Servis kartında görünecek tagleri yönet
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
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Alt Bilgi Kutuları
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Kart altındaki scope, output ve delivery alanları
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                value={form.scopeValue}
                onChange={(e) => updateField("scopeValue", e.target.value)}
                placeholder="Scope value"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <input
                value={form.outputValue}
                onChange={(e) => updateField("outputValue", e.target.value)}
                placeholder="Output value"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
              />

              <input
                value={form.deliveryValue}
                onChange={(e) => updateField("deliveryValue", e.target.value)}
                placeholder="Delivery value"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400"
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
                    updateField("status", e.target.value as ServiceStatus)
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
                Form bilgilerini kontrol edip servis kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/homepage/services"
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
                    Service kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d13] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.16),transparent_35%)]" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                      {preview.no}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                      {preview.status}
                    </span>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/10 bg-violet-500/10 text-violet-300">
                    <PreviewIcon className="h-6 w-6" />
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

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div className="text-[11px] text-white/35">Scope</div>
                      <div className="mt-1 text-sm font-medium text-white">
                        {preview.scopeValue}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div className="text-[11px] text-white/35">Output</div>
                      <div className="mt-1 text-sm font-medium text-white">
                        {preview.outputValue}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div className="text-[11px] text-white/35">Delivery</div>
                      <div className="mt-1 text-sm font-medium text-white">
                        {preview.deliveryValue}
                      </div>
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
                  <p className="text-xs text-slate-400">İkon</p>
                  <p className="mt-1 font-semibold text-slate-800">{preview.iconKey}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  )
}