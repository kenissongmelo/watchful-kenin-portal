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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeninDutyDashboardPage = void 0;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var axios_1 = __importDefault(require("axios"));
var API_BASE = 'http://localhost:7007/api/keninduty';
var KeninDutyDashboardPage = function () {
    var _a = (0, react_1.useState)(null), stats = _a[0], setStats = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        function fetchStats() {
            return __awaiter(this, void 0, void 0, function () {
                var res, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoading(true);
                            setError(null);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, axios_1.default.get("".concat(API_BASE, "/stats"))];
                        case 2:
                            res = _a.sent();
                            setStats(res.data.data || res.data);
                            return [3 /*break*/, 5];
                        case 3:
                            e_1 = _a.sent();
                            console.error('Erro ao carregar dashboard:', e_1);
                            setError(e_1.message || 'Erro ao carregar dados');
                            setStats(null);
                            return [3 /*break*/, 5];
                        case 4:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        fetchStats();
    }, []);
    if (loading) {
        return (<material_1.Box sx={{ textAlign: 'center', mt: 8 }}>
        <material_1.CircularProgress size={60}/>
        <material_1.Typography sx={{ mt: 2 }}>Carregando dashboard...</material_1.Typography>
      </material_1.Box>);
    }
    if (error) {
        return (<material_1.Box sx={{ p: 3 }}>
        <material_1.Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar dashboard: {error}
        </material_1.Alert>
        <material_1.Typography>Verifique se o backend está rodando em http://localhost:7007</material_1.Typography>
      </material_1.Box>);
    }
    if (!stats) {
        return (<material_1.Box sx={{ textAlign: 'center', mt: 8 }}>
        <material_1.Typography>Nenhum dado disponível</material_1.Typography>
      </material_1.Box>);
    }
    return (<material_1.Box sx={{ p: 3 }}>
      <material_1.Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Dashboard KeninDuty
      </material_1.Typography>
      
      <material_1.Grid container spacing={3}>
        <material_1.Grid item xs={12} sm={6} md={3}>
          <material_1.Card sx={{ height: '100%' }}>
            <material_1.CardContent sx={{ textAlign: 'center' }}>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                🚨 Alertas Ativos
              </material_1.Typography>
              <material_1.Typography variant="h3" color="error.main" sx={{ fontWeight: 'bold' }}>
                {stats.activeAlerts || 0}
              </material_1.Typography>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6} md={3}>
          <material_1.Card sx={{ height: '100%' }}>
            <material_1.CardContent sx={{ textAlign: 'center' }}>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                📋 Total de Alertas
              </material_1.Typography>
              <material_1.Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.totalAlerts || 0}
              </material_1.Typography>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6} md={3}>
          <material_1.Card sx={{ height: '100%' }}>
            <material_1.CardContent sx={{ textAlign: 'center' }}>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                👥 Times
              </material_1.Typography>
              <material_1.Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalTeams || 0}
              </material_1.Typography>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6} md={3}>
          <material_1.Card sx={{ height: '100%' }}>
            <material_1.CardContent sx={{ textAlign: 'center' }}>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                👤 Membros
              </material_1.Typography>
              <material_1.Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalMembers || 0}
              </material_1.Typography>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6} md={3}>
          <material_1.Card sx={{ height: '100%' }}>
            <material_1.CardContent sx={{ textAlign: 'center' }}>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                📞 Tentativas de Chamada
              </material_1.Typography>
              <material_1.Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.totalCallAttempts || 0}
              </material_1.Typography>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6} md={3}>
          <material_1.Card sx={{ height: '100%' }}>
            <material_1.CardContent sx={{ textAlign: 'center' }}>
              <material_1.Typography variant="h6" color="text.secondary" gutterBottom>
                ✅ Alertas Resolvidos
              </material_1.Typography>
              <material_1.Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                {(stats.totalAlerts || 0) - (stats.activeAlerts || 0)}
              </material_1.Typography>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
      </material_1.Grid>

      {/* Atividade Recente */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (<material_1.Card sx={{ mt: 4 }}>
          <material_1.CardContent>
            <material_1.Typography variant="h6" sx={{ mb: 2 }}>
              📈 Atividade Recente
            </material_1.Typography>
            <material_1.Grid container spacing={2}>
              {stats.recentActivity.slice(0, 5).map(function (activity, index) { return (<material_1.Grid item xs={12} sm={6} md={4} key={index}>
                  <material_1.Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <material_1.Typography variant="body2" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </material_1.Typography>
                    <material_1.Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {activity.message}
                    </material_1.Typography>
                    <material_1.Typography variant="caption" color={activity.status === 'active' ? 'error.main' : 'success.main'}>
                      {activity.status}
                    </material_1.Typography>
                  </material_1.Box>
                </material_1.Grid>); })}
            </material_1.Grid>
          </material_1.CardContent>
        </material_1.Card>)}
    </material_1.Box>);
};
exports.KeninDutyDashboardPage = KeninDutyDashboardPage;
