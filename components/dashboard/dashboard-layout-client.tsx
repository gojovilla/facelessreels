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
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0a0c14] z-10 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.05]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <DashboardSidebar onMobileClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          onOpenCreateSeries={() => setCreateModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
