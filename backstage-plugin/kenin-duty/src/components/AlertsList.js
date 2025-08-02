"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AlertsList = void 0;
var react_1 = __importStar(require("react"));
var core_1 = require("@material-ui/core");
var icons_1 = require("@material-ui/icons");
var styles_1 = require("@material-ui/core/styles");
var useStyles = (0, styles_1.makeStyles)(function (theme) { return ({
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
}); });
var mockAlerts = [
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
var AlertsList = function () {
    var classes = useStyles();
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)('all'), filterProvider = _b[0], setFilterProvider = _b[1];
    var _c = (0, react_1.useState)('all'), filterStatus = _c[0], setFilterStatus = _c[1];
    var _d = (0, react_1.useState)(mockAlerts), alerts = _d[0], setAlerts = _d[1];
    var filteredAlerts = alerts.filter(function (alert) {
        var matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.service.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesProvider = filterProvider === 'all' || alert.provider.toLowerCase().includes(filterProvider.toLowerCase());
        var matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
        return matchesSearch && matchesProvider && matchesStatus;
    });
    var handleCreateAlert = function () {
        alert('Criar Alerta - Redirecionando para página de criação de alerta...');
        window.location.href = '/create';
    };
    var handleToggleStatus = function (alertId) {
        setAlerts(function (prev) { return prev.map(function (alert) {
            return alert.id === alertId
                ? __assign(__assign({}, alert), { status: alert.status === 'active' ? 'paused' : 'active' }) : alert;
        }); });
        var alert = alerts.find(function (a) { return a.id === alertId; });
        var newStatus = (alert === null || alert === void 0 ? void 0 : alert.status) === 'active' ? 'pausado' : 'ativado';
        alert("Status Alterado - Alerta \"".concat(alert === null || alert === void 0 ? void 0 : alert.name, "\" foi ").concat(newStatus));
    };
    var handleEditAlert = function (alertId) {
        var alert = alerts.find(function (a) { return a.id === alertId; });
        alert("Editar Alerta - Editando alerta: ".concat(alert === null || alert === void 0 ? void 0 : alert.name));
    };
    var handleViewExternal = function (alertId) {
        var alert = alerts.find(function (a) { return a.id === alertId; });
        alert("Link Externo - Abrindo ".concat(alert === null || alert === void 0 ? void 0 : alert.provider, " para o alerta: ").concat(alert === null || alert === void 0 ? void 0 : alert.name));
    };
    var handleDeleteAlert = function (alertId) {
        var alert = alerts.find(function (a) { return a.id === alertId; });
        if (window.confirm("Tem certeza que deseja excluir o alerta \"".concat(alert === null || alert === void 0 ? void 0 : alert.name, "\"?"))) {
            setAlerts(function (prev) { return prev.filter(function (a) { return a.id !== alertId; }); });
            alert("Alerta Exclu\u00EDdo - Alerta \"".concat(alert === null || alert === void 0 ? void 0 : alert.name, "\" foi removido com sucesso"));
        }
    };
    var handleClearFilters = function () {
        setSearchTerm('');
        setFilterProvider('all');
        setFilterStatus('all');
        alert('Filtros Limpos - Todos os filtros foram removidos');
    };
    return (<div className={classes.root}>
      <div className={classes.header}>
        <div>
          <core_1.Typography variant="h4" component="h2">
            Alert Management
          </core_1.Typography>
          <core_1.Typography variant="body2" color="textSecondary">
            Manage and configure your monitoring alerts
          </core_1.Typography>
        </div>
        <core_1.Button variant="contained" color="primary" startIcon={<icons_1.Add />} onClick={handleCreateAlert}>
          Create Alert
        </core_1.Button>
      </div>

      {/* Filters */}
      <core_1.Card className={classes.filtersCard}>
        <core_1.CardContent>
          <div className={classes.filterRow}>
            <core_1.TextField className={classes.searchField} placeholder="Search alerts or services..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} InputProps={{
            startAdornment: <icons_1.Search color="action"/>,
        }}/>
            
            <core_1.FormControl className={classes.selectField}>
              <core_1.InputLabel>Provider</core_1.InputLabel>
              <core_1.Select value={filterProvider} onChange={function (e) { return setFilterProvider(e.target.value); }} startAdornment={<icons_1.FilterList />}>
                <core_1.MenuItem value="all">All Providers</core_1.MenuItem>
                <core_1.MenuItem value="new relic">New Relic</core_1.MenuItem>
                <core_1.MenuItem value="datadog">Datadog</core_1.MenuItem>
              </core_1.Select>
            </core_1.FormControl>

            <core_1.FormControl className={classes.selectField}>
              <core_1.InputLabel>Status</core_1.InputLabel>
              <core_1.Select value={filterStatus} onChange={function (e) { return setFilterStatus(e.target.value); }}>
                <core_1.MenuItem value="all">All Status</core_1.MenuItem>
                <core_1.MenuItem value="active">Active</core_1.MenuItem>
                <core_1.MenuItem value="paused">Paused</core_1.MenuItem>
              </core_1.Select>
            </core_1.FormControl>

            <core_1.Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
            </core_1.Button>
          </div>
        </core_1.CardContent>
      </core_1.Card>

      {/* Alerts Grid */}
      <div>
        {filteredAlerts.map(function (alert) { return (<core_1.Card key={alert.id} className={classes.alertCard}>
            <core_1.CardContent className={classes.alertContent}>
              <div className={classes.alertHeader}>
                <div style={{ flex: 1 }}>
                  <core_1.Typography variant="h6" component="h3">
                    {alert.name}
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    Service: {alert.service}
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    Threshold: {alert.threshold}
                  </core_1.Typography>
                  <core_1.Typography variant="body2" color="textSecondary">
                    Last Triggered: {alert.lastTriggered}
                  </core_1.Typography>
                  
                  <core_1.Box mt={1}>
                    <core_1.Chip label={alert.status} color={alert.status === 'active' ? 'primary' : 'default'} size="small" className={classes.statusChip}/>
                    <core_1.Chip label={alert.provider} variant="outlined" size="small" className={classes.providerChip}/>
                  </core_1.Box>
                </div>
                
                <div className={classes.alertActions}>
                  <core_1.IconButton size="small" onClick={function () { return handleToggleStatus(alert.id); }} color={alert.status === 'active' ? 'primary' : 'default'}>
                    {alert.status === 'active' ? <icons_1.Pause /> : <icons_1.PlayArrow />}
                  </core_1.IconButton>
                  <core_1.IconButton size="small" onClick={function () { return handleEditAlert(alert.id); }}>
                    <icons_1.Edit />
                  </core_1.IconButton>
                  <core_1.IconButton size="small" onClick={function () { return handleViewExternal(alert.id); }}>
                    <icons_1.OpenInNew />
                  </core_1.IconButton>
                  <core_1.IconButton size="small" onClick={function () { return handleDeleteAlert(alert.id); }} color="secondary">
                    <icons_1.Delete />
                  </core_1.IconButton>
                </div>
              </div>
              
              <core_1.Divider style={{ margin: '16px 0' }}/>
              
              <core_1.Typography variant="body2" color="textSecondary">
                <strong>Query:</strong> {alert.query}
              </core_1.Typography>
            </core_1.CardContent>
          </core_1.Card>); })}
      </div>
    </div>);
};
exports.AlertsList = AlertsList;
