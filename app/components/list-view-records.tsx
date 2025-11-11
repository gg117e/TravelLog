"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TravelRecord } from "../types"

interface ListViewRecordsProps {
  records: TravelRecord[]
  selectedRecord: TravelRecord | null
  onRecordSelect: (record: TravelRecord) => void
  onDeleteRecord: (id: string) => void
  onEditRecord: (record: TravelRecord) => void
}

export function ListViewRecords({
  records,
  selectedRecord,
  onRecordSelect,
  onDeleteRecord,
  onEditRecord,
}: ListViewRecordsProps) {
  const sortedRecords = [...records].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())

  return (
    <div className="p-4 space-y-3">
      {sortedRecords.map((record) => (
        <Card
          key={record.id}
          className={`p-3 cursor-pointer transition-all border ${
            selectedRecord?.id === record.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onClick={() => onRecordSelect(record)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm truncate flex-1">{record.location}</h3>
              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditRecord(record)
                  }}
                  title="Edit"
                >
                  ✎
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteRecord(record.id)
                  }}
                  title="Delete"
                >
                  ✕
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(record.visitDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-xs line-clamp-2 text-foreground/80">{record.feelings}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
