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

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [data, setData] = useState<image_ocr[]>([]); // Lưu dữ liệu hiển thị bảng
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Lưu danh sách ảnh nhận diện

  useEffect(() => {
    if (!taskId) return;
  
    async function fetchRecognitionData() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/task-status/${taskId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
    
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");
    
        const result = await response.json();
    
        const newData: image_ocr[] = result.results.flatMap((item: any, index: number) =>
          item.plates
            .filter((plate: any) => plate.text !== -1)
            .map((plate: any) => ({
              id: `${index}-${plate.vehicle_id}`,
              type: plate.vehicle_type || "Không xác định",
              number_plate: plate.text,
              score: parseFloat((plate.confidence * 100).toFixed(2)),
            }))
        );
    
        setData(newData);
      } catch (error) {
        console.error("Lỗi khi lấy kết quả nhận diện:", error);
      }
    }
  
    fetchRecognitionData();
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;
  
    async function fetchRecognitionData() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/task-image/${taskId}`);
        if (!response.ok) throw new Error("Lỗi khi lấy ảnh");
        const result = await response.json() as { images: string[] };;
        const cleanedUrls = result.images.map((urls) => urls.replace(/^public\//, ""));
        setImageUrls(cleanedUrls);
      } catch (error) {
        console.error("Lỗi khi tải ảnh biển số:", error);
      }
    }
  
    fetchRecognitionData();
  }, [taskId]);


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

    if (!file) {
      alert("Vui lòng chọn một ảnh");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/image_LPR", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload thất bại");

      const result = await response.json();
      if (result.uuid) {
        setTaskId(result.uuid); // Lưu UUID để gọi GET API
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };
  
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
            <div className="justify-center flex col-span-3 rounded-xl bg-muted/70 py-10">
              <div className="w-full max-w-sm items-center gap-1.5 justify-center">
                <form onSubmit={handleSubmit} className="flex flex-col">
                  <div className="grid gap-4 py-2">
                    <Input
                      type="file"
                      id="file"
                      name="file"
                      accept=".jpg, .jpeg, .png"
                      className="w-full"
                      onChange={handleFileChange}
                    />

                    {/* Hiển thị ảnh upload */}
                    {image && (
                      <div className="flex justify-center">
                        <img src={image} alt="Ảnh đã tải lên" className="rounded-lg max-w-[250px] h-auto" />
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
          <div className="col-span-3 rounded-xl bg-muted/70 py-10">
                  <h2 className="text-center font-semibold">Ảnh biển số nhận diện</h2>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={`../../${url}`} // Nối chuỗi tại đây
                        alt={`Detected plate ${index}`}
                        className="rounded-lg max-w-[200px] h-auto"
                      />
                    ))}
                  </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}