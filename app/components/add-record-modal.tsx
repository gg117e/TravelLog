"use client"

import type React from "react"

import { useState, useEffect, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { TravelRecord } from "../types"

interface AddRecordModalProps {
  latitude: number
  longitude: number
  isOpen: boolean
  onClose: () => void
  onSubmit: (record: TravelRecord) => void
  initialRecord?: TravelRecord
}

export function AddRecordModal({ latitude, longitude, isOpen, onClose, onSubmit, initialRecord }: AddRecordModalProps) {
  const [location, setLocation] = useState("")
  const [visitDate, setVisitDate] = useState("")
  const [feelings, setFeelings] = useState("")
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (initialRecord) {
      setLocation(initialRecord.location)
      setVisitDate(initialRecord.visitDate)
      setFeelings(initialRecord.feelings)
    } else {
      setLocation("")
      setVisitDate(new Date().toISOString().split("T")[0])
      setFeelings("")
    }
  }, [initialRecord, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!location.trim() || !visitDate || !feelings.trim()) {
      alert("Please fill in all fields")
      return
    }

    const record: TravelRecord = {
      id: initialRecord?.id || `record-${Date.now()}`,
      location,
      latitude,
      longitude,
      visitDate,
      feelings,
      createdAt: initialRecord?.createdAt || new Date().toISOString(),
    }

    onSubmit(record)
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Card
        className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-gray-300 shadow-2xl rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialRecord ? "Edit Travel Record" : "Add Travel Record"}
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Tokyo, Japan"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Visit Date</label>
            <Input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Feelings & Impressions</label>
            <Textarea
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
              placeholder="Share your thoughts and memories..."
              rows={4}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {initialRecord ? "Update" : "Add"} Record
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body,
  )
}
