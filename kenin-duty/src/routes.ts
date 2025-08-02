import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'kenin-duty',
});

export const teamsRouteRef = createSubRouteRef({
  id: 'kenin-duty-teams',
  parent: rootRouteRef,
  path: '/teams',
});

export const configRouteRef = createSubRouteRef({
  id: 'kenin-duty-config',
  parent: rootRouteRef,
  path: '/config',
});

export const alertsRouteRef = createSubRouteRef({
  id: 'kenin-duty-alerts',
  parent: rootRouteRef,
  path: '/alerts',
});

export const logsRouteRef = createSubRouteRef({
  id: 'kenin-duty-logs',
  parent: rootRouteRef,
  path: '/logs',
});
