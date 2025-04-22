"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type History = {
  id: string
  type: string
  status: string
  source_url: string
  process_time: number
  created_at: string
}

export const columns: ColumnDef<History>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
    accessorKey: "type",
    header: "Loại nhận diện",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
    },
    {
      accessorKey: "source_url",
      header: "URL nguồn",
    },
    {
      accessorKey: "process_time",
      header: "Thời gian xử lý (ms)",
    },
    {
      accessorKey: "created_at",
      header: "Thời gian tạo",
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
]
