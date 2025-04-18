import { History } from "@/app/history/columns";

export async function getData(): Promise<History[]> {
  return [
    {
      id: "728ed52f",
      type: "Xe Máy",
      number_plate: "M1GG-4444A",
      timestamp: "2023-10-01T12:00:00Z",
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMoIN8n1Nf_1wkuWpMCQLAL5lh8nb_FNVafw&s",
    },
  ];
}
