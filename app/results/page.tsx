import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  MediaPlayer,
  MediaPlayerControls,
  MediaPlayerFullscreen,
  MediaPlayerOverlay,
  MediaPlayerPiP,
  MediaPlayerPlay,
  MediaPlayerPlaybackSpeed,
  MediaPlayerSeek,
  MediaPlayerSeekBackward,
  MediaPlayerSeekForward,
  MediaPlayerTime,
  MediaPlayerVideo,
  MediaPlayerVolume,
} from "@/components/ui/media-player";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { columns, Plate, GroupedPlate } from "./columns"
import { DataTable } from "./data-table"
import { be, is, se } from "date-fns/locale";
import { CheckCircle2Icon, Link, Loader } from "lucide-react";

import { redirect } from 'next/navigation'

type rawData = {
  uuid: string;
  type: string;
  status: string;
  process_time: string;
  source_url: string;
  results: {
    timestamp: string;
    plates: Plate[];
  }[];
};




function groupPlatesByVehicleId(plates: Plate[], raw: rawData): GroupedPlate[] {
  const grouped: Record<string, GroupedPlate & {
    _confidenceMap: { plate: string; confidence: number; is_blacklist: boolean }[]
  }> = {};

  plates.forEach((plate) => {
    if (
      plate.plate_number.toString() === "-1" ||
      plate.confidence === -1
    ) {
      return;
    }

    const id = plate.vehicle_id;
    if (!grouped[id]) {
      grouped[id] = {
        vehicle_id: id,
        plate_numbers: [],
        confidences: [],
        vehicle_type: plate.vehicle_type,
        plate_images: [],
        is_blacklist: plate.is_blacklist,
        average_confidence: 0,
        best_plate_number: "",
        plate_image: plate.plate_image,
        first_timestamp: raw.results[0].timestamp,
        _confidenceMap: [],
        plate_stats: [],
      };
    }

    grouped[id].plate_numbers.push(plate.plate_number);
    grouped[id].confidences.push(plate.confidence);
    grouped[id].plate_images.push(plate.plate_image);
    grouped[id]._confidenceMap.push({ plate: plate.plate_number, confidence: plate.confidence, is_blacklist: plate.is_blacklist });
  });

  return Object.values(grouped).map(group => {
    const total = group.confidences.reduce((sum, c) => sum + c, 0);

    // Tìm first_timestamp từ raw.results
    const timestamps = raw.results
    .filter(r => r.plates.some(p => p.vehicle_id === group.vehicle_id && p.confidence !== -1 && p.plate_number !== "-1"))
    .map(r => r.timestamp);

    const first_timestamp = timestamps.sort()[0] ?? null;
    // Tính trung bình confidence theo từng plate_number
    const plateGroups: Record<string, { confidences: number[]; is_blacklist: boolean }> = {};

    group._confidenceMap.forEach(({ plate, confidence, is_blacklist }) => {
      if (!plateGroups[plate]) {
        plateGroups[plate] = {
          confidences: [],
          is_blacklist: is_blacklist, // lấy theo lần đầu gặp
        };
      }
      plateGroups[plate].confidences.push(confidence);

      // Nếu bạn muốn cập nhật is_blacklist bất kỳ khi nào gặp true
      if (is_blacklist) {
        plateGroups[plate].is_blacklist = true;
      }
    });

    const plate_stats = Object.entries(plateGroups).map(
      ([plate_number, { confidences, is_blacklist }]) => ({
        plate_number,
        average_confidence:
          confidences.reduce((sum, c) => sum + c, 0) / confidences.length,
        is_blacklist: is_blacklist ? 1 : 0,
      })
    );
    

    const bestPlate = plate_stats.reduce((best, current) =>
      current.average_confidence > best.average_confidence ? current : best
    , { plate_number: "", average_confidence: -1 });
    const is_blacklist = plate_stats.find(p => p.plate_number == bestPlate.plate_number)?.is_blacklist ?? 0;

    // console.log(bestPlate1);
    // console.log("Plate Stats:", plate_stats);
    return {
      ...group,
      average_confidence: bestPlate.average_confidence,
      best_plate_number: bestPlate.plate_number,
      first_timestamp,
      plate_stats,
      is_blacklist: is_blacklist,
    };
  });
}




async function getData(uuid: string): Promise<rawData> {
  const res = await fetch(`http://localhost:8000/task-status/${uuid}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    // Redirect to a different page when a 404 is encountered
    redirect('/not-found')
  }
  const json = await res.json();
  // Assuming `json` is the entire response object as per your example
  return {
    uuid: json.uuid,
    type: json.type,
    status: json.status,
    process_time: json.process_time,
    source_url: json.source_url,
    results: json.results.map((result: any) => ({
      timestamp: result.timestamp,
      plates: result.plates.map((plate: any) => ({
        vehicle_id: plate.vehicle_id,
        plate_number: plate.text,
        confidence: plate.confidence,
        vehicle_type: plate.vehicle_type,
        plate_image: plate.plate_image,
        is_blacklist: plate.is_blacklisted // Correcting for boolean value
      })),
    })),
  };
}




export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ uuid: string  }>
}) {
  const uuid = (await searchParams).uuid as string;
  
  
  const data = await getData(  uuid);
  const plates: Plate[] = data.results.flatMap(result => result.plates);

  const groupedPlates = groupPlatesByVehicleId(plates, data);
  
  //console.log("Grouped Plates:", groupedPlates);
  
  
  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                
                  
                <BreadcrumbItem>
                  <BreadcrumbPage>Kết quả</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-10">
            <div className="col-span-4 aspect-video rounded-xl bg-muted/0">
              <div className="flex flex-col gap-6">
                <Table className="border-separate border-spacing-y-2">
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-40">UUID</TableHead>
                      <TableCell>{data.uuid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Loại</TableHead>
                      <TableCell>{data.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Nguồn</TableHead>
                      <TableCell><a href={data.source_url}><Link/></a></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Trạng thái xử lý</TableHead>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {data.status === "processing" ? (
                            <>
                              <Loader className="animate-spin text-yellow-500 w-4 h-4" />
                              <span className="text-yellow-600">Đang xử lý</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                              <span className="text-green-600">Hoàn tất</span>
                            </>
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Thời gian xử lý</TableHead>
                      <TableCell>{data.process_time}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

              </div>
            </div>

            <div className="col-span-6 aspect-video rounded-xl bg-muted/100">
              <MediaPlayer className="w-full h-full">
                <MediaPlayerVideo className="w-full h-full object-contain">
                  <source
                    src={`/task_results/${data.uuid}/${data.uuid}.mp4`}
                    type="video/mp4"
                  />
                </MediaPlayerVideo>

                <MediaPlayerControls className="flex-col items-start gap-2.5">
                  <MediaPlayerOverlay />
                  <MediaPlayerSeek />
                  <div className="flex w-full items-center gap-2">
                    <div className="flex flex-1 items-center gap-2">
                      <MediaPlayerPlay />
                      <MediaPlayerSeekBackward />
                      <MediaPlayerSeekForward />
                      <MediaPlayerVolume expandable />
                      <MediaPlayerTime />
                    </div>
                    <div className="flex items-center gap-2">
                      <MediaPlayerPlaybackSpeed />
                      <MediaPlayerPiP />
                      <MediaPlayerFullscreen />
                    </div>
                  </div>
                </MediaPlayerControls>
              </MediaPlayer>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-neutral-100 md:min-h-min">
            <div className="container mx-auto py-1 px-4">
              <DataTable columns={columns} data={groupedPlates} />
            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
