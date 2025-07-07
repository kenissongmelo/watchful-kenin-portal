import { createPlugin } from '@backstage/core-plugin-api';
import { createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

// Standalone plugin structure that can later be adapted for Backstage
export const keninDutyPlugin = createPlugin({
  id: 'kenin-duty',
  routes: {
    root: rootRouteRef,
  },
});

// Export the main component for use
export const KeninDutyPage = keninDutyPlugin.provide(
  createRoutableExtension({
    name: 'KeninDutyPage',
    component: () => import('./components/KeninDutyPage').then(m => m.KeninDutyPage),
    mountPoint: rootRouteRef,
  }),
);
