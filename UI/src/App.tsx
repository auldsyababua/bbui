import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { MobileNav } from './components/layout/MobileNav';
import { AppRoutes } from './components/AppRoutes';
export function App() {
  return <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-[#f8f8f8]">
        <TopNav />
        <MobileNav />
        <main className="flex-1">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>;
}