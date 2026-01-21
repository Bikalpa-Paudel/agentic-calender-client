import { cookies } from "next/headers"
import {jwtDecode} from "jwt-decode"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CalendarService } from "@/services/calendar.service"
import {Calendar } from "@/components/calendar/Calendar"
export default async function Page() {
    
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value || null;
  let userData = null;
  if (access_token) {

    const decoded = jwtDecode(access_token);
    userData = decoded as { sub: string; email: string; name: string; picture: string;  };

  }
  else {
    userData = {
      name: "Guest User",
      email: "n@example.com",
      picture: "/avatars/guest.jpg",
    };
  }

  const calendarService = new CalendarService();
  const calendars = access_token ? await calendarService.getCalendars(access_token) : [];


  return (

        <Calendar />
 
    
  )
}
