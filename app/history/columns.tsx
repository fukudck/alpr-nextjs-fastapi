"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type History = {
  id: string
  type: string
  number_plate: string
  timestamp: string // ngày giờ nhận diện
  image_url: string // frame ảnh nhận diện
}

export const columns: ColumnDef<History>[] = [
    {
    accessorKey: "type",
    header: "Loại xe",
    },
    {
    accessorKey: "number_plate",
    header: "Biển số",
    },
    {
    accessorKey: "timestamp",
    header: "Thời gian",
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      const date = new Date(timestamp);
      return date.toLocaleString("vi-VN"); // Chuyển sang định dạng ngày giờ kiểu Việt Nam
    },
    },
    
]
