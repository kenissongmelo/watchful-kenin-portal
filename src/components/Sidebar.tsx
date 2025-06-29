
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Bell, 
  Plus, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    description: 'Overview of all alerts'
  },
  { 
    name: 'Alerts', 
    href: '/alerts', 
    icon: Bell,
    description: 'Manage your alerts'
  },
  { 
    name: 'Create Alert', 
    href: '/create', 
    icon: Plus,
    description: 'Add new alert'
  },
  { 
    name: 'Providers', 
    href: '/providers', 
    icon: Settings,
    description: 'Configure monitoring providers'
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-white shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">KD</span>
              </div>
              <span className="font-semibold text-gray-900">KeninDuty</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn(
                    "flex-shrink-0 w-5 h-5 transition-colors",
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600",
                    collapsed ? "mx-auto" : "mr-3"
                  )} />
                  {!collapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "flex items-center space-x-3",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">ON</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Connected</div>
              <div className="text-xs text-gray-500">All systems operational</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
