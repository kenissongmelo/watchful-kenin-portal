
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { AlertsList } from './AlertsList';
import { CreateAlert } from './CreateAlert';
import { ProvidersConfig } from './ProvidersConfig';
import { Sidebar } from './Sidebar';

export const KeninDutyRouter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">KD</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KeninDuty</h1>
            <p className="text-sm text-gray-600">Alert Management for Developer Portal</p>
          </div>
        </div>
      </div>
      
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
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
  );
};
