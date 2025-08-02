"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@material-ui/core");
var icons_1 = require("@material-ui/icons");
var styles_1 = require("@material-ui/core/styles");
var useStyles = (0, styles_1.makeStyles)(function (theme) { return ({
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
        borderRight: "1px solid ".concat(theme.palette.divider),
    },
    drawerPaperCollapsed: {
        width: 64,
    },
    header: {
        padding: theme.spacing(2),
        borderBottom: "1px solid ".concat(theme.palette.divider),
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
        borderTop: "1px solid ".concat(theme.palette.divider),
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
}); });
var navigationItems = [
    {
        name: 'Dashboard',
        icon: icons_1.Dashboard,
        description: 'Overview of all alerts',
        action: function () { return alert('Dashboard clicked'); }
    },
    {
        name: 'Alerts',
        icon: icons_1.Notifications,
        description: 'Manage your alerts',
        action: function () { return alert('Alerts clicked'); }
    },
    {
        name: 'Create Alert',
        icon: icons_1.Add,
        description: 'Add new alert',
        action: function () { return alert('Create Alert clicked'); }
    },
    {
        name: 'Providers',
        icon: icons_1.Settings,
        description: 'Configure monitoring providers',
        action: function () { return alert('Providers clicked'); }
    },
];
var Sidebar = function () {
    var _a = (0, react_1.useState)(false), collapsed = _a[0], setCollapsed = _a[1];
    var classes = useStyles();
    return (<core_1.Drawer variant="permanent" className={"".concat(classes.drawer, " ").concat(collapsed ? classes.drawerCollapsed : '')} classes={{
            paper: "".concat(classes.drawerPaper, " ").concat(collapsed ? classes.drawerPaperCollapsed : ''),
        }}>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          {!collapsed && (<core_1.Box display="flex" alignItems="center" style={{ gap: 8 }}>
              <div className={classes.logo}>
                KD
              </div>
              <core_1.Typography variant="h6" style={{ fontWeight: 600 }}>
                KeninDuty
              </core_1.Typography>
            </core_1.Box>)}
          <core_1.IconButton size="small" onClick={function () { return setCollapsed(!collapsed); }} className={classes.collapseButton}>
            {collapsed ? <icons_1.ChevronRight /> : <icons_1.ChevronLeft />}
          </core_1.IconButton>
        </div>
      </div>

      <core_1.List>
        {navigationItems.map(function (item) { return (<core_1.ListItem key={item.name} button onClick={item.action} className={"".concat(classes.navItem, " ").concat(collapsed ? classes.navItemCollapsed : '')}>
            <core_1.ListItemIcon className={classes.navItemIcon}>
              <item.icon />
            </core_1.ListItemIcon>
            {!collapsed && (<core_1.ListItemText primary={item.name} secondary={item.description} primaryTypographyProps={{
                    variant: 'body2',
                    style: { fontWeight: 500 }
                }} secondaryTypographyProps={{
                    variant: 'caption',
                    color: 'textSecondary'
                }}/>)}
          </core_1.ListItem>); })}
      </core_1.List>

      <div className={classes.statusSection}>
        <core_1.Box display="flex" alignItems="center" style={{ gap: 8 }}>
          <core_1.Chip icon={<icons_1.CheckCircle />} label="ON" className={classes.statusChip} size="small"/>
          {!collapsed && (<core_1.Box flex={1}>
              <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                Connected
              </core_1.Typography>
              <core_1.Typography variant="caption" color="textSecondary">
                All systems operational
              </core_1.Typography>
            </core_1.Box>)}
        </core_1.Box>
      </div>
    </core_1.Drawer>);
};
exports.Sidebar = Sidebar;
