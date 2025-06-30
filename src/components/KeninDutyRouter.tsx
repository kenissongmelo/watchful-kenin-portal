
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Page, Header, Content } from '@backstage/core-components';
import { Dashboard } from './Dashboard';
import { AlertsList } from './AlertsList';
import { CreateAlert } from './CreateAlert';
import { ProvidersConfig } from './ProvidersConfig';
import { Sidebar } from './Sidebar';

export const KeninDutyRouter = () => {
  return (
    <Page themeId="tool">
      <Header title="KeninDuty" subtitle="Alert Management for Developer Portal" />
      <Content>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/alerts" element={<AlertsList />} />
              <Route path="/create" element={<CreateAlert />} />
              <Route path="/providers" element={<ProvidersConfig />} />
            </Routes>
          </main>
        </div>
      </Content>
    </Page>
  );
};
