"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  Layers3,
  CheckCircle2,
  Pencil,
} from "lucide-react"

type SliderStatus = "Aktif" | "Pasif"

type ApiSliderItem = {
  id: number
  eyebrow: string
  title: string
  description: string
  image: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  status: SliderStatus | "AKTIF" | "PASIF"
  sortOrder: number
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api").replace(/\/+$/, "")

function isValidImageSrc(value: string) {
  const src = value.trim()
  if (!src) return false

  if (src.startsWith("/")) return true

  try {
    const url = new URL(src)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function mapApiStatusToUi(status?: string): SliderStatus {
  return status === "Pasif" || status === "PASIF" ? "Pasif" : "Aktif"
}

function mapUiStatusToApi(status: SliderStatus) {
  return status === "Aktif" ? "AKTIF" : "PASIF"
}

export default function EditTopSliderPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params?.id)

  const [form, setForm] = useState({
    eyebrow: "",
    title: "",
    description: "",
    image: "",
    primaryButtonText: "",
    primaryButtonUrl: "",
    secondaryButtonText: "",
    secondaryButtonUrl: "",
    status: "Aktif" as SliderStatus,
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

        const response = await fetch(`${API_BASE}/homepage/top-slider/${id}`, {
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
              : result?.message || "Slide kaydı getirilemedi."
          )
        }

        const item = result as ApiSliderItem

        setForm({
          eyebrow: item.eyebrow || "",
          title: item.title || "",
          description: item.description || "",
          image: item.image || "",
          primaryButtonText: item.primaryButtonText || "",
          primaryButtonUrl: item.primaryButtonUrl || "",
          secondaryButtonText: item.secondaryButtonText || "",
          secondaryButtonUrl: item.secondaryButtonUrl || "",
          status: mapApiStatusToUi(item.status),
          sortOrder: Number(item.sortOrder || 1),
        })
      } catch (error: any) {
        console.error("Top slider detail fetch error:", error)
        alert(error?.message || "Slide kaydı getirilemedi.")
      } finally {
        setIsLoaded(true)
      }
    }

    fetchItem()
  }, [id])

  const preview = useMemo(() => {
    const rawImage = form.image.trim()
    const safeImage = isValidImageSrc(rawImage) ? rawImage : "/placeholder.png"

    return {
      eyebrow: form.eyebrow || "ERVIX LABS",
      title:
        form.title ||
        "Kurumsal web siteleri, dijital ürünler ve güçlü yazılım altyapıları geliştiriyoruz.",
      description:
        form.description ||
        "Markalar için modern web deneyimleri, özel yazılım çözümleri ve ürün odaklı dijital sistemler tasarlıyor ve hayata geçiriyoruz.",
      image: safeImage,
      imageRaw: rawImage,
      imageValid: isValidImageSrc(rawImage),
      primaryButtonText: form.primaryButtonText || "Projeleri İncele",
      primaryButtonUrl: form.primaryButtonUrl || "/anasayfa#projects",
      secondaryButtonText: form.secondaryButtonText || "İletişime Geç",
      secondaryButtonUrl: form.secondaryButtonUrl || "/anasayfa#contact",
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
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        primaryButtonText: form.primaryButtonText.trim(),
        primaryButtonUrl: form.primaryButtonUrl.trim(),
        secondaryButtonText: form.secondaryButtonText.trim(),
        secondaryButtonUrl: form.secondaryButtonUrl.trim(),
        status: mapUiStatusToApi(form.status),
        sortOrder: Number(form.sortOrder || 1),
      }

      const response = await fetch(`${API_BASE}/homepage/top-slider/${id}`, {
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
            : result?.message || "Slide kaydı güncellenemedi."
        )
      }

      alert("Slide kaydı başarıyla güncellendi.")
      router.push("/homepage/top-slider")
    } catch (error: any) {
      console.error("Top slider update error:", error)
      alert(error?.message || "Bir hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (notFound) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h1 className="text-2xl font-bold text-slate-900">Slide bulunamadı</h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğin içerik mevcut değil.
        </p>

        <div className="mt-6">
          <Link
            href="/homepage/top-slider"
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
              HomePage / Top Slider
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Slide Düzenle
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Seçtiğin slider içeriğini buradan güncelleyebilirsin. Sağ tarafta
              canlı önizleme alanı hazır.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/homepage/top-slider"
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
                  Slider’da görünecek yazı alanlarını güncelle
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
                  placeholder="Örn: ERVIX LABS"
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
                  placeholder="Slider başlığını yaz..."
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Slider açıklamasını yaz..."
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Görsel Bilgisi
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Geçerli bir local path ya da tam URL gir
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Görsel URL
              </label>
              <input
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="/slider/slide-1.jpg veya https://..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
              />

              <div className="mt-2 text-xs">
                {form.image.trim() === "" ? (
                  <p className="text-slate-400">
                    Görsel girilmezse placeholder kullanılacak.
                  </p>
                ) : preview.imageValid ? (
                  <p className="text-emerald-600">Geçerli görsel yolu algılandı.</p>
                ) : (
                  <p className="text-amber-600">
                    Geçersiz görsel yolu. Önizlemede placeholder gösteriliyor.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <LinkIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  Buton Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Primary ve secondary CTA alanlarını güncelle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Primary Button</h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Buton Metni
                    </label>
                    <input
                      value={form.primaryButtonText}
                      onChange={(e) =>
                        updateField("primaryButtonText", e.target.value)
                      }
                      placeholder="Örn: Projeleri İncele"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Buton Linki
                    </label>
                    <input
                      value={form.primaryButtonUrl}
                      onChange={(e) =>
                        updateField("primaryButtonUrl", e.target.value)
                      }
                      placeholder="/anasayfa#projects"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900">Secondary Button</h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Buton Metni
                    </label>
                    <input
                      value={form.secondaryButtonText}
                      onChange={(e) =>
                        updateField("secondaryButtonText", e.target.value)
                      }
                      placeholder="Örn: İletişime Geç"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Buton Linki
                    </label>
                    <input
                      value={form.secondaryButtonUrl}
                      onChange={(e) =>
                        updateField("secondaryButtonUrl", e.target.value)
                      }
                      placeholder="/anasayfa#contact"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400"
                    />
                  </div>
                </div>
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
                    updateField("status", e.target.value as SliderStatus)
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
                Form bilgilerini kontrol edip slide kaydını güncelleyebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/homepage/top-slider"
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
                    Slider kartı yaklaşık görünüm
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-[#060606]">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  <Image
                    src={preview.image}
                    alt={preview.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <div className="space-y-4 p-5">
                  <div className="inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                    {preview.eyebrow}
                  </div>

                  <h3 className="text-xl font-bold leading-tight tracking-[-0.02em] text-white">
                    {preview.title}
                  </h3>

                  <p className="text-sm leading-7 text-white/65">
                    {preview.description}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
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
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.status}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Sıralama</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {preview.sortOrder}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Primary Link</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {preview.primaryButtonUrl}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-400">Secondary Link</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {preview.secondaryButtonUrl}
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