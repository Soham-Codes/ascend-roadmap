import React, { useState } from 'react';
import {
  LayoutDashboard,
  Map,
  Target,
  Code,
  GraduationCap,
  Microscope,
  Briefcase,
  BookOpen,
  TrendingUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  User
} from 'lucide-react';
import { cn } from './lib/utils';
import CommandCenter from './pages/CommandCenter';
import MasterRoadmap from './pages/MasterRoadmap';
import GoalSystem from './pages/GoalSystem';
import TechnicalSkills from './pages/TechnicalSkills';
import MBAApplications from './pages/MBAApplications';
import HonorsResearch from './pages/HonorsResearch';
import MITxTracker from './pages/MITxTracker';
import CareerTracker from './pages/CareerTracker';
import Analytics from './pages/Analytics';
import LeadershipEntrepreneurship from './pages/LeadershipEntrepreneurship';

const navItems = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, component: CommandCenter },
  { id: 'master-roadmap', label: 'Master Roadmap', icon: Map, component: MasterRoadmap },
  { id: 'goals', label: 'Goals & Milestones', icon: Target, component: GoalSystem },
  { id: 'skills', label: 'Technical Skills', icon: Code, component: TechnicalSkills },
  { id: 'mba', label: 'MBA Applications', icon: GraduationCap, component: MBAApplications },
  { id: 'research', label: 'Honors Research', icon: Microscope, component: HonorsResearch },
  { id: 'career', label: 'Career & Recruiting', icon: Briefcase, component: CareerTracker },
  { id: 'mitx', label: 'MITx MicroMasters', icon: BookOpen, component: MITxTracker },
  { id: 'leadership', label: 'Leadership & Entre.', icon: TrendingUp, component: LeadershipEntrepreneurship },
  { id: 'analytics', label: 'Analytics & Reflections', icon: TrendingUp, component: Analytics },
];

export default function App() {
  const [activePageId, setActivePageId] = useState('command-center');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  const activePage = navItems.find(item => item.id === activePageId)!;
  const PageComponent = activePage.component;

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      theme === 'dark' ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
    )}>
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 transition-all duration-300 border-r",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
        isCollapsed ? "w-20" : "w-64",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <TrendingUp size={20} />
              </div >
              {!isCollapsed && <span className="font-bold text-xl tracking-tight">ASCEND</span>}
            </div >
          </div >

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePageId(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                  activePageId === item.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : theme === 'dark' ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div >
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800/50 space-y-2">
            <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              {!isCollapsed && <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              <User size={20} />
              {!isCollapsed && <span className="text-sm">My Profile</span>}
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div >
        </div >
      </aside>

      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen",
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        <header className={cn(
          "h-16 sticky top-0 z-40 flex items-center justify-between px-6 border-b backdrop-blur-md",
          theme === 'dark' ? "bg-slate-950/80 border-slate-800" : "bg-slate-50/80 border-slate-200"
        )}>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-slate-800/10 rounded-lg">
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-medium">Current Phase</p>
              <p className="text-sm font-bold text-indigo-500">Build the Foundation</p>
            </div >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          </div >
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          <PageComponent />
        </div >
      </main>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div >
  );
}
