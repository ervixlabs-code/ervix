"use client"

import { useState } from "react"
import Link from "next/link"

export default function CreateCTA() {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* FORM */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <input placeholder="Badge" onChange={(e)=>setForm({...form,badge:e.target.value})} className="input"/>
        <input placeholder="Title" onChange={(e)=>setForm({...form,title:e.target.value})} className="input"/>
        <textarea placeholder="Description" onChange={(e)=>setForm({...form,description:e.target.value})} className="input"/>

        <input placeholder="Primary Button Text" onChange={(e)=>setForm({...form,primaryText:e.target.value})} className="input"/>
        <input placeholder="Primary URL" onChange={(e)=>setForm({...form,primaryUrl:e.target.value})} className="input"/>

        <input placeholder="Secondary Button Text" onChange={(e)=>setForm({...form,secondaryText:e.target.value})} className="input"/>
        <input placeholder="Secondary URL" onChange={(e)=>setForm({...form,secondaryUrl:e.target.value})} className="input"/>

        <input placeholder="Background (gradient/css)" onChange={(e)=>setForm({...form,background:e.target.value})} className="input"/>

        <button className="bg-black text-white px-4 py-2 rounded-xl">
          Kaydet
        </button>
      </div>

      {/* PREVIEW */}
      <div
        className="rounded-xl p-10 text-white flex flex-col gap-4"
        style={{ background: form.background || "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)" }}
      >
        <p className="text-sm opacity-70">{form.badge || "Start Now"}</p>

        <h2 className="text-3xl font-bold">
          {form.title || "Projeni birlikte büyütelim 🚀"}
        </h2>

        <p className="opacity-80">
          {form.description || "CTA açıklaması burada görünecek"}
        </p>

        <div className="flex gap-3 mt-4">
          <button className="bg-white text-black px-4 py-2 rounded-lg">
            {form.primaryText || "Hemen Başla"}
          </button>

          <button className="border px-4 py-2 rounded-lg">
            {form.secondaryText || "Detaylı İncele"}
          </button>
        </div>
      </div>
    </div>
  )
}