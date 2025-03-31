"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type video_results = {
  id: string
  type: string
  number_plate: string
  score: number
}

export const columns: ColumnDef<video_results>[] = [
  {
    accessorKey: "oID",
    header: "ID",
  },
  {
    accessorKey: "type",
    header: "Loại xe",
  },
  {
    accessorKey: "number_plate",
    header: "Biển số",
  },
  {
    accessorKey: "score",
    header: "Tỉ lệ chính xác",
  },
  {
    accessorKey: "time",
    header: "Thời gian xuất hiện",
  },
  {
    accessorKey: "score",
    header: "Tỉ lệ chính xác",
  },
]
