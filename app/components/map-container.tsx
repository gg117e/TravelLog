"use client"

import { useEffect, useRef, useState } from "react"
import type { TravelRecord } from "../types"

interface MapContainerProps {
  records: TravelRecord[]
  selectedRecord: TravelRecord | null
  onRecordSelect: (record: TravelRecord | null) => void
  onMapClick: (lat: number, lng: number) => void
  onEditRecord: (record: TravelRecord) => void
}

declare global {
  interface Window {
    L?: any
  }
}

export function MapContainer({ records, selectedRecord, onRecordSelect, onMapClick, onEditRecord }: MapContainerProps) {
  const mapRef = useRef<any>(null)
  const markersRef = useRef<{ [key: string]: any }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [error, setError] = useState<string>("")
  const popupRef = useRef<any>(null)

  // Initialize Leaflet and map
  useEffect(() => {
    if (typeof window === "undefined") return
    if (mapInitialized) return

    const container = containerRef.current
    if (!container) return

    let attemptsCount = 0
    const maxAttempts = 20

    const loadLeafletAndInitialize = () => {
      attemptsCount++

      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        document.head.appendChild(link)
      }

      if (!window.L) {
        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
          script.async = true
          script.onerror = () => {
            setError("Failed to load Leaflet library")
          }
          document.head.appendChild(script)
        }

        if (attemptsCount < maxAttempts) {
          setTimeout(loadLeafletAndInitialize, 200)
        } else {
          setError("Could not load Leaflet after multiple attempts")
        }
        return
      }

      try {
        const L = window.L

        if (container._leaflet_id) {
          return
        }

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        const map = L.map(container).setView([20, 100], 3)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        mapRef.current = map
        setMapInitialized(true)

        // Handle map clicks
        map.on("click", (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng)
        })
      } catch (error) {
        console.error("[v0] Error initializing map:", error)
        setError(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    loadLeafletAndInitialize()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Add/update markers
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return

    const L = window.L
    if (!L) return

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => {
      mapRef.current?.removeLayer(marker)
    })
    markersRef.current = {}

    // Add new markers
    records.forEach((record) => {
      const markerColor = record.id === selectedRecord?.id ? "#ef4444" : "#3b82f6"

      const marker = L.circleMarker([record.latitude, record.longitude], {
        radius: record.id === selectedRecord?.id ? 8 : 6,
        fillColor: markerColor,
        color: markerColor,
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(mapRef.current)
        .on("click", () => {
          onRecordSelect(record)
          showRecordPopup(record, marker)
        })

      markersRef.current[record.id] = marker
    })
  }, [records, selectedRecord, onRecordSelect, mapInitialized])

  const showRecordPopup = (record: TravelRecord, marker: any) => {
    const L = window.L
    if (!L || !mapRef.current) return

    if (popupRef.current) {
      mapRef.current.closePopup(popupRef.current)
    }

    const popup = L.popup({
      offset: L.point(0, -10),
      closeButton: true,
      maxWidth: 300,
    })
      .setLatLng([record.latitude, record.longitude])
      .setContent(`
        <div style="padding: 12px; font-family: sans-serif;">
          <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${record.location}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${new Date(record.visitDate).toLocaleDateString()}</p>
          <p style="font-size: 12px; margin-bottom: 12px; max-height: 96px; overflow-y: auto;">${record.feelings}</p>
          <div style="display: flex; gap: 8px;">
            <button id="popup-edit" style="font-size: 12px; background-color: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; border: none; cursor: pointer;">Edit</button>
            <button id="popup-delete" style="font-size: 12px; background-color: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; border: none; cursor: pointer;">Delete</button>
          </div>
        </div>
      `)
      .openOn(mapRef.current)

    popupRef.current = popup

    setTimeout(() => {
      const editBtn = document.getElementById("popup-edit")
      const deleteBtn = document.getElementById("popup-delete")

      if (editBtn) {
        editBtn.addEventListener("click", () => {
          onEditRecord(record)
          mapRef.current?.closePopup(popup)
        })
      }

      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          mapRef.current?.closePopup(popup)
        })
      }
    }, 0)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <h1 className="text-2xl font-bold">Travel Log</h1>
        <p className="text-sm text-muted-foreground mt-1">Click on the map to add a travel record</p>
      </div>

      {/* Map */}
      {error ? (
        <div className="flex-1 flex items-center justify-center bg-destructive/10">
          <div className="text-center">
            <p className="text-destructive font-semibold">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Please refresh the page and try again</p>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="flex-1" style={{ minHeight: 0 }} />
      )}
    </div>
  )
}
