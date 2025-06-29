
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { AlertsList } from '@/components/AlertsList';
import { CreateAlert } from '@/components/CreateAlert';
import { ProvidersConfig } from '@/components/ProvidersConfig';

const Index = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <header className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">KD</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">KeninDuty</h1>
                    <p className="text-gray-600">Alert Management for Developer Portal</p>
                  </div>
                </div>
              </header>
              
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alerts" element={<AlertsList />} />
                <Route path="/create" element={<CreateAlert />} />
                <Route path="/providers" element={<ProvidersConfig />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
