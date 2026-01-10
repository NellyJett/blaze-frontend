import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';

import Logo from '@/components/icons/logo';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Database,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useIsMobile } from '@/hooks/use-mobile';

/* ───────────────────────────
   Sidebar Navigation
─────────────────────────── */
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customer 360', href: '/customers', icon: Users },
  { name: 'Fraud & AML Center', href: '/fraud', icon: AlertTriangle },
  { name: 'Compliance Engine', href: '/compliance', icon: ShieldCheck },
  { name: 'Credit Scoring', href: '/scoring', icon: TrendingUp, badge: 'ENTERPRISE' },
  { name: 'Data Integrations', href: '/integrations', icon: Database, badge: 'ENTERPRISE' },
  { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isMobile = useIsMobile();
  const isIconsOnly = isMobile;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/welcome');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen transition-all duration-300',
          isIconsOnly ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col bg-[#E9F1EE] border-r border-[#CAD8D2]">

          {/* ───────── Logo Header ───────── */}
          <div className="bg-white border-b border-gray-200/60">
            <div
              className={cn(
                'flex h-[68px] items-center',
                isIconsOnly ? 'justify-center px-2' : 'gap-3 px-6'
              )}
            >
              <Logo />
              {!isIconsOnly && (
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-[#3F6F5E]">
                    BlazeTech
                  </h1>
                  <p className="text-xs text-gray-600">
                    Intelligence Platform
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ───────── Navigation ───────── */}
          <nav
            className={cn(
              'flex-1 overflow-y-auto space-y-1 py-6',
              isIconsOnly ? 'px-2' : 'px-3'
            )}
          >
            {navigation.map((item) => {
              const link = (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-lg text-sm font-medium transition-colors min-h-[46px]',
                      isIconsOnly
                        ? 'justify-center p-3'
                        : 'gap-3 px-3 py-2.5',
                      isActive
                        ? 'bg-[#3F6F5E] text-white'
                        : 'text-[#2F4F45] hover:bg-[#DCE8E3]'
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isIconsOnly
                        ? 'text-[#1F3D33]'
                        : 'text-inherit'
                    )}
                  />

                  {!isIconsOnly && (
                    <div className="flex flex-1 items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );

              return isIconsOnly ? (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                link
              );
            })}
          </nav>

          {/* ───────── User + Logout (Pinned Bottom) ───────── */}
          {user && (
            <div
              className={cn(
                'border-t border-[#CAD8D2]',
                isIconsOnly ? 'p-2' : 'p-3'
              )}
            >
              {!isIconsOnly ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-2 hover:bg-[#DCE8E3] transition">
                    <div className="h-9 w-9 rounded-full bg-[#3F6F5E] flex items-center justify-center text-white text-sm font-semibold">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1F3D33] truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#4E6E63] truncate">
                        {user.organizationName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#2F4F45] hover:bg-[#DCE8E3] hover:text-red-700 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full justify-center items-center rounded-lg p-3 text-[#2F4F45] hover:bg-[#DCE8E3]"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Logout
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
