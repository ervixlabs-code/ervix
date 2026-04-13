"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  X,
  Home,
  PanelsTopLeft,
  BarChart2,
  Info,
  ShoppingBag,
  Briefcase,
  Box,
  Megaphone,
  Menu,
  Sparkles,
  Layers3,
  Target,
  Lightbulb,
  Boxes,
  Workflow,
  Users2,
  Rocket,
  MonitorSmartphone,
  Package,
  ShieldCheck,
  Mail,
  FileText,
} from "lucide-react"

type MenuItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type SectionItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Servisler", href: "/services", icon: Briefcase },
]

const homePageSections: SectionItem[] = [
  { title: "Top Slider", href: "/homepage/top-slider", icon: PanelsTopLeft },
  { title: "Stats", href: "/homepage/stats", icon: BarChart2 },
  { title: "About", href: "/homepage/about", icon: Info },
  { title: "Products", href: "/homepage/products", icon: ShoppingBag },
  { title: "Services", href: "/homepage/services", icon: Briefcase },
  { title: "3D Showcase", href: "/homepage/showcase-3d", icon: Box },
  { title: "CTA Bölümü", href: "/homepage/cta", icon: Megaphone },
]

const aboutUsSections: SectionItem[] = [
  { title: "Hero", href: "/about-us/hero", icon: Sparkles },
  { title: "Story", href: "/about-us/story", icon: Layers3 },
  { title: "Pillars", href: "/about-us/pillars", icon: Lightbulb },
  { title: "Strengths", href: "/about-us/strengths", icon: Boxes },
  { title: "Process", href: "/about-us/process", icon: Workflow },
  { title: "Culture", href: "/about-us/culture", icon: Users2 },
  { title: "CTA Bölümü", href: "/about-us/cta", icon: Rocket },
]

const productSections: SectionItem[] = [
  { title: "Hero Slides", href: "/products/hero-slides", icon: Sparkles },
  { title: "Products List", href: "/products/list", icon: MonitorSmartphone },
  { title: "Product Pillars", href: "/products/pillars", icon: ShieldCheck },
  { title: "CTA Bölümü", href: "/products/cta", icon: Megaphone },
]

