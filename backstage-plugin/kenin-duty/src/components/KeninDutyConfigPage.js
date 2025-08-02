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
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var KeninDutyService_1 = require("../services/KeninDutyService");
var KeninDutyConfigPage = function () {
    var _a = (0, react_1.useState)(KeninDutyService_1.keninDutyService.getConfig()), config = _a[0], setConfig = _a[1];
    var _b = (0, react_1.useState)(true), isValid = _b[0], setIsValid = _b[1];
    var _c = (0, react_1.useState)('idle'), testStatus = _c[0], setTestStatus = _c[1];
    var _d = (0, react_1.useState)(''), testMessage = _d[0], setTestMessage = _d[1];
    var _e = (0, react_1.useState)(false), saved = _e[0], setSaved = _e[1];
    var _f = (0, react_1.useState)(null), testResult = _f[0], setTestResult = _f[1];
    var validateUrl = function (url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    var handleConfigChange = function (field, value) {
        setConfig(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        setSaved(false);
        // Validate URLs
        if (field === 'pluginApiUrl' || field === 'pluginHealthUrl' || field === 'callsApiUrl' || field === 'callsHealthUrl') {
            setIsValid(validateUrl(value));
        }
    };
    var handleSave = function () {
        KeninDutyService_1.keninDutyService.updateConfig(config);
        setSaved(true);
        setTimeout(function () { return setSaved(false); }, 3000);
    };
    var handleTestConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTestStatus('testing');
                    setTestMessage('');
                    setTestResult(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, KeninDutyService_1.keninDutyService.testConnection()];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setTestStatus('success');
                        setTestMessage(result.message);
                        setTestResult(result);
                    }
                    else {
                        setTestStatus('error');
                        setTestMessage(result.message);
                        setTestResult(result);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    setTestStatus('error');
                    setTestMessage("Erro de conex\u00E3o: ".concat(error_1.message));
                    setTestResult(null);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleReset = function () {
        var defaultConfig = {
            pluginApiUrl: 'http://localhost:7007',
            pluginHealthUrl: 'http://localhost:7007/health',
            callsApiUrl: 'http://localhost:8080',
            callsHealthUrl: 'http://localhost:8080/stats',
            timeout: 5000,
            autoRefresh: false,
            refreshInterval: 30,
            enableLogs: true,
            logLevel: 'info'
        };
        setConfig(defaultConfig);
        setIsValid(true);
        setTestStatus('idle');
        setTestMessage('');
        setSaved(false);
    };
    var predefinedPluginPorts = [
        { port: 7007, label: 'Padrão (7007)', description: 'Porta padrão do plugin KeninDuty' },
        { port: 7008, label: 'Alternativa (7008)', description: 'Porta alternativa do plugin' },
        { port: 7009, label: 'Desenvolvimento (7009)', description: 'Porta para desenvolvimento' }
    ];
    var predefinedCallsPorts = [
        { port: 8080, label: 'Padrão (8080)', description: 'Porta padrão da API de ligações' },
        { port: 3001, label: 'Alternativa (3001)', description: 'Porta alternativa da API de ligações' },
        { port: 3002, label: 'Desenvolvimento (3002)', description: 'Porta para desenvolvimento' },
        { port: 9000, label: 'Web (9000)', description: 'Porta comum para APIs web' }
    ];
    var handlePluginPortChange = function (port) {
        var newConfig = __assign(__assign({}, config), { pluginApiUrl: "http://localhost:".concat(port), pluginHealthUrl: "http://localhost:".concat(port, "/health") });
        setConfig(newConfig);
        setSaved(false);
    };
    var handleCallsPortChange = function (port) {
        var newConfig = __assign(__assign({}, config), { callsApiUrl: "http://localhost:".concat(port), callsHealthUrl: "http://localhost:".concat(port, "/health") });
        setConfig(newConfig);
        setSaved(false);
    };
    return (<material_1.Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <material_1.Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <icons_material_1.Settings color="primary" sx={{ fontSize: 32 }}/>
        <material_1.Typography variant="h4" component="h1">
          Configurações KeninDuty
        </material_1.Typography>
      </material_1.Stack>

      <material_1.Grid container spacing={3}>
        {/* Plugin API Configuration */}
        <material_1.Grid item xs={12} md={6}>
          <material_1.Card elevation={2}>
            <material_1.CardContent>
              <material_1.Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <icons_material_1.Api color="primary"/>
                API do Plugin KeninDuty
              </material_1.Typography>
              <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configuração da API do plugin que gerencia times, alertas e políticas
              </material_1.Typography>
              
              <material_1.Grid container spacing={2}>
                <material_1.Grid item xs={12}>
                  <material_1.TextField fullWidth label="URL da API do Plugin" value={config.pluginApiUrl} onChange={function (e) { return handleConfigChange('pluginApiUrl', e.target.value); }} helperText="URL base da API do plugin KeninDuty" placeholder="http://localhost:7007"/>
                </material_1.Grid>
                
                <material_1.Grid item xs={12}>
                  <material_1.TextField fullWidth label="URL de Health Check do Plugin" value={config.pluginHealthUrl} onChange={function (e) { return handleConfigChange('pluginHealthUrl', e.target.value); }} helperText="URL para verificar se o plugin está funcionando" placeholder="http://localhost:7007/health"/>
                </material_1.Grid>
              </material_1.Grid>

              <material_1.Divider sx={{ my: 2 }}/>
              
              <material_1.Typography variant="subtitle2" gutterBottom>
                Portas Pré-definidas do Plugin:
              </material_1.Typography>
              
              <material_1.Stack spacing={1}>
                {predefinedPluginPorts.map(function (_a) {
            var port = _a.port, label = _a.label, description = _a.description;
            return (<material_1.Chip key={port} label={"".concat(label, " - ").concat(description)} onClick={function () { return handlePluginPortChange(port); }} variant={config.pluginApiUrl.includes(":".concat(port)) ? "filled" : "outlined"} color={config.pluginApiUrl.includes(":".concat(port)) ? "primary" : "default"} sx={{ justifyContent: 'flex-start', textAlign: 'left' }}/>);
        })}
              </material_1.Stack>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>

        {/* Calls API Configuration */}
        <material_1.Grid item xs={12} md={6}>
          <material_1.Card elevation={2}>
            <material_1.CardContent>
              <material_1.Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <icons_material_1.Phone color="primary"/>
                API de Ligações
              </material_1.Typography>
              <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configuração da API que realiza as ligações reais e gerencia chamadas
              </material_1.Typography>
              
              <material_1.Grid container spacing={2}>
                <material_1.Grid item xs={12}>
                  <material_1.TextField fullWidth label="URL da API de Ligações" value={config.callsApiUrl} onChange={function (e) { return handleConfigChange('callsApiUrl', e.target.value); }} helperText="URL base da API que faz as ligações" placeholder="http://localhost:3001"/>
                </material_1.Grid>
                
                <material_1.Grid item xs={12}>
                  <material_1.TextField fullWidth label="URL de Health Check das Ligações" value={config.callsHealthUrl} onChange={function (e) { return handleConfigChange('callsHealthUrl', e.target.value); }} helperText="URL para verificar se a API de ligações está funcionando" placeholder="http://localhost:3001/health"/>
                </material_1.Grid>
              </material_1.Grid>

              <material_1.Divider sx={{ my: 2 }}/>
              
              <material_1.Typography variant="subtitle2" gutterBottom>
                Portas Pré-definidas das Ligações:
              </material_1.Typography>
              
              <material_1.Stack spacing={1}>
                {predefinedCallsPorts.map(function (_a) {
            var port = _a.port, label = _a.label, description = _a.description;
            return (<material_1.Chip key={port} label={"".concat(label, " - ").concat(description)} onClick={function () { return handleCallsPortChange(port); }} variant={config.callsApiUrl.includes(":".concat(port)) ? "filled" : "outlined"} color={config.callsApiUrl.includes(":".concat(port)) ? "primary" : "default"} sx={{ justifyContent: 'flex-start', textAlign: 'left' }}/>);
        })}
              </material_1.Stack>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>

        {/* General Configuration */}
        <material_1.Grid item xs={12}>
          <material_1.Card elevation={2}>
            <material_1.CardContent>
              <material_1.Typography variant="h6" gutterBottom>
                Configurações Gerais
              </material_1.Typography>
              
              <material_1.Grid container spacing={2}>
                <material_1.Grid item xs={12} sm={6}>
                  <material_1.TextField fullWidth type="number" label="Timeout (ms)" value={config.timeout} onChange={function (e) { return handleConfigChange('timeout', parseInt(e.target.value)); }} helperText="Tempo limite para requisições" inputProps={{ min: 1000, max: 30000 }}/>
                </material_1.Grid>
                
                <material_1.Grid item xs={12} sm={6}>
                  <material_1.TextField fullWidth type="number" label="Intervalo de Refresh (s)" value={config.refreshInterval} onChange={function (e) { return handleConfigChange('refreshInterval', parseInt(e.target.value)); }} helperText="Intervalo para atualização automática" inputProps={{ min: 5, max: 300 }} disabled={!config.autoRefresh}/>
                </material_1.Grid>
                
                <material_1.Grid item xs={12} sm={6}>
                  <material_1.FormControlLabel control={<material_1.Switch checked={config.enableLogs} onChange={function (e) { return handleConfigChange('enableLogs', e.target.checked); }}/>} label="Habilitar Logs"/>
                </material_1.Grid>
                
                <material_1.Grid item xs={12} sm={6}>
                  <material_1.FormControlLabel control={<material_1.Switch checked={config.autoRefresh} onChange={function (e) { return handleConfigChange('autoRefresh', e.target.checked); }}/>} label="Auto Refresh"/>
                </material_1.Grid>
                
                <material_1.Grid item xs={12} sm={6}>
                  <material_1.FormControl fullWidth disabled={!config.enableLogs}>
                    <material_1.InputLabel>Nível de Log</material_1.InputLabel>
                    <material_1.Select value={config.logLevel} label="Nível de Log" onChange={function (e) { return handleConfigChange('logLevel', e.target.value); }}>
                      <material_1.MenuItem value="debug">Debug</material_1.MenuItem>
                      <material_1.MenuItem value="info">Info</material_1.MenuItem>
                      <material_1.MenuItem value="warn">Warning</material_1.MenuItem>
                      <material_1.MenuItem value="error">Error</material_1.MenuItem>
                    </material_1.Select>
                  </material_1.FormControl>
                </material_1.Grid>
              </material_1.Grid>
            </material_1.CardContent>
          </material_1.Card>
        </material_1.Grid>
      </material_1.Grid>

      {/* Actions */}
      <material_1.Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <material_1.Button variant="contained" startIcon={<icons_material_1.Save />} onClick={handleSave} disabled={!isValid || saved}>
          {saved ? 'Salvo!' : 'Salvar Configuração'}
        </material_1.Button>
        
        <material_1.Button variant="outlined" startIcon={<icons_material_1.Refresh />} onClick={handleTestConnection} disabled={!isValid || testStatus === 'testing'}>
          Testar Conexões
        </material_1.Button>
        
        <material_1.Button variant="outlined" onClick={handleReset}>
          Restaurar Padrões
        </material_1.Button>
      </material_1.Box>

      {/* Test Results */}
      {testResult && (<material_1.Card sx={{ mt: 2 }}>
          <material_1.CardContent>
            <material_1.Typography variant="h6" gutterBottom>
              Resultado dos Testes de Conexão
            </material_1.Typography>
            
            <material_1.Alert severity={testResult.success ? 'success' : 'warning'} sx={{ mb: 2 }}>
              {testResult.message}
            </material_1.Alert>
            
            <material_1.Grid container spacing={2}>
              <material_1.Grid item xs={12} sm={6}>
                <material_1.Typography variant="subtitle2" gutterBottom>
                  Plugin API:
                </material_1.Typography>
                <material_1.Alert severity={testResult.details.plugin.success ? 'success' : 'error'} sx={{ fontSize: '0.875rem' }}>
                  {testResult.details.plugin.message}
                </material_1.Alert>
              </material_1.Grid>
              
              <material_1.Grid item xs={12} sm={6}>
                <material_1.Typography variant="subtitle2" gutterBottom>
                  Calls API:
                </material_1.Typography>
                <material_1.Alert severity={testResult.details.calls.success ? 'success' : 'error'} sx={{ fontSize: '0.875rem' }}>
                  {testResult.details.calls.message}
                </material_1.Alert>
              </material_1.Grid>
            </material_1.Grid>
          </material_1.CardContent>
        </material_1.Card>)}

      {/* Configuration Status */}
      <material_1.Card sx={{ mt: 2 }}>
        <material_1.CardContent>
          <material_1.Typography variant="h6" gutterBottom>
            Status da Configuração
          </material_1.Typography>
          
          <material_1.Grid container spacing={2}>
            <material_1.Grid item xs={12} md={6}>
              <material_1.Typography variant="subtitle2" gutterBottom>
                Plugin API:
              </material_1.Typography>
              <material_1.Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                {config.pluginApiUrl}
              </material_1.Typography>
              <material_1.Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Health: {config.pluginHealthUrl}
              </material_1.Typography>
            </material_1.Grid>
            
            <material_1.Grid item xs={12} md={6}>
              <material_1.Typography variant="subtitle2" gutterBottom>
                Calls API:
              </material_1.Typography>
              <material_1.Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                {config.callsApiUrl}
              </material_1.Typography>
              <material_1.Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Health: {config.callsHealthUrl}
              </material_1.Typography>
            </material_1.Grid>
            
            <material_1.Grid item xs={12} sm={6}>
              <material_1.Typography variant="body2" color="text.secondary">
                Timeout: {config.timeout}ms
              </material_1.Typography>
            </material_1.Grid>
            
            <material_1.Grid item xs={12} sm={6}>
              <material_1.Typography variant="body2" color="text.secondary">
                Logs: {config.enableLogs ? "Habilitado (".concat(config.logLevel, ")") : 'Desabilitado'}
              </material_1.Typography>
            </material_1.Grid>
          </material_1.Grid>
        </material_1.CardContent>
      </material_1.Card>
    </material_1.Box>);
};
exports.default = KeninDutyConfigPage;
