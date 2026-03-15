import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen flex flex-col">
        <Header />
        <div className="p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
