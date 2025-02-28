"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
const app_sidebar_1 = require("@/components/app-sidebar");
const breadcrumb_1 = require("@/components/ui/breadcrumb");
const separator_1 = require("@/components/ui/separator");
const sidebar_1 = require("@/components/ui/sidebar");
function Page() {
    return (<sidebar_1.SidebarProvider style={{
            "--sidebar-width": "350px",
        }}>
      <app_sidebar_1.AppSidebar />
      <sidebar_1.SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <sidebar_1.SidebarTrigger className="-ml-1"/>
          <separator_1.Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
          <breadcrumb_1.Breadcrumb>
            <breadcrumb_1.BreadcrumbList>
              <breadcrumb_1.BreadcrumbItem className="hidden md:block">
                <breadcrumb_1.BreadcrumbLink href="#">All Inboxes</breadcrumb_1.BreadcrumbLink>
              </breadcrumb_1.BreadcrumbItem>
              <breadcrumb_1.BreadcrumbSeparator className="hidden md:block"/>
              <breadcrumb_1.BreadcrumbItem>
                <breadcrumb_1.BreadcrumbPage>Inbox</breadcrumb_1.BreadcrumbPage>
              </breadcrumb_1.BreadcrumbItem>
            </breadcrumb_1.BreadcrumbList>
          </breadcrumb_1.Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {Array.from({ length: 24 }).map((_, index) => (<div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg"/>))}
        </div>
      </sidebar_1.SidebarInset>
    </sidebar_1.SidebarProvider>);
}
