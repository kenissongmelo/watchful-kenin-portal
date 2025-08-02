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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeninDutyPage = void 0;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var AlertCard_1 = require("./AlertCard");
var DesignSystem_1 = require("./DesignSystem");
var API_BASE = 'http://localhost:7007/api/keninduty';
var KeninDutyPage = function () {
    var theme = (0, material_1.useTheme)();
    var _a = (0, react_1.useState)(0), tabValue = _a[0], setTabValue = _a[1];
    var _b = (0, react_1.useState)([]), teams = _b[0], setTeams = _b[1];
    var _c = (0, react_1.useState)([]), alerts = _c[0], setAlerts = _c[1];
    var _d = (0, react_1.useState)([]), callAttempts = _d[0], setCallAttempts = _d[1];
    var _e = (0, react_1.useState)(null), stats = _e[0], setStats = _e[1];
    var _f = (0, react_1.useState)(false), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)({
        open: false,
        message: '',
        severity: 'success'
    }), snackbar = _g[0], setSnackbar = _g[1];
    // Dialog states
    var _h = (0, react_1.useState)(false), createAlertDialog = _h[0], setCreateAlertDialog = _h[1];
    var _j = (0, react_1.useState)(false), alertHistoryDialog = _j[0], setAlertHistoryDialog = _j[1];
    var _k = (0, react_1.useState)(null), selectedAlert = _k[0], setSelectedAlert = _k[1];
    var _l = (0, react_1.useState)({
        title: '',
        description: '',
        severity: 'medium',
        provider: 'datadog',
        teamId: '',
        query: ''
    }), alertForm = _l[0], setAlertForm = _l[1];
    // Pagination states
    var _m = (0, react_1.useState)(0), alertsPage = _m[0], setAlertsPage = _m[1];
    var _o = (0, react_1.useState)(6), alertsRowsPerPage = _o[0], setAlertsRowsPerPage = _o[1];
    // Filter states
    var _p = (0, react_1.useState)(''), alertSearchTerm = _p[0], setAlertSearchTerm = _p[1];
    var _q = (0, react_1.useState)('all'), alertStatusFilter = _q[0], setAlertStatusFilter = _q[1];
    var _r = (0, react_1.useState)('all'), alertSeverityFilter = _r[0], setAlertSeverityFilter = _r[1];
    var _s = (0, react_1.useState)('all'), alertProviderFilter = _s[0], setAlertProviderFilter = _s[1];
    (0, react_1.useEffect)(function () {
        fetchData();
    }, []);
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, teamsRes, alertsRes, statsRes, teamsData, alertsData, allAttempts, statsData, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    return [4 /*yield*/, Promise.all([
                            fetch("".concat(API_BASE, "/teams")),
                            fetch("".concat(API_BASE, "/alerts")),
                            fetch("".concat(API_BASE, "/stats"))
                        ])];
                case 2:
                    _a = _b.sent(), teamsRes = _a[0], alertsRes = _a[1], statsRes = _a[2];
                    if (!teamsRes.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, teamsRes.json()];
                case 3:
                    teamsData = _b.sent();
                    console.log('Teams loaded:', teamsData); // Debug log
                    setTeams(teamsData);
                    _b.label = 4;
                case 4:
                    if (!alertsRes.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, alertsRes.json()];
                case 5:
                    alertsData = _b.sent();
                    setAlerts(alertsData);
                    allAttempts = alertsData.flatMap(function (alert) {
                        return (alert.attempts || []).map(function (attempt) { return ({
                            id: "".concat(alert.id, "-").concat(attempt.timestamp),
                            alertId: alert.id,
                            teamMemberId: attempt.memberId || '',
                            status: attempt.status,
                            attemptNumber: (alert.attempts || []).indexOf(attempt) + 1,
                            startedAt: attempt.timestamp,
                            endedAt: attempt.timestamp,
                            duration: attempt.duration,
                            notes: attempt.notes
                        }); });
                    });
                    setCallAttempts(allAttempts);
                    _b.label = 6;
                case 6:
                    if (!statsRes.ok) return [3 /*break*/, 8];
                    return [4 /*yield*/, statsRes.json()];
                case 7:
                    statsData = _b.sent();
                    setStats(statsData.data || statsData);
                    _b.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    error_1 = _b.sent();
                    showSnackbar('Erro ao carregar dados', 'error');
                    return [3 /*break*/, 11];
                case 10:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var showSnackbar = function (message, severity) {
        setSnackbar({ open: true, message: message, severity: severity });
    };
    // Filtered alerts logic
    var filteredAlerts = alerts.filter(function (alert) {
        var _a;
        // Função para obter o texto de busca baseado no provider
        var getSearchText = function () {
            switch (alert.provider) {
                case 'newrelic':
                    return (alert.message || alert.description || alert.title || '').toLowerCase();
                case 'datadog':
                    return (alert.title || alert.description || '').toLowerCase();
                case 'grafana':
                    return (alert.description || alert.title || '').toLowerCase();
                default:
                    return (alert.description || alert.title || '').toLowerCase();
            }
        };
        var searchText = getSearchText();
        var matchesSearch = alertSearchTerm === '' ||
            searchText.includes(alertSearchTerm.toLowerCase()) ||
            ((_a = alert.provider) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(alertSearchTerm.toLowerCase()));
        var matchesStatus = alertStatusFilter === 'all' || alert.status === alertStatusFilter;
        var matchesSeverity = alertSeverityFilter === 'all' || alert.severity === alertSeverityFilter;
        var matchesProvider = alertProviderFilter === 'all' || alert.provider === alertProviderFilter;
        return matchesSearch && matchesStatus && matchesSeverity && matchesProvider;
    });
    // Reset filters
    var resetAlertFilters = function () {
        setAlertSearchTerm('');
        setAlertStatusFilter('all');
        setAlertSeverityFilter('all');
        setAlertProviderFilter('all');
        setAlertsPage(0); // Reset to first page
    };
    // Glassmorphism styles
    var glassmorphismStyle = {
        background: (0, material_1.alpha)(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: "1px solid ".concat((0, material_1.alpha)(theme.palette.divider, 0.2)),
        boxShadow: "0 8px 32px ".concat((0, material_1.alpha)(theme.palette.common.black, 0.1)),
    };
    var handleCreateAlert = function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, response, result, error, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!alertForm.title || !alertForm.description || !alertForm.teamId) {
                        showSnackbar('Preencha todos os campos obrigatórios', 'error');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    payload = {
                        severity: alertForm.severity,
                        teamId: alertForm.teamId,
                        query: alertForm.query,
                    };
                    // Adicionar campos específicos por provider
                    switch (alertForm.provider) {
                        case 'newrelic':
                            payload = __assign(__assign({}, payload), { title: "newrelic-".concat(Date.now()), description: alertForm.description, message: alertForm.title, nrqlQuery: alertForm.query });
                            break;
                        case 'datadog':
                            payload = __assign(__assign({}, payload), { title: alertForm.title, description: alertForm.description // Descrição adicional
                             });
                            break;
                        case 'grafana':
                            payload = __assign(__assign({}, payload), { title: "grafana-".concat(Date.now()), description: alertForm.title // Título legível para Grafana
                             });
                            break;
                    }
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/providers/").concat(alertForm.provider, "/alerts"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _b.sent();
                    showSnackbar("Alerta criado com sucesso! Provider ID: ".concat(result.providerAlertId, ". Team ID inclu\u00EDdo em owners: ").concat(((_a = result.owners) === null || _a === void 0 ? void 0 : _a[0]) || 'N/A'), 'success');
                    setCreateAlertDialog(false);
                    setAlertForm({
                        title: '',
                        description: '',
                        severity: 'medium',
                        provider: 'datadog',
                        teamId: '',
                        query: ''
                    });
                    fetchData();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    error = _b.sent();
                    showSnackbar("Erro ao criar alerta: ".concat(error.error), 'error');
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    showSnackbar('Erro ao criar alerta', 'error');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleShowAlertHistory = function (alert) {
        setSelectedAlert(alert);
        setAlertHistoryDialog(true);
    };
    var getSeverityColor = function (severity) {
        switch (severity === null || severity === void 0 ? void 0 : severity.toLowerCase()) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'default';
        }
    };
    var getStatusColor = function (status) {
        switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
            case 'active': return 'error';
            case 'resolved': return 'success';
            case 'acknowledged': return 'warning';
            default: return 'default';
        }
    };
    var getCallStatusColor = function (status) {
        switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
            case 'answered': return 'success';
            case 'no-answer': return 'warning';
            case 'failed': return 'error';
            case 'in-progress': return 'info';
            default: return 'default';
        }
    };
    var getCallStatusIcon = function (status) {
        switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
            case 'answered': return <icons_material_1.CheckCircle />;
            case 'no-answer': return <icons_material_1.Cancel />;
            case 'failed': return <icons_material_1.Error />;
            case 'in-progress': return <icons_material_1.Phone />;
            default: return <icons_material_1.Info />;
        }
    };
    return (<material_1.Box sx={{
            backgroundColor: 'background.default',
            p: 3
        }}>
      {/* Header */}
      <material_1.Box sx={{ mb: 4, textAlign: 'center' }}>
        <material_1.Typography variant="h3" component="h1" sx={{
            fontWeight: 'bold',
            mb: 1
        }}>
          🚀 KeninDuty
        </material_1.Typography>
        <material_1.Typography variant="h6" sx={{
            fontWeight: 300
        }}>
          Sistema de Gerenciamento de On-Call e Alertas
        </material_1.Typography>
      </material_1.Box>

      {/* Stats Cards */}
      <material_1.Grid container spacing={3} sx={{ mb: 4 }}>
        <material_1.Grid item xs={12} sm={6} md={3}>
          <DesignSystem_1.GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <material_1.Badge badgeContent={(stats === null || stats === void 0 ? void 0 : stats.activeAlerts) || 0} color="error">
              <icons_material_1.Warning sx={{ fontSize: 40, color: '#f44336' }}/>
            </material_1.Badge>
            <material_1.Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {(stats === null || stats === void 0 ? void 0 : stats.activeAlerts) || 0}
            </material_1.Typography>
            <DesignSystem_1.BodyText>
              Alertas Ativos
            </DesignSystem_1.BodyText>
          </DesignSystem_1.GlassCard>
        </material_1.Grid>

        <material_1.Grid item xs={12} sm={6} md={3}>
          <DesignSystem_1.GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <icons_material_1.Group sx={{ fontSize: 40, color: '#667eea' }}/>
            <material_1.Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {(stats === null || stats === void 0 ? void 0 : stats.totalTeams) || 0}
            </material_1.Typography>
            <DesignSystem_1.BodyText>
              Times
            </DesignSystem_1.BodyText>
          </DesignSystem_1.GlassCard>
        </material_1.Grid>

        <material_1.Grid item xs={12} sm={6} md={3}>
          <DesignSystem_1.GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <icons_material_1.Person sx={{ fontSize: 40, color: '#764ba2' }}/>
            <material_1.Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {(stats === null || stats === void 0 ? void 0 : stats.totalMembers) || 0}
            </material_1.Typography>
            <DesignSystem_1.BodyText>
              Membros
            </DesignSystem_1.BodyText>
          </DesignSystem_1.GlassCard>
        </material_1.Grid>

        <material_1.Grid item xs={12} sm={6} md={3}>
          <DesignSystem_1.GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <icons_material_1.Phone sx={{ fontSize: 40, color: '#4caf50' }}/>
            <material_1.Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {(stats === null || stats === void 0 ? void 0 : stats.totalCallAttempts) || 0}
            </material_1.Typography>
            <DesignSystem_1.BodyText>
              Chamadas
            </DesignSystem_1.BodyText>
          </DesignSystem_1.GlassCard>
        </material_1.Grid>
      </material_1.Grid>

      {/* Main Content */}
      <material_1.Box>
        {/* Header */}
        <material_1.Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DesignSystem_1.SectionTitle icon="📊">
            Alertas & Times
          </DesignSystem_1.SectionTitle>
          <DesignSystem_1.ModernButton startIcon={<icons_material_1.Add />} onClick={function () { return setCreateAlertDialog(true); }}>
            Criar Alerta
          </DesignSystem_1.ModernButton>
        </material_1.Box>

        {/* Filtros */}
        <DesignSystem_1.GlassCard sx={{ mb: 3 }}>
          <material_1.Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <material_1.TextField label="Buscar alertas" variant="outlined" size="small" placeholder="Título, descrição ou provider..." value={alertSearchTerm} onChange={function (e) { return setAlertSearchTerm(e.target.value); }} sx={{ minWidth: 250 }}/>
            <material_1.FormControl size="small" sx={{ minWidth: 120 }}>
              <material_1.InputLabel>Status</material_1.InputLabel>
              <material_1.Select label="Status" value={alertStatusFilter} onChange={function (e) { return setAlertStatusFilter(e.target.value); }}>
                <material_1.MenuItem value="all">Todos</material_1.MenuItem>
                <material_1.MenuItem value="active">Ativos</material_1.MenuItem>
                <material_1.MenuItem value="acknowledged">Reconhecidos</material_1.MenuItem>
                <material_1.MenuItem value="resolved">Resolvidos</material_1.MenuItem>
              </material_1.Select>
            </material_1.FormControl>
            <material_1.FormControl size="small" sx={{ minWidth: 120 }}>
              <material_1.InputLabel>Severidade</material_1.InputLabel>
              <material_1.Select label="Severidade" value={alertSeverityFilter} onChange={function (e) { return setAlertSeverityFilter(e.target.value); }}>
                <material_1.MenuItem value="all">Todas</material_1.MenuItem>
                <material_1.MenuItem value="critical">Crítica</material_1.MenuItem>
                <material_1.MenuItem value="high">Alta</material_1.MenuItem>
                <material_1.MenuItem value="medium">Média</material_1.MenuItem>
                <material_1.MenuItem value="low">Baixa</material_1.MenuItem>
              </material_1.Select>
            </material_1.FormControl>
            <material_1.FormControl size="small" sx={{ minWidth: 120 }}>
              <material_1.InputLabel>Provider</material_1.InputLabel>
              <material_1.Select label="Provider" value={alertProviderFilter} onChange={function (e) { return setAlertProviderFilter(e.target.value); }}>
                <material_1.MenuItem value="all">Todos</material_1.MenuItem>
                <material_1.MenuItem value="newrelic">New Relic</material_1.MenuItem>
                <material_1.MenuItem value="datadog">Datadog</material_1.MenuItem>
                <material_1.MenuItem value="grafana">Grafana</material_1.MenuItem>
              </material_1.Select>
            </material_1.FormControl>
            <material_1.Button variant="outlined" size="small" onClick={resetAlertFilters} startIcon={<icons_material_1.Clear />}>
              Limpar
            </material_1.Button>
          </material_1.Box>
        </DesignSystem_1.GlassCard>

        {/* Grid de Alertas */}
        {filteredAlerts.length > 0 ? (<>
            <material_1.Grid container spacing={3}>
              {filteredAlerts
                .slice(alertsPage * alertsRowsPerPage, alertsPage * alertsRowsPerPage + alertsRowsPerPage)
                .map(function (alert) {
                var _a;
                return (<material_1.Grid item xs={12} md={6} lg={4} key={alert.id}>
                  <AlertCard_1.AlertCard alert={alert} teamName={(_a = teams.find(function (t) { return t.id === alert.teamId; })) === null || _a === void 0 ? void 0 : _a.name} onShowHistory={handleShowAlertHistory} onCopyTeamId={function (teamId) {
                        navigator.clipboard.writeText(teamId);
                        showSnackbar('Team ID copiado!', 'success');
                    }}/>
                </material_1.Grid>);
            })}
            </material_1.Grid>
            
            {/* Paginação */}
            <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <material_1.Pagination count={Math.ceil(filteredAlerts.length / alertsRowsPerPage)} page={alertsPage + 1} onChange={function (event, page) { return setAlertsPage(page - 1); }} color="primary" showFirstButton showLastButton/>
            </material_1.Box>
            
            <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <material_1.Typography variant="body2" color="text.secondary">
                Mostrando {alertsPage * alertsRowsPerPage + 1} a {Math.min((alertsPage + 1) * alertsRowsPerPage, filteredAlerts.length)} de {filteredAlerts.length} alertas
              </material_1.Typography>
            </material_1.Box>
          </>) : (<DesignSystem_1.EmptyState icon="🚨" title="Nenhum alerta encontrado" description="Crie seu primeiro alerta clicando no botão 'Criar Alerta' ou aguarde alertas dos providers" action={<DesignSystem_1.ModernButton startIcon={<icons_material_1.Add />} onClick={function () { return setCreateAlertDialog(true); }}>
                Criar Primeiro Alerta
              </DesignSystem_1.ModernButton>}/>)}
      </material_1.Box>

      {/* Snackbar */}
      <material_1.Snackbar open={snackbar.open} autoHideDuration={6000} onClose={function () { return setSnackbar(__assign(__assign({}, snackbar), { open: false })); }}>
        <material_1.Alert onClose={function () { return setSnackbar(__assign(__assign({}, snackbar), { open: false })); }} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </material_1.Alert>
      </material_1.Snackbar>

      {/* Alert History Dialog */}
      <material_1.Dialog open={alertHistoryDialog} onClose={function () { return setAlertHistoryDialog(false); }} maxWidth="md" fullWidth>
        <material_1.DialogTitle>
          📋 Histórico do Alerta
          {selectedAlert && (<material_1.Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'normal' }}>
              {selectedAlert.provider === 'newrelic'
                ? (selectedAlert.message || selectedAlert.description || 'Alerta New Relic')
                : selectedAlert.provider === 'datadog'
                    ? (selectedAlert.title || selectedAlert.description || 'Alerta Datadog')
                    : (selectedAlert.description || selectedAlert.title || 'Alerta sem descrição')}
            </material_1.Typography>)}
        </material_1.DialogTitle>
        <material_1.DialogContent>
          {selectedAlert && (<material_1.Box>
              {/* Alert Info */}
              <material_1.Card sx={{ mb: 3 }}>
                <material_1.CardContent>
                  <material_1.Typography variant="h6" sx={{ mb: 2 }}>
                    Informações do Alerta
                  </material_1.Typography>
                  <material_1.Grid container spacing={2}>
                    <material_1.Grid item xs={12} sm={6}>
                      <material_1.Typography variant="body2">
                        <strong>ID:</strong> {selectedAlert.id}
                      </material_1.Typography>
                      <material_1.Typography variant="body2">
                        <strong>Provider ID:</strong> {selectedAlert.providerAlertId}
                      </material_1.Typography>
                      <material_1.Typography variant="body2">
                        <strong>Status:</strong> {selectedAlert.status}
                      </material_1.Typography>
                      <material_1.Typography variant="body2">
                        <strong>Severidade:</strong> {selectedAlert.severity}
                      </material_1.Typography>
                    </material_1.Grid>
                    <material_1.Grid item xs={12} sm={6}>
                      <material_1.Typography variant="body2">
                        <strong>Mensagem:</strong> {selectedAlert.provider === 'newrelic'
                ? (selectedAlert.message || selectedAlert.description || 'N/A')
                : selectedAlert.provider === 'datadog'
                    ? (selectedAlert.title || selectedAlert.description || 'N/A')
                    : (selectedAlert.description || selectedAlert.title || 'N/A')}
                      </material_1.Typography>
                      <material_1.Typography variant="body2">
                        <strong>Criado:</strong> {new Date(selectedAlert.createdAt).toLocaleString('pt-BR')}
                      </material_1.Typography>
                      {selectedAlert.acknowledgedAt && (<material_1.Typography variant="body2">
                          <strong>Reconhecido:</strong> {new Date(selectedAlert.acknowledgedAt).toLocaleString('pt-BR')}
                        </material_1.Typography>)}
                      {selectedAlert.resolvedAt && (<material_1.Typography variant="body2">
                          <strong>Resolvido:</strong> {new Date(selectedAlert.resolvedAt).toLocaleString('pt-BR')}
                        </material_1.Typography>)}
                      <material_1.Typography variant="body2">
                        <strong>Provider:</strong> {selectedAlert.provider}
                      </material_1.Typography>
                    </material_1.Grid>
                  </material_1.Grid>
                </material_1.CardContent>
              </material_1.Card>

              {/* Call Attempts */}
              <material_1.Card>
                <material_1.CardContent>
                  <material_1.Typography variant="h6" sx={{ mb: 2 }}>
                    Tentativas de Chamada
                  </material_1.Typography>
                  {selectedAlert.attempts && selectedAlert.attempts.length > 0 ? (<material_1.List>
                      {selectedAlert.attempts.map(function (attempt, index) { return (<react_1.default.Fragment key={index}>
                          <material_1.ListItem>
                            <material_1.ListItemText primary={<material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {getCallStatusIcon(attempt.status)}
                                  <material_1.Typography variant="body1">
                                    Tentativa {index + 1} - {attempt.status}
                                  </material_1.Typography>
                                  {attempt.memberName && (<material_1.Chip label={attempt.memberName} size="small" color="primary" variant="outlined"/>)}
                                </material_1.Box>} secondary={<material_1.Box>
                                  <material_1.Typography variant="body2">
                                    <strong>Horário:</strong> {new Date(attempt.timestamp).toLocaleString('pt-BR')}
                                  </material_1.Typography>
                                  {attempt.duration && (<material_1.Typography variant="body2">
                                      <strong>Duração:</strong> {Math.round(attempt.duration / 1000)}s
                                    </material_1.Typography>)}
                                  {attempt.notes && (<material_1.Typography variant="body2">
                                      <strong>Notas:</strong> {attempt.notes}
                                    </material_1.Typography>)}
                                  {attempt.callId && (<material_1.Typography variant="body2">
                                      <strong>Call ID:</strong> {attempt.callId}
                                    </material_1.Typography>)}
                                </material_1.Box>}/>
                          </material_1.ListItem>
                          {index < selectedAlert.attempts.length - 1 && <material_1.Divider />}
                        </react_1.default.Fragment>); })}
                    </material_1.List>) : (<material_1.Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      Nenhuma tentativa de chamada registrada para este alerta.
                    </material_1.Typography>)}
                </material_1.CardContent>
              </material_1.Card>
            </material_1.Box>)}
        </material_1.DialogContent>
        <material_1.DialogActions>
          <material_1.Button onClick={function () { return setAlertHistoryDialog(false); }}>
            Fechar
          </material_1.Button>
        </material_1.DialogActions>
      </material_1.Dialog>
    </material_1.Box>);
};
exports.KeninDutyPage = KeninDutyPage;
