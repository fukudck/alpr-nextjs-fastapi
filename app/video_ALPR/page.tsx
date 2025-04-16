"use client"; // Thêm dòng này để biến component thành Client Component

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { video_results, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getData } from "@/lib/getData";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];



export default function Page() {
  const [data, setData] = useState<video_results[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [task_id, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!task_id) return;
  
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/task-status/${task_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error("Lỗi khi kiểm tra trạng thái task");
  
        const result = await response.json();
  
        // Nếu kết quả đã sẵn sàng (ví dụ: status là 'completed' hoặc có results)
        if (result.results && result.results.length > 0) {
          clearInterval(interval);
          setLoading(false);
  
          const allPlates = result.results.flatMap((item: any, index: number) =>
            item.plates.map((plate: any) => ({
              id: `${index}-${plate.vehicle_id}`,
              type: plate.vehicle_type || "Không xác định",
              number_plate: plate.text,
              score: parseFloat((plate.confidence * 100).toFixed(2)),
              time: item.timestamp,
            }))
          );
  
          const validPlates = allPlates.filter((plate) => plate.number_plate !== -1);
  
          // Tùy: lọc biển số xuất hiện nhiều nhất hoặc hiển thị hết
          setData(validPlates);
        }
      } catch (err) {
        console.error("Lỗi polling kết quả:", err);
        clearInterval(interval);
      }
    }, 10000); // Kiểm tra mỗi 10 giây
  
    // Dọn dẹp interval nếu component unmount
    return () => clearInterval(interval);
  }, [task_id]);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Vui lòng chọn một file video!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/video_LPR", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload thất bại!");
      }

      const result = await response.json();
      if(result.task_id){
        setTaskId(result.task_id); // Lưu UUID để gọi GET API
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("task_id", task_id);
  console.log(data);
  
  
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
                  <BreadcrumbPage>Nhận diện biển số bằng video</BreadcrumbPage>
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
              {loading ? (
                <p className="text-gray-500">Đang xử lý video, vui lòng chờ...</p>
              ) : (
                <DataTable columns={columns} data={data} />
              )}
              </div>
            </div>

            {/* Form Upload */}
            <div className="justify-center flex col-span-3 rounded-xl bg-muted/70 py-10">
              <div className="w-full max-w-sm items-center gap-1.5 justify-center">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-2">
                    <Input
                      type="file"
                      id="file"
                      name="file"
                      accept=".mkv, .mp4, .flv"
                      className="w-full"
                      onChange={handleFileChange}
                    />
                    <Label>Cài đặt</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {value
                            ? frameworks.find((framework) => framework.value === value)?.label
                            : "Select framework..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  {framework.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      value === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <Button className="w-full" variant="default" type="submit" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Nhận diện biển số"}
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
