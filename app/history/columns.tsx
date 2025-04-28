"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { Button } from "@/components/ui/button"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export type History = {
  id: string
  type: string
  status: string
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
    cell: ({ row }) => {
      const type = row.getValue("type");

      if (type === "image") {
        return (
          <div>🖼️ Ảnh </div>
        );
      }
      if (type === "video") {
        return (
          <div>🎥 Video</div>
        );
      }
      return (
        <div>❔ Không xác định</div>
      );
    },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status")

        if (status === "processing") {
          return <span className="text-yellow-500">⏳ Đang xử lý</span>
        }

        if (status === "completed") {
          return <span className="text-green-500">✅ Hoàn thành</span>
        }
        return (
          <div className="flex items-center gap-2 text-gray-500">
            ❔ Không xác định
          </div>
        );
      },
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
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
        const id = row.getValue("id") as string;
        const url = `http://localhost:3000/results?uuid=${id}`;
   
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <a href={url}><DropdownMenuItem>Xem kết quả</DropdownMenuItem></a>
              <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="hover:!bg-red-500 hover:!text-white"
                  onSelect={(e) => e.preventDefault()}
                >
                  Xóa
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này sẽ không thể hoàn tác.
                    {id && <div className="mt-2 text-red-500">ID: {id}</div>}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    fetch(`http://localhost:8000/api/history/delete/${id}`, {
                      method: "DELETE",
                    }).then(() => {
                      window.location.reload()
                    })
                  }}>Tiếp tục
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
]
