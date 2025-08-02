import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';

export const KeninDutyPage = () => {
  return (
    <Page themeId="tool">
      <Header title="KeninDuty" subtitle="Sistema de Gestão de Plantões" />
      <Content>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            KeninDuty Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Bem-vindo ao sistema KeninDuty para gerenciamento de plantões e alertas.
          </Typography>
        </Box>
      </Content>
    </Page>
  );
}; 