import React, { useState } from 'react';
import {
  LayoutDashboard,
  Map,
  Target,
  Calendar,
  Code,
  GraduationCap,
  Microscope,
  Briefcase,
  BookOpen,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'master-roadmap', label: 'Master Roadmap', icon: Map },
  { id: 'goals', label: 'Goals & Milestones', icon: Target },
  { id: 'planner', label: 'Weekly Planner', icon: Calendar },
  { id: 'skills', label: 'Technical Skills', icon: Code },
  { id: 'mba', label: 'MBA Applications', icon: GraduationCap },
  { id: 'research', label: 'Honors Research', icon: Microscope },
  { id: 'career', label: 'Career & Recruiting', icon: Briefcase },
  { id: 'mitx', label: 'MITx MicroMasters', icon: BookOpen },
  { id: 'leadership', label: 'Leadership & Entre.', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics & Reflections', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      theme === 'dark' ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 transition-all duration-300 border-r",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
        isCollapsed ? "w-20" : "w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <TrendingUp size={20} />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-xl tracking-tight">ASCEND</span>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                  "hover:bg-indigo-600/10 hover:text-indigo-400",
                  theme === 'dark' ? "text-slate-400" : "text-slate-600"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-800/50 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              {!isCollapsed && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              <User size={20} />
              {!isCollapsed && <span className="text-sm">My Profile</span>}
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen",
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Top Bar */}
        <header className={cn(
          "h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b backdrop-blur-md",
          theme === 'dark' ? "bg-slate-950/80 border-slate-800" : "bg-slate-50/80 border-slate-200"
        )}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-800/10 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-medium">Current Phase</p>
              <p className="text-sm font-bold text-indigo-500">Build the Foundation</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
