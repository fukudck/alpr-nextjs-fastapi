"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type image_ocr = {
  id: string
  type: string
  number_plate: string
  score: number
}

export const columns: ColumnDef<image_ocr>[] = [
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
]
