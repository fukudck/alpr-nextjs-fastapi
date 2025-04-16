"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Cctv,
  Command,
  FileVideo,
  Frame,
  House,
  LifeBuoy,
  Map,
  PieChart,
  Radar,
  Send,
  Settings2,
  SquareTerminal,
  Image,
  CarFront,
  History,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Nhận diện p.t vi phạm",
      url: "#",
      icon: Radar,
      isActive: true,
      items: [
        {
          title: "Hình ảnh",
          url: "image_ALPR",
          item_icon: Image,
        },
        {
          title: "Video",
          url: "video_ALPR",
          item_icon: FileVideo,
        },
        {
          title: "Live-Camera(Beta)",
          url: "livecam_ALPR",
          item_icon: Cctv,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Trang Chủ",
      url: "#",
      icon: House,
    },
    {
      name: "Danh sách p.t vi phạm",
      url: "#",
      icon: CarFront,
    },
    {
      name: "Lịch sử",
      url: "#",
      icon: History,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
