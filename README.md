
# KeninDuty - Alert Management System

A React-based alert management system that can be integrated with Backstage or used as a standalone application.

## Features

- Dashboard with alert overview
- Alert management and configuration
- Provider integration (New Relic, Datadog)
- Create and manage custom alerts
- Responsive design with modern UI

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:8080`

## Backstage Integration

To integrate this as a Backstage plugin:

1. Package this code as a Backstage plugin by adding the required dependencies:
   ```bash
   yarn add @backstage/core-components @backstage/core-plugin-api @backstage/theme
   ```

2. Update the plugin structure to use Backstage components

3. Import in your Backstage app:
   ```typescript
   // In packages/app/src/App.tsx
   import { KeninDutyPage } from '@internal/plugin-kenin-duty';
   
   // Add to your app routes:
   <Route path="/kenin-duty" element={<KeninDutyPage />} />
   ```

4. Add to your sidebar navigation:
   ```typescript
   // In packages/app/src/components/Root/Root.tsx
   import { AlertTriangle } from 'lucide-react';
   
   // Add to your sidebar:
   <SidebarItem icon={AlertTriangle} to="kenin-duty" text="Alert Management" />
   ```

## Architecture

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: React Query for server state
- **Icons**: Lucide React

## Usage

Once running, you can:
- View the dashboard for alert overview
- Manage existing alerts
- Create new custom alerts
- Configure monitoring providers (New Relic, Datadog)
