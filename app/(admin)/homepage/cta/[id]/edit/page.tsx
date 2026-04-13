"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function EditCTA() {
  const { id } = useParams()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    // mock data
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      badge: "Start Now",
      title: "Projeni birlikte büyütelim 🚀",
      description: "Ervix ile fark yarat",
      primaryText: "Başla",
      secondaryText: "İncele",
      background: "linear-gradient(135deg,#4F46E5,#7C3AED,#A21CAF)",
    })
  }, [])

  if (!form) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <input value={form.badge} onChange={(e)=>setForm({...form,badge:e.target.value})} className="input"/>
        <input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} className="input"/>
        <textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} className="input"/>

        <button className="bg-black text-white px-4 py-2 rounded-xl">
          Güncelle
        </button>
      </div>

      <div
        className="rounded-xl p-10 text-white"
        style={{ background: form.background }}
      >
        <p>{form.badge}</p>
        <h2 className="text-3xl font-bold">{form.title}</h2>
        <p>{form.description}</p>
      </div>
    </div>
  )
}