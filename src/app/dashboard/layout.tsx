
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home, Settings, GraduationCap, Users, LogOut, MessageCircleQuestion, Landmark, Calculator, Wrench, LayoutDashboard, Menu, BookOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { SignOutButton } from '@/components/auth-buttons';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/session';
import ProtectedLayout from '@/components/protected-layout';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedLayout>
      <AuthProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Landmark className="h-8 w-8 text-primary" />
              <span className="text-xl font-headline font-bold text-primary">TaxCode</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton tooltip="Dashboard">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/assistant">
                  <SidebarMenuButton tooltip="AI Assistant">
                    <div className="flex items-center gap-2">
                      <MessageCircleQuestion />
                      <span>AI Tax Assistant</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <Link href="/dashboard/calculator">
                  <SidebarMenuButton tooltip="Tax Calculator">
                    <div className="flex items-center gap-2">
                      <Calculator />
                      <span>Tax Calculator</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/tools">
                  <SidebarMenuButton tooltip="Interactive Tools">
                    <div className="flex items-center gap-2">
                      <Wrench />
                      <span>Interactive Tools</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <Link href="/dashboard/modules">
                  <SidebarMenuButton tooltip="Training Modules">
                    <div className="flex items-center gap-2">
                      <GraduationCap />
                      <span>Training Modules</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <Link href="/dashboard/knowledge">
                  <SidebarMenuButton tooltip="Knowledge Base">
                    <div className="flex items-center gap-2">
                      <BookOpen />
                      <span>Knowledge Base</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/team">
                  <SidebarMenuButton tooltip="Faculty Management">
                    <div className="flex items-center gap-2">
                      <Users />
                      <span>Faculty</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip="Community Forum">
                    <div className="flex items-center gap-2">
                      <Users />
                      <span>Community Forum</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
               <SidebarMenuItem>
                 <Link href="/">
                  <SidebarMenuButton tooltip="Homepage">
                    <div className="flex items-center gap-2">
                      <Home />
                      <span>Homepage</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="#">
                  <SidebarMenuButton tooltip="Settings">
                    <div className="flex items-center gap-2">
                      <Settings />
                      <span>Settings</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SignOutButton>
                  <SidebarMenuButton tooltip="Logout">
                     <div className="flex items-center gap-2">
                      <LogOut />
                      <span>Logout</span>
                    </div>
                  </SidebarMenuButton>
                </SignOutButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
           <header className="p-4 border-b h-14 flex items-center md:hidden">
              <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                     <Landmark className="h-7 w-7 text-primary" />
                     <span className="text-lg font-headline font-bold text-primary">TaxCode</span>
                  </div>
                  <SidebarTrigger>
                      <Menu />
                  </SidebarTrigger>
              </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
