"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
var react_1 = __importDefault(require("react"));
var core_1 = require("@material-ui/core");
var icons_1 = require("@material-ui/icons");
var styles_1 = require("@material-ui/core/styles");
var useStyles = (0, styles_1.makeStyles)(function (theme) { return ({
    root: {
        padding: theme.spacing(3),
    },
    statsGrid: {
        marginBottom: theme.spacing(4),
    },
    statCard: {
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        border: "1px solid ".concat(theme.palette.divider),
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
        border: "1px solid ".concat(theme.palette.divider),
        borderRadius: theme.spacing(1),
    },
    alertItem: {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.spacing(1),
        marginBottom: theme.spacing(1),
        border: "1px solid ".concat(theme.palette.divider),
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
}); });
var mockStats = {
    totalAlerts: 24,
    activeAlerts: 3,
    resolvedToday: 8,
    avgResponseTime: '2.3m'
};
var mockRecentAlerts = [
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
var Dashboard = function () {
    var classes = useStyles();
    var getStatusColor = function (status) {
        switch (status) {
            case 'critical': return 'error';
            case 'warning': return 'default';
            case 'resolved': return 'default';
            default: return 'default';
        }
    };
    return (<div className={classes.root}>
      {/* Stats Cards */}
      <core_1.Grid container spacing={3} className={classes.statsGrid}>
        <core_1.Grid item xs={12} sm={6} md={3}>
          <core_1.Card className={classes.statCard}>
            <core_1.CardContent>
              <div className={classes.statHeader}>
                <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                  Total Alerts
                </core_1.Typography>
                <icons_1.Notifications color="primary"/>
              </div>
              <core_1.Typography className={classes.statValue}>
                {mockStats.totalAlerts}
              </core_1.Typography>
              <core_1.Typography className={classes.statDescription}>
                Active monitoring rules
              </core_1.Typography>
            </core_1.CardContent>
          </core_1.Card>
        </core_1.Grid>

        <core_1.Grid item xs={12} sm={6} md={3}>
          <core_1.Card className={classes.statCard}>
            <core_1.CardContent>
              <div className={classes.statHeader}>
                <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                  Active Alerts
                </core_1.Typography>
                <icons_1.Warning color="error"/>
              </div>
              <core_1.Typography className={classes.statValue}>
                {mockStats.activeAlerts}
              </core_1.Typography>
              <core_1.Typography className={classes.statDescription}>
                Require attention
              </core_1.Typography>
            </core_1.CardContent>
          </core_1.Card>
        </core_1.Grid>

        <core_1.Grid item xs={12} sm={6} md={3}>
          <core_1.Card className={classes.statCard}>
            <core_1.CardContent>
              <div className={classes.statHeader}>
                <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                  Resolved Today
                </core_1.Typography>
                <icons_1.CheckCircle color="primary"/>
              </div>
              <core_1.Typography className={classes.statValue}>
                {mockStats.resolvedToday}
              </core_1.Typography>
              <core_1.Typography className={classes.statDescription}>
                Successfully handled
              </core_1.Typography>
            </core_1.CardContent>
          </core_1.Card>
        </core_1.Grid>

        <core_1.Grid item xs={12} sm={6} md={3}>
          <core_1.Card className={classes.statCard}>
            <core_1.CardContent>
              <div className={classes.statHeader}>
                <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                  Avg Response
                </core_1.Typography>
                <icons_1.Schedule color="primary"/>
              </div>
              <core_1.Typography className={classes.statValue}>
                {mockStats.avgResponseTime}
              </core_1.Typography>
              <core_1.Typography className={classes.statDescription}>
                Mean time to resolve
              </core_1.Typography>
            </core_1.CardContent>
          </core_1.Card>
        </core_1.Grid>
      </core_1.Grid>

      {/* Content Grid */}
      <core_1.Grid container spacing={3} className={classes.contentGrid}>
        {/* Recent Alerts */}
        <core_1.Grid item xs={12} md={6}>
          <core_1.Card className={classes.contentCard}>
            <core_1.CardContent>
              <core_1.Typography className={classes.sectionTitle}>
                Recent Alerts
              </core_1.Typography>
              {mockRecentAlerts.map(function (alert) { return (<div key={alert.id} className={classes.alertItem}>
                  <div className={classes.alertHeader}>
                    <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                      {alert.title}
                    </core_1.Typography>
                    <core_1.Chip label={alert.status} size="small" color={getStatusColor(alert.status)}/>
                  </div>
                  <div className={classes.alertMeta}>
                    <span>{alert.provider}</span>
                    <span>•</span>
                    <span>{alert.service}</span>
                    <span>•</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>); })}
            </core_1.CardContent>
          </core_1.Card>
        </core_1.Grid>

        {/* System Health */}
        <core_1.Grid item xs={12} md={6}>
          <core_1.Card className={classes.contentCard}>
            <core_1.CardContent>
              <core_1.Typography className={classes.sectionTitle}>
                System Health
              </core_1.Typography>
              
              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                    API Response Time
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    95%
                  </core_1.Typography>
                </div>
                <core_1.LinearProgress variant="determinate" value={95} style={{ height: 6, borderRadius: 3 }}/>
              </div>

              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                    Database Performance
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    88%
                  </core_1.Typography>
                </div>
                <core_1.LinearProgress variant="determinate" value={88} style={{ height: 6, borderRadius: 3 }}/>
              </div>

              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                    Memory Usage
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    72%
                  </core_1.Typography>
                </div>
                <core_1.LinearProgress variant="determinate" value={72} style={{ height: 6, borderRadius: 3 }}/>
              </div>

              <div className={classes.progressItem}>
                <div className={classes.progressHeader}>
                  <core_1.Typography variant="body2" style={{ fontWeight: 500 }}>
                    CPU Utilization
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    65%
                  </core_1.Typography>
                </div>
                <core_1.LinearProgress variant="determinate" value={65} style={{ height: 6, borderRadius: 3 }}/>
              </div>
            </core_1.CardContent>
          </core_1.Card>
        </core_1.Grid>
      </core_1.Grid>
    </div>);
};
exports.Dashboard = Dashboard;
