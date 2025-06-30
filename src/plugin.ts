
import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

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
      import('./components/KeninDutyRouter').then(m => m.KeninDutyRouter),
    mountPoint: rootRouteRef,
  }),
);
