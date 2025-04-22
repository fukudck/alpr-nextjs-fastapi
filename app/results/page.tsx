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


export default function Page() {
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
              <Table>
  <TableBody>
    <TableRow>
      <TableHead className="w-40">UUID</TableHead>
      <TableCell>eabf61cf-ad0d-4214-b1e2-f15b19154aac</TableCell>
    </TableRow>
    <TableRow>
      <TableHead>File Name</TableHead>
      <TableCell>eabf61cf-ad0d-4214-b1e2-f15b19154aac.mp4</TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Source</TableHead>
      <TableCell>/uploads/eabf61cf-ad0d-4214-b1e2-f15b19154aac/eabf61cf-ad0d-4214-b1e2-f15b19154aac.mp4</TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Status</TableHead>
      <TableCell>Completed</TableCell>
    </TableRow>
    <TableRow>
      <TableHead>Created At</TableHead>
      <TableCell>2025-04-22 10:30:00</TableCell>
    </TableRow>
  </TableBody>
</Table>

              </div>
            </div>

            <div className="col-span-6 aspect-video rounded-xl bg-muted/100">
              <MediaPlayer className="w-full h-full">
                <MediaPlayerVideo className="w-full h-full object-contain">
                  <source
                    src="/uploads/eabf61cf-ad0d-4214-b1e2-f15b19154aac/eabf61cf-ad0d-4214-b1e2-f15b19154aac.mp4"
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

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/100 md:min-h-min" />
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}
