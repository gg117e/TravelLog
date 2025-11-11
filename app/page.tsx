"use client"

import { useState, useCallback, useEffect } from "react"
import { MapContainer } from "./components/map-container"
import { RecordsSidebar } from "./components/records-sidebar"
import { AddRecordModal } from "./components/add-record-modal"
import { useLocalStorage } from "./hooks/use-local-storage"
import type { TravelRecord } from "./types"

export default function TravelLogApp() {
  const [records, setRecords] = useLocalStorage<TravelRecord[]>("travel-records", [])
  const [selectedRecord, setSelectedRecord] = useState<TravelRecord | null>(null)
  const [sidebarView, setSidebarView] = useState<"list" | "timeline">("list")
  const [isAddingModal, setIsAddingModal] = useState(false)
  const [isEditingModal, setIsEditingModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TravelRecord | null>(null)
  const [clickedLat, setClickedLat] = useState<number | null>(null)
  const [clickedLng, setClickedLng] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddRecord = useCallback(
    (record: TravelRecord) => {
      setRecords([...records, record])
      setIsAddingModal(false)
    },
    [records, setRecords],
  )

  const handleUpdateRecord = useCallback(
    (updatedRecord: TravelRecord) => {
      setRecords(records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)))
      setEditingRecord(null)
      setIsEditingModal(false)
    },
    [records, setRecords],
  )

  const handleDeleteRecord = useCallback(
    (id: string) => {
      setRecords(records.filter((r) => r.id !== id))
      setSelectedRecord(null)
    },
    [records, setRecords],
  )

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Main Map Area (70%) */}
      <div className="flex-1 flex flex-col">
        <MapContainer
          records={records}
          selectedRecord={selectedRecord}
          onRecordSelect={setSelectedRecord}
          onMapClick={(lat, lng) => {
            setClickedLat(lat)
            setClickedLng(lng)
            setIsAddingModal(true)
          }}
          onEditRecord={(record) => {
            setEditingRecord(record)
            setIsEditingModal(true)
          }}
        />
      </div>

      {/* Sidebar (30%) */}
      <div className="w-[30%] border-l border-border bg-card">
        <RecordsSidebar
          records={records}
          selectedRecord={selectedRecord}
          onRecordSelect={setSelectedRecord}
          onDeleteRecord={handleDeleteRecord}
          onEditRecord={(record) => {
            setEditingRecord(record)
            setIsEditingModal(true)
          }}
          viewMode={sidebarView}
          onViewModeChange={setSidebarView}
        />
      </div>

      {mounted && isAddingModal && clickedLat !== null && clickedLng !== null && (
        <AddRecordModal
          latitude={clickedLat}
          longitude={clickedLng}
          isOpen={isAddingModal}
          onClose={() => setIsAddingModal(false)}
          onSubmit={handleAddRecord}
        />
      )}

      {mounted && isEditingModal && editingRecord && (
        <AddRecordModal
          latitude={editingRecord.latitude}
          longitude={editingRecord.longitude}
          isOpen={isEditingModal}
          onClose={() => {
            setIsEditingModal(false)
            setEditingRecord(null)
          }}
          onSubmit={handleUpdateRecord}
          initialRecord={editingRecord}
        />
      )}
    </div>
  )
}
