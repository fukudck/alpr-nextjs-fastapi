"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { AlertCircle, ArrowUpDown, CheckCircle, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { is } from "date-fns/locale"




// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export type Plate = {
  vehicle_id: string;
  plate_number: string;
  confidence: number;
  vehicle_type: string;
  plate_image: string;
  is_blacklist: boolean;
};

export type GroupedPlate = {
  vehicle_id: string;
  plate_numbers: string[];
  confidences: number[];
  vehicle_type: string;
  plate_images: string[];
  is_blacklist: boolean;
  average_confidence: number;
  best_plate_number: string;
  plate_image: string;
  first_timestamp: string;
  plate_stats: plateStats[];
};
type plateStats = {
  plate_number: string;
  average_confidence: number;
  is_blacklist: boolean;
}
const typeMap: Record<string, string> = {
  car: "Xe Hơi",
  motorcycle: "Xe Máy",
  bus: "Xe Bus",
  truck: "Xe Tải",
};

export const columns: ColumnDef<GroupedPlate>[] = [
  {
    accessorKey: "stt",
    header: "Số thứ tự",
    cell: ({ row }) => {
      const stt = row.index + 1
      return <span>{stt}</span>
    },
  },
  {
    accessorKey: "vehicle_id",
    header: "ID",
  },
  {
    accessorKey: "vehicle_type",
    header: "Loại xe",
    cell: ({ row }) => {
      const vehicle_type = row.getValue("vehicle_type") as string;
      const display = typeMap[vehicle_type] || vehicle_type;
      return <span>{display}</span>;
    }
  },
  {
    accessorKey: "average_confidence",
    header: "Dộ chính xác",
    cell: ({ row }) => {
      const average_confidence = row.getValue("average_confidence") as number
      return <span>{(average_confidence * 100).toFixed(2)}%</span>
    },
  },
  {
    accessorKey: "best_plate_number",
    header: "Biển số",
    cell: ({ row }) => {
      const plateNumber = row.getValue("best_plate_number") as string
      const plateStats = row.original.plate_stats as plateStats[]
      // console.log(plateStats) 

      return (
        <HoverCard openDelay={0}>
          <HoverCardTrigger className="underline">{plateNumber}</HoverCardTrigger>
          <HoverCardContent style={{ width: '350px' }}>
            <Table>
              <TableCaption>Bảng chi tiết nhận dạng.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Biển số</TableHead>
                  <TableHead>Tỉ lệ</TableHead>
                  <TableHead>Đang vi phạm</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plateStats.map((plate, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{plate.plate_number}</TableCell>
                    <TableCell>{(plate.average_confidence * 100).toFixed(2)}%</TableCell>
                    <TableCell>{plate.is_blacklist ? (
                      <>
                        <AlertCircle className="text-red-500 w-4 h-4" />
                        <span className="text-red-500 font-medium">Có</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="text-green-500 w-4 h-4" />
                        <span className="text-green-600">Không</span>
                      </>
                    )}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>


          </HoverCardContent>
        </HoverCard>

      )
    }
  },
  {
    accessorKey: "first_timestamp",
    header: "Thời gian xuất hiện",
  },
  {
    accessorKey: "is_blacklist",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Đang vi phạm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const is_blacklist = row.getValue("is_blacklist") as boolean;
  
      return (
        <span className="flex items-center gap-2">
          {is_blacklist ? (
            <>
              <AlertCircle className="text-red-500 w-4 h-4" />
              <span className="text-red-500 font-medium">Có</span>
            </>
          ) : (
            <>
              <CheckCircle className="text-green-500 w-4 h-4" />
              <span className="text-green-600">Không</span>
            </>
          )}
        </span>
      );
    },
    
  },
  {
    accessorKey: "plate_image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const plate_image = row.getValue("plate_image") as string

      return (
        <Dialog>
          <DialogTrigger><Eye/></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xem ảnh</DialogTitle>
              <DialogDescription>
                <img src={plate_image} alt="Plate" className="w-full h-auto" />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


      )
    }
  },
]
