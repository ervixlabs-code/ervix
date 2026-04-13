"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function normalizeApiBase(raw?: string) {
  const base = (raw || "").trim().replace(/\/+$/, "")
  if (!base) return ""
  return base.endsWith("/api") ? base : `${base}/api`
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
const API_BASE = normalizeApiBase(RAW_BASE)
const CTA_ENDPOINT = `${API_BASE}/products/cta`

export default function CreateCTA() {
  const router = useRouter()

  const [form, setForm] = useState({
    badge: "",
    title: "",
    description: "",
    primaryText: "",
    primaryUrl: "",
    secondaryText: "",
    secondaryUrl: "",
    background: "",
    status: "Aktif",
    sortOrder: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...form,
        status: form.status === "Aktif" ? "ACTIVE" : "PASSIVE",
        sortOrder: Number(form.sortOrder),
      }

      const res = await fetch(CTA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "CTA kaydı oluşturulamadı.")
      }

      router.push("/homepage/cta")
    } catch (error) {
      console.error("Create CTA error:", error)
      alert("CTA kaydı oluşturulurken hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* FORM */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <input
          placeholder="Badge"
          onChange={(e)=>setForm({...form,badge:e.target.value})}
          className="input"
        />

        <input
          placeholder="Title"
          onChange={(e)=>setForm({...form,title:e.target.value})}
          className="input"
        />

        <textarea
          placeholder="Description"
          onChange={(e)=>setForm({...form,description:e.target.value})}
          className="input"
        />

        <input
          placeholder="Primary Button Text"
          onChange={(e)=>setForm({...form,primaryText:e.target.value})}
          className="input"
        />

        <input
          placeholder="Primary URL"
          onChange={(e)=>setForm({...form,primaryUrl:e.target.value})}
          className="input"
        />

        <input
          placeholder="Secondary Button Text"
          onChange={(e)=>setForm({...form,secondaryText:e.target.value})}
          className="input"
        />

        <input
          placeholder="Secondary URL"
          onChange={(e)=>setForm({...form,secondaryUrl:e.target.value})}
          className="input"
        />

        <input
          placeholder="Background (gradient/css)"
          onChange={(e)=>setForm({...form,background:e.target.value})}
          className="input"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-4 py-2 rounded-xl w-full"
        >
          {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* PREVIEW */}
      <div
        className="rounded-xl p-10 text-white flex flex-col gap-4"
        style={{
          background:
            form.background ||
            "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
        }}
      >
        <p className="text-sm opacity-70">{form.badge || "Start Now"}</p>

        <h2 className="text-3xl font-bold">
          {form.title || "Projeni birlikte büyütelim 🚀"}
        </h2>

        <p className="opacity-80">
          {form.description || "CTA açıklaması burada görünecek"}
        </p>

        <div className="flex gap-3 mt-4">
          <button type="button" className="bg-white text-black px-4 py-2 rounded-lg">
            {form.primaryText || "Hemen Başla"}
          </button>

          <button type="button" className="border px-4 py-2 rounded-lg">
            {form.secondaryText || "Detaylı İncele"}
          </button>
        </div>
      </div>
    </form>
  )
}