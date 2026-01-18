
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
import { Home, Settings, LogOut, Landmark, LayoutDashboard, Menu, BookOpen, MessageSquare, Plus, Newspaper, Users, Share2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { SignOutButton } from '@/components/auth-buttons';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';
import ProtectedLayout from '@/components/protected-layout';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Fetch user role for conditional menu rendering
  let userRole: string | null = null;
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (decoded?.uid) {
      userRole = await getUserRole(decoded.uid);
    }
  } catch (e) {
    // Role fetch failed, continue with no role
  }

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
                  <SidebarMenuButton tooltip="Dashboard Overview">
                    <div className="flex items-center gap-2">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarSeparator />

              <SidebarMenuItem>
                <Link href="/dashboard/insights">
                  <SidebarMenuButton tooltip="Manage Insights">
                    <div className="flex items-center gap-2">
                      <BookOpen />
                      <span>Insights</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/news">
                  <SidebarMenuButton tooltip="Manage News & Media">
                    <div className="flex items-center gap-2">
                      <Newspaper />
                      <span>News & Media</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/insights?create=insight">
                  <SidebarMenuButton tooltip="Create New Insight">
                    <div className="flex items-center gap-2">
                      <Plus />
                      <span>New Insight</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/dashboard/insights?create=news">
                  <SidebarMenuButton tooltip="Create News Item">
                    <div className="flex items-center gap-2">
                      <Plus />
                      <span>New News</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>


<SidebarMenuItem>
                 <Link href="/dashboard/team">
                   <SidebarMenuButton tooltip="Team Management">
                     <div className="flex items-center gap-2">
                       <Users />
                       <span>Team</span>
                     </div>
                   </SidebarMenuButton>
                 </Link>
               </SidebarMenuItem>

<SidebarMenuItem>
                  <Link href="/community">
                    <SidebarMenuButton tooltip="Community Forum">
                      <div className="flex items-center gap-2">
                        <MessageSquare />
                        <span>Community</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/dashboard/settings/social-media">
                    <SidebarMenuButton tooltip="Social Media Settings">
                      <div className="flex items-center gap-2">
                        <Share2 />
                        <span>Social Media</span>
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
              {userRole === 'admin' && (
                <SidebarMenuItem>
                  <Link href="/dashboard/settings">
                    <SidebarMenuButton tooltip="Admin Settings">
                      <div className="flex items-center gap-2">
                        <Settings />
                        <span>Settings</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )}
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
    </ProtectedLayout>
  );
}
