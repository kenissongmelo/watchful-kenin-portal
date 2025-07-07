import React, { useState } from 'react';
import { Box, Tabs, Tab, useTheme } from '@mui/material';
import { KeninDutyPage } from './KeninDutyPage';
import { KeninDutyLogsPage } from './KeninDutyLogsPage';
import { KeninDutyDashboardPage } from './KeninDutyDashboardPage';
import KeninDutyConfigPage from './KeninDutyConfigPage';

export const KeninDutyMainPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4, 
        textAlign: 'center'
      }}>
        <Box sx={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          mb: 1
        }}>
          🚀 KeninDuty
        </Box>
        <Box sx={{ 
          fontSize: '1.1rem', 
          opacity: 0.7,
          fontWeight: 300
        }}>
          Sistema de Gerenciamento de On-Call e Alertas
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ 
        mb: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 500,
              minHeight: 64,
              textTransform: 'none',
            }
          }}
          variant="fullWidth"
        >
          <Tab label="📊 Dashboards" />
          <Tab label="📊 Alertas" />
          <Tab label="📝 Logs" />
          <Tab label="⚙️ Configurações" />
        </Tabs>
      </Box>
      
      {/* Content */}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        minHeight: '70vh',
        p: 3
      }}>
        {tabValue === 0 && <KeninDutyDashboardPage />}
        {tabValue === 1 && <KeninDutyPage />}
        {tabValue === 2 && <KeninDutyLogsPage />}
        {tabValue === 3 && <KeninDutyConfigPage />}
      </Box>
    </Box>
  );
}; 