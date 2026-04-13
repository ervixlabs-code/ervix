"use client"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-8 border-t border-slate-200 bg-white/70 backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium text-slate-600">
          © {year} Ervix Admin. Tüm hakları saklıdır.
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
            Version 1.0.0
          </span>
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-600">
            Premium Admin Panel
          </span>
        </div>
      </div>
    </footer>
  )
}