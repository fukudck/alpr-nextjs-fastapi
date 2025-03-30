"use client";

import { useState, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function VideoOCRPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [plateNumber, setPlateNumber] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Chọn Video
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
      setPlateNumber(null); // Reset kết quả
      setProgress(0);
    }
  };

  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Nhận diện biển số từ video</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-10">
            {/* Khu vực xem Video */}
            <div className="col-span-7 bg-muted/50 p-4 rounded-xl flex flex-col items-center border-2 border-gray-200">
              <h3 className="text-lg font-semibold">Tải lên video:</h3>
              <Input type="file" accept="video/*" onChange={handleVideoUpload} className="mb-2" />

              {videoURL && (
                <video ref={videoRef} src={videoURL} controls className="rounded-lg w-full shadow-md mb-2" />
              )}

              {videoFile && (
                <>
                  <Button variant="outline" disabled={processing}>
                    {processing ? "Đang xử lý..." : "Nhận diện biển số"}
                  </Button>
                  <Progress value={progress} className="mt-2 w-full" />
                </>
              )}
            </div>

            {/* Kết quả nhận diện */}
            <div className="col-span-3 flex flex-col items-center bg-muted/50 p-4 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-semibold">Biển số nhận diện:</h3>
              <p className="text-2xl font-bold text-600">{plateNumber || "Chưa có dữ liệu"}</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
