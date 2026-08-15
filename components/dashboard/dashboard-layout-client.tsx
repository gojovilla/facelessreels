"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { CreateSeriesModal } from "./create-series-modal";
import { X } from "lucide-react";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#07080c] text-slate-900 dark:text-slate-100 flex relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop Fixed Static Sidebar */}
      <div className="hidden lg:flex w-64 shrink-0 h-screen overflow-y-auto bg-white dark:bg-[#0a0c14] border-r border-slate-200 dark:border-white/10 z-20">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#0a0c14] z-10 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl border-r border-slate-200 dark:border-white/10">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <DashboardSidebar onMobileClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main App Content Area (Independent Vertical Scrolling) */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          onOpenCreateSeries={() => setCreateModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Create Series Modal */}
      <CreateSeriesModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
