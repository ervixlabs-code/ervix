"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  Eye,
  Layers3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react"

type SlideItem = {
  eyebrow: string
  title: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  tags: string[]
  panelTitle: string
  panelDescription: string
}

type ContactCardItem = {
  type: "email" | "phone" | "location"
  label: string
  value: string
}

type ProcessStepItem = {
  icon: "Briefcase" | "Layers3" | "Wallet"
  title: string
  description: string
}

type FormState = {
  id?: string | number
  slug: string
  title: string
  isActive: boolean
  heroSlides: SlideItem[]
  formHeader: string
  formTitle: string
  formDescription: string
  projectTypes: string[]
  services: string[]
  budgets: string[]
  contactCards: ContactCardItem[]
  processSteps: ProcessStepItem[]
  quickNoteTitle: string
  quickNoteDescription: string
  quickNoteButtonLabel: string
  quickNoteButtonHref: string
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function iconForCard(type: ContactCardItem["type"]) {
  if (type === "email") return Mail
  if (type === "phone") return Phone
  return MapPin
}

function iconForStep(icon: ProcessStepItem["icon"]) {
  if (icon === "Briefcase") return Briefcase
  if (icon === "Layers3") return Layers3
  return Wallet
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const ENDPOINT = `${API_BASE}/contact-page-contents`

const defaultSlide: SlideItem = {
  eyebrow: "CONTACT",
  title: "Yeni bir proje, güçlü bir fikir veya dijital dönüşüm planınız mı var?",
  description:
    "ERVIX LABS ile kurumsal web projeleri, özel yazılım sistemleri, mobil uygulamalar ve deneyim odaklı dijital çözümler için birlikte çalışabiliriz.",
  primaryCtaLabel: "Formu Doldur",
  primaryCtaHref: "#contact-form",
  secondaryCtaLabel: "Projeleri İncele",
  secondaryCtaHref: "/projects",
  tags: ["Web", "Mobile", "Admin Panel", "3D Experience"],
  panelTitle: "Doğru proje, doğru strateji ile başlar.",
  panelDescription:
    "İhtiyacı, kapsamı ve öncelikleri birlikte netleştirip daha doğru bir yol haritası oluşturuyoruz.",
}

const defaultState: FormState = {
  slug: "contact-page",
  title: "Contact Page Content",
  isActive: true,
  heroSlides: [defaultSlide],
  formHeader: "Proje Formu",
  formTitle: "Projenizden biraz bahsedin.",
  formDescription:
    "Form şu an UI amaçlı hazırlanmıştır. Sonraki adımda backend ve admin entegrasyonu ile tamamen aktif hale getirebiliriz.",
  projectTypes: [
    "Kurumsal Web Sitesi",
    "Özel Yazılım",
    "Mobil Uygulama",
    "3D Web Deneyimi",
    "Yönetim Paneli",
    "Diğer",
  ],
  services: [
    "UI / UX Tasarım",
    "Frontend Development",
    "Backend Development",
    "Mobil Geliştirme",
    "CMS / Admin Panel",
    "3D / Interactive Web",
  ],
  budgets: [
    "50.000 TL altı",
    "50.000 - 150.000 TL",
    "150.000 - 300.000 TL",
    "300.000 TL +",
    "Henüz net değil",
  ],
  contactCards: [
    { type: "email", label: "E-posta", value: "hello@ervixlabs.com" },
    { type: "phone", label: "Telefon", value: "+90 (5xx) xxx xx xx" },
    { type: "location", label: "Lokasyon", value: "İstanbul, Türkiye" },
  ],
  processSteps: [
    {
      icon: "Briefcase",
      title: "İlk İletişim",
      description:
        "Projenin kapsamını, hedefini ve önceliklerini anlamaya çalışıyoruz.",
    },
    {
      icon: "Layers3",
      title: "Kapsam Belirleme",
      description:
        "İhtiyaca göre doğru çözüm yaklaşımını ve yol haritasını oluşturuyoruz.",
    },
    {
      icon: "Wallet",
      title: "Teklif & Planlama",
      description:
        "Bütçe, zaman ve teslim çerçevesini netleştirerek süreci başlatıyoruz.",
    },
  ],
  quickNoteTitle: "Quick Note",
  quickNoteDescription:
    "İsterseniz bu formu bir sonraki adımda gerçek backend’e bağlayıp admin panel üzerinden gelen mesajları yönetebileceğiniz tam aktif bir iletişim altyapısına dönüştürebiliriz.",
  quickNoteButtonLabel: "Projeleri İncele",
  quickNoteButtonHref: "/projects",
}

function mapApiToForm(data: any): FormState {
  return {
    id: data?.id,
    slug: data?.slug ?? defaultState.slug,
    title: data?.title ?? defaultState.title,
    isActive: typeof data?.isActive === "boolean" ? data.isActive : true,
    heroSlides:
      Array.isArray(data?.heroSlides) && data.heroSlides.length
        ? data.heroSlides.map((item: any) => ({
            eyebrow: item?.eyebrow ?? "",
            title: item?.title ?? "",
            description: item?.description ?? "",
            primaryCtaLabel: item?.primaryCtaLabel ?? "",
            primaryCtaHref: item?.primaryCtaHref ?? "",
            secondaryCtaLabel: item?.secondaryCtaLabel ?? "",
            secondaryCtaHref: item?.secondaryCtaHref ?? "",
            tags: Array.isArray(item?.tags) ? item.tags : [],
            panelTitle: item?.panelTitle ?? "",
            panelDescription: item?.panelDescription ?? "",
          }))
        : defaultState.heroSlides,
    formHeader: data?.formHeader ?? defaultState.formHeader,
    formTitle: data?.formTitle ?? defaultState.formTitle,
    formDescription: data?.formDescription ?? defaultState.formDescription,
    projectTypes: Array.isArray(data?.projectTypes)
      ? data.projectTypes
      : defaultState.projectTypes,
    services: Array.isArray(data?.services)
      ? data.services
      : defaultState.services,
    budgets: Array.isArray(data?.budgets) ? data.budgets : defaultState.budgets,
    contactCards:
      Array.isArray(data?.contactCards) && data.contactCards.length
        ? data.contactCards.map((item: any) => ({
            type:
              item?.type === "phone" || item?.type === "location"
                ? item.type
                : "email",
            label: item?.label ?? "",
            value: item?.value ?? "",
          }))
        : defaultState.contactCards,
    processSteps:
      Array.isArray(data?.processSteps) && data.processSteps.length
        ? data.processSteps.map((item: any) => ({
            icon:
              item?.icon === "Layers3" || item?.icon === "Wallet"
                ? item.icon
                : "Briefcase",
            title: item?.title ?? "",
            description: item?.description ?? "",
          }))
        : defaultState.processSteps,
    quickNoteTitle: data?.quickNoteTitle ?? defaultState.quickNoteTitle,
    quickNoteDescription:
      data?.quickNoteDescription ?? defaultState.quickNoteDescription,
    quickNoteButtonLabel:
      data?.quickNoteButtonLabel ?? defaultState.quickNoteButtonLabel,
    quickNoteButtonHref:
      data?.quickNoteButtonHref ?? defaultState.quickNoteButtonHref,
  }
}

function buildPayload(form: FormState) {
  return {
    slug: form.slug,
    title: form.title,
    isActive: form.isActive,
    heroSlides: form.heroSlides,
    formHeader: form.formHeader,
    formTitle: form.formTitle,
    formDescription: form.formDescription,
    projectTypes: form.projectTypes,
    services: form.services,
    budgets: form.budgets,
    contactCards: form.contactCards,
    processSteps: form.processSteps,
    quickNoteTitle: form.quickNoteTitle,
    quickNoteDescription: form.quickNoteDescription,
    quickNoteButtonLabel: form.quickNoteButtonLabel,
    quickNoteButtonHref: form.quickNoteButtonHref,
  }
}

function ContactPageContentCreatePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const slugParam = searchParams.get("slug")

  const [form, setForm] = useState<FormState>(defaultState)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Yükleniyor...")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const isEditMode = !!form.id || !!editId

  useEffect(() => {
    let ignore = false

    async function loadData() {
      if (!editId && !slugParam) return

      try {
        setLoading(true)
        setError("")
        setLoadingMessage("Kayıt getiriliyor...")

        const url = editId
          ? `${ENDPOINT}/${editId}`
          : `${ENDPOINT}/slug/${slugParam}`

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Kayıt getirilemedi.")
        }

        const data = await res.json()
        if (!ignore) {
          setForm(mapApiToForm(data))
          setActiveSlideIndex(0)
        }
      } catch (err: any) {
        if (!ignore) {
          console.error("Load contact page content error:", err)
          setError(err?.message || "Kayıt yüklenirken hata oluştu.")
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      ignore = true
    }
  }, [editId, slugParam])

  const activeSlide =
    form.heroSlides[activeSlideIndex] || form.heroSlides[0] || defaultSlide

  const stats = useMemo(() => {
    return {
      slides: form.heroSlides.length,
      cards: form.contactCards.length,
      steps: form.processSteps.length,
      services: form.services.length,
    }
  }, [form])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError("")
      setSuccess("")

      const payload = buildPayload(form)
      const method = form.id ? "PATCH" : "POST"
      const url = form.id ? `${ENDPOINT}/${form.id}` : ENDPOINT

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Kayıt kaydedilemedi.")
      }

      const data = await res.json()
      const normalized = mapApiToForm(data)

      setForm(normalized)
      setSuccess(form.id ? "Kayıt başarıyla güncellendi." : "Kayıt başarıyla oluşturuldu.")

      if (!form.id && data?.id) {
        router.replace(`/contact/page-content/create?id=${data.id}`)
      }
    } catch (err: any) {
      console.error("Save contact page content error:", err)
      setError(err?.message || "Kayıt kaydedilirken hata oluştu.")
    } finally {
      setSubmitting(false)
    }
  }

  function updateSlide(index: number, patch: Partial<SlideItem>) {
    setForm((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }))
  }

  function addSlide() {
    setForm((prev) => ({
      ...prev,
      heroSlides: [
        ...prev.heroSlides,
        {
          ...defaultSlide,
          eyebrow: `SLIDE ${prev.heroSlides.length + 1}`,
          title: "",
          description: "",
          primaryCtaLabel: "",
          primaryCtaHref: "",
          secondaryCtaLabel: "",
          secondaryCtaHref: "",
          tags: [],
          panelTitle: "",
          panelDescription: "",
        },
      ],
    }))
    setActiveSlideIndex(form.heroSlides.length)
  }

  function removeSlide(index: number) {
    setForm((prev) => {
      const next = prev.heroSlides.filter((_, i) => i !== index)
      return {
        ...prev,
        heroSlides: next.length ? next : [defaultSlide],
      }
    })
    setActiveSlideIndex((prev) => Math.max(0, Math.min(prev, form.heroSlides.length - 2)))
  }

  function updateContactCard(index: number, patch: Partial<ContactCardItem>) {
    setForm((prev) => ({
      ...prev,
      contactCards: prev.contactCards.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }))
  }

  function addContactCard() {
    setForm((prev) => ({
      ...prev,
      contactCards: [...prev.contactCards, { type: "email", label: "", value: "" }],
    }))
  }

  function removeContactCard(index: number) {
    setForm((prev) => ({
      ...prev,
      contactCards: prev.contactCards.filter((_, i) => i !== index),
    }))
  }

  function updateProcessStep(index: number, patch: Partial<ProcessStepItem>) {
    setForm((prev) => ({
      ...prev,
      processSteps: prev.processSteps.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }))
  }

  function addProcessStep() {
    setForm((prev) => ({
      ...prev,
      processSteps: [
        ...prev.processSteps,
        { icon: "Briefcase", title: "", description: "" },
      ],
    }))
  }

  function removeProcessStep(index: number) {
    setForm((prev) => ({
      ...prev,
      processSteps: prev.processSteps.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Sidebar />

      <div className="pl-0 lg:pl-[300px]">
        <main className="mx-auto max-w-[1780px] px-4 py-6 sm:px-6">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <Link
                    href="/contact/page-content"
                    className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Listeye Dön
                  </Link>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      {isEditMode ? "Contact Page Edit" : "Contact Page Create"}
                    </div>

                    <div className="text-xs text-slate-400">
                      {isEditMode ? "PATCH /api/contact-page-contents/{id}" : "POST /api/contact-page-contents"}
                    </div>
                  </div>

                  <h1 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[30px]">
                    {isEditMode ? "Contact Sayfa İçeriğini Düzenle" : "Yeni Contact Sayfa İçeriği"}
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Input alanları ve preview yan yana durur. Tek bir üst action alanı vardır, ekstra topbar görünmez.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Slide", value: stats.slides },
                    { label: "Kart", value: stats.cards },
                    { label: "Süreç", value: stats.steps },
                    { label: "Hizmet", value: stats.services },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center"
                    >
                      <div className="text-lg font-bold text-slate-900">{item.value}</div>
                      <div className="text-[11px] text-slate-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-3 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">{loadingMessage}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
                  <div className="space-y-6">
                    {error && (
                      <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                        {success}
                      </div>
                    )}

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                          Genel Ayarlar
                        </h2>

                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {form.id ? `ID: ${form.id}` : "Yeni kayıt"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Slug
                          </label>
                          <input
                            value={form.slug}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, slug: e.target.value }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                            placeholder="contact-page"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Başlık
                          </label>
                          <input
                            value={form.title}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                            placeholder="Contact Page Content"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={form.isActive}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  isActive: e.target.checked,
                                }))
                              }
                            />
                            Bu kayıt aktif olsun
                          </label>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                          Hero Slides
                        </h2>

                        <button
                          type="button"
                          onClick={addSlide}
                          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white"
                        >
                          <Plus className="h-4 w-4" />
                          Slide Ekle
                        </button>
                      </div>

                      <div className="mt-5 space-y-5">
                        {form.heroSlides.map((slide, index) => (
                          <div
                            key={index}
                            className={cn(
                              "rounded-[24px] border p-4",
                              index === activeSlideIndex
                                ? "border-violet-300 bg-violet-50"
                                : "border-slate-200 bg-slate-50"
                            )}
                          >
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => setActiveSlideIndex(index)}
                                className="text-left"
                              >
                                <div className="text-sm font-bold text-slate-900">
                                  Slide {index + 1}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Preview için seç
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => removeSlide(index)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Eyebrow
                                </label>
                                <input
                                  value={slide.eyebrow}
                                  onChange={(e) =>
                                    updateSlide(index, { eyebrow: e.target.value })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Tags
                                </label>
                                <input
                                  value={slide.tags.join(", ")}
                                  onChange={(e) =>
                                    updateSlide(index, {
                                      tags: parseCommaList(e.target.value),
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                  placeholder="Web, Mobile, Admin Panel"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Başlık
                                </label>
                                <input
                                  value={slide.title}
                                  onChange={(e) =>
                                    updateSlide(index, { title: e.target.value })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Açıklama
                                </label>
                                <textarea
                                  rows={4}
                                  value={slide.description}
                                  onChange={(e) =>
                                    updateSlide(index, { description: e.target.value })
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Primary CTA Label
                                </label>
                                <input
                                  value={slide.primaryCtaLabel}
                                  onChange={(e) =>
                                    updateSlide(index, {
                                      primaryCtaLabel: e.target.value,
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Primary CTA Href
                                </label>
                                <input
                                  value={slide.primaryCtaHref}
                                  onChange={(e) =>
                                    updateSlide(index, {
                                      primaryCtaHref: e.target.value,
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Secondary CTA Label
                                </label>
                                <input
                                  value={slide.secondaryCtaLabel}
                                  onChange={(e) =>
                                    updateSlide(index, {
                                      secondaryCtaLabel: e.target.value,
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Secondary CTA Href
                                </label>
                                <input
                                  value={slide.secondaryCtaHref}
                                  onChange={(e) =>
                                    updateSlide(index, {
                                      secondaryCtaHref: e.target.value,
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Panel Başlığı
                                </label>
                                <input
                                  value={slide.panelTitle}
                                  onChange={(e) =>
                                    updateSlide(index, { panelTitle: e.target.value })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Panel Açıklaması
                                </label>
                                <textarea
                                  rows={3}
                                  value={slide.panelDescription}
                                  onChange={(e) =>
                                    updateSlide(index, {
                                      panelDescription: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-300"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                        Form Alanı
                      </h2>

                      <div className="mt-5 grid grid-cols-1 gap-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Form Header
                          </label>
                          <input
                            value={form.formHeader}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, formHeader: e.target.value }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Form Title
                          </label>
                          <input
                            value={form.formTitle}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, formTitle: e.target.value }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Form Description
                          </label>
                          <textarea
                            rows={4}
                            value={form.formDescription}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                formDescription: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Project Types
                          </label>
                          <input
                            value={form.projectTypes.join(", ")}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                projectTypes: parseCommaList(e.target.value),
                              }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Services
                          </label>
                          <input
                            value={form.services.join(", ")}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                services: parseCommaList(e.target.value),
                              }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Budgets
                          </label>
                          <input
                            value={form.budgets.join(", ")}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                budgets: parseCommaList(e.target.value),
                              }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                          Contact Cards
                        </h2>

                        <button
                          type="button"
                          onClick={addContactCard}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700"
                        >
                          <Plus className="h-4 w-4" />
                          Kart Ekle
                        </button>
                      </div>

                      <div className="mt-5 space-y-4">
                        {form.contactCards.map((card, index) => (
                          <div
                            key={index}
                            className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="mb-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeContactCard(index)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Type
                                </label>
                                <select
                                  value={card.type}
                                  onChange={(e) =>
                                    updateContactCard(index, {
                                      type: e.target.value as ContactCardItem["type"],
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                >
                                  <option value="email">email</option>
                                  <option value="phone">phone</option>
                                  <option value="location">location</option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Label
                                </label>
                                <input
                                  value={card.label}
                                  onChange={(e) =>
                                    updateContactCard(index, { label: e.target.value })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Value
                                </label>
                                <input
                                  value={card.value}
                                  onChange={(e) =>
                                    updateContactCard(index, { value: e.target.value })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                          Process Steps
                        </h2>

                        <button
                          type="button"
                          onClick={addProcessStep}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700"
                        >
                          <Plus className="h-4 w-4" />
                          Adım Ekle
                        </button>
                      </div>

                      <div className="mt-5 space-y-4">
                        {form.processSteps.map((step, index) => (
                          <div
                            key={index}
                            className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="mb-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeProcessStep(index)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Icon
                                </label>
                                <select
                                  value={step.icon}
                                  onChange={(e) =>
                                    updateProcessStep(index, {
                                      icon: e.target.value as ProcessStepItem["icon"],
                                    })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                >
                                  <option value="Briefcase">Briefcase</option>
                                  <option value="Layers3">Layers3</option>
                                  <option value="Wallet">Wallet</option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Başlık
                                </label>
                                <input
                                  value={step.title}
                                  onChange={(e) =>
                                    updateProcessStep(index, { title: e.target.value })
                                  }
                                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-300"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Açıklama
                                </label>
                                <textarea
                                  rows={3}
                                  value={step.description}
                                  onChange={(e) =>
                                    updateProcessStep(index, {
                                      description: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-300"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                        Quick Note
                      </h2>

                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Başlık
                          </label>
                          <input
                            value={form.quickNoteTitle}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                quickNoteTitle: e.target.value,
                              }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Buton Label
                          </label>
                          <input
                            value={form.quickNoteButtonLabel}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                quickNoteButtonLabel: e.target.value,
                              }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Açıklama
                          </label>
                          <textarea
                            rows={4}
                            value={form.quickNoteDescription}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                quickNoteDescription: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-300"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Buton Href
                          </label>
                          <input
                            value={form.quickNoteButtonHref}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                quickNoteButtonHref: e.target.value,
                              }))
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300"
                          />
                        </div>
                      </div>
                    </section>

                    <div className="sticky bottom-4 z-20 rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-500">
                          {isEditMode
                            ? "Bu buton PATCH ile mevcut kaydı günceller."
                            : "Bu buton POST ile yeni kayıt oluşturur."}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Link
                            href="/contact/page-content"
                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Vazgeç
                          </Link>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.25)] transition hover:scale-[1.01] disabled:opacity-70"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Kaydediliyor...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                Kaydet
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
                    <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-900">
                          <Eye className="h-4 w-4 text-violet-600" />
                          <span className="text-sm font-semibold">Canlı Preview</span>
                        </div>

                        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                          Slide {activeSlideIndex + 1} / {form.heroSlides.length}
                        </div>
                      </div>

                      <div className="max-h-[calc(100vh-120px)] overflow-y-auto bg-[#060606]">
                        <section className="relative overflow-hidden border-b border-white/10">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.20),transparent_30%),radial-gradient(circle_at_left,rgba(255,255,255,0.05),transparent_22%),linear-gradient(180deg,#09090d_0%,#060606_100%)]" />
                          <div className="absolute left-[-60px] top-[-20px] h-[220px] w-[220px] rounded-full bg-violet-600/15 blur-3xl" />
                          <div className="absolute bottom-[-60px] right-[-20px] h-[220px] w-[220px] rounded-full bg-fuchsia-500/10 blur-3xl" />

                          <div className="relative px-6 py-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
                              <Sparkles className="h-3.5 w-3.5" />
                              {activeSlide.eyebrow || "EYEBROW"}
                            </div>

                            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-white">
                              {activeSlide.title || "Slide başlığı"}
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-white/65">
                              {activeSlide.description || "Slide açıklaması"}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                              {(activeSlide.tags || []).map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                              <span className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-medium text-white">
                                {activeSlide.primaryCtaLabel || "Primary CTA"}
                              </span>
                              <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white">
                                {activeSlide.secondaryCtaLabel || "Secondary CTA"}
                              </span>
                            </div>

                            <div className="mt-8 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
                              <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                                ERVIX LABS
                              </div>

                              <div className="mt-4 text-xl font-semibold text-white">
                                {activeSlide.panelTitle || "Panel başlığı"}
                              </div>

                              <p className="mt-4 text-sm leading-7 text-white/58">
                                {activeSlide.panelDescription || "Panel açıklaması"}
                              </p>

                              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {["Discovery", "Planning", "Delivery"].map((item) => (
                                  <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75"
                                  >
                                    {item}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6 flex items-center gap-2">
                                {form.heroSlides.map((_, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActiveSlideIndex(index)}
                                    className={cn(
                                      "h-2.5 rounded-full transition-all",
                                      index === activeSlideIndex
                                        ? "w-8 bg-violet-500"
                                        : "w-2.5 bg-white/25"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>

                        <section className="grid gap-6 px-6 py-8">
                          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                              {form.formHeader || "Form Header"}
                            </div>
                            <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                              {form.formTitle || "Form Title"}
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-white/58">
                              {form.formDescription || "Form açıklaması"}
                            </p>

                            <div className="mt-6 grid gap-4">
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div className="h-12 rounded-2xl border border-white/10 bg-white/[0.03]" />
                                <div className="h-12 rounded-2xl border border-white/10 bg-white/[0.03]" />
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div className="h-12 rounded-2xl border border-white/10 bg-white/[0.03]" />
                                <div className="h-12 rounded-2xl border border-white/10 bg-white/[0.03]" />
                              </div>

                              <div>
                                <p className="mb-3 text-sm text-white/70">Proje Tipi</p>
                                <div className="flex flex-wrap gap-2">
                                  {form.projectTypes.map((item, index) => (
                                    <span
                                      key={`${item}-${index}`}
                                      className={cn(
                                        "rounded-full border px-4 py-2 text-xs",
                                        index === 0
                                          ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                                          : "border-white/10 bg-white/5 text-white/70"
                                      )}
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="mb-3 text-sm text-white/70">
                                  İhtiyaç Duyulan Hizmetler
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {form.services.map((item, index) => (
                                    <span
                                      key={`${item}-${index}`}
                                      className={cn(
                                        "rounded-full border px-4 py-2 text-xs",
                                        index < 2
                                          ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                                          : "border-white/10 bg-white/5 text-white/70"
                                      )}
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="mb-3 text-sm text-white/70">Tahmini Bütçe</p>
                                <div className="flex flex-wrap gap-2">
                                  {form.budgets.map((item, index) => (
                                    <span
                                      key={`${item}-${index}`}
                                      className={cn(
                                        "rounded-full border px-4 py-2 text-xs",
                                        index === 0
                                          ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                                          : "border-white/10 bg-white/5 text-white/70"
                                      )}
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="h-28 rounded-2xl border border-white/10 bg-white/[0.03]" />

                              <div className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-medium text-white">
                                Mesajı Gönder
                                <Send className="ml-2 h-4 w-4" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {form.contactCards.map((card, index) => {
                              const Icon = iconForCard(card.type)
                              return (
                                <div
                                  key={`${card.type}-${index}`}
                                  className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-300">
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <div className="text-[11px] uppercase tracking-[0.18em] text-violet-300">
                                        {card.label || "Label"}
                                      </div>
                                      <div className="mt-1 text-sm text-white/75">
                                        {card.value || "Value"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}

                            <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5">
                              <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                                Süreç Nasıl İşliyor?
                              </div>

                              <div className="mt-5 space-y-4">
                                {form.processSteps.map((step, index) => {
                                  const Icon = iconForStep(step.icon)
                                  return (
                                    <div
                                      key={`${step.title}-${index}`}
                                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-300">
                                          <Icon className="h-4 w-4" />
                                        </div>

                                        <div>
                                          <div className="text-sm font-semibold text-white">
                                            {step.title || "Adım başlığı"}
                                          </div>
                                          <p className="mt-2 text-sm leading-7 text-white/58">
                                            {step.description || "Adım açıklaması"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="rounded-[26px] border border-white/10 bg-violet-500/10 p-5">
                              <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                                {form.quickNoteTitle || "Quick Note"}
                              </div>

                              <p className="mt-4 text-sm leading-7 text-white/70">
                                {form.quickNoteDescription || "Quick note açıklaması"}
                              </p>

                              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white">
                                {form.quickNoteButtonLabel || "Button"}
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Sidebar />
      <div className="pl-0 lg:pl-[300px]">
        <main className="mx-auto max-w-[1780px] px-4 py-6 sm:px-6">
          <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Yükleniyor...</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ContactPageContentCreatePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ContactPageContentCreatePageInner />
    </Suspense>
  )
}