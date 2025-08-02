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
exports.RealTimeLogs = void 0;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var RealTimeLogs = function (_a) {
    var callId = _a.callId, _b = _a.autoRefresh, autoRefresh = _b === void 0 ? true : _b, _c = _a.refreshInterval, refreshInterval = _c === void 0 ? 2000 : _c;
    var _d = (0, react_1.useState)([]), logs = _d[0], setLogs = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(true), expanded = _f[0], setExpanded = _f[1];
    var _g = (0, react_1.useState)('all'), filterLevel = _g[0], setFilterLevel = _g[1];
    var _h = (0, react_1.useState)(''), searchTerm = _h[0], setSearchTerm = _h[1];
    var logsEndRef = (0, react_1.useRef)(null);
    var fetchLogs = function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    setLoading(true);
                    params = new URLSearchParams();
                    if (callId)
                        params.append('callId', callId);
                    params.append('limit', '100');
                    console.log('Fetching logs from:', "http://localhost:7007/api/keninduty/logs/realtime?".concat(params));
                    return [4 /*yield*/, fetch("http://localhost:7007/api/keninduty/logs/realtime?".concat(params))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log('Logs response:', data);
                    if (data.success) {
                        setLogs(data.data.logs || []);
                    }
                    else {
                        console.error('Failed to fetch logs:', data.error);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching logs:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchLogs();
        if (autoRefresh) {
            var interval_1 = setInterval(fetchLogs, refreshInterval);
            return function () { return clearInterval(interval_1); };
        }
    }, [callId, autoRefresh, refreshInterval]);
    var getLevelIcon = function (level) {
        switch (level) {
            case 'success':
                return <icons_material_1.CheckCircle color="success"/>;
            case 'warning':
                return <icons_material_1.Warning color="warning"/>;
            case 'error':
                return <icons_material_1.Error color="error"/>;
            default:
                return <icons_material_1.Info color="info"/>;
        }
    };
    var getLevelColor = function (level) {
        switch (level) {
            case 'success':
                return 'success';
            case 'warning':
                return 'warning';
            case 'error':
                return 'error';
            default:
                return 'info';
        }
    };
    var getCallStatusFromMessage = function (message) {
        var msg = message.toUpperCase();
        // Status de atendimento
        if (msg.includes('ATENDIDA') || msg.includes('ATENDIDO') || msg.includes('RESPONDIDA') || msg.includes('RESPONDIDO'))
            return 'answered';
        // Status de retry
        if (msg.includes('RETRY') || msg.includes('TENTATIVA') || msg.includes('REPETINDO') || msg.includes('REPETIR'))
            return 'retry';
        // Status de escalonamento
        if (msg.includes('ESCALONAMENTO') || msg.includes('ESCALONADO') || msg.includes('PRÓXIMO NÍVEL') || msg.includes('NEXT LEVEL'))
            return 'escalation';
        // Status de esgotado
        if (msg.includes('ESGOTADOS') || msg.includes('ESGOTADO') || msg.includes('EXAUSTADO') || msg.includes('FALHOU TODAS'))
            return 'exhausted';
        // Status de inicialização
        if (msg.includes('INICIALIZANDO') || msg.includes('INICIANDO') || msg.includes('CRIANDO CHAMADA') || msg.includes('SETUP'))
            return 'init';
        // Status de sucesso
        if (msg.includes('SUCESSO') || msg.includes('SUCCESS') || msg.includes('CONCLUÍDA') || msg.includes('FINALIZADA'))
            return 'success';
        // Status de erro
        if (msg.includes('ERRO') || msg.includes('ERROR') || msg.includes('FALHA') || msg.includes('FAILED'))
            return 'error';
        // Status de informação
        if (msg.includes('MEMBROS') || msg.includes('DISPONÍVEIS') || msg.includes('INFO') || msg.includes('INFORMATION'))
            return 'info';
        return 'info';
    };
    var getCallStatusColor = function (status) {
        switch (status) {
            case 'answered':
                return '#4caf50'; // Verde vibrante para atendida
            case 'retry':
                return '#ff9800'; // Laranja para retry
            case 'escalation':
                return '#f57c00'; // Laranja escuro para escalonamento
            case 'exhausted':
                return '#f44336'; // Vermelho para esgotado
            case 'init':
                return '#2196f3'; // Azul para inicialização
            case 'success':
                return '#4caf50'; // Verde para sucesso
            case 'error':
                return '#d32f2f'; // Vermelho escuro para erro
            default:
                return '#757575'; // Cinza para info
        }
    };
    var getCallStatusIcon = function (status) {
        switch (status) {
            case 'answered':
                return '✅';
            case 'retry':
                return '🔄';
            case 'escalation':
                return '⬆️';
            case 'exhausted':
                return '❌';
            case 'init':
                return '🚀';
            case 'success':
                return '✅';
            case 'error':
                return '💥';
            default:
                return 'ℹ️';
        }
    };
    var getCallStatusLabel = function (status) {
        switch (status) {
            case 'answered':
                return 'ATENDIDA';
            case 'retry':
                return 'RETRY';
            case 'escalation':
                return 'ESCALONAMENTO';
            case 'exhausted':
                return 'ESGOTADO';
            case 'init':
                return 'INICIANDO';
            case 'success':
                return 'SUCESSO';
            case 'error':
                return 'ERRO';
            default:
                return 'INFO';
        }
    };
    var getBackgroundColor = function (status, level) {
        var statusColor = getCallStatusColor(status);
        return "".concat(statusColor, "15"); // 15% de opacidade
    };
    var getBorderColor = function (status) {
        return getCallStatusColor(status);
    };
    var filteredLogs = logs.filter(function (log) {
        var matchesLevel = filterLevel === 'all' || log.level === filterLevel;
        var matchesSearch = searchTerm === '' ||
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesLevel && matchesSearch;
    });
    var formatTimestamp = function (timestamp) {
        return new Date(timestamp).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    return (<material_1.Card sx={{ mb: 2 }}>
      <material_1.CardContent>
        <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <icons_material_1.Phone color="primary"/>
            <material_1.Typography variant="h6" component="h3">
              📞 Logs em Tempo Real
            </material_1.Typography>
            <material_1.Chip label={"".concat(filteredLogs.length, " logs")} size="small" color="primary" variant="outlined"/>
          </material_1.Box>
          <material_1.Box sx={{ display: 'flex', gap: 1 }}>
            <material_1.IconButton onClick={fetchLogs} disabled={loading} size="small">
              <icons_material_1.Refresh />
            </material_1.IconButton>
            <material_1.IconButton onClick={function () { return setExpanded(!expanded); }} size="small">
              {expanded ? <icons_material_1.ExpandLess /> : <icons_material_1.ExpandMore />}
            </material_1.IconButton>
          </material_1.Box>
        </material_1.Box>

        {expanded && (<>
          {/* Filtros */}
          <material_1.Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <material_1.TextField label="Buscar nos logs" variant="outlined" size="small" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} sx={{ minWidth: 200 }}/>
            <material_1.FormControl size="small" sx={{ minWidth: 120 }}>
              <material_1.InputLabel>Nível</material_1.InputLabel>
              <material_1.Select value={filterLevel} label="Nível" onChange={function (e) { return setFilterLevel(e.target.value); }}>
                <material_1.MenuItem value="all">Todos</material_1.MenuItem>
                <material_1.MenuItem value="info">Info</material_1.MenuItem>
                <material_1.MenuItem value="warning">Warning</material_1.MenuItem>
                <material_1.MenuItem value="error">Error</material_1.MenuItem>
                <material_1.MenuItem value="success">Success</material_1.MenuItem>
              </material_1.Select>
            </material_1.FormControl>
            <material_1.Button variant="outlined" size="small" onClick={function () {
                setSearchTerm('');
                setFilterLevel('all');
            }} startIcon={<icons_material_1.Clear />}>
              Limpar
            </material_1.Button>
          </material_1.Box>

          {/* Legenda de Status */}
          <material_1.Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }}>
            <material_1.Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              📊 Legenda de Status:
            </material_1.Typography>
            <material_1.Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <material_1.Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                  ✅
                </material_1.Box>
                <material_1.Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ATENDIDA - Chamada foi atendida com sucesso
                </material_1.Typography>
              </material_1.Box>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <material_1.Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#ff9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                  🔄
                </material_1.Box>
                <material_1.Typography variant="caption" sx={{ fontWeight: 500 }}>
                  RETRY - Tentativa de recontato
                </material_1.Typography>
              </material_1.Box>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <material_1.Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#f57c00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                  ⬆️
                </material_1.Box>
                <material_1.Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ESCALONAMENTO - Passou para próximo nível
                </material_1.Typography>
              </material_1.Box>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <material_1.Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#f44336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                  ❌
                </material_1.Box>
                <material_1.Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ESGOTADO - Retries esgotados
                </material_1.Typography>
              </material_1.Box>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <material_1.Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#2196f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                  🚀
                </material_1.Box>
                <material_1.Typography variant="caption" sx={{ fontWeight: 500 }}>
                  INICIANDO - Chamada sendo inicializada
                </material_1.Typography>
              </material_1.Box>
              <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <material_1.Box sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                  💥
                </material_1.Box>
                <material_1.Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ERRO - Falha ou erro na operação
                </material_1.Typography>
              </material_1.Box>
            </material_1.Box>
          </material_1.Box>

          {/* Lista de Logs */}
          <material_1.Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredLogs.length === 0 ? (<material_1.Box sx={{ textAlign: 'center', py: 4 }}>
                <icons_material_1.Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}/>
                <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {loading ? 'Carregando logs...' : 'Nenhum log encontrado'}
                </material_1.Typography>
                {!loading && (<material_1.Box sx={{ textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                    <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Para gerar logs:</strong>
                    </material_1.Typography>
                    <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      1. Crie um alerta na aba "Alertas"
                    </material_1.Typography>
                    <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      2. Inicialize uma chamada usando o endpoint: POST /api/keninduty/calls/init
                    </material_1.Typography>
                    <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      3. Faça callbacks usando: POST /api/keninduty/calls/callback
                    </material_1.Typography>
                    <material_1.Typography variant="body2" color="text.secondary">
                      4. Os logs aparecerão automaticamente aqui
                    </material_1.Typography>
                  </material_1.Box>)}
              </material_1.Box>) : (<material_1.List dense>
                {filteredLogs.map(function (log, index) {
                    var callStatus = getCallStatusFromMessage(log.message);
                    var statusColor = getCallStatusColor(callStatus);
                    var statusIcon = getCallStatusIcon(callStatus);
                    var statusLabel = getCallStatusLabel(callStatus);
                    var backgroundColor = getBackgroundColor(callStatus, log.level);
                    var borderColor = getBorderColor(callStatus);
                    return (<react_1.default.Fragment key={log.id}>
                      <material_1.ListItem sx={{
                            bgcolor: backgroundColor,
                            borderRadius: 2,
                            mb: 1.5,
                            border: "2px solid ".concat(borderColor),
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateX(4px)',
                                boxShadow: 2
                            }
                        }}>
                        <material_1.ListItemIcon sx={{ minWidth: 40 }}>
                          <material_1.Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: "".concat(statusColor, "20"),
                            border: "2px solid ".concat(statusColor),
                            fontSize: '1.2rem'
                        }}>
                            {statusIcon}
                          </material_1.Box>
                        </material_1.ListItemIcon>
                        <material_1.ListItemText primary={<material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <material_1.Typography variant="body2" component="span" sx={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: statusColor
                            }}>
                                {log.message}
                              </material_1.Typography>
                              <material_1.Chip label={statusLabel} size="small" sx={{
                                bgcolor: statusColor,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                height: 20
                            }}/>
                              {log.callId && (<material_1.Chip label={"Call: ".concat(log.callId.slice(-8))} size="small" color="info" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }}/>)}
                            </material_1.Box>} secondary={<material_1.Box sx={{ mt: 1 }}>
                              <material_1.Typography variant="caption" sx={{
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                fontWeight: 500
                            }}>
                                📅 {formatTimestamp(log.timestamp)}
                              </material_1.Typography>
                              {log.details && (<material_1.Box sx={{ mt: 1 }}>
                                  <material_1.Typography variant="caption" sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.7rem',
                                    fontWeight: 500
                                }}>
                                    📋 Detalhes:
                                  </material_1.Typography>
                                  <pre style={{
                                    fontSize: '0.7rem',
                                    margin: '4px 0',
                                    padding: '8px',
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    maxHeight: '80px',
                                    border: '1px solid rgba(0,0,0,0.1)'
                                }}>
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </material_1.Box>)}
                            </material_1.Box>}/>
                      </material_1.ListItem>
                      {index < filteredLogs.length - 1 && (<material_1.Divider sx={{
                                my: 1,
                                borderColor: 'rgba(0,0,0,0.1)',
                                opacity: 0.5
                            }}/>)}
                    </react_1.default.Fragment>);
                })}
              </material_1.List>)}
          </material_1.Box>

          {/* Status */}
          <material_1.Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <material_1.Typography variant="caption" color="text.secondary">
              Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </material_1.Typography>
            <material_1.Box sx={{ display: 'flex', gap: 1 }}>
              <material_1.Chip label={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'} size="small" color={autoRefresh ? 'success' : 'default'} variant="outlined"/>
              {callId && (<material_1.Chip label={"Filtrado por: ".concat(callId.slice(-8))} size="small" color="primary" variant="outlined"/>)}
            </material_1.Box>
          </material_1.Box>
          </>)}
      </material_1.CardContent>
    </material_1.Card>);
};
exports.RealTimeLogs = RealTimeLogs;
