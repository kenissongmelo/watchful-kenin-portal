import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';

export const ProviderConfigPage = () => {
  return (
    <Page themeId="tool">
      <Header title="Configuração de Provedores" subtitle="Configuração de Provedores de Monitoramento" />
      <Content>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Configuração de Provedores
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Esta página permite configurar os provedores de monitoramento (New Relic, Datadog, Grafana).
          </Typography>
        </Box>
      </Content>
    </Page>
  );
}; 