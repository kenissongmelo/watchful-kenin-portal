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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeninDutyMainPage = void 0;
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var KeninDutyPage_1 = require("./KeninDutyPage");
var KeninDutyLogsPage_1 = require("./KeninDutyLogsPage");
var KeninDutyDashboardPage_1 = require("./KeninDutyDashboardPage");
var KeninDutyTeamsPage_1 = require("./KeninDutyTeamsPage");
var KeninDutyConfigPage_1 = __importDefault(require("./KeninDutyConfigPage"));
var KeninDutyMainPage = function () {
    var _a = (0, react_1.useState)(0), tabValue = _a[0], setTabValue = _a[1];
    var theme = (0, material_1.useTheme)();
    var handleTabChange = function (event, newValue) {
        setTabValue(newValue);
    };
    return (<material_1.Box sx={{
            minHeight: '100vh',
            backgroundColor: 'background.default',
            p: 3
        }}>
      {/* Header */}
      <material_1.Box sx={{
            mb: 4,
            textAlign: 'center'
        }}>
        <material_1.Box sx={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            mb: 1
        }}>
          🚀 KeninDuty
        </material_1.Box>
        <material_1.Box sx={{
            fontSize: '1.1rem',
            opacity: 0.7,
            fontWeight: 300
        }}>
          Sistema de Gerenciamento de On-Call e Alertas
        </material_1.Box>
      </material_1.Box>

      {/* Navigation Tabs */}
      <material_1.Box sx={{
            mb: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
        }}>
        <material_1.Tabs value={tabValue} onChange={handleTabChange} sx={{
            '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 500,
                minHeight: 64,
                textTransform: 'none',
            }
        }} variant="fullWidth">
          <material_1.Tab label="📊 Dashboards"/>
          <material_1.Tab label="📊 Alertas"/>
          <material_1.Tab label="👥 Times"/>
          <material_1.Tab label="📝 Logs"/>
          <material_1.Tab label="⚙️ Configurações"/>
        </material_1.Tabs>
      </material_1.Box>
      
      {/* Content */}
      <material_1.Box sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            minHeight: '70vh',
            p: 3
        }}>
        {tabValue === 0 && <KeninDutyDashboardPage_1.KeninDutyDashboardPage />}
        {tabValue === 1 && <KeninDutyPage_1.KeninDutyPage />}
        {tabValue === 2 && <KeninDutyTeamsPage_1.KeninDutyTeamsPage />}
        {tabValue === 3 && <KeninDutyLogsPage_1.KeninDutyLogsPage />}
        {tabValue === 4 && <KeninDutyConfigPage_1.default />}
      </material_1.Box>
    </material_1.Box>);
};
exports.KeninDutyMainPage = KeninDutyMainPage;
