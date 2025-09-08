import * as React from "react";
import { GalleryVerticalEnd, ExternalLink } from "lucide-react";
import { TENANT_CONFIG, TenantType } from "@/../convex/lib/constants";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Generate tenant navigation data from constants
const createUrl = (subdomain: string) => {
  if (subdomain === "main") {
    return "http://dellavega.local:3000/";
  }
  return `http://${subdomain}.dellavega.local:3000/`;
};

// Group tenants by type
const standalones = Object.entries(TENANT_CONFIG)
  .filter(([_, config]) => config.type === TenantType.STANDALONE)
  .map(([tenantId, config]) => ({
    title: config.name,
    url: createUrl(config.subdomain),
    subdomain: config.subdomain,
    color: config.primaryColor,
  }));

const portals = Object.entries(TENANT_CONFIG)
  .filter(([_, config]) => config.type === TenantType.PORTAL)
  .map(([tenantId, config]) => ({
    title: config.name,
    url: createUrl(config.subdomain),
    subdomain: config.subdomain,
    color: config.primaryColor,
  }));

const publicTenants = Object.entries(TENANT_CONFIG)
  .filter(([_, config]) => config.type === TenantType.PUBLIC_STANDALONE)
  .map(([tenantId, config]) => ({
    title: config.name,
    url: createUrl(config.subdomain),
    subdomain:
      config.subdomain === "main" ? "dellavega.local" : config.subdomain,
    color: config.primaryColor,
  }));

const apiTenants = Object.entries(TENANT_CONFIG)
  .filter(([_, config]) => config.type === TenantType.API_ONLY)
  .map(([tenantId, config]) => ({
    title: config.name,
    url: createUrl(config.subdomain),
    subdomain: config.subdomain,
    color: config.primaryColor,
  }));

// main tenant, get it from  publicTenants where  config.subdomain === "main",
//  if returns an array pick teh first object
const mainTenant = publicTenants.find((tenant) => tenant.title === "Main Site");

const data = {
  navMain: [
    {
      title: "Standalones",
      items: standalones,
    },
    {
      title: "Portals",
      items: portals,
    },
    {
      title: "Public",
      items: publicTenants,
    },
    {
      title: "APIs",
      items: apiTenants,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={mainTenant?.url}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Tenant Navigator</span>
                  <span className="">Multi-Tenant System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((tenant) => (
                <SidebarMenuItem key={tenant.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={tenant.url}
                      className="flex items-center gap-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tenant.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {tenant.title}
                        </div>
                        {/* <div className="text-xs text-muted-foreground truncate">
                          {tenant.subdomain}
                        </div> */}
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
