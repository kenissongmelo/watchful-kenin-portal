import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const keninDutyPlugin = createPlugin({
  id: 'kenin-duty',
  routes: {
    root: rootRouteRef,
  },
});

export const KeninDutyPage = keninDutyPlugin.provide(
  createRoutableExtension({
    name: 'KeninDutyPage',
    component: () =>
      import('./components/KeninDutyMainPage').then(m => m.KeninDutyMainPage),
    mountPoint: rootRouteRef,
  }),
);

// Export individual components
export { KeninDutyMainPage } from './components/KeninDutyMainPage';
export { KeninDutyIcon } from './components/KeninDutyIcon';
export { KeninDutyTeamsPage } from './components/KeninDutyTeamsPage';
export { KeninDutyConfigPage } from './components/KeninDutyConfigPage';
export { AlertRegistrationPage } from './components/AlertRegistrationPage';
export { ProviderConfigPage } from './components/ProviderConfigPage';
export { RealTimeLogs } from './components/RealTimeLogs'; 