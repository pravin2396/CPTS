import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Boxes,
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Activity,
  Bell,
  BarChart3,
  LogOut,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logoutUser } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      name: 'Shipments',
      path: '/shipments',
      icon: Package
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users
    },
    {
      name: 'Parcel Tracking',
      path: '/tracking',
      icon: Truck
    },
    {
      name: 'Delivery Status',
      path: '/delivery-status',
      icon: Activity
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : null
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3
    }
  ];


  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation Drawer (Theme 4 Charcoal & Amber) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#10141d] border-r border-amber-500/20 text-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-amber-500/20 bg-[#141822]/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/20">
              <Boxes className="h-5 w-5 font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                Drop<span className="text-amber-400">Point</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 block">
                Logistics Dispatch
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.action) {
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-400 hover:bg-[#181d2a] hover:text-amber-300 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'text-slate-400 hover:bg-[#181d2a] hover:text-amber-300'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Card in Sidebar Footer */}
        <div className="p-4 m-4 rounded-2xl bg-[#141822] border border-amber-500/20 shadow-inner">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center uppercase border border-amber-500/30">
              {currentUser?.name ? currentUser.name.slice(0, 2) : 'US'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {currentUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-amber-400/90 capitalize truncate">
                {currentUser?.role || 'Admin'} • Online
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-[#1a1f2c] hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700/80 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
