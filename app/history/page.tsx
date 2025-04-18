"use client"

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { History, columns } from "./columns";
import { DataTable } from "./data-table";
import { getData } from "@/lib/historydata"; // Import hàm từ Server Component



export default function Page() {
    const [data, setData] = useState<History[]>([]);
  
    useEffect(() => {
      async function fetchData() {
        const result = await getData();
        setData(result);
      }
      fetchData();
    }, []);
    return (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Lịch sử nhận diện</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
    
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              
                {/* Bảng dữ liệu */}
                <div className="rounded-xl">
                  <div className="container mx-auto py-10">
                    <DataTable columns={columns} data={data} />
                  </div>
                </div>
              
            </div>
          </SidebarInset>
        </SidebarProvider>
      );
    }