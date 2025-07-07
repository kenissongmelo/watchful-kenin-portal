import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Notifications as BellIcon,
  Add as PlusIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerCollapsed: {
    width: 64,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  drawerPaperCollapsed: {
    width: 64,
  },
  header: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  navItem: {
    margin: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  navItemCollapsed: {
    justifyContent: 'center',
    minHeight: 48,
  },
  navItemIcon: {
    color: theme.palette.text.secondary,
  },
  statusSection: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  statusChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  collapseButton: {
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const navigationItems = [
  { 
    name: 'Dashboard', 
    icon: DashboardIcon,
    description: 'Overview of all alerts',
    action: () => alert('Dashboard clicked')
  },
  { 
    name: 'Alerts', 
    icon: BellIcon,
    description: 'Manage your alerts',
    action: () => alert('Alerts clicked')
  },
  { 
    name: 'Create Alert', 
    icon: PlusIcon,
    description: 'Add new alert',
    action: () => alert('Create Alert clicked')
  },
  { 
    name: 'Providers', 
    icon: SettingsIcon,
    description: 'Configure monitoring providers',
    action: () => alert('Providers clicked')
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={`${classes.drawer} ${collapsed ? classes.drawerCollapsed : ''}`}
      classes={{
        paper: `${classes.drawerPaper} ${collapsed ? classes.drawerPaperCollapsed : ''}`,
      }}
    >
      <div className={classes.header}>
        <div className={classes.headerContent}>
          {!collapsed && (
            <Box display="flex" alignItems="center" style={{ gap: 8 }}>
              <div className={classes.logo}>
                KD
              </div>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                KeninDuty
              </Typography>
            </Box>
          )}
          <IconButton
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            className={classes.collapseButton}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
      </div>

      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.name}
            button
            onClick={item.action}
            className={`${classes.navItem} ${collapsed ? classes.navItemCollapsed : ''}`}
          >
            <ListItemIcon className={classes.navItemIcon}>
              <item.icon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={item.name}
                secondary={item.description}
                primaryTypographyProps={{ 
                  variant: 'body2', 
                  style: { fontWeight: 500 } 
                }}
                secondaryTypographyProps={{ 
                  variant: 'caption',
                  color: 'textSecondary'
                }}
              />
            )}
          </ListItem>
        ))}
      </List>

      <div className={classes.statusSection}>
        <Box display="flex" alignItems="center" style={{ gap: 8 }}>
          <Chip
            icon={<CheckCircleIcon />}
            label="ON"
            className={classes.statusChip}
            size="small"
          />
          {!collapsed && (
            <Box flex={1}>
              <Typography variant="body2" style={{ fontWeight: 500 }}>
                Connected
              </Typography>
              <Typography variant="caption" color="textSecondary">
                All systems operational
              </Typography>
            </Box>
          )}
        </Box>
      </div>
    </Drawer>
  );
};
