import { useCallback } from "react";
import { MENU_SIDEBAR_MAIN } from "@/config/layout-20.config";
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function SidebarPrimaryMenu() {
  const pathname = usePathname();

  // Memoize matchPath to prevent unnecessary re-renders
  const matchPath = useCallback(
    (path: string): boolean => {
      // Exact match
      if (path === pathname) {
        return true;
      }

      // Don't match root path
      if (path === '/layout-20') {
        return false;
      }

      // Special handling for blog posts section to prevent parent highlighting
      if (path === '/layout-20/blog/posts') {
        // Only match if it's exactly the posts page, not child pages
        return pathname === '/layout-20/blog/posts';
      }

      // Special handling for blog users section to prevent parent highlighting
      if (path === '/layout-20/blog/users') {
        // Only match if it's exactly the users page, not child pages
        return pathname === '/layout-20/blog/users';
      }

      // Special handling for blog comments section to prevent parent highlighting
      if (path === '/layout-20/blog/comments') {
        // Only match if it's exactly the comments page, not child pages
        return pathname === '/layout-20/blog/comments';
      }

      // For other paths, check if pathname starts with path
      // but ensure it's followed by a slash or end of string to avoid partial matches
      if (path.length > 1) {
        const pathWithSlash = path + '/';
        return pathname.startsWith(pathWithSlash) || pathname === path;
      }

      return false;
    },
    [pathname],
  );

  return (
    <AccordionMenu
      selectedValue={pathname}
      matchPath={matchPath}
      type="multiple"
      className="space-y-7.5 px-2.5 pt-1"
      classNames={{
        label: 'text-xs font-normal text-muted-foreground mb-2',
        item: 'h-8.5 px-2.5 text-sm font-normal text-foreground hover:text-white border border-transparent hover:bg-zinc-800/80 data-[selected=true]:bg-zinc-800/60 data-[selected=true]:text-foreground data-[selected=true]:border-zinc-700/60 [&[data-selected=true]_svg]:opacity-100',
        group: '',
      }}
    >
      {MENU_SIDEBAR_MAIN.map((item, index) => {
        return (
          <AccordionMenuGroup key={index}>
            {item.children?.map((child, index) => {
              return (
                <AccordionMenuItem key={index} value={child.path || '#'}>
                  <Link href={child.path || '#'}>
                    {child.icon && <child.icon />}
                    <span>{child.title}</span>
                    {child.badge == 'Beta' && <Badge size="sm" variant="destructive" appearance="light">{child.badge}</Badge>}
                  </Link>
                </AccordionMenuItem>
              )
            })}
          </AccordionMenuGroup>
        )
      })}
    </AccordionMenu>
  );
}
