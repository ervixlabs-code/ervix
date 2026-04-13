"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointerClick,
  Users,
  Clock3,
  MessageSquareText,
  MonitorSmartphone,
  Globe,
  Activity,
  TrendingUp,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type RangeType = "7d" | "30d" | "90d"

type DashboardHero = {
  liveVisitors: number
  newLeads: number
  bestPage: string
  conversionRate: number
}

type DashboardStat = {
  title: string
  value: string
  change: string
  positive: boolean
  note: string
}

type DashboardTrafficTrendItem = {
  name: string
  visitors: number
  sessions: number
}

type DashboardTrafficSourceItem = {
  name: string
  value: number
}

type DashboardTopPageItem = {
  page: string
  views: number
  avgTime: string
  rate: string
}

type DashboardDeviceDistributionItem = {
  name: string
  value: number
}

type DashboardFeedbackScoreItem = {
  label: string
  value: number
}

type DashboardRecentFeedbackItem = {
  title: string
  text: string
  mood: string
}

type DashboardAnalyticsResponse = {
  hero: DashboardHero
  stats: DashboardStat[]
  trafficTrend: DashboardTrafficTrendItem[]
  trafficSources: DashboardTrafficSourceItem[]
  topPages: DashboardTopPageItem[]
  deviceDistribution: DashboardDeviceDistributionItem[]
  feedbackScores: DashboardFeedbackScoreItem[]
  recentFeedback: DashboardRecentFeedbackItem[]
}

const sourceColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#F59E0B", "#EC4899", "#10B981"]

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return "http://localhost:3001/api"
  return base.endsWith("/api") ? base : `${base}/api`
}

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE)

function formatHeroValue(value: string | number) {
  if (typeof value === "number") return value.toLocaleString("tr-TR")
  return value
}

function getStatIcon(title: string) {
  const normalized = title.toLocaleLowerCase("tr-TR")

  if (normalized.includes("ziyaretçi")) return Users
  if (normalized.includes("görüntülenme")) return Eye
  if (normalized.includes("oturum")) return Clock3
  if (normalized.includes("çıkma")) return Activity
  if (normalized.includes("form")) return MousePointerClick
  if (normalized.includes("geri bildirim")) return MessageSquareText

  return Activity
}

function RangeButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string
  value: RangeType
  active: boolean
  onClick: (value: RangeType) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={
        active
          ? "rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm"
          : "rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
      }
    >
      {label}
    </button>
  )
}

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  note,
}: {
  title: string
  value: string
  change: string
  positive: boolean
  icon: React.ComponentType<{ className?: string }>
  note: string
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-xs text-slate-500">{note}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(99,102,241,0.35)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {change}
        </span>
        <span className="text-xs text-slate-500">önceki döneme göre</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [range, setRange] = useState<RangeType>("30d")
  const [data, setData] = useState<DashboardAnalyticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async (selectedRange: RangeType, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      const res = await fetch(`${API_BASE}/admin/dashboard/analytics?range=${selectedRange}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        throw new Error(`Dashboard analytics verisi alınamadı (${res.status})`)
      }

      const json = (await res.json()) as DashboardAnalyticsResponse
      setData(json)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Dashboard verisi alınırken bir hata oluştu"
      setError(message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void fetchAnalytics(range, false)
  }, [range, fetchAnalytics])

  const stats = useMemo(() => {
    return (data?.stats || []).map((item) => ({
      ...item,
      icon: getStatIcon(item.title),
    }))
  }, [data])

  const heroCards = useMemo(() => {
    return [
      {
        label: "Canlı Ziyaretçi",
        value: formatHeroValue(data?.hero?.liveVisitors ?? 0),
      },
      {
        label: "Yeni Lead",
        value: formatHeroValue(data?.hero?.newLeads ?? 0),
      },
      {
        label: "En Güçlü Sayfa",
        value: data?.hero?.bestPage ?? "-",
      },
      {
        label: "Dönüşüm",
        value:
          typeof data?.hero?.conversionRate === "number"
            ? `%${data.hero.conversionRate}`
            : "%0",
      },
    ]
  }, [data])

  const feedbackCount = data?.recentFeedback?.length ?? 0

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.28)] sm:p-8">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <TrendingUp className="h-3.5 w-3.5" />
              {range === "7d"
                ? "Son 7 günlük ziyaretçi ve dönüşüm özeti"
                : range === "90d"
                ? "Son 90 günlük ziyaretçi ve dönüşüm özeti"
                : "Son 30 günlük ziyaretçi ve dönüşüm özeti"}
            </div>

            <h2 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Ervix web sitesi performansı tek ekranda
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Siteye giren ziyaretçi sayısı, en çok vakit geçirilen sayfalar, trafik
              kaynakları, cihaz kırılımı ve kullanıcı geri dönüşleri burada özetleniyor.
            </p>

            {(loading || refreshing) && (
              <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                {loading ? "Dashboard yükleniyor..." : "Veriler yenileniyor..."}
              </div>
            )}

            {error && (
              <div className="mt-4 inline-flex rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white">
                {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[420px] xl:grid-cols-2">
            {heroCards.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-xs text-white/70">{item.label}</p>
                <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAT GRID */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {loading && !data
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[152px] animate-pulse rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
              />
            ))
          : stats.map((card) => <StatCard key={card.title} {...card} />)}
      </section>

      {/* MAIN CHARTS */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-8 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                Ziyaretçi ve Oturum Trendi
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Günlük bazda site trafiği ve oturum artışı
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <RangeButton
                label="7 Gün"
                value="7d"
                active={range === "7d"}
                onClick={setRange}
              />
              <RangeButton
                label="30 Gün"
                value="30d"
                active={range === "30d"}
                onClick={setRange}
              />
              <RangeButton
                label="90 Gün"
                value="90d"
                active={range === "90d"}
                onClick={setRange}
              />
            </div>
          </div>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trafficTrend || []}>
                <defs>
                  <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#8B5CF6"
                  fill="url(#sessionsFill)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366F1"
                  fill="url(#visitorsFill)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="2xl:col-span-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
              Trafik Kaynakları
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Ziyaretçiler en çok nereden geliyor
            </p>
          </div>

          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.trafficSources || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={4}
                >
                  {(data?.trafficSources || []).map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={sourceColors[index % sourceColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-3">
            {(data?.trafficSources || []).map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: sourceColors[index % sourceColors.length] }}
                  />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">%{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECOND GRID */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-7 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                En Çok Vakit Geçirilen Sayfalar
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Sayfa bazlı görüntülenme ve ortalama kalış süresi
              </p>
            </div>

            <div className="hidden rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 sm:block">
              Top {(data?.topPages || []).length} sayfa
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-slate-200">
            <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <div className="col-span-5">Sayfa</div>
              <div className="col-span-3 text-center">Görüntülenme</div>
              <div className="col-span-2 text-center">Süre</div>
              <div className="col-span-2 text-right">Değişim</div>
            </div>

            <div className="divide-y divide-slate-200">
              {(data?.topPages || []).map((item) => {
                const positive = item.rate.startsWith("+")
                return (
                  <div
                    key={item.page}
                    className="grid grid-cols-12 items-center px-4 py-4 text-sm"
                  >
                    <div className="col-span-5">
                      <p className="font-semibold text-slate-900">{item.page}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Kullanıcı ilgisi yüksek sayfa
                      </p>
                    </div>

                    <div className="col-span-3 text-center font-medium text-slate-700">
                      {item.views.toLocaleString("tr-TR")}
                    </div>

                    <div className="col-span-2 text-center font-medium text-slate-700">
                      {item.avgTime}
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          positive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {item.rate}
                      </span>
                    </div>
                  </div>
                )
              })}

              {!loading && (data?.topPages || []).length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  Gösterilecek sayfa performans verisi bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="2xl:col-span-5 space-y-6">
          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <MonitorSmartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-900">
                  Cihaz Dağılımı
                </h3>
                <p className="text-sm text-slate-500">
                  Mobil kullanım açık ara önde
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(data?.deviceDistribution || []).map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="font-semibold text-slate-900">%{item.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-900">
                  Geri Bildirim Skorları
                </h3>
                <p className="text-sm text-slate-500">
                  Site performansına dair alınan yorumlar
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(data?.feedbackScores || []).map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="font-semibold text-slate-900">{item.value}/100</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM */}
      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-12">
        <div className="2xl:col-span-5 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-5">
            <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
              Etkileşim Yoğunluğu
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Günlere göre aksiyon ve tıklama yoğunluğu
            </p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.trafficTrend || []} barCategoryGap={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  }}
                />
                <Bar dataKey="visitors" radius={[10, 10, 0, 0]} fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="2xl:col-span-7 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                Son Kullanıcı Geri Dönüşleri
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Panel üzerinden takip edilebilecek özet yorumlar
              </p>
            </div>

            <div className="rounded-xl bg-fuchsia-50 px-3 py-2 text-xs font-semibold text-fuchsia-600">
              {feedbackCount} yeni geri bildirim
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {(data?.recentFeedback || []).map((item) => (
              <div
                key={`${item.title}-${item.mood}`}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-white"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {item.mood}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          {!loading && (data?.recentFeedback || []).length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Henüz gösterilecek kullanıcı geri dönüşü bulunmuyor.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}