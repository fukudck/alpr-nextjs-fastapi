import { image_ocr } from "@/app/image_ALPR/columns";

export async function getData(): Promise<image_ocr[]> {
  return [
    {
      id: "728ed52f",
      type: "Xe Máy",
      number_plate: "M1GG-4444A",
      score: 0.999,
    },
  ];
}
