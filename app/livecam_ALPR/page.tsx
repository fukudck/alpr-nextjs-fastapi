"use client";

import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VideoOCRPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [plateNumber, setPlateNumber] = useState<string | null>(null);

  //  Bật Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (error) {
      console.error("Lỗi khi bật camera:", error);
    }
  };

  //  Dừng Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      //  Chuyển ảnh thành file Blob để gửi lên API
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          // Gửi frame đến API nhận diện biển số
          const response = await fetch("/api/ocr-video", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          setPlateNumber(result.plate_number || "Không tìm thấy biển số");
        } catch (error) {
          console.error("Lỗi khi nhận diện biển số:", error);
        }
      }, "image/jpeg");
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
                  <BreadcrumbPage>Nhận diện biển số livecam</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-10">
            {/* Khung hiển thị video */}
            <div className="col-span-7 rounded-xl bg-muted/50 p-4 flex flex-col items-center border-2 border-gray-1">
							<h3 className="text-lg font-semibold">Camera:</h3>
              <video ref={videoRef} autoPlay playsInline className="rounded-xl w-full h-auto"></video>
              <canvas ref={canvasRef} className="hidden"></canvas>

              <div className="mt-4 flex gap-2">
                {streaming ? (
                  <Button variant="destructive" onClick={stopCamera}>Tắt Camera</Button>
                ) : (
                  <Button variant="default" onClick={startCamera}>Bật Camera</Button>
                )}
                <Button variant="outline" onClick={captureFrame}>Nhận diện biển số</Button>
              </div>
            </div>

            {/* Kết quả nhận diện */}
            <div className="col-span-3 flex flex-col items-center bg-muted/50 rounded-xl p-4 border-2 border-gray-1">
              <h3 className="text-lg font-semibold">Biển số nhận diện:</h3>
              <p className="text-2xl font-bold text-600">{plateNumber || "Chưa có dữ liệu"}</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