const contactUsSections: SectionItem[] = [
  { title: "Page Content", href: "/contact/page-content", icon: Mail },
  { title: "Requests", href: "/contact/requests", icon: FileText },
]

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [homeOpen, setHomeOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const isHomePageAreaActive = pathname.startsWith("/homepage")
  const isAboutUsAreaActive = pathname.startsWith("/about-us")
  const isProductsAreaActive = pathname.startsWith("/products")
  const isContactAreaActive = pathname.startsWith("/contact")

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isHomePageAreaActive) setHomeOpen(true)
    if (isAboutUsAreaActive) setAboutOpen(true)
    if (isProductsAreaActive) setProductsOpen(true)
    if (isContactAreaActive) setContactOpen(true)
  }, [
    isHomePageAreaActive,
    isAboutUsAreaActive,
    isProductsAreaActive,
    isContactAreaActive,
  ])

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-[300px] border-r border-white/10 bg-[#0B1120] text-white transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[80px] items-center justify-between border-b border-white/10 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-bold text-white shadow-lg">
                E
              </div>
              <div>
                <p className="text-sm font-semibold">Ervix Admin</p>
                <p className="text-xs text-slate-400">Control Center</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-3 px-3 text-[11px] uppercase tracking-wider text-slate-500">
              Menü
            </p>

            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        isActive
                          ? "bg-white/20"
                          : "bg-white/5 group-hover:bg-white/10"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setHomeOpen((prev) => !prev)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all",
                    isHomePageAreaActive
                      ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isHomePageAreaActive
                        ? "bg-white/20"
                        : "bg-white/5 group-hover:bg-white/10"
                    )}
                  >
                    <Home className="h-5 w-5" />
                  </div>

                  <span className="flex-1">HomePage</span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      homeOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {homeOpen && (
                  <div className="mt-2 space-y-2 pl-3">
                    {homePageSections.map((section) => {
                      const SectionIcon = section.icon
                      const isActive =
                        pathname === section.href ||
                        pathname.startsWith(section.href + "/")

                      return (
                        <Link
                          key={section.href}
                          href={section.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl border border-white/6 px-3 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-white/[0.03] text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              isActive ? "bg-violet-500/20" : "bg-white/5"
                            )}
                          >
                            <SectionIcon className="h-4.5 w-4.5" />
                          </div>

                          <span className="flex-1">{section.title}</span>

                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isActive ? "text-violet-300" : "text-slate-500"
                            )}
                          />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setAboutOpen((prev) => !prev)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all",
                    isAboutUsAreaActive
                      ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isAboutUsAreaActive
                        ? "bg-white/20"
                        : "bg-white/5 group-hover:bg-white/10"
                    )}
                  >
                    <Target className="h-5 w-5" />
                  </div>

                  <span className="flex-1">About Us</span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      aboutOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {aboutOpen && (
                  <div className="mt-2 space-y-2 pl-3">
                    {aboutUsSections.map((section) => {
                      const SectionIcon = section.icon
                      const isActive =
                        pathname === section.href ||
                        pathname.startsWith(section.href + "/")

                      return (
                        <Link
                          key={section.href}
                          href={section.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl border border-white/6 px-3 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-white/[0.03] text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              isActive ? "bg-violet-500/20" : "bg-white/5"
                            )}
                          >
                            <SectionIcon className="h-4.5 w-4.5" />
                          </div>

                          <span className="flex-1">{section.title}</span>

                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isActive ? "text-violet-300" : "text-slate-500"
                            )}
                          />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setProductsOpen((prev) => !prev)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all",
                    isProductsAreaActive
                      ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isProductsAreaActive
                        ? "bg-white/20"
                        : "bg-white/5 group-hover:bg-white/10"
                    )}
                  >
                    <Package className="h-5 w-5" />
                  </div>

                  <span className="flex-1">Products</span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      productsOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {productsOpen && (
                  <div className="mt-2 space-y-2 pl-3">
                    {productSections.map((section) => {
                      const SectionIcon = section.icon
                      const isActive =
                        pathname === section.href ||
                        pathname.startsWith(section.href + "/")

                      return (
                        <Link
                          key={section.href}
                          href={section.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl border border-white/6 px-3 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-white/[0.03] text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              isActive ? "bg-violet-500/20" : "bg-white/5"
                            )}
                          >
                            <SectionIcon className="h-4.5 w-4.5" />
                          </div>

                          <span className="flex-1">{section.title}</span>

                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isActive ? "text-violet-300" : "text-slate-500"
                            )}
                          />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setContactOpen((prev) => !prev)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all",
                    isContactAreaActive
                      ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isContactAreaActive
                        ? "bg-white/20"
                        : "bg-white/5 group-hover:bg-white/10"
                    )}
                  >
                    <Mail className="h-5 w-5" />
                  </div>

                  <span className="flex-1">Contact Us</span>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      contactOpen ? "rotate-180" : ""
                    )}
                  />
                </button>

                {contactOpen && (
                  <div className="mt-2 space-y-2 pl-3">
                    {contactUsSections.map((section) => {
                      const SectionIcon = section.icon
                      const isActive =
                        pathname === section.href ||
                        pathname.startsWith(section.href + "/")

                      return (
                        <Link
                          key={section.href}
                          href={section.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-2xl border border-white/6 px-3 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-white/10 text-white"
                              : "bg-white/[0.03] text-slate-300 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              isActive ? "bg-violet-500/20" : "bg-white/5"
                            )}
                          >
                            <SectionIcon className="h-4.5 w-4.5" />
                          </div>

                          <span className="flex-1">{section.title}</span>

                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isActive ? "text-violet-300" : "text-slate-500"
                            )}
                          />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 font-bold text-black">
                  A
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">Admin User</p>
                  <p className="text-xs text-slate-400">admin@ervix.com</p>
                </div>

                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2 text-sm transition hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>
    </>
  )
}