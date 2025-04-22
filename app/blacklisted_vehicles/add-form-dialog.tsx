
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export function AddForm() {
    const plateRegex = /^([0-9]{2}[A-Z]{1,2}[0-9]?)-[0-9]{4,5}$/;
    
    const formSchema = z.object({
      plate_number: z
        .string()
        .toUpperCase()
        .regex(plateRegex, {
          message: "Biển số không đúng định dạng. VD: 50L1-12345 hoặc 29A-1234",
        }),
      vehicle_type: z.enum(["car", "motorbike", "bus", "truck"], {
        required_error: "Vui lòng chọn loại phương tiện",
      }),
      reason: z.string().min(1, "Vui lòng nhập lý do"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          plate_number: "",
          vehicle_type: "car",
          reason: "",
        },
      })
    
      // 2. Define a submit handler.
      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        console.log(values.plate_number)
        try {
          fetch("http://localhost:8000/api/blacklist_vehicles/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              plate_text: values.plate_number,
              vehicle_type: values.vehicle_type,
              description: values.reason,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              // ✅ Refresh lại trang sau khi gửi xong
              window.location.reload()
            })
        }
        catch (error) {
          console.error("Error:", error)
        }
      }
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-4"><Plus /> Thêm</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm phương tiện</DialogTitle>
              <DialogDescription>
                Thêm phương tiện vào danh sách đen.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="plate_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biển số</FormLabel>
                      <FormControl>
                        <Input placeholder="00AA-00000" {...field} />
                      </FormControl>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại phương tiện</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger >
                            <SelectValue placeholder="Chọn loại phương tiện" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="car">Xe Hơi</SelectItem>
                          <SelectItem value="motorbike">Xe Máy</SelectItem>
                          <SelectItem value="bus">Xe Bus</SelectItem>
                          <SelectItem value="truck">Xe Tải</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lý do</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập lý do" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )
}