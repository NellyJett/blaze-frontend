import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  // Mobile: pl-16 (icons-only sidebar), Desktop: pl-64 (full sidebar)
  const sidebarWidth = isMobile ? 'pl-16' : 'pl-64';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarWidth
        )}
      >
        <div className="min-h-screen border-l border-gray-200">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
