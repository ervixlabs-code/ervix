"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Users,
  UserCheck,
  UserPlus,
  Shield,
  Mail,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"

type UserRole = "Admin" | "Editor" | "Member"
type UserStatus = "Aktif" | "Pasif" | "Beklemede"

type UserItem = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  lastLogin: string
}

const allUsers: UserItem[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet@ervix.com",
    role: "Admin",
    status: "Aktif",
    createdAt: "12.03.2026",
    lastLogin: "Bugün, 08:42",
  },
  {
    id: 2,
    name: "Zeynep Kaya",
    email: "zeynep@ervix.com",
    role: "Editor",
    status: "Aktif",
    createdAt: "10.03.2026",
    lastLogin: "Bugün, 07:15",
  },
  {
    id: 3,
    name: "Mehmet Demir",
    email: "mehmet@ervix.com",
    role: "Member",
    status: "Pasif",
    createdAt: "08.03.2026",
    lastLogin: "Dün, 22:30",
  },
  {
    id: 4,
    name: "Elif Arslan",
    email: "elif@ervix.com",
    role: "Editor",
    status: "Aktif",
    createdAt: "07.03.2026",
    lastLogin: "Bugün, 09:03",
  },
  {
    id: 5,
    name: "Burak Şahin",
    email: "burak@ervix.com",
    role: "Member",
    status: "Beklemede",
    createdAt: "05.03.2026",
    lastLogin: "Henüz giriş yapmadı",
  },
  {
    id: 6,
    name: "Merve Aksoy",
    email: "merve@ervix.com",
    role: "Admin",
    status: "Aktif",
    createdAt: "04.03.2026",
    lastLogin: "Bugün, 10:11",
  },
  {
    id: 7,
    name: "Can Özkan",
    email: "can@ervix.com",
    role: "Member",
    status: "Aktif",
    createdAt: "02.03.2026",
    lastLogin: "Dün, 18:54",
  },
  {
    id: 8,
    name: "Sena Koç",
    email: "sena@ervix.com",
    role: "Editor",
    status: "Beklemede",
    createdAt: "01.03.2026",
    lastLogin: "Henüz giriş yapmadı",
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function statusClasses(status: UserStatus) {
  if (status === "Aktif") {
    return "bg-emerald-50 text-emerald-600 border border-emerald-100"
  }
  if (status === "Pasif") {
    return "bg-rose-50 text-rose-600 border border-rose-100"
  }
  return "bg-amber-50 text-amber-600 border border-amber-100"
}

function roleClasses(role: UserRole) {
  if (role === "Admin") {
    return "bg-indigo-50 text-indigo-600 border border-indigo-100"
  }
  if (role === "Editor") {
    return "bg-violet-50 text-violet-600 border border-violet-100"
  }
  return "bg-slate-100 text-slate-600 border border-slate-200"
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("Tümü")
  const [statusFilter, setStatusFilter] = useState("Tümü")
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchesRole = roleFilter === "Tümü" || user.role === roleFilter
      const matchesStatus =
        statusFilter === "Tümü" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [search, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage])

  const totalUsers = allUsers.length
  const activeUsers = allUsers.filter((u) => u.status === "Aktif").length
  const newUsers = 12
  const adminUsers = allUsers.filter((u) => u.role === "Admin").length

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#A21CAF] p-6 text-white shadow-[0_20px_60px_rgba(99,102,241,0.24)] sm:p-8">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              Kullanıcı yönetimi
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl xl:text-4xl">
              Tüm kullanıcılarını tek yerden yönet
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Burada kullanıcıları görüntüleyebilir, filtreleyebilir, rollerini
              takip edebilir ve yönetim aksiyonlarını hızlıca uygulayabilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]">
              <Plus className="h-4 w-4" />
              Yeni Kullanıcı
            </button>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
              <Download className="h-4 w-4" />
              Dışa Aktar
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Toplam Kullanıcı",
            value: totalUsers.toString(),
            note: "Sistemde kayıtlı kullanıcı",
            icon: Users,
          },
          {
            title: "Aktif Kullanıcı",
            value: activeUsers.toString(),
            note: "Şu an aktif durumda",
            icon: UserCheck,
          },
          {
            title: "Yeni Kayıtlar",
            value: `+${newUsers}`,
            note: "Son 30 günde eklenen",
            icon: UserPlus,
          },
          {
            title: "Admin Hesapları",
            value: adminUsers.toString(),
            note: "Yetkili kullanıcılar",
            icon: Shield,
          },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.title}</p>
                  <h3 className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-slate-900">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500">{item.note}</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_10px_25px_rgba(99,102,241,0.28)]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* FILTER + TABLE */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
              Kullanıcı Listesi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Arama yap, filtrele ve kullanıcı detaylarını yönet
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="İsim veya e-posta ara..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 lg:w-[240px]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option>Tümü</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>Member</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
            >
              <option>Tümü</option>
              <option>Aktif</option>
              <option>Pasif</option>
              <option>Beklemede</option>
            </select>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="grid grid-cols-1 gap-4 xl:hidden">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                  {getInitials(user.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-500">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>

                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${roleClasses(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-xs text-slate-400">Kayıt Tarihi</p>
                      <p className="mt-1 font-medium text-slate-700">{user.createdAt}</p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-xs text-slate-400">Son Giriş</p>
                      <p className="mt-1 font-medium text-slate-700">{user.lastLogin}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      <Eye className="h-4 w-4" />
                      Gör
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      <Pencil className="h-4 w-4" />
                      Düzenle
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-[22px] border border-slate-200 xl:block">
          <div className="grid grid-cols-12 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <div className="col-span-4">Kullanıcı</div>
            <div className="col-span-2 text-center">Rol</div>
            <div className="col-span-2 text-center">Durum</div>
            <div className="col-span-2 text-center">Kayıt Tarihi</div>
            <div className="col-span-1 text-center">Son Giriş</div>
            <div className="col-span-1 text-right">İşlem</div>
          </div>

          <div className="divide-y divide-slate-200">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 items-center px-5 py-4 transition hover:bg-slate-50/80"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                    {getInitials(user.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{user.name}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="col-span-2 flex justify-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${roleClasses(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="col-span-2 text-center text-sm font-medium text-slate-700">
                  {user.createdAt}
                </div>

                <div className="col-span-1 text-center text-sm text-slate-500">
                  {user.lastLogin}
                </div>

                <div className="col-span-1 flex justify-end">
                  <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMPTY */}
        {paginatedUsers.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-slate-700">Kullanıcı bulunamadı</p>
            <p className="mt-2 text-sm text-slate-500">
              Arama veya filtre kriterlerini değiştirerek tekrar deneyebilirsin.
            </p>
          </div>
        )}

        {/* FOOT */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Toplam <span className="font-semibold text-slate-900">{filteredUsers.length}</span>{" "}
            kullanıcı listeleniyor
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Geri
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1
              const isActive = currentPage === page

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-[40px] rounded-xl px-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              İleri
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}