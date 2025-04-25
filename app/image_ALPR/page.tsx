"use client";

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


import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

const formSchema = z.object({
  files: z
    .array(z.custom<File>())
    .length(1, "You must upload at least 1 file")
    .refine((files) => files.every((file) => file.size <= 500 * 1024 * 1024), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
});
 

type FormValues = z.infer<typeof formSchema>;


export default function Page() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = React.useCallback((data: FormValues) => {
    const formData = new FormData();
    
    // Kiểm tra xem có file nào trong data.files không
    if (data.files && data.files.length > 0) {
      formData.append("file", data.files[0]);  // Lấy file đầu tiên từ mảng files
    }
    
    fetch(`http://localhost:8000/api/image_LPR`, {
      method: "POST",
      body: formData,
      headers: {
        // Content-Type không cần thiết, FormData sẽ tự động thiết lập header đúng
      },
      cache: "no-store",
    })
    .then(response => response.json())
    .then(result => {
      // Xử lý kết quả từ API
      console.log(result.uuid);
      window.location.href = `/results?uuid=${result.uuid}`; // Chuyển hướng đến trang kết quả với UUID
    })
    .catch(error => {
      // Xử lý lỗi
      console.error("Error:", error);
    });
  }, []);
  
  
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
                  <BreadcrumbPage>Nhận dạng phương tiện vi phạm - Hình ảnh</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 justify-center  items-center">
          
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onValueChange={field.onChange}
                        accept="image/*"
                        
                        maxFiles={1}
                        maxSize={500 * 1024 * 1024}
                        onFileReject={(_, message) => {
                          form.setError("files", {
                            message,
                          });
                        }}
                        
                      >
                        <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 ">
                          <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">Kéo và thả tệp tin vào đây</p>
                          <p className="text-muted-foreground text-xs">
                            Hoặc nhấp để chọn tệp tin từ thiết bị của bạn
                          </p>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button variant="outline" size="sm" className="mt-2 w-fit">
                            <CloudUpload className="size-4 mr-2" /> Chọn tệp tin
                          </Button>
                        </FileUploadTrigger>
                      </FileUploadDropzone>
                        <FileUploadList>
                          {field.value.map((file, index) => (
                            <FileUploadItem key={index} value={file}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7"
                                >
                                  <X />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUpload>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center mt-4">
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
