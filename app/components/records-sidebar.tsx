"use client"
import { Button } from "@/components/ui/button"
import { ListViewRecords } from "./list-view-records"
import { TimelineViewRecords } from "./timeline-view-records"
import type { TravelRecord } from "../types"

interface RecordsSidebarProps {
  records: TravelRecord[]
  selectedRecord: TravelRecord | null
  onRecordSelect: (record: TravelRecord) => void
  onDeleteRecord: (id: string) => void
  onEditRecord: (record: TravelRecord) => void
  viewMode: "list" | "timeline"
  onViewModeChange: (mode: "list" | "timeline") => void
}

export function RecordsSidebar({
  records,
  selectedRecord,
  onRecordSelect,
  onDeleteRecord,
  onEditRecord,
  viewMode,
  onViewModeChange,
}: RecordsSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-bold mb-3">My Records</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="flex-1"
          >
            List
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("timeline")}
            className="flex-1"
          >
            Timeline
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {records.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">No travel records yet.</p>
            <p className="text-xs mt-1">Click on the map to add one!</p>
          </div>
        ) : viewMode === "list" ? (
          <ListViewRecords
            records={records}
            selectedRecord={selectedRecord}
            onRecordSelect={onRecordSelect}
            onDeleteRecord={onDeleteRecord}
            onEditRecord={onEditRecord}
          />
        ) : (
          <TimelineViewRecords
            records={records}
            selectedRecord={selectedRecord}
            onRecordSelect={onRecordSelect}
            onDeleteRecord={onDeleteRecord}
            onEditRecord={onEditRecord}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 bg-muted/30 text-xs text-muted-foreground">
        <p>
          {records.length} record{records.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  )
}
