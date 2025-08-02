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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeninDutyTeamsPage = void 0;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var DesignSystem_1 = require("./DesignSystem");
var API_BASE = 'http://localhost:7007/api/keninduty';
var KeninDutyTeamsPage = function () {
    var theme = (0, material_1.useTheme)();
    var _a = (0, react_1.useState)([]), teams = _a[0], setTeams = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(false), createTeamDialog = _c[0], setCreateTeamDialog = _c[1];
    var _d = (0, react_1.useState)(false), editTeamDialog = _d[0], setEditTeamDialog = _d[1];
    var _e = (0, react_1.useState)(null), editingTeam = _e[0], setEditingTeam = _e[1];
    var _f = (0, react_1.useState)(0), teamsPage = _f[0], setTeamsPage = _f[1];
    var teamsRowsPerPage = (0, react_1.useState)(6)[0];
    var _g = (0, react_1.useState)({
        open: false,
        message: '',
        severity: 'success'
    }), snackbar = _g[0], setSnackbar = _g[1];
    var _h = (0, react_1.useState)({
        name: '',
        members: [{ name: '', phone: '', email: '', role: 'primary' }],
        escalationPolicy: {
            retryCount: 3,
            retryIntervalMinutes: 5,
            escalationDelayMinutes: 15
        }
    }), teamForm = _h[0], setTeamForm = _h[1];
    var fetchTeams = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 6]);
                    setLoading(true);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/teams"))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    setTeams(data);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error fetching teams:', error_1);
                    showSnackbar('Erro ao carregar times', 'error');
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchTeams();
    }, []);
    var showSnackbar = function (message, severity) {
        setSnackbar({ open: true, message: message, severity: severity });
    };
    var handleCreateTeam = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/teams"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(teamForm)
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        showSnackbar('Time criado com sucesso!', 'success');
                        setCreateTeamDialog(false);
                        setTeamForm({
                            name: '',
                            members: [{ name: '', phone: '', email: '', role: 'primary' }],
                            escalationPolicy: { retryCount: 3, retryIntervalMinutes: 5, escalationDelayMinutes: 15 }
                        });
                        fetchTeams();
                    }
                    else {
                        showSnackbar(result.error || 'Erro ao criar time', 'error');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    showSnackbar('Erro ao criar time', 'error');
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    showSnackbar('Erro ao criar time', 'error');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleEditTeam = function (team) {
        setEditingTeam(team);
        setTeamForm({
            name: team.name,
            members: team.members.map(function (member) { return ({
                name: member.name,
                phone: member.phone,
                email: member.email,
                role: member.role
            }); }),
            escalationPolicy: team.escalationPolicy
        });
        setEditTeamDialog(true);
    };
    var handleUpdateTeam = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingTeam)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/teams/").concat(editingTeam.id), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(teamForm)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (result.success) {
                        showSnackbar('Time atualizado com sucesso!', 'success');
                        setEditTeamDialog(false);
                        setEditingTeam(null);
                        setTeamForm({
                            name: '',
                            members: [{ name: '', phone: '', email: '', role: 'primary' }],
                            escalationPolicy: { retryCount: 3, retryIntervalMinutes: 5, escalationDelayMinutes: 15 }
                        });
                        fetchTeams();
                    }
                    else {
                        showSnackbar(result.error || 'Erro ao atualizar time', 'error');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    showSnackbar('Erro ao atualizar time', 'error');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    showSnackbar('Erro ao atualizar time', 'error');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteTeam = function (teamId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Tem certeza que deseja excluir este time?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/teams/").concat(teamId), {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (result.success) {
                        showSnackbar('Time excluído com sucesso!', 'success');
                        fetchTeams();
                    }
                    else {
                        showSnackbar(result.error || 'Erro ao excluir time', 'error');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    showSnackbar('Erro ao excluir time', 'error');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    showSnackbar('Erro ao excluir time', 'error');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var getRoleColor = function (role) {
        switch (role) {
            case 'primary': return 'primary';
            case 'secondary': return 'secondary';
            case 'escalation': return 'warning';
            default: return 'default';
        }
    };
    var getRoleLabel = function (role) {
        switch (role) {
            case 'primary': return '1º';
            case 'secondary': return '2º';
            case 'escalation': return 'ESC';
            default: return role;
        }
    };
    return (<material_1.Box>
      {/* Header */}
      <material_1.Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DesignSystem_1.SectionTitle icon="👥">
          Gerenciamento de Times
        </DesignSystem_1.SectionTitle>
        <material_1.Box sx={{ display: 'flex', gap: 2 }}>
          <DesignSystem_1.ModernButton startIcon={<icons_material_1.Refresh />} onClick={fetchTeams} disabled={loading}>
            Atualizar
          </DesignSystem_1.ModernButton>
          <DesignSystem_1.ModernButton startIcon={<icons_material_1.Add />} onClick={function () { return setCreateTeamDialog(true); }}>
            Criar Time
          </DesignSystem_1.ModernButton>
        </material_1.Box>
      </material_1.Box>

      {/* Teams Grid */}
      {teams.length > 0 ? (<>
          <material_1.Grid container spacing={3}>
            {teams
                .slice(teamsPage * teamsRowsPerPage, teamsPage * teamsRowsPerPage + teamsRowsPerPage)
                .map(function (team) { return (<material_1.Grid item xs={12} md={6} lg={4} key={team.id}>
                <DesignSystem_1.GlassCard sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                    }
                }}>
                  <material_1.CardContent sx={{ flexGrow: 1 }}>
                    {/* Team Header */}
                    <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <material_1.Box sx={{ flexGrow: 1 }}>
                        <material_1.Typography variant="h6" sx={{
                    fontWeight: 'bold',
                    mb: 0.5,
                    color: theme.palette.primary.main,
                    fontSize: '1.1rem'
                }}>
                          {team.name}
                        </material_1.Typography>
                        <material_1.Chip label={"".concat(team.members.length, " membros")} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.75rem' }}/>
                      </material_1.Box>
                      <material_1.Box sx={{ display: 'flex', gap: 0.5 }}>
                        <material_1.IconButton size="small" onClick={function () { return handleEditTeam(team); }} sx={{
                    bgcolor: (0, material_1.alpha)(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': { bgcolor: (0, material_1.alpha)(theme.palette.primary.main, 0.2) }
                }}>
                          <icons_material_1.Edit fontSize="small"/>
                        </material_1.IconButton>
                        <material_1.IconButton size="small" onClick={function () { return handleDeleteTeam(team.id); }} sx={{
                    bgcolor: (0, material_1.alpha)(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    '&:hover': { bgcolor: (0, material_1.alpha)(theme.palette.error.main, 0.2) }
                }}>
                          <icons_material_1.Delete fontSize="small"/>
                        </material_1.IconButton>
                      </material_1.Box>
                    </material_1.Box>

                    {/* Team Members */}
                    <material_1.Box sx={{ mb: 3 }}>
                      <material_1.Typography variant="subtitle2" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    mb: 1
                }}>
                        👥 Membros
                      </material_1.Typography>
                      <material_1.Stack spacing={1}>
                        {team.members.slice(0, 3).map(function (member, index) { return (<material_1.Box key={member.id} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: (0, material_1.alpha)(theme.palette.background.paper, 0.5),
                        border: "1px solid ".concat((0, material_1.alpha)(theme.palette.divider, 0.1))
                    }}>
                            <material_1.Chip label={getRoleLabel(member.role)} size="small" color={getRoleColor(member.role)} sx={{
                        minWidth: 35,
                        fontSize: '0.7rem',
                        height: 20
                    }}/>
                            <material_1.Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <material_1.Typography variant="body2" sx={{
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                                {member.name}
                              </material_1.Typography>
                              <material_1.Typography variant="caption" sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.7rem'
                    }}>
                                {member.phone}
                              </material_1.Typography>
                            </material_1.Box>
                          </material_1.Box>); })}
                        {team.members.length > 3 && (<material_1.Typography variant="body2" color="text.secondary" sx={{
                        fontStyle: 'italic',
                        fontSize: '0.75rem',
                        textAlign: 'center'
                    }}>
                            +{team.members.length - 3} membros adicionais
                          </material_1.Typography>)}
                      </material_1.Stack>
                    </material_1.Box>

                    {/* Escalation Policy */}
                    <material_1.Box>
                      <material_1.Typography variant="subtitle2" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    mb: 1
                }}>
                        ⚙️ Política de Escalonamento
                      </material_1.Typography>
                      <material_1.Grid container spacing={1}>
                        <material_1.Grid item xs={4}>
                          <material_1.Box sx={{
                    textAlign: 'center',
                    p: 1,
                    bgcolor: (0, material_1.alpha)(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    border: "1px solid ".concat((0, material_1.alpha)(theme.palette.primary.main, 0.2))
                }}>
                            <material_1.Typography variant="h6" color="primary.main" sx={{ fontSize: '1rem' }}>
                              {team.escalationPolicy.retryCount}
                            </material_1.Typography>
                            <material_1.Typography variant="caption" color="primary.main" sx={{ fontSize: '0.65rem' }}>
                              Retries
                            </material_1.Typography>
                          </material_1.Box>
                        </material_1.Grid>
                        <material_1.Grid item xs={4}>
                          <material_1.Box sx={{
                    textAlign: 'center',
                    p: 1,
                    bgcolor: (0, material_1.alpha)(theme.palette.secondary.main, 0.1),
                    borderRadius: 1,
                    border: "1px solid ".concat((0, material_1.alpha)(theme.palette.secondary.main, 0.2))
                }}>
                            <material_1.Typography variant="h6" color="secondary.main" sx={{ fontSize: '1rem' }}>
                              {team.escalationPolicy.retryIntervalMinutes}
                            </material_1.Typography>
                            <material_1.Typography variant="caption" color="secondary.main" sx={{ fontSize: '0.65rem' }}>
                              Min
                            </material_1.Typography>
                          </material_1.Box>
                        </material_1.Grid>
                        <material_1.Grid item xs={4}>
                          <material_1.Box sx={{
                    textAlign: 'center',
                    p: 1,
                    bgcolor: (0, material_1.alpha)(theme.palette.warning.main, 0.1),
                    borderRadius: 1,
                    border: "1px solid ".concat((0, material_1.alpha)(theme.palette.warning.main, 0.2))
                }}>
                            <material_1.Typography variant="h6" color="warning.main" sx={{ fontSize: '1rem' }}>
                              {team.escalationPolicy.escalationDelayMinutes}
                            </material_1.Typography>
                            <material_1.Typography variant="caption" color="warning.main" sx={{ fontSize: '0.65rem' }}>
                              Delay
                            </material_1.Typography>
                          </material_1.Box>
                        </material_1.Grid>
                      </material_1.Grid>
                    </material_1.Box>
                  </material_1.CardContent>
                </DesignSystem_1.GlassCard>
              </material_1.Grid>); })}
          </material_1.Grid>
          
          {/* Pagination */}
          <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <material_1.Pagination count={Math.ceil(teams.length / teamsRowsPerPage)} page={teamsPage + 1} onChange={function (event, page) { return setTeamsPage(page - 1); }} color="primary" showFirstButton showLastButton/>
          </material_1.Box>
          
          <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <material_1.Typography variant="body2" color="text.secondary">
              Mostrando {teamsPage * teamsRowsPerPage + 1} a {Math.min((teamsPage + 1) * teamsRowsPerPage, teams.length)} de {teams.length} times
            </material_1.Typography>
          </material_1.Box>
        </>) : (<DesignSystem_1.EmptyState icon="👥" title="Nenhum time encontrado" description="Crie seu primeiro time clicando no botão 'Criar Time'" action={<DesignSystem_1.ModernButton startIcon={<icons_material_1.Add />} onClick={function () { return setCreateTeamDialog(true); }}>
              Criar Primeiro Time
            </DesignSystem_1.ModernButton>}/>)}

      {/* Create Team Dialog */}
      <material_1.Dialog open={createTeamDialog} onClose={function () { return setCreateTeamDialog(false); }} maxWidth="md" fullWidth>
        <material_1.DialogTitle>
          <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <icons_material_1.Add color="primary"/>
            <material_1.Typography variant="h6">Criar Novo Time</material_1.Typography>
          </material_1.Box>
        </material_1.DialogTitle>
        <material_1.DialogContent>
          <material_1.Box sx={{ mt: 2 }}>
            <material_1.TextField fullWidth label="Nome do Time" value={teamForm.name} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { name: e.target.value })); }} sx={{ mb: 3 }}/>

            <material_1.Typography variant="h6" sx={{ mb: 2 }}>
              Membros do Time
            </material_1.Typography>
            {teamForm.members.map(function (member, index) { return (<material_1.Card key={index} sx={{ mb: 2, p: 2 }}>
                <material_1.Grid container spacing={2}>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.TextField fullWidth label="Nome" value={member.name} onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].name = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}/>
                  </material_1.Grid>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.TextField fullWidth label="Telefone" value={member.phone} onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].phone = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}/>
                  </material_1.Grid>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.TextField fullWidth label="Email" value={member.email} onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].email = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}/>
                  </material_1.Grid>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.FormControl fullWidth>
                      <material_1.InputLabel>Função</material_1.InputLabel>
                      <material_1.Select value={member.role} label="Função" onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].role = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}>
                        <material_1.MenuItem value="primary">Primário</material_1.MenuItem>
                        <material_1.MenuItem value="secondary">Secundário</material_1.MenuItem>
                        <material_1.MenuItem value="escalation">Escalação</material_1.MenuItem>
                      </material_1.Select>
                    </material_1.FormControl>
                  </material_1.Grid>
                </material_1.Grid>
                {teamForm.members.length > 1 && (<material_1.IconButton onClick={function () {
                    var newMembers = teamForm.members.filter(function (_, i) { return i !== index; });
                    setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
                }} sx={{ mt: 1 }} color="error">
                    <icons_material_1.Delete />
                  </material_1.IconButton>)}
              </material_1.Card>); })}
            
            <material_1.Button startIcon={<icons_material_1.Add />} onClick={function () {
            setTeamForm(__assign(__assign({}, teamForm), { members: __spreadArray(__spreadArray([], teamForm.members, true), [{ name: '', phone: '', email: '', role: 'primary' }], false) }));
        }} sx={{ mb: 3 }}>
              Adicionar Membro
            </material_1.Button>

            <material_1.Typography variant="h6" sx={{ mb: 2 }}>
              Política de Escalonamento
            </material_1.Typography>
            <material_1.Grid container spacing={2}>
              <material_1.Grid item xs={12} sm={4}>
                <material_1.TextField fullWidth type="number" label="Número de Retries" value={teamForm.escalationPolicy.retryCount} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { escalationPolicy: __assign(__assign({}, teamForm.escalationPolicy), { retryCount: parseInt(e.target.value) || 0 }) })); }}/>
              </material_1.Grid>
              <material_1.Grid item xs={12} sm={4}>
                <material_1.TextField fullWidth type="number" label="Intervalo entre Retries (min)" value={teamForm.escalationPolicy.retryIntervalMinutes} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { escalationPolicy: __assign(__assign({}, teamForm.escalationPolicy), { retryIntervalMinutes: parseInt(e.target.value) || 0 }) })); }}/>
              </material_1.Grid>
              <material_1.Grid item xs={12} sm={4}>
                <material_1.TextField fullWidth type="number" label="Delay de Escalonamento (min)" value={teamForm.escalationPolicy.escalationDelayMinutes} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { escalationPolicy: __assign(__assign({}, teamForm.escalationPolicy), { escalationDelayMinutes: parseInt(e.target.value) || 0 }) })); }}/>
              </material_1.Grid>
            </material_1.Grid>
          </material_1.Box>
        </material_1.DialogContent>
        <material_1.DialogActions>
          <material_1.Button onClick={function () { return setCreateTeamDialog(false); }}>
            Cancelar
          </material_1.Button>
          <material_1.Button onClick={handleCreateTeam} variant="contained" color="primary">
            Criar Time
          </material_1.Button>
        </material_1.DialogActions>
      </material_1.Dialog>

      {/* Edit Team Dialog */}
      <material_1.Dialog open={editTeamDialog} onClose={function () { return setEditTeamDialog(false); }} maxWidth="md" fullWidth>
        <material_1.DialogTitle>
          <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <icons_material_1.Edit color="primary"/>
            <material_1.Typography variant="h6">Editar Time</material_1.Typography>
          </material_1.Box>
        </material_1.DialogTitle>
        <material_1.DialogContent>
          <material_1.Box sx={{ mt: 2 }}>
            <material_1.TextField fullWidth label="Nome do Time" value={teamForm.name} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { name: e.target.value })); }} sx={{ mb: 3 }}/>

            <material_1.Typography variant="h6" sx={{ mb: 2 }}>
              Membros do Time
            </material_1.Typography>
            {teamForm.members.map(function (member, index) { return (<material_1.Card key={index} sx={{ mb: 2, p: 2 }}>
                <material_1.Grid container spacing={2}>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.TextField fullWidth label="Nome" value={member.name} onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].name = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}/>
                  </material_1.Grid>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.TextField fullWidth label="Telefone" value={member.phone} onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].phone = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}/>
                  </material_1.Grid>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.TextField fullWidth label="Email" value={member.email} onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].email = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}/>
                  </material_1.Grid>
                  <material_1.Grid item xs={12} sm={6}>
                    <material_1.FormControl fullWidth>
                      <material_1.InputLabel>Função</material_1.InputLabel>
                      <material_1.Select value={member.role} label="Função" onChange={function (e) {
                var newMembers = __spreadArray([], teamForm.members, true);
                newMembers[index].role = e.target.value;
                setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
            }}>
                        <material_1.MenuItem value="primary">Primário</material_1.MenuItem>
                        <material_1.MenuItem value="secondary">Secundário</material_1.MenuItem>
                        <material_1.MenuItem value="escalation">Escalação</material_1.MenuItem>
                      </material_1.Select>
                    </material_1.FormControl>
                  </material_1.Grid>
                </material_1.Grid>
                {teamForm.members.length > 1 && (<material_1.IconButton onClick={function () {
                    var newMembers = teamForm.members.filter(function (_, i) { return i !== index; });
                    setTeamForm(__assign(__assign({}, teamForm), { members: newMembers }));
                }} sx={{ mt: 1 }} color="error">
                    <icons_material_1.Delete />
                  </material_1.IconButton>)}
              </material_1.Card>); })}
            
            <material_1.Button startIcon={<icons_material_1.Add />} onClick={function () {
            setTeamForm(__assign(__assign({}, teamForm), { members: __spreadArray(__spreadArray([], teamForm.members, true), [{ name: '', phone: '', email: '', role: 'primary' }], false) }));
        }} sx={{ mb: 3 }}>
              Adicionar Membro
            </material_1.Button>

            <material_1.Typography variant="h6" sx={{ mb: 2 }}>
              Política de Escalonamento
            </material_1.Typography>
            <material_1.Grid container spacing={2}>
              <material_1.Grid item xs={12} sm={4}>
                <material_1.TextField fullWidth type="number" label="Número de Retries" value={teamForm.escalationPolicy.retryCount} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { escalationPolicy: __assign(__assign({}, teamForm.escalationPolicy), { retryCount: parseInt(e.target.value) || 0 }) })); }}/>
              </material_1.Grid>
              <material_1.Grid item xs={12} sm={4}>
                <material_1.TextField fullWidth type="number" label="Intervalo entre Retries (min)" value={teamForm.escalationPolicy.retryIntervalMinutes} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { escalationPolicy: __assign(__assign({}, teamForm.escalationPolicy), { retryIntervalMinutes: parseInt(e.target.value) || 0 }) })); }}/>
              </material_1.Grid>
              <material_1.Grid item xs={12} sm={4}>
                <material_1.TextField fullWidth type="number" label="Delay de Escalonamento (min)" value={teamForm.escalationPolicy.escalationDelayMinutes} onChange={function (e) { return setTeamForm(__assign(__assign({}, teamForm), { escalationPolicy: __assign(__assign({}, teamForm.escalationPolicy), { escalationDelayMinutes: parseInt(e.target.value) || 0 }) })); }}/>
              </material_1.Grid>
            </material_1.Grid>
          </material_1.Box>
        </material_1.DialogContent>
        <material_1.DialogActions>
          <material_1.Button onClick={function () { return setEditTeamDialog(false); }}>
            Cancelar
          </material_1.Button>
          <material_1.Button onClick={handleUpdateTeam} variant="contained" color="primary">
            Atualizar Time
          </material_1.Button>
        </material_1.DialogActions>
      </material_1.Dialog>

      {/* Snackbar */}
      <material_1.Snackbar open={snackbar.open} autoHideDuration={6000} onClose={function () { return setSnackbar(__assign(__assign({}, snackbar), { open: false })); }}>
        <material_1.Alert onClose={function () { return setSnackbar(__assign(__assign({}, snackbar), { open: false })); }} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </material_1.Alert>
      </material_1.Snackbar>
    </material_1.Box>);
};
exports.KeninDutyTeamsPage = KeninDutyTeamsPage;
