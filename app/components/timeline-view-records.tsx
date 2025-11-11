"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TravelRecord } from "../types"

interface TimelineViewRecordsProps {
  records: TravelRecord[]
  selectedRecord: TravelRecord | null
  onRecordSelect: (record: TravelRecord) => void
  onDeleteRecord: (id: string) => void
  onEditRecord: (record: TravelRecord) => void
}

export function TimelineViewRecords({
  records,
  selectedRecord,
  onRecordSelect,
  onDeleteRecord,
  onEditRecord,
}: TimelineViewRecordsProps) {
  // Group records by year and month
  const groupedRecords = records.reduce(
    (acc, record) => {
      const date = new Date(record.visitDate)
      const year = date.getFullYear()
      const month = date.toLocaleDateString("en-US", { month: "long" })
      const key = `${year}-${month}`

      if (!acc[key]) {
        acc[key] = { year, month, records: [] }
      }

      acc[key].records.push(record)
      return acc
    },
    {} as Record<string, { year: number; month: string; records: TravelRecord[] }>,
  )

  // Sort by date descending
  const sortedGroups = Object.values(groupedRecords).sort((a, b) => {
    const dateA = new Date(`${a.month} 1, ${a.year}`)
    const dateB = new Date(`${b.month} 1, ${b.year}`)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="p-4 space-y-6">
      {sortedGroups.map((group) => (
        <div key={`${group.year}-${group.month}`} className="relative">
          {/* Timeline line and label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">
                {group.month} {group.year}
              </h3>
            </div>
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>

          {/* Records in this month */}
          <div className="space-y-2 ml-6 border-l-2 border-primary/30 pl-4 pb-4">
            {group.records.map((record) => (
              <div key={record.id} className="relative -ml-6 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                <Card
                  className={`flex-1 p-2 cursor-pointer transition-all border ${
                    selectedRecord?.id === record.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => onRecordSelect(record)}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-xs truncate flex-1">{record.location}</h4>
                      <div className="flex gap-1 ml-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-xs"
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
                          className="h-5 w-5 p-0 text-destructive hover:text-destructive text-xs"
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
                    <p className="text-xs text-muted-foreground line-clamp-2">{record.feelings}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
