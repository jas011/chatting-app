"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { AnimatedGroup } from '@/components/ui/animated-group';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactElement, useState,useEffect,useRef } from "react"
import { Textarea } from "@/components/ui/textarea"



import{useMessageContext} from "../context/context";
import ChatArea from "../chatArea/page";
import { Chats } from "../Data/structure";

const io = new WebSocket(`ws://192.168.29.200:8000?room=["vdvd"]&user=japjeet`);
export default function Page() {


  const [items, setItems] = useState<ReactElement[]>([]);
  const message = useRef<HTMLTextAreaElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const unshiftRef = useRef<HTMLButtonElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);

  const handleUnshift = () => {
    setItems([ ...items,<div
      key={items.length}
      className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
    >key: {items.length}</div>])  
  }

  const handleSend = () => {
    const msg = {
      recipient:"jaskirat",
      sender:"japjeet",
      chat: message.current?.value,
      timestamp:new Date().toLocaleDateString(),
  };
  io.send(JSON.stringify(msg));
    setItems([ <div
      key={items.length}
      className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
    >{message.current?.value}</div>,...items])
    message.current!.value = "";
  }

  useEffect(() => {
    io.onmessage = (e)=>{
      setTimeout(() => {
        if (messageContainerRef.current && unshiftRef.current) {window.scrollTo(0,messageContainerRef.current.scrollHeight);
      }}, 10);
      setItems([ <div
     key={items.length}
     className="bg-muted/50 aspect-video h-12 w-full rounded-lg"
   >{e.data}</div>,...items])
   }

    if(unshiftRef.current){unshiftRef.current.onclick = () => {
      handleUnshift();
    if (messageContainerRef.current && unshiftRef.current) {
      window.scrollTo(0,window.scrollY+48+16);
      console.log(window.scrollY+48);
    }
  }}
  if(sendRef.current){sendRef.current.onclick = () => {
    handleSend();
    
      setTimeout(() => {
        if (messageContainerRef.current && unshiftRef.current) {window.scrollTo(0,messageContainerRef.current.scrollHeight);
      }}, 10);
    
  }}
  });




 

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 z-11">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
          <ChatArea io={io} selection={"jaskirat"} />
      </SidebarInset>
    </SidebarProvider>
  )
}



{/* <Button className="fixed z-11 top-4 left-100" ref={unshiftRef}>Unshift</Button>
        <div className="z-10 mb-18 h-full flex w-full flex-1 flex-col-reverse gap-4 p-4 message-container" ref={messageContainerRef}>
          {items.map((elem,i)=>{if(i)return elem;else
            return <AnimatedGroup
            key={Math.random()}
            variants={{
              container: {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              },
              item: {
                hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 1.2,
                    type: 'spring',
                    bounce: 0.3,
                  },
                },
              },
            }}
          >{items[0]}</AnimatedGroup>
          })}
          
        </div>

        <div style={{width:"-webkit-fill-available",height: "fit-content"}} className="fixed z-11 flex gap-2 bottom-0 p-2 bg-background rounded-lg h-12 justify-center items-center border-t">

        <Textarea ref={message} placeholder="Type your message here." className="w-full" />
        <Button ref={sendRef}>send</Button>
        </div> */}