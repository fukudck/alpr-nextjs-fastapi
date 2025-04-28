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

import { Data, columns } from "./columns"
import { DataTable } from "./data-table"
import { format } from 'date-fns';
import { vi } from "date-fns/locale";

async function getData(): Promise<Data[]> {
  const res = await fetch("http://localhost:8000/api/blacklist_vehicles", {
    cache: "no-store",
  });
  const typeMap = {
    car: "Xe Hơi",
    motorcycle: "Xe Máy",
    bus: "Xe Bus",
    truck: "Xe Tải",
  } as const;
  const json = await res.json();
  return json.results.map((item: any) => ({
    stt: item.id.toString(),
    plate_number: item.plate_text,
    type: typeMap[item.vehicle_type as keyof typeof typeMap] || "Không xác định",
    reason: item.description,
    report_by: item.report_by,
    report_time: format(new Date(item.reported_at), "EEEE, dd MMMM yyyy, HH:mm:ss", { locale: vi }),
  }));
}

export default async function Page() {
  const data = await getData()
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
                  <BreadcrumbPage>Danh sách phương tiện vi phạm</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-0 md:grid-cols-1">
            
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={data} />
            </div>

          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
