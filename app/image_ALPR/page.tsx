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

import { image_ocr, columns } from "./columns"
import { DataTable } from "./data-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

async function getData(): Promise<image_ocr[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      type: "Xe Máy",
      number_plate: "M1GG-4444A",
      score: 0.999,

    },
    // ...
  ]
}

export default  async function Page() {
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
                  <BreadcrumbPage>Nhận diện biển số bằng hình ảnh</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-10">
            <div className="col-span-7 rounded-xl" >
              <div className="container mx-auto py-10">
                
                <DataTable columns={columns} data={data} />
              </div>
            </div>
            
            <div className="justify-center flex col-span-3 rounded-xl bg-muted/50 py-10" >
              <div className=" w-full max-w-sm items-center gap-1.5 justify-center">
                <Input id="picture" type="file" />
                <Button>Button</Button>
              </div>
                
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/100 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
