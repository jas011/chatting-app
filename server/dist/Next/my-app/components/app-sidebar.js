"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSidebar = AppSidebar;
const React = __importStar(require("react"));
const lucide_react_1 = require("lucide-react");
const nav_user_1 = require("@/components/nav-user");
const label_1 = require("@/components/ui/label");
const sidebar_1 = require("@/components/ui/sidebar");
const switch_1 = require("@/components/ui/switch");
// This is sample data
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Inbox",
            url: "#",
            icon: lucide_react_1.Inbox,
            isActive: true,
        },
        {
            title: "Drafts",
            url: "#",
            icon: lucide_react_1.File,
            isActive: false,
        },
        {
            title: "Sent",
            url: "#",
            icon: lucide_react_1.Send,
            isActive: false,
        },
        {
            title: "Junk",
            url: "#",
            icon: lucide_react_1.ArchiveX,
            isActive: false,
        },
        {
            title: "Trash",
            url: "#",
            icon: lucide_react_1.Trash2,
            isActive: false,
        },
    ],
    mails: [
        {
            name: "William Smith",
            email: "williamsmith@example.com",
            subject: "Meeting Tomorrow",
            date: "09:34 AM",
            teaser: "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
        },
        {
            name: "Alice Smith",
            email: "alicesmith@example.com",
            subject: "Re: Project Update",
            date: "Yesterday",
            teaser: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
        },
        {
            name: "Bob Johnson",
            email: "bobjohnson@example.com",
            subject: "Weekend Plans",
            date: "2 days ago",
            teaser: "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
        },
        {
            name: "Emily Davis",
            email: "emilydavis@example.com",
            subject: "Re: Question about Budget",
            date: "2 days ago",
            teaser: "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
        },
        {
            name: "Michael Wilson",
            email: "michaelwilson@example.com",
            subject: "Important Announcement",
            date: "1 week ago",
            teaser: "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
        },
        {
            name: "Sarah Brown",
            email: "sarahbrown@example.com",
            subject: "Re: Feedback on Proposal",
            date: "1 week ago",
            teaser: "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
        },
        {
            name: "David Lee",
            email: "davidlee@example.com",
            subject: "New Project Idea",
            date: "1 week ago",
            teaser: "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
        },
        {
            name: "Olivia Wilson",
            email: "oliviawilson@example.com",
            subject: "Vacation Plans",
            date: "1 week ago",
            teaser: "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
        },
        {
            name: "James Martin",
            email: "jamesmartin@example.com",
            subject: "Re: Conference Registration",
            date: "1 week ago",
            teaser: "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
        },
        {
            name: "Sophia White",
            email: "sophiawhite@example.com",
            subject: "Team Dinner",
            date: "1 week ago",
            teaser: "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
        },
    ],
};
function AppSidebar(_a) {
    var props = __rest(_a, []);
    // Note: I'm using state to show active item.
    // IRL you should use the url/router.
    const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
    const [mails, setMails] = React.useState(data.mails);
    const { setOpen } = (0, sidebar_1.useSidebar)();
    return (<sidebar_1.Sidebar collapsible="icon" className="overflow-hidden *:data-[sidebar=sidebar]:flex-row" {...props}>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <sidebar_1.Sidebar collapsible="none" className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
        <sidebar_1.SidebarHeader>
          <sidebar_1.SidebarMenu>
            <sidebar_1.SidebarMenuItem>
              <sidebar_1.SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <lucide_react_1.Command className="size-4"/>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </sidebar_1.SidebarMenuButton>
            </sidebar_1.SidebarMenuItem>
          </sidebar_1.SidebarMenu>
        </sidebar_1.SidebarHeader>
        <sidebar_1.SidebarContent>
          <sidebar_1.SidebarGroup>
            <sidebar_1.SidebarGroupContent className="px-1.5 md:px-0">
              <sidebar_1.SidebarMenu>
                {data.navMain.map((item) => (<sidebar_1.SidebarMenuItem key={item.title}>
                    <sidebar_1.SidebarMenuButton tooltip={{
                children: item.title,
                hidden: false,
            }} onClick={() => {
                setActiveItem(item);
                const mail = data.mails.sort(() => Math.random() - 0.5);
                setMails(mail.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1)));
                setOpen(true);
            }} isActive={activeItem.title === item.title} className="px-2.5 md:px-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </sidebar_1.SidebarMenuButton>
                  </sidebar_1.SidebarMenuItem>))}
              </sidebar_1.SidebarMenu>
            </sidebar_1.SidebarGroupContent>
          </sidebar_1.SidebarGroup>
        </sidebar_1.SidebarContent>
        <sidebar_1.SidebarFooter>
          <nav_user_1.NavUser user={data.user}/>
        </sidebar_1.SidebarFooter>
      </sidebar_1.Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <sidebar_1.Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <sidebar_1.SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem.title}
            </div>
            <label_1.Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <switch_1.Switch className="shadow-none"/>
            </label_1.Label>
          </div>
          <sidebar_1.SidebarInput placeholder="Type to search..."/>
        </sidebar_1.SidebarHeader>
        <sidebar_1.SidebarContent>
          <sidebar_1.SidebarGroup className="px-0">
            <sidebar_1.SidebarGroupContent>
              {mails.map((mail) => (<a href="#" key={mail.email} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0">
                  <div className="flex w-full items-center gap-2">
                    <span>{mail.name}</span>{" "}
                    <span className="ml-auto text-xs">{mail.date}</span>
                  </div>
                  <span className="font-medium">{mail.subject}</span>
                  <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
                    {mail.teaser}
                  </span>
                </a>))}
            </sidebar_1.SidebarGroupContent>
          </sidebar_1.SidebarGroup>
        </sidebar_1.SidebarContent>
      </sidebar_1.Sidebar>
    </sidebar_1.Sidebar>);
}
