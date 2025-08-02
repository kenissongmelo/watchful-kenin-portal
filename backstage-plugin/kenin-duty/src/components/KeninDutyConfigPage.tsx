import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';

export const KeninDutyConfigPage = () => {
  return (
    <Page themeId="tool">
      <Header title="Configurações" subtitle="Configurações do Sistema KeninDuty" />
      <Content>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Configurações do Sistema
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Esta página permite configurar as configurações gerais do sistema KeninDuty.
          </Typography>
        </Box>
      </Content>
    </Page>
  );
}; 