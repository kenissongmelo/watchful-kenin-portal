import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Box,
  Grid,
  Paper,
  Divider
} from '@material-ui/core';
import {
  Notifications as BellIcon,
  Warning as AlertTriangleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ClockIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as ActivityIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  statsGrid: {
    marginBottom: theme.spacing(4),
  },
  statCard: {
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  statDescription: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  contentGrid: {
    marginTop: theme.spacing(3),
  },
  contentCard: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
  },
  alertItem: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(0.5),
  },
  alertMeta: {
    display: 'flex',
    gap: theme.spacing(1),
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  progressItem: {
    marginBottom: theme.spacing(2),
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  },
}));

const mockStats = {
  totalAlerts: 24,
  activeAlerts: 3,
  resolvedToday: 8,
  avgResponseTime: '2.3m'
};

const mockRecentAlerts = [
  {
    id: 1,
    title: 'High CPU Usage - Payment Service',
    provider: 'New Relic',
    status: 'critical',
    timestamp: '2 minutes ago',
    service: 'payment-api'
  },
  {
    id: 2,
    title: 'Database Connection Pool Exhausted',
    provider: 'Datadog',
    status: 'warning',
    timestamp: '15 minutes ago',
    service: 'user-service'
  },
  {
    id: 3,
    title: 'API Response Time Degradation',
    provider: 'New Relic',
    status: 'resolved',
    timestamp: '1 hour ago',
    service: 'auth-service'
  }
];

export const Dashboard = () => {
  const classes = useStyles();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'error';
      case 'warning': return 'default';
      case 'resolved': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className={classes.root}>
      {/* Stats Cards */}
      <Grid container spacing={3} className={classes.statsGrid}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent>
              <div className={classes.statHeader}>
                <Typography variant="body2" style={{ fontWeight: 500 }}>
                  Total Alerts
                </Typography>
                <BellIcon color="primary" />
              </div>
              <Typography className={classes.statValue}>
                {mockStats.totalAlerts}
              </Typography>
              <Typography className={classes.statDescription}>
                Active monitoring rules
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent>
              <div className={classes.statHeader}>
                <Typography variant="body2" style={{ fontWeight: 500 }}>
                  Active Alerts
                </Typography>
                <AlertTriangleIcon color="error" />
              </div>
              <Typography className={classes.statValue}>
                {mockStats.activeAlerts}
              </Typography>
              <Typography className={classes.statDescription}>
                Require attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent>
              <div className={classes.statHeader}>
                <Typography variant="body2" style={{ fontWeight: 500 }}>
                  Resolved Today
                </Typography>
                <CheckCircleIcon color="primary" />
              </div>
              <Typography className={classes.statValue}>
                {mockStats.resolvedToday}
              </Typography>
              <Typography className={classes.statDescription}>
                Successfully handled
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent>
              <div className={classes.statHeader}>
                <Typography variant="body2" style={{ fontWeight: 500 }}>
                  Avg Response
                </Typography>
                <ClockIcon color="primary" />
              </div>
              <Typography className={classes.statValue}>
                {mockStats.avgResponseTime}
              </Typography>
              <Typography className={classes.statDescription}>
                Mean time to resolve
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3} className={classes.contentGrid}>
        {/* Recent Alerts */}
        <Grid item xs={12} md={6}>
          <Card className={classes.contentCard}>
            <CardContent>
              <Typography className={classes.sectionTitle}>
                Recent Alerts
              </Typography>
              {mockRecentAlerts.map((alert) => (
                <div key={alert.id} className={classes.alertItem}>
                  <div className={classes.alertHeader}>
                    <Typography variant="body2" style={{ fontWeight: 500 }}>
                      {alert.title}
                    </Typography>
                    <Chip
                      label={alert.status}
                      size="small"
                      color={getStatusColor(alert.status) as any}
                    />
                  </div>
                  <div className={classes.alertMeta}>
                    <span>{alert.provider}</span>
                    <span>•</span>
                    <span>{alert.service}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={6}>
          <Card className={classes.contentCard}>
            <CardContent>
              <Typography className={classes.sectionTitle}>
                System Health
              </Typography>
              
              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <Typography variant="body2" style={{ fontWeight: 500 }}>
                    API Response Time
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    95%
                  </Typography>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={95} 
                  style={{ height: 6, borderRadius: 3 }}
                />
              </div>

              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <Typography variant="body2" style={{ fontWeight: 500 }}>
                    Database Performance
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    88%
                  </Typography>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={88} 
                  style={{ height: 6, borderRadius: 3 }}
                />
              </div>

              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <Typography variant="body2" style={{ fontWeight: 500 }}>
                    Memory Usage
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    72%
                  </Typography>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={72} 
                  style={{ height: 6, borderRadius: 3 }}
                />
              </div>

              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <Typography variant="body2" style={{ fontWeight: 500 }}>
                    CPU Utilization
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    65%
                  </Typography>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  style={{ height: 6, borderRadius: 3 }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
