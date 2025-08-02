import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Box,
  Grid,
  Paper,
  Divider
} from '@material-ui/core';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as ExternalLinkIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Add as PlusIcon,
  Notifications as BellIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  filtersCard: {
    marginBottom: theme.spacing(3),
  },
  filterRow: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  searchField: {
    flex: 1,
    minWidth: 250,
  },
  selectField: {
    minWidth: 150,
  },
  alertCard: {
    marginBottom: theme.spacing(2),
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertContent: {
    padding: theme.spacing(2),
  },
  alertActions: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  statusChip: {
    marginLeft: theme.spacing(1),
  },
  providerChip: {
    marginTop: theme.spacing(1),
  },
}));

const mockAlerts = [
  {
    id: 1,
    name: 'High CPU Usage Alert',
    service: 'payment-api',
    provider: 'New Relic',
    query: "SELECT average(cpuPercent) FROM SystemSample WHERE hostname LIKE '%payment%'",
    status: 'active',
    threshold: '> 80%',
    lastTriggered: '2 hours ago',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Database Connection Pool',
    service: 'user-service',
    provider: 'Datadog',
    query: "avg:postgresql.connections{service:user-service}",
    status: 'paused',
    threshold: '> 90',
    lastTriggered: 'Never',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'API Response Time',
    service: 'auth-service',
    provider: 'New Relic',
    query: "SELECT percentile(duration, 95) FROM Transaction WHERE appName = 'auth-service'",
    status: 'active',
    threshold: '> 2000ms',
    lastTriggered: '1 day ago',
    createdAt: '2024-01-08'
  }
];

export const AlertsList = () => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alerts, setAlerts] = useState(mockAlerts);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || alert.provider.toLowerCase().includes(filterProvider.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesProvider && matchesStatus;
  });

  const handleCreateAlert = () => {
    alert('Criar Alerta - Redirecionando para página de criação de alerta...');
    window.location.href = '/create';
  };

  const handleToggleStatus = (alertId: number) => {
    setAlerts(prev => prev.map(alertItem => 
      alertItem.id === alertId 
        ? { ...alertItem, status: alertItem.status === 'active' ? 'paused' : 'active' }
        : alertItem
    ));
    
    const alertItem = alerts.find(a => a.id === alertId);
    const newStatus = alertItem?.status === 'active' ? 'pausado' : 'ativado';
    window.alert(`Status Alterado - Alerta "${alertItem?.name}" foi ${newStatus}`);
  };

  const handleEditAlert = (alertId: number) => {
    const alertItem = alerts.find(a => a.id === alertId);
    window.alert(`Editar Alerta - Editando alerta: ${alertItem?.name}`);
  };

  const handleViewExternal = (alertId: number) => {
    const alertItem = alerts.find(a => a.id === alertId);
    window.alert(`Link Externo - Abrindo ${alertItem?.provider} para o alerta: ${alertItem?.name}`);
  };

  const handleDeleteAlert = (alertId: number) => {
    const alertItem = alerts.find(a => a.id === alertId);
    
    if (window.confirm(`Tem certeza que deseja excluir o alerta "${alertItem?.name}"?`)) {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      window.alert(`Alerta Excluído - Alerta "${alertItem?.name}" foi removido com sucesso`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterProvider('all');
    setFilterStatus('all');
    window.alert('Filtros Limpos - Todos os filtros foram removidos');
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div>
          <Typography variant="h4" component="h2">
            Alert Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage and configure your monitoring alerts
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusIcon />}
          onClick={handleCreateAlert}
        >
          Create Alert
        </Button>
      </div>

      {/* Filters */}
      <Card className={classes.filtersCard}>
        <CardContent>
          <div className={classes.filterRow}>
            <TextField
              className={classes.searchField}
              placeholder="Search alerts or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
            />
            
            <FormControl className={classes.selectField}>
              <InputLabel>Provider</InputLabel>
              <Select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value as string)}
                startAdornment={<FilterIcon />}
              >
                <MenuItem value="all">All Providers</MenuItem>
                <MenuItem value="new relic">New Relic</MenuItem>
                <MenuItem value="datadog">Datadog</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.selectField}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as string)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Grid */}
      <div>
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={classes.alertCard}>
            <CardContent className={classes.alertContent}>
              <div className={classes.alertHeader}>
                <div style={{ flex: 1 }}>
                  <Typography variant="h6" component="h3">
                    {alert.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Service: {alert.service}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Threshold: {alert.threshold}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last Triggered: {alert.lastTriggered}
                  </Typography>
                  
                  <Box mt={1}>
                    <Chip
                      label={alert.status}
                      color={alert.status === 'active' ? 'primary' : 'default'}
                      size="small"
                      className={classes.statusChip}
                    />
                    <Chip
                      label={alert.provider}
                      variant="outlined"
                      size="small"
                      className={classes.providerChip}
                    />
                  </Box>
                </div>
                
                <div className={classes.alertActions}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleStatus(alert.id)}
                    color={alert.status === 'active' ? 'primary' : 'default'}
                  >
                    {alert.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEditAlert(alert.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleViewExternal(alert.id)}
                  >
                    <ExternalLinkIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAlert(alert.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Typography variant="body2" color="textSecondary">
                <strong>Query:</strong> {alert.query}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
