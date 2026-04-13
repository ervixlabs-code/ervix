"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"
import {
  Sparkles,
  Save,
  ArrowLeft,
  Loader2,
  Globe,
  Code2,
  MonitorSmartphone,
  Box,
  Layers3,
  CheckCircle2,
  Eye,
  Info,
  Workflow,
  Rocket,
  ShieldCheck,
  BriefcaseBusiness,
  Gauge,
  Building2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from "lucide-react"

type ServiceStatus = "ACTIVE" | "PASSIVE"
type ServiceIconKey = "Globe" | "Code2" | "MonitorSmartphone" | "Box"
type ValueIconKey =
  | "BriefcaseBusiness"
  | "Gauge"
  | "Building2"
  | "ShieldCheck"
type ProcessIconKey = "Layers3" | "Sparkles" | "Workflow" | "Rocket"

type ServiceItem = {
  id: string
  title: string
  slug: string
  icon: ServiceIconKey
  description: string
  longDescription?: string | null
  scope?: string | null
  output?: string | null
  delivery?: string | null
  status: ServiceStatus
  sortOrder: number
  createdAt?: string
  updatedAt?: string
  features: string[]
  technologies: string[]
}

type FormState = {
  title: string
  slug: string
  icon: ServiceIconKey
  description: string
  longDescription: string
  scope: string
  output: string
  delivery: string
  status: ServiceStatus
  sortOrder: number
  featuresText: string
  technologiesText: string
}

type HeroState = {
  eyebrow: string
  title: string
  description: string
  tagsText: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  perspectiveEyebrow: string
  perspectiveTitle: string
  perspectiveDescription: string
  perspectiveItemsText: string
}

type StatItem = {
  value: string
  label: string
  description: string
}

type ValueBlockItem = {
  icon: ValueIconKey
  title: string
  description: string
}

type ProcessItem = {
  icon: ProcessIconKey
  title: string
  description: string
}

type CtaState = {
  eyebrow: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function getServiceIcon(icon: ServiceIconKey) {
  switch (icon) {
    case "Globe":
      return Globe
    case "Code2":
      return Code2
    case "MonitorSmartphone":
      return MonitorSmartphone
    case "Box":
      return Box
    default:
      return Layers3
  }
}

function getValueIcon(icon: ValueIconKey) {
  switch (icon) {
    case "BriefcaseBusiness":
      return BriefcaseBusiness
    case "Gauge":
      return Gauge
    case "Building2":
      return Building2
    case "ShieldCheck":
      return ShieldCheck
    default:
      return BriefcaseBusiness
  }
}

function getProcessIcon(icon: ProcessIconKey) {
  switch (icon) {
    case "Layers3":
      return Layers3
    case "Sparkles":
      return Sparkles
    case "Workflow":
      return Workflow
    case "Rocket":
      return Rocket
    default:
      return Layers3
  }
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function arrayToLines(value?: string[]) {
  return Array.isArray(value) ? value.join("\n") : ""
}

async function safeReadError(res: Response) {
  try {
    const text = await res.text()
    return text || `HTTP ${res.status}`
  } catch {
    return `HTTP ${res.status}`
  }
}

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-300">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  )
}

function CollapsibleSection({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string
  subtitle: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open ? <div className="border-t border-slate-200 px-5 py-5">{children}</div> : null}
    </div>
  )
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const ENDPOINT = `${API_BASE}/services`

const iconOptions: Array<{ value: ServiceIconKey; label: string }> = [
  { value: "Globe", label: "Globe / Kurumsal Web" },
  { value: "Code2", label: "Code2 / Özel Yazılım" },
  { value: "MonitorSmartphone", label: "MonitorSmartphone / Mobil" },
  { value: "Box", label: "Box / 3D Web" },
]

const valueIconOptions: Array<{ value: ValueIconKey; label: string }> = [
  { value: "BriefcaseBusiness", label: "BriefcaseBusiness" },
  { value: "Gauge", label: "Gauge" },
  { value: "Building2", label: "Building2" },
  { value: "ShieldCheck", label: "ShieldCheck" },
]

const processIconOptions: Array<{ value: ProcessIconKey; label: string }> = [
  { value: "Layers3", label: "Layers3" },
  { value: "Sparkles", label: "Sparkles" },
  { value: "Workflow", label: "Workflow" },
  { value: "Rocket", label: "Rocket" },
]

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params?.id || "")

  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    icon: "Globe",
    description: "",
    longDescription: "",
    scope: "",
    output: "",
    delivery: "",
    status: "ACTIVE",
    sortOrder: 1,
    featuresText: "",
    technologiesText: "",
  })

  const [hero, setHero] = useState<HeroState>({
    eyebrow: "Services",
    title: "Markalar için güçlü, modern ve ölçeklenebilir dijital çözümler geliştiriyoruz.",
    description:
      "Kurumsal web siteleri, özel yazılım projeleri, mobil uygulamalar ve 3D deneyim odaklı yapılarla uçtan uca hizmet sunuyoruz. Her hizmet alanında marka hissi, kullanıcı deneyimi ve teknik sürdürülebilirliği birlikte düşünüyoruz.",
    tagsText: "Kurumsal Web\nCustom Software\nMobile\n3D Web",
    primaryButtonText: "Bizimle Çalış",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Projeleri İncele",
    secondaryButtonUrl: "/projects",
    perspectiveEyebrow: "Service Perspective",
    perspectiveTitle:
      "Design, engineering ve teslim disiplinini aynı sistem içinde birleştiriyoruz.",
    perspectiveDescription:
      "Sadece estetik değil; performanslı, sürdürülebilir ve büyümeye açık dijital yapılar kuruyoruz. Her hizmet alanını kendi içinde değil, markanın genel ihtiyacı ve sistem mantığı içinde değerlendiriyoruz.",
    perspectiveItemsText:
      "İhtiyaç analiziyle başlayan net süreç\nGüçlü teknik omurga ve modern arayüz yaklaşımı\nYayına alma sonrası da gelişebilen yapı",
  })

  const [stats, setStats] = useState<StatItem[]>([
    {
      value: "Kurumsal odaklı",
      label: "Yaklaşım",
      description:
        "Her hizmet alanını yalnızca teknik çıktı değil, iş ihtiyacı ve marka algısı açısından ele alıyoruz.",
    },
    {
      value: "Uçtan uca",
      label: "Teslim modeli",
      description:
        "Analiz, tasarım, geliştirme ve yayına alma süreçlerini tek çatı altında yönetiyoruz.",
    },
    {
      value: "Modern sistemler",
      label: "Teknik bakış",
      description:
        "Performans, sürdürülebilirlik ve ölçeklenebilirlik odağında yapılar kuruyoruz.",
    },
    {
      value: "Uzun vadeli",
      label: "Çözüm yaklaşımı",
      description:
        "Bugünün ihtiyacını karşılayan ama yarının büyümesine de uyum sağlayan yapılar oluşturuyoruz.",
    },
  ])

  const [valueBlocks, setValueBlocks] = useState<ValueBlockItem[]>([
    {
      icon: "BriefcaseBusiness",
      title: "İhtiyaca özel çözüm modeli",
      description:
        "Her markanın ve her kurumun ihtiyacına göre en uygun yapı ve servis kombinasyonunu belirliyoruz.",
    },
    {
      icon: "Gauge",
      title: "Kalite ve performans dengesi",
      description:
        "Görsel kaliteyi, teknik performansı ve kullanım kolaylığını birlikte önceliklendiriyoruz.",
    },
    {
      icon: "Building2",
      title: "Kurumsal uyum",
      description:
        "Karar vericilere güven veren, sade, net ve profesyonel dijital yapılar oluşturmaya odaklanıyoruz.",
    },
    {
      icon: "ShieldCheck",
      title: "Sürdürülebilir teslim",
      description:
        "Projeleri yalnızca canlıya almak değil, sonrasında da geliştirilebilir halde bırakmak temel yaklaşımımızdır.",
    },
  ])

  const [processItems, setProcessItems] = useState<ProcessItem[]>([
    {
      icon: "Layers3",
      title: "Discovery",
      description:
        "İhtiyacı, hedef kullanıcıyı, kapsamı ve öncelikleri netleştiriyoruz.",
    },
    {
      icon: "Sparkles",
      title: "Design",
      description:
        "Marka dili, kullanıcı deneyimi ve arayüz yapısını rafine ediyoruz.",
    },
    {
      icon: "Workflow",
      title: "Build",
      description:
        "Güçlü frontend ve backend omurgasıyla projeyi geliştiriyoruz.",
    },
    {
      icon: "Rocket",
      title: "Scale",
      description:
        "Projeyi yayına alıyor, geliştiriyor ve büyümeye hazırlıyoruz.",
    },
  ])

  const [cta, setCta] = useState<CtaState>({
    eyebrow: "Let’s Build",
    title: "İhtiyacınıza uygun doğru hizmet yapısını birlikte kuralım.",
    description:
      "Kurumsal web sitesi, özel yazılım, mobil uygulama veya interaktif deneyim odaklı bir proje planlıyorsanız; size uygun en doğru çerçeveyi birlikte oluşturabiliriz.",
    primaryButtonText: "İletişime Geç",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Projeleri İncele",
    secondaryButtonUrl: "/projects",
  })

  const [openSections, setOpenSections] = useState({
    hero: true,
    stats: false,
    service: true,
    value: false,
    process: false,
    cta: false,
  })

  const [initialData, setInitialData] = useState<FormState | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const features = useMemo(() => linesToArray(form.featuresText), [form.featuresText])
  const technologies = useMemo(
    () => linesToArray(form.technologiesText),
    [form.technologiesText]
  )
  const heroTags = useMemo(() => linesToArray(hero.tagsText), [hero.tagsText])
  const perspectiveItems = useMemo(
    () => linesToArray(hero.perspectiveItemsText),
    [hero.perspectiveItemsText]
  )

  const Icon = getServiceIcon(form.icon)

  const isDirty = useMemo(() => {
    if (!initialData) return false
    return JSON.stringify(form) !== JSON.stringify(initialData)
  }, [form, initialData])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateHero<K extends keyof HeroState>(key: K, value: HeroState[K]) {
    setHero((prev) => ({ ...prev, [key]: value }))
  }

  function updateCta<K extends keyof CtaState>(key: K, value: CtaState[K]) {
    setCta((prev) => ({ ...prev, [key]: value }))
  }

  function handleTitleChange(value: string) {
    setForm((prev) => {
      const nextSlug =
        prev.slug === "" || prev.slug === slugify(prev.title)
          ? slugify(value)
          : prev.slug

      return {
        ...prev,
        title: value,
        slug: nextSlug,
      }
    })
  }

  function toggleSection(key: keyof typeof openSections) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function updateStat(index: number, key: keyof StatItem, value: string) {
    setStats((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  function updateValueBlock(
    index: number,
    key: keyof ValueBlockItem,
    value: string
  ) {
    setValueBlocks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  function updateProcess(index: number, key: keyof ProcessItem, value: string) {
    setProcessItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    )
  }

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function fetchItem() {
      try {
        setPageLoading(true)
        setError("")
        setSuccess("")

        const res = await fetch(`${ENDPOINT}/${id}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          const message = await safeReadError(res)
          throw new Error(message || "Servis kaydı alınamadı.")
        }

        const item: ServiceItem = await res.json()

        if (cancelled) return

        const mapped: FormState = {
          title: item.title ?? "",
          slug: item.slug ?? "",
          icon:
            item.icon === "Code2" ||
            item.icon === "MonitorSmartphone" ||
            item.icon === "Box"
              ? item.icon
              : "Globe",
          description: item.description ?? "",
          longDescription: item.longDescription ?? "",
          scope: item.scope ?? "",
          output: item.output ?? "",
          delivery: item.delivery ?? "",
          status: item.status === "PASSIVE" ? "PASSIVE" : "ACTIVE",
          sortOrder: Number(item.sortOrder ?? 1),
          featuresText: arrayToLines(item.features),
          technologiesText: arrayToLines(item.technologies),
        }

        setForm(mapped)
        setInitialData(mapped)
      } catch (err: any) {
        console.error("Edit service fetch error:", err)
        if (!cancelled) {
          setError(err?.message || "Servis yüklenirken hata oluştu.")
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false)
        }
      }
    }

    fetchItem()

    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      icon: form.icon,
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      scope: form.scope.trim(),
      output: form.output.trim(),
      delivery: form.delivery.trim(),
      status: form.status,
      sortOrder: Number(form.sortOrder || 1),
      features,
      technologies,
    }

    if (!payload.title) {
      setError("Başlık zorunludur.")
      return
    }

    if (!payload.slug) {
      setError("Slug zorunludur.")
      return
    }

    if (!payload.description) {
      setError("Kısa açıklama zorunludur.")
      return
    }

    if (features.length === 0) {
      setError("En az 1 feature girmelisin.")
      return
    }

    if (technologies.length === 0) {
      setError("En az 1 teknoloji girmelisin.")
      return
    }

    try {
      setSubmitting(true)

      const res = await fetch(`${ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const message = await safeReadError(res)
        throw new Error(message || "Servis kaydı güncellenemedi.")
      }

      await res.json()

      const updatedState: FormState = {
        ...form,
        title: payload.title,
        slug: payload.slug,
        description: payload.description,
        longDescription: payload.longDescription,
        scope: payload.scope,
        output: payload.output,
        delivery: payload.delivery,
        status: payload.status,
        sortOrder: payload.sortOrder,
        featuresText: features.join("\n"),
        technologiesText: technologies.join("\n"),
      }

      setForm(updatedState)
      setInitialData(updatedState)
      setSuccess(
        "Service kartı güncellendi. Hero / stats / value / process / CTA bölümleri şu an preview amaçlı builder yapıda tutuluyor."
      )
    } catch (err: any) {
      console.error("Update service error:", err)
      setError(err?.message || "Servis güncellenirken hata oluştu.")
    } finally {
      setSubmitting(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
        <Sidebar />
        <div className="pl-0 lg:pl-[300px]">
          <TopBar />
          <main className="mx-auto max-w-[1900px] px-4 py-10 sm:px-6">
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-lg font-semibold text-slate-700">Servis yükleniyor...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Sidebar />

      <div className="pl-0 lg:pl-[300px]">
        <TopBar />

        <main className="mx-auto max-w-[1900px] px-4 py-6 sm:px-6">
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Services Page Builder
                  </div>

                  <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
                    Services Builder Edit Ekranı
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-[15px]">
                    Service kartını düzenlerken aynı zamanda hero, stats, value,
                    process ve CTA bloklarını builder mantığında canlı preview ile
                    görebilirsin.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Listeye Dön
                  </Link>
                </div>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 2xl:grid-cols-[760px_minmax(0,1fr)]"
            >
              <section className="space-y-4">
                <CollapsibleSection
                  title="Hero Bölümü"
                  subtitle="Services hero ve perspective kartı"
                  open={openSections.hero}
                  onToggle={() => toggleSection("hero")}
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Eyebrow
                        </label>
                        <input
                          value={hero.eyebrow}
                          onChange={(e) => updateHero("eyebrow", e.target.value)}
                          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Hero Tag’ler
                        </label>
                        <textarea
                          value={hero.tagsText}
                          onChange={(e) => updateHero("tagsText", e.target.value)}
                          rows={4}
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Hero Başlık
                      </label>
                      <textarea
                        value={hero.title}
                        onChange={(e) => updateHero("title", e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Hero Açıklama
                      </label>
                      <textarea
                        value={hero.description}
                        onChange={(e) => updateHero("description", e.target.value)}
                        rows={5}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Primary Button Text
                        </label>
                        <input
                          value={hero.primaryButtonText}
                          onChange={(e) =>
                            updateHero("primaryButtonText", e.target.value)
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Primary Button URL
                        </label>
                        <input
                          value={hero.primaryButtonUrl}
                          onChange={(e) =>
                            updateHero("primaryButtonUrl", e.target.value)
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Secondary Button Text
                        </label>
                        <input
                          value={hero.secondaryButtonText}
                          onChange={(e) =>
                            updateHero("secondaryButtonText", e.target.value)
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Secondary Button URL
                        </label>
                        <input
                          value={hero.secondaryButtonUrl}
                          onChange={(e) =>
                            updateHero("secondaryButtonUrl", e.target.value)
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <h4 className="text-sm font-bold text-slate-800">
                        Perspective Card
                      </h4>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Perspective Eyebrow
                          </label>
                          <input
                            value={hero.perspectiveEyebrow}
                            onChange={(e) =>
                              updateHero("perspectiveEyebrow", e.target.value)
                            }
                            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Perspective Title
                          </label>
                          <textarea
                            value={hero.perspectiveTitle}
                            onChange={(e) =>
                              updateHero("perspectiveTitle", e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Perspective Description
                          </label>
                          <textarea
                            value={hero.perspectiveDescription}
                            onChange={(e) =>
                              updateHero("perspectiveDescription", e.target.value)
                            }
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Perspective Maddeleri
                          </label>
                          <textarea
                            value={hero.perspectiveItemsText}
                            onChange={(e) =>
                              updateHero("perspectiveItemsText", e.target.value)
                            }
                            rows={5}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Trust Stats"
                  subtitle="Üst güven kartları"
                  open={openSections.stats}
                  onToggle={() => toggleSection("stats")}
                >
                  <div className="space-y-4">
                    {stats.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 text-sm font-bold text-slate-800">
                          Stat #{index + 1}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <input
                            value={item.value}
                            onChange={(e) => updateStat(index, "value", e.target.value)}
                            placeholder="Value"
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                          />
                          <input
                            value={item.label}
                            onChange={(e) => updateStat(index, "label", e.target.value)}
                            placeholder="Label"
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                          />
                        </div>

                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateStat(index, "description", e.target.value)
                          }
                          rows={3}
                          placeholder="Description"
                          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Service Card"
                  subtitle="Gerçek PATCH edilen service item alanları"
                  open={openSections.service}
                  onToggle={() => toggleSection("service")}
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Başlık
                        </label>
                        <input
                          value={form.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Slug
                        </label>
                        <input
                          value={form.slug}
                          onChange={(e) => updateField("slug", slugify(e.target.value))}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Icon
                        </label>
                        <select
                          value={form.icon}
                          onChange={(e) =>
                            updateField("icon", e.target.value as ServiceIconKey)
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        >
                          {iconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Durum
                        </label>
                        <select
                          value={form.status}
                          onChange={(e) =>
                            updateField("status", e.target.value as ServiceStatus)
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        >
                          <option value="ACTIVE">Aktif</option>
                          <option value="PASSIVE">Pasif</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Sıra
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={form.sortOrder}
                          onChange={(e) =>
                            updateField("sortOrder", Number(e.target.value || 1))
                          }
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Kısa Açıklama
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Uzun Açıklama
                      </label>
                      <textarea
                        value={form.longDescription}
                        onChange={(e) => updateField("longDescription", e.target.value)}
                        rows={6}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Scope
                        </label>
                        <input
                          value={form.scope}
                          onChange={(e) => updateField("scope", e.target.value)}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Output
                        </label>
                        <input
                          value={form.output}
                          onChange={(e) => updateField("output", e.target.value)}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Delivery
                        </label>
                        <input
                          value={form.delivery}
                          onChange={(e) => updateField("delivery", e.target.value)}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Features
                        </label>
                        <textarea
                          value={form.featuresText}
                          onChange={(e) => updateField("featuresText", e.target.value)}
                          rows={9}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Technologies
                        </label>
                        <textarea
                          value={form.technologiesText}
                          onChange={(e) =>
                            updateField("technologiesText", e.target.value)
                          }
                          rows={9}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-400"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Value Blocks"
                  subtitle="Service discipline blokları"
                  open={openSections.value}
                  onToggle={() => toggleSection("value")}
                >
                  <div className="space-y-4">
                    {valueBlocks.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 text-sm font-bold text-slate-800">
                          Value Block #{index + 1}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <select
                            value={item.icon}
                            onChange={(e) =>
                              updateValueBlock(index, "icon", e.target.value)
                            }
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                          >
                            {valueIconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <input
                            value={item.title}
                            onChange={(e) =>
                              updateValueBlock(index, "title", e.target.value)
                            }
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                          />
                        </div>

                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateValueBlock(index, "description", e.target.value)
                          }
                          rows={3}
                          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Process"
                  subtitle="Process kartları"
                  open={openSections.process}
                  onToggle={() => toggleSection("process")}
                >
                  <div className="space-y-4">
                    {processItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 text-sm font-bold text-slate-800">
                          Process #{index + 1}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <select
                            value={item.icon}
                            onChange={(e) =>
                              updateProcess(index, "icon", e.target.value)
                            }
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                          >
                            {processIconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <input
                            value={item.title}
                            onChange={(e) =>
                              updateProcess(index, "title", e.target.value)
                            }
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none"
                          />
                        </div>

                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateProcess(index, "description", e.target.value)
                          }
                          rows={3}
                          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="CTA"
                  subtitle="Sayfanın alt CTA alanı"
                  open={openSections.cta}
                  onToggle={() => toggleSection("cta")}
                >
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Eyebrow
                      </label>
                      <input
                        value={cta.eyebrow}
                        onChange={(e) => updateCta("eyebrow", e.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Title
                      </label>
                      <textarea
                        value={cta.title}
                        onChange={(e) => updateCta("title", e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Description
                      </label>
                      <textarea
                        value={cta.description}
                        onChange={(e) => updateCta("description", e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <input
                        value={cta.primaryButtonText}
                        onChange={(e) =>
                          updateCta("primaryButtonText", e.target.value)
                        }
                        placeholder="Primary Button Text"
                        className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                      />
                      <input
                        value={cta.primaryButtonUrl}
                        onChange={(e) =>
                          updateCta("primaryButtonUrl", e.target.value)
                        }
                        placeholder="Primary Button Url"
                        className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <input
                        value={cta.secondaryButtonText}
                        onChange={(e) =>
                          updateCta("secondaryButtonText", e.target.value)
                        }
                        placeholder="Secondary Button Text"
                        className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                      />
                      <input
                        value={cta.secondaryButtonUrl}
                        onChange={(e) =>
                          updateCta("secondaryButtonUrl", e.target.value)
                        }
                        placeholder="Secondary Button Url"
                        className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {(error || success) && (
                  <div
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm",
                      error
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {error || success}
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-violet-100 p-2 text-violet-600">
                      <Info className="h-4 w-4" />
                    </div>
                    <div className="text-sm text-slate-600">
                      Bu edit ekranı builder mantığına taşındı. Şu an güncelleme
                      işlemi gerçek backend nedeniyle yalnızca service item alanlarını
                      PATCH eder; diğer bloklar preview amaçlı local builder state
                      olarak durur.
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !isDirty}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Güncelle
                  </button>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Vazgeç
                  </Link>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                      Canlı Preview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Services sayfasının builder preview görünümü
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                    <Eye className="h-3.5 w-3.5" />
                    Live Preview
                  </div>
                </div>

                <div className="rounded-[32px] bg-[#060606] text-white">
                  <section className="relative overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,#09090d_0%,#060606_100%)]" />
                    <div className="absolute left-[-60px] top-[-20px] h-[220px] w-[220px] rounded-full bg-violet-600/10 blur-3xl" />
                    <div className="absolute bottom-[-60px] right-[-20px] h-[220px] w-[220px] rounded-full bg-fuchsia-500/8 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                        <div>
                          <SectionEyebrow>{hero.eyebrow || "Services"}</SectionEyebrow>

                          <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {hero.title}
                          </h1>

                          <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
                            {hero.description}
                          </p>

                          <div className="mt-8 flex flex-wrap gap-3">
                            {(heroTags.length > 0 ? heroTags : ["Kurumsal Web", "Custom Software"]).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/72"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <button
                              type="button"
                              className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-medium text-white transition hover:bg-violet-500"
                            >
                              {hero.primaryButtonText || "Bizimle Çalış"}
                            </button>

                            <button
                              type="button"
                              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                            >
                              {hero.secondaryButtonText || "Projeleri İncele"}
                            </button>
                          </div>
                        </div>

                        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-6 md:p-8">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                            {hero.perspectiveEyebrow || "Service Perspective"}
                          </div>

                          <div className="mt-4 text-2xl font-semibold leading-tight text-white md:text-3xl">
                            {hero.perspectiveTitle}
                          </div>

                          <p className="mt-4 text-sm leading-8 text-white/58">
                            {hero.perspectiveDescription}
                          </p>

                          <div className="mt-8 grid gap-3">
                            {(perspectiveItems.length > 0
                              ? perspectiveItems
                              : ["İhtiyaç analiziyle başlayan net süreç"]).map((item) => (
                              <div
                                key={item}
                                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                                <div className="text-sm leading-7 text-white/72">{item}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {stats.map((item, index) => (
                        <div
                          key={`${item.label}-${index}`}
                          className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] p-5 md:p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-[11px]">
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(168,85,247,0.75)]" />
                          </div>

                          <div className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                            {item.value}
                          </div>

                          <div className="mt-3 text-sm font-semibold text-violet-300">
                            {item.label}
                          </div>

                          <p className="mt-4 text-sm leading-7 text-white/58">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="space-y-8">
                      <article className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 md:p-8 lg:p-10">
                        <div className="absolute left-0 top-10 h-32 w-32 rounded-full bg-violet-600/8 blur-3xl" />
                        <div className="absolute right-0 bottom-10 h-32 w-32 rounded-full bg-fuchsia-500/8 blur-3xl" />

                        <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-10">
                          <div>
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-violet-500/10 text-violet-300">
                                <Icon className="h-6 w-6" />
                              </div>

                              <div>
                                <div className="text-[11px] uppercase tracking-[0.18em] text-violet-300">
                                  Service
                                </div>
                                <h2 className="mt-1 text-3xl font-semibold text-white md:text-4xl">
                                  {form.title || "Servis Başlığı"}
                                </h2>
                              </div>
                            </div>

                            <p className="mt-6 text-base leading-8 text-white/62">
                              {form.description ||
                                "Marka kimliğinizi doğru yansıtan güçlü servis açıklaması burada görünecek."}
                            </p>

                            <p className="mt-4 text-sm leading-8 text-white/56 md:text-base">
                              {form.longDescription ||
                                "Detaylı servis açıklaması burada yer alacak."}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2">
                              {technologies.length > 0 ? (
                                technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75"
                                  >
                                    {tech}
                                  </span>
                                ))
                              ) : (
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/40">
                                  Teknolojiler burada
                                </span>
                              )}
                            </div>

                            <div className="mt-8">
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-violet-300"
                              >
                                Bu hizmet için iletişime geç
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0c0c11] p-4">
                            <div className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(123,44,191,0.18),transparent_30%),linear-gradient(180deg,#14141b_0%,#0b0b10_100%)] p-5">
                              <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                                Service Highlights
                              </div>

                              <div className="mt-5 space-y-3">
                                {(features.length > 0
                                  ? features
                                  : ["Feature maddeleri burada görünecek"]).map((feature) => (
                                  <div
                                    key={feature}
                                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                                  >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                                    <div className="text-sm leading-7 text-white/70">
                                      {feature}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-violet-500/45 via-white/10 to-transparent" />

                              <div className="mt-6 grid gap-3">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                    Scope
                                  </div>
                                  <div className="mt-1 text-sm font-medium text-white">
                                    {form.scope || "Kurumsal görünüm + içerik akışı"}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                      Output
                                    </div>
                                    <div className="mt-1 text-sm font-medium text-white">
                                      {form.output || "Güven veren web deneyimi"}
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                      Delivery
                                    </div>
                                    <div className="mt-1 text-sm font-medium text-white">
                                      {form.delivery || "Yönetilebilir ve hızlı yapı"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </section>

                  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8">
                      <SectionEyebrow>Service Discipline</SectionEyebrow>
                      <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                        Her hizmet alanında aynı kalite standardı, aynı sistem disiplini ve aynı kurumsal yaklaşım ile ilerliyoruz.
                      </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                      {valueBlocks.map((item, index) => {
                        const ValueIcon = getValueIcon(item.icon)

                        return (
                          <div
                            key={`${item.title}-${index}`}
                            className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300">
                              <ValueIcon className="h-5 w-5" />
                            </div>

                            <h3 className="mt-5 text-2xl font-semibold text-white">
                              {item.title}
                            </h3>

                            <p className="mt-4 text-sm leading-8 text-white/60">
                              {item.description}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </section>

                  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8">
                      <SectionEyebrow>Process</SectionEyebrow>

                      <h2 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                        Her hizmet alanında aynı düşünce disipliniyle, net ve profesyonel bir süreç yönetimi kuruyoruz.
                      </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                      {processItems.map((item, index) => {
                        const ProcessIcon = getProcessIcon(item.icon)

                        return (
                          <div
                            key={`${item.title}-${index}`}
                            className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300">
                              <ProcessIcon className="h-5 w-5" />
                            </div>

                            <h3 className="mt-5 text-2xl font-semibold text-white">
                              {item.title}
                            </h3>

                            <p className="mt-4 text-sm leading-8 text-white/60">
                              {item.description}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </section>

                  <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
                    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] px-6 py-12 md:px-10 md:py-16">
                      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-600/18 blur-3xl" />
                      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-fuchsia-500/8 blur-3xl" />

                      <div className="relative max-w-3xl">
                        <SectionEyebrow>{cta.eyebrow || "Let’s Build"}</SectionEyebrow>

                        <h3 className="mt-5 text-3xl font-semibold leading-tight text-white md:text-5xl">
                          {cta.title}
                        </h3>

                        <p className="mt-5 text-sm leading-8 text-white/62 md:text-base">
                          {cta.description}
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                          <button
                            type="button"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-medium text-white transition hover:bg-violet-500"
                          >
                            {cta.primaryButtonText || "İletişime Geç"}
                          </button>

                          <button
                            type="button"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                          >
                            {cta.secondaryButtonText || "Projeleri İncele"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </section>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}