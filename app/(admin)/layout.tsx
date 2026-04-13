import type { ReactNode } from "react"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar />

      <div className="min-h-screen lg:pl-[280px]">
        <TopBar />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  )
}