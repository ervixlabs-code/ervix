"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  Globe,
  Code2,
  MonitorSmartphone,
  Box,
  Layers3,
  CheckCircle2,
  Pencil,
  CalendarDays,
  Hash,
  Eye,
  ShieldCheck,
  Workflow,
  Rocket,
  BriefcaseBusiness,
  Gauge,
  Building2,
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

type HeroState = {
  eyebrow: string
  title: string
  description: string
  tags: string[]
  primaryButtonText: string
  primaryButtonUrl: string
  secondaryButtonText: string
  secondaryButtonUrl: string
  perspectiveEyebrow: string
  perspectiveTitle: string
  perspectiveDescription: string
  perspectiveItems: string[]
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

function formatDate(date?: string) {
  if (!date) return "-"
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
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

function getStatusClasses(status: ServiceStatus) {
  return status === "ACTIVE"
    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
    : "border border-slate-500/20 bg-slate-500/10 text-slate-300"
}

function getStatusLabel(status: ServiceStatus) {
  return status === "ACTIVE" ? "Aktif" : "Pasif"
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

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const ENDPOINT = `${API_BASE}/services`

export default function ServiceDetailPage() {
  const params = useParams()
  const id = String(params?.id || "")

  const [item, setItem] = useState<ServiceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [hero] = useState<HeroState>({
    eyebrow: "Services",
    title: "Markalar için güçlü, modern ve ölçeklenebilir dijital çözümler geliştiriyoruz.",
    description:
      "Kurumsal web siteleri, özel yazılım projeleri, mobil uygulamalar ve 3D deneyim odaklı yapılarla uçtan uca hizmet sunuyoruz. Her hizmet alanında marka hissi, kullanıcı deneyimi ve teknik sürdürülebilirliği birlikte düşünüyoruz.",
    tags: ["Kurumsal Web", "Custom Software", "Mobile", "3D Web"],
    primaryButtonText: "Bizimle Çalış",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Projeleri İncele",
    secondaryButtonUrl: "/projects",
    perspectiveEyebrow: "Service Perspective",
    perspectiveTitle:
      "Design, engineering ve teslim disiplinini aynı sistem içinde birleştiriyoruz.",
    perspectiveDescription:
      "Sadece estetik değil; performanslı, sürdürülebilir ve büyümeye açık dijital yapılar kuruyoruz. Her hizmet alanını kendi içinde değil, markanın genel ihtiyacı ve sistem mantığı içinde değerlendiriyoruz.",
    perspectiveItems: [
      "İhtiyaç analiziyle başlayan net süreç",
      "Güçlü teknik omurga ve modern arayüz yaklaşımı",
      "Yayına alma sonrası da gelişebilen yapı",
    ],
  })

  const [stats] = useState<StatItem[]>([
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

  const [valueBlocks] = useState<ValueBlockItem[]>([
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

  const [processItems] = useState<ProcessItem[]>([
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

  const [cta] = useState<CtaState>({
    eyebrow: "Let’s Build",
    title: "İhtiyacınıza uygun doğru hizmet yapısını birlikte kuralım.",
    description:
      "Kurumsal web sitesi, özel yazılım, mobil uygulama veya interaktif deneyim odaklı bir proje planlıyorsanız; size uygun en doğru çerçeveyi birlikte oluşturabiliriz.",
    primaryButtonText: "İletişime Geç",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "Projeleri İncele",
    secondaryButtonUrl: "/projects",
  })

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function fetchItem() {
      try {
        setLoading(true)
        setError("")

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

        const data = await res.json()

        if (cancelled) return

        const mapped: ServiceItem = {
          id: String(data.id ?? ""),
          title: String(data.title ?? ""),
          slug: String(data.slug ?? ""),
          icon:
            data.icon === "Code2" ||
            data.icon === "MonitorSmartphone" ||
            data.icon === "Box"
              ? data.icon
              : "Globe",
          description: String(data.description ?? ""),
          longDescription: data.longDescription ?? "",
          scope: data.scope ?? "",
          output: data.output ?? "",
          delivery: data.delivery ?? "",
          status: data.status === "PASSIVE" ? "PASSIVE" : "ACTIVE",
          sortOrder: Number(data.sortOrder ?? 1),
          createdAt: data.createdAt ?? "",
          updatedAt: data.updatedAt ?? "",
          features: Array.isArray(data.features) ? data.features : [],
          technologies: Array.isArray(data.technologies) ? data.technologies : [],
        }

        setItem(mapped)
      } catch (err: any) {
        console.error("Service detail fetch error:", err)
        if (!cancelled) {
          setError(err?.message || "Servis yüklenirken hata oluştu.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchItem()

    return () => {
      cancelled = true
    }
  }, [id])

  const Icon = useMemo(
    () => getServiceIcon(item?.icon || "Globe"),
    [item?.icon]
  )

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Sidebar />

      <div className="pl-0 lg:pl-[300px]">

        <main className="mx-auto max-w-[1900px] px-4 py-6 sm:px-6">
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Services Builder Preview
                  </div>

                  <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
                    Read Only Services Görünümü
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-[15px]">
                    Service item kaydını ve services page builder mantığını tek ekranda
                    inceleyebileceğin read-only görünüm.
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

                  {id ? (
                    <Link
                      href={`/services/${id}/edit`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
                    >
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>

            {loading ? (
              <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col items-center gap-3 text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-lg font-semibold text-slate-700">Servis yükleniyor...</p>
                </div>
              </section>
            ) : error ? (
              <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-16 text-center text-rose-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <p className="text-lg font-semibold">Bir hata oluştu</p>
                <p className="mt-2 text-sm">{error}</p>
              </section>
            ) : !item ? (
              <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <p className="text-lg font-semibold text-slate-700">Kayıt bulunamadı</p>
              </section>
            ) : (
              <>
                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      title: "Durum",
                      value: getStatusLabel(item.status),
                      note: "Yayın durumu",
                      icon: ShieldCheck,
                    },
                    {
                      title: "Feature",
                      value: String(item.features.length),
                      note: "Highlight madde sayısı",
                      icon: Layers3,
                    },
                    {
                      title: "Teknoloji",
                      value: String(item.technologies.length),
                      note: "Etiketlenen teknoloji sayısı",
                      icon: Code2,
                    },
                    {
                      title: "Sıra",
                      value: String(item.sortOrder),
                      note: "Listeleme önceliği",
                      icon: Hash,
                    },
                  ].map((stat) => {
                    const StatIcon = stat.icon

                    return (
                      <div
                        key={stat.title}
                        className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <h3 className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
                              {stat.value}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
                          </div>

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(99,102,241,0.28)]">
                            <StatIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                        Full Builder Preview
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Services sayfasının bütünsel read-only görünümü
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                      <Eye className="h-3.5 w-3.5" />
                      Read Only
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
                            <SectionEyebrow>{hero.eyebrow}</SectionEyebrow>

                            <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                              {hero.title}
                            </h1>

                            <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
                              {hero.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                              {hero.tags.map((tag) => (
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
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-medium text-white transition"
                              >
                                {hero.primaryButtonText}
                              </button>

                              <button
                                type="button"
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition"
                              >
                                {hero.secondaryButtonText}
                              </button>
                            </div>
                          </div>

                          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-6 md:p-8">
                            <div className="text-[11px] uppercase tracking-[0.22em] text-violet-300">
                              {hero.perspectiveEyebrow}
                            </div>

                            <div className="mt-4 text-2xl font-semibold leading-tight text-white md:text-3xl">
                              {hero.perspectiveTitle}
                            </div>

                            <p className="mt-4 text-sm leading-8 text-white/58">
                              {hero.perspectiveDescription}
                            </p>

                            <div className="mt-8 grid gap-3">
                              {hero.perspectiveItems.map((text) => (
                                <div
                                  key={text}
                                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                                >
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                                  <div className="text-sm leading-7 text-white/72">
                                    {text}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat, index) => (
                          <div
                            key={`${stat.label}-${index}`}
                            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.018))] p-5 md:p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-[11px]">
                                {String(index + 1).padStart(2, "0")}
                              </div>
                              <div className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(168,85,247,0.75)]" />
                            </div>

                            <div className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                              {stat.value}
                            </div>

                            <div className="mt-3 text-sm font-semibold text-violet-300">
                              {stat.label}
                            </div>

                            <p className="mt-4 text-sm leading-7 text-white/58">
                              {stat.description}
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
                                    {item.title || "Servis Başlığı"}
                                  </h2>
                                </div>
                              </div>

                              <p className="mt-6 text-base leading-8 text-white/62">
                                {item.description || "-"}
                              </p>

                              <p className="mt-4 text-sm leading-8 text-white/56 md:text-base">
                                {item.longDescription || "-"}
                              </p>

                              <div className="mt-8 flex flex-wrap gap-2">
                                {item.technologies.length > 0 ? (
                                  item.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75"
                                    >
                                      {tech}
                                    </span>
                                  ))
                                ) : (
                                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/40">
                                    Teknoloji bilgisi yok
                                  </span>
                                )}
                              </div>

                              <div className="mt-8">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 text-sm font-medium text-white transition"
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
                                  {item.features.length > 0 ? (
                                    item.features.map((feature) => (
                                      <div
                                        key={feature}
                                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                                      >
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                                        <div className="text-sm leading-7 text-white/70">
                                          {feature}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/40">
                                      Feature bilgisi yok.
                                    </div>
                                  )}
                                </div>

                                <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-violet-500/45 via-white/10 to-transparent" />

                                <div className="mt-6 grid gap-3">
                                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                      Scope
                                    </div>
                                    <div className="mt-1 text-sm font-medium text-white">
                                      {item.scope || "-"}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                        Output
                                      </div>
                                      <div className="mt-1 text-sm font-medium text-white">
                                        {item.output || "-"}
                                      </div>
                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                        Delivery
                                      </div>
                                      <div className="mt-1 text-sm font-medium text-white">
                                        {item.delivery || "-"}
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
                        {valueBlocks.map((block, index) => {
                          const ValueIcon = getValueIcon(block.icon)

                          return (
                            <div
                              key={`${block.title}-${index}`}
                              className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6"
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300">
                                <ValueIcon className="h-5 w-5" />
                              </div>

                              <h3 className="mt-5 text-2xl font-semibold text-white">
                                {block.title}
                              </h3>

                              <p className="mt-4 text-sm leading-8 text-white/60">
                                {block.description}
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
                        {processItems.map((process, index) => {
                          const ProcessIcon = getProcessIcon(process.icon)

                          return (
                            <div
                              key={`${process.title}-${index}`}
                              className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6"
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-300">
                                <ProcessIcon className="h-5 w-5" />
                              </div>

                              <h3 className="mt-5 text-2xl font-semibold text-white">
                                {process.title}
                              </h3>

                              <p className="mt-4 text-sm leading-8 text-white/60">
                                {process.description}
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
                          <SectionEyebrow>{cta.eyebrow}</SectionEyebrow>

                          <h3 className="mt-5 text-3xl font-semibold leading-tight text-white md:text-5xl">
                            {cta.title}
                          </h3>

                          <p className="mt-5 text-sm leading-8 text-white/62 md:text-base">
                            {cta.description}
                          </p>

                          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <button
                              type="button"
                              className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-medium text-white transition"
                            >
                              {cta.primaryButtonText}
                            </button>

                            <button
                              type="button"
                              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition"
                            >
                              {cta.secondaryButtonText}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-900">
                      Service Item Bilgileri
                    </h3>

                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Başlık
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-800">
                          {item.title || "-"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Slug
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-800">
                          {item.slug || "-"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Icon
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-800">
                          {item.icon}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Durum
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-800">
                          {getStatusLabel(item.status)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Scope
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-800">
                          {item.scope || "-"}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Output
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-800">
                          {item.output || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-6">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-900">
                        Kayıt Bilgileri
                      </h3>

                      <div className="mt-5 space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            ID
                          </div>
                          <div className="mt-2 break-all text-sm font-medium text-slate-800">
                            {item.id}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Delivery
                          </div>
                          <div className="mt-2 text-sm font-medium text-slate-800">
                            {item.delivery || "-"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Sort Order
                          </div>
                          <div className="mt-2 text-sm font-medium text-slate-800">
                            {item.sortOrder}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                      <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-900">
                        Tarih Bilgileri
                      </h3>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                              Oluşturulma
                            </div>
                            <div className="mt-1 text-sm font-medium text-slate-800">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                              Son Güncelleme
                            </div>
                            <div className="mt-1 text-sm font-medium text-slate-800">
                              {formatDate(item.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </aside>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}