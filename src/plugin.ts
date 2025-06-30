
// Standalone plugin structure that can later be adapted for Backstage
export const keninDutyPlugin = {
  id: 'kenin-duty',
  name: 'KeninDuty',
  description: 'Alert Management for Developer Portal'
};

// Export the main component for use
export { KeninDutyRouter as KeninDutyPage } from './components/KeninDutyRouter';
