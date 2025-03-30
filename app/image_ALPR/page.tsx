"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { image_ocr, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getData } from "@/lib/getData"; // Import hàm từ Server Component
import { set } from "react-hook-form";

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [data, setData] = useState<image_ocr[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    } else {
      setImage(null);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    setImage(URL.createObjectURL(file)); // Hiển thị ảnh đã tải lên
  }
  
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
                  <BreadcrumbPage>Nhận diện biển số bằng hình ảnh</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-10">
            {/* Bảng dữ liệu */}
            <div className="col-span-7 rounded-xl">
              <div className="container mx-auto py-10">
                <DataTable columns={columns} data={data} />
              </div>
            </div>

            {/* Form Upload */}
            <div className="justify-center flex col-span-3 rounded-xl bg-muted/50 py-10">
              <div className="w-full max-w-sm items-center gap-1.5 justify-center">
                <form onSubmit={handleSubmit} className="flex  flex-col">
                  <div className="grid gap-4 py-2">
                    <Input
                      type="file" id="file" name="file" accept=".jpg, .jpeg, .png"className="w-full" onChange={handleFileChange}
                    />

                    {/* Hiển thị ảnh upload */}
                    {image && (
                      <div className="flex justify-center">
                        <img src={image} alt="Ảnh đã tải lên" className="rounded-lg max-w-50% h-auto" />
                      </div>
                    )}

                    <Button className="w-full" variant="default">
                      Nhận diện biển số
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
