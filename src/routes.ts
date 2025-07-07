import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'kenin-duty',
});

// Simple route constants for the standalone app
export const routes = {
  root: '/',
  alerts: '/alerts',
  create: '/create',
  providers: '/providers'
};
