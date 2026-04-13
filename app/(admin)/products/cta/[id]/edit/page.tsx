"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CTA_ENDPOINT = `${API_BASE}/products/cta`

export default function EditCTA() {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function fetchCTA() {
    try {
      const res = await fetch(`${CTA_ENDPOINT}/${id}`, {
        cache: "no-store",
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA getirilemedi")
      }

      const data = await res.json()

      setForm({
        badge: data.badge || "",
        title: data.title || "",
        description: data.description || "",
        primaryText: data.primaryText || "",
        primaryUrl: data.primaryUrl || "",
        secondaryText: data.secondaryText || "",
        secondaryUrl: data.secondaryUrl || "",
        background:
          data.background ||
          "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
        status: data.status === "ACTIVE" ? "Aktif" : "Pasif",
        sortOrder: data.sortOrder || 1,
      })
    } catch (error) {
      console.error("Fetch CTA error:", error)
      alert("CTA yüklenirken hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCTA()
  }, [id])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...form,
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder),
      }

      const res = await fetch(`${CTA_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA güncellenemedi")
      }

      router.push("/homepage/cta")
    } catch (error) {
      console.error("Update CTA error:", error)
      alert("CTA güncellenirken hata oluştu")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <p className="font-semibold">Yükleniyor...</p>
      </div>
    )
  }

  if (!form) return null

  return (
    <form onSubmit={handleUpdate} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* FORM */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <input
          value={form.badge}
          onChange={(e)=>setForm({...form,badge:e.target.value})}
          className="input"
        />

        <input
          value={form.title}
          onChange={(e)=>setForm({...form,title:e.target.value})}
          className="input"
        />

        <textarea
          value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})}
          className="input"
        />

        <input
          value={form.primaryText}
          onChange={(e)=>setForm({...form,primaryText:e.target.value})}
          className="input"
        />

        <input
          value={form.primaryUrl}
          onChange={(e)=>setForm({...form,primaryUrl:e.target.value})}
          className="input"
        />

        <input
          value={form.secondaryText}
          onChange={(e)=>setForm({...form,secondaryText:e.target.value})}
          className="input"
        />

        <input
          value={form.secondaryUrl}
          onChange={(e)=>setForm({...form,secondaryUrl:e.target.value})}
          className="input"
        />

        <input
          value={form.background}
          onChange={(e)=>setForm({...form,background:e.target.value})}
          className="input"
        />

        <select
          value={form.status}
          onChange={(e)=>setForm({...form,status:e.target.value})}
          className="input"
        >
          <option>Aktif</option>
          <option>Pasif</option>
        </select>

        <input
          type="number"
          value={form.sortOrder}
          onChange={(e)=>setForm({...form,sortOrder:Number(e.target.value)})}
          className="input"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-4 py-2 rounded-xl w-full"
        >
          {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
        </button>
      </div>

      {/* PREVIEW */}
      <div
        className="rounded-xl p-10 text-white flex flex-col gap-4"
        style={{ background: form.background }}
      >
        <p className="opacity-70">{form.badge}</p>

        <h2 className="text-3xl font-bold">{form.title}</h2>

        <p className="opacity-80">{form.description}</p>

        <div className="flex gap-3 mt-4">
          <button type="button" className="bg-white text-black px-4 py-2 rounded-lg">
            {form.primaryText}
          </button>

          <button type="button" className="border px-4 py-2 rounded-lg">
            {form.secondaryText}
          </button>
        </div>
      </div>
    </form>
  )
}