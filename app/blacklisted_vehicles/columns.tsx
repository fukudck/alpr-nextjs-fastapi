"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { MoreHorizontal, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Data = {
  stt: string
  plate_number: string
  type: string
  reason: string
  report_by: string
  report_time : Date
}   

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "stt",
    header: "ID",
  },
  {
    accessorKey: "plate_number",
    header: "Biển số",
  },
  {
    accessorKey: "type",
    header: "Loại phương tiện",
  },
  {
    accessorKey: "reason",
    header: "Lý do",
  },
  {
    accessorKey: "report_by",
    header: "Báo cáo bởi",
  },
  {
    accessorKey: "report_time",
    header: "Thời gian báo cáo",
  },
  {
    id: "actions",
    
    cell: ({ row }) => {
      const data = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(data.stt)}
            >
              <Pencil/> Sửa
            </DropdownMenuItem> */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash/>Xóa
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này sẽ không thể hoàn tác.
                    {data.stt && <div className="mt-2 text-red-500">ID: {data.stt}</div>}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    fetch(`http://localhost:8000/api/blacklist_vehicles/delete/${data.stt}`, {
                      method: "DELETE",
                    }).then(() => {
                      window.location.reload()
                    })
                  }}>Tiếp tục
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
