
import React, { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Building, LayoutDashboard, Users, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold ml-4">{title || 'Lead Management System'}</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="p-4">
          <h2 className="font-bold text-xl text-center">
            <span className="bg-gradient-to-r from-opportunity-purple to-opportunity-blue bg-clip-text text-transparent">
              Opportunity Radar
            </span>
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem to="/" icon={<LayoutDashboard size={18} />}>
                Dashboard
              </MenuItem>
              <MenuItem to="/leads" icon={<Building size={18} />}>
                Leads
              </MenuItem>
              <MenuItem to="/team" icon={<Users size={18} />}>
                Team
              </MenuItem>
              <MenuItem to="/reports" icon={<FileText size={18} />}>
                Reports
              </MenuItem>
              <MenuItem to="/settings" icon={<Settings size={18} />}>
                Settings
              </MenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function MenuItem({ to, icon, children }: MenuItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={to} 
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
          )}
        >
          <span>{icon}</span>
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default MainLayout;
