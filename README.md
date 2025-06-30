
# KeninDuty - Backstage Plugin

A Backstage plugin for alert management and monitoring integration.

## Installation

This plugin integrates with Backstage to provide alert management capabilities.

### For Backstage Integration

1. Import the plugin in your Backstage app:

```typescript
// In packages/app/src/App.tsx
import { KeninDutyPage } from '@internal/plugin-kenin-duty';

// Add to your app routes:
<Route path="/kenin-duty" element={<KeninDutyPage />} />
```

2. Add to your sidebar navigation:

```typescript
// In packages/app/src/components/Root/Root.tsx
import { AlertTriangle } from 'lucide-react';

// Add to your sidebar:
<SidebarItem icon={AlertTriangle} to="kenin-duty" text="Alert Management" />
```

## Features

- Dashboard with alert overview
- Alert management and configuration
- Provider integration (New Relic, Datadog)
- Create and manage custom alerts

## Usage

Once installed, navigate to `/kenin-duty` in your Backstage instance to access the alert management interface.
