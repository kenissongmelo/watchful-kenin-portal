import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';

export const AlertRegistrationPage = () => {
  return (
    <Page themeId="tool">
      <Header title="Registro de Alertas" subtitle="Configuração de Alertas" />
      <Content>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Registro de Alertas
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Esta página permite configurar o registro de alertas no sistema KeninDuty.
          </Typography>
        </Box>
      </Content>
    </Page>
  );
}; 