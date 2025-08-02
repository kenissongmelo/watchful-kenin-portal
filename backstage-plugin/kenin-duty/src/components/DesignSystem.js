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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyState = exports.CaptionText = exports.BodyText = exports.Subtitle = exports.SectionTitle = exports.ModernIconButton = exports.ModernButton = exports.ProviderChip = exports.SeverityChip = exports.StatusChip = exports.GlassCard = exports.colors = void 0;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
// Simple Design System Colors
exports.colors = {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
};
// Simple Card Component
var GlassCard = function (_a) {
    var children = _a.children, _b = _a.sx, sx = _b === void 0 ? {} : _b;
    return (<material_1.Card sx={__assign({ backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2, '&:hover': {
                boxShadow: 4,
            }, transition: 'box-shadow 0.2s ease' }, sx)}>
    <material_1.CardContent sx={{ p: 2 }}>
      {children}
    </material_1.CardContent>
  </material_1.Card>);
};
exports.GlassCard = GlassCard;
// Status Chip Component
var StatusChip = function (_a) {
    var status = _a.status, label = _a.label, _b = _a.size, size = _b === void 0 ? 'small' : _b;
    var getStatusColor = function () {
        switch (status) {
            case 'active':
                return { bg: exports.colors.error, text: 'white' };
            case 'acknowledged':
                return { bg: exports.colors.warning, text: 'white' };
            case 'resolved':
                return { bg: exports.colors.success, text: 'white' };
            case 'attended':
                return { bg: exports.colors.info, text: 'white' };
            case 'pending':
                return { bg: (0, material_1.alpha)(exports.colors.warning, 0.2), text: exports.colors.warning };
            default:
                return { bg: exports.colors.info, text: 'white' };
        }
    };
    var color = getStatusColor();
    return (<material_1.Chip label={label} size={size} sx={{
            backgroundColor: color.bg,
            color: color.text,
            fontWeight: 600,
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            '& .MuiChip-label': {
                px: 1.5,
            }
        }}/>);
};
exports.StatusChip = StatusChip;
// Severity Chip Component
var SeverityChip = function (_a) {
    var severity = _a.severity, _b = _a.size, size = _b === void 0 ? 'small' : _b;
    var getSeverityConfig = function () {
        switch (severity) {
            case 'critical':
                return { color: exports.colors.error, icon: '🔴', label: 'CRÍTICO' };
            case 'high':
                return { color: exports.colors.warning, icon: '🟡', label: 'ALTO' };
            case 'medium':
                return { color: exports.colors.info, icon: '🔵', label: 'MÉDIO' };
            case 'low':
                return { color: exports.colors.success, icon: '🟢', label: 'BAIXO' };
            default:
                return { color: exports.colors.info, icon: '🔵', label: 'MÉDIO' };
        }
    };
    var config = getSeverityConfig();
    return (<material_1.Chip label={"".concat(config.icon, " ").concat(config.label)} size={size} sx={{
            backgroundColor: (0, material_1.alpha)(config.color, 0.2),
            color: config.color,
            border: "1px solid ".concat((0, material_1.alpha)(config.color, 0.3)),
            fontWeight: 700,
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            '& .MuiChip-label': {
                px: 1.5,
            }
        }}/>);
};
exports.SeverityChip = SeverityChip;
// Provider Chip Component
var ProviderChip = function (_a) {
    var provider = _a.provider, _b = _a.size, size = _b === void 0 ? 'small' : _b;
    var getProviderConfig = function () {
        switch (provider) {
            case 'newrelic':
                return { icon: '🔵', label: 'NEW RELIC', color: '#00AC69' };
            case 'datadog':
                return { icon: '🟣', label: 'DATADOG', color: '#632CA6' };
            case 'grafana':
                return { icon: '🟠', label: 'GRAFANA', color: '#F46800' };
            default:
                return { icon: '📊', label: 'UNKNOWN', color: exports.colors.info };
        }
    };
    var config = getProviderConfig();
    return (<material_1.Chip label={"".concat(config.icon, " ").concat(config.label)} size={size} variant="outlined" sx={{
            borderColor: (0, material_1.alpha)(config.color, 0.5),
            color: config.color,
            fontWeight: 600,
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            '& .MuiChip-label': {
                px: 1.5,
            }
        }}/>);
};
exports.ProviderChip = ProviderChip;
// Simple Button Component
var ModernButton = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'contained' : _b, _c = _a.color, color = _c === void 0 ? 'primary' : _c, _d = _a.size, size = _d === void 0 ? 'medium' : _d, startIcon = _a.startIcon, onClick = _a.onClick, _e = _a.disabled, disabled = _e === void 0 ? false : _e, _f = _a.sx, sx = _f === void 0 ? {} : _f;
    return (<material_1.Button variant={variant} color={color} size={size} startIcon={startIcon} onClick={onClick} disabled={disabled} sx={__assign({ textTransform: 'none', fontWeight: 600 }, sx)}>
    {children}
  </material_1.Button>);
};
exports.ModernButton = ModernButton;
// Simple Icon Button Component
var ModernIconButton = function (_a) {
    var children = _a.children, _b = _a.color, color = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, onClick = _a.onClick, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.sx, sx = _e === void 0 ? {} : _e;
    return (<material_1.IconButton color={color} size={size} onClick={onClick} disabled={disabled} sx={__assign({}, sx)}>
    {children}
  </material_1.IconButton>);
};
exports.ModernIconButton = ModernIconButton;
// Section Title Component
var SectionTitle = function (_a) {
    var children = _a.children, icon = _a.icon, _b = _a.sx, sx = _b === void 0 ? {} : _b;
    return (<material_1.Typography variant="h5" sx={__assign({ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }, sx)}>
    {icon && <span>{icon}</span>}
    {children}
  </material_1.Typography>);
};
exports.SectionTitle = SectionTitle;
// Subtitle Component
var Subtitle = function (_a) {
    var children = _a.children, _b = _a.sx, sx = _b === void 0 ? {} : _b;
    return (<material_1.Typography variant="h6" sx={__assign({ fontWeight: 600, mb: 2 }, sx)}>
    {children}
  </material_1.Typography>);
};
exports.Subtitle = Subtitle;
// Body Text Component
var BodyText = function (_a) {
    var children = _a.children, _b = _a.sx, sx = _b === void 0 ? {} : _b;
    return (<material_1.Typography variant="body2" sx={__assign({ lineHeight: 1.6 }, sx)}>
    {children}
  </material_1.Typography>);
};
exports.BodyText = BodyText;
// Caption Text Component
var CaptionText = function (_a) {
    var children = _a.children, _b = _a.sx, sx = _b === void 0 ? {} : _b;
    return (<material_1.Typography variant="caption" sx={__assign({ fontSize: '0.75rem' }, sx)}>
    {children}
  </material_1.Typography>);
};
exports.CaptionText = CaptionText;
// Empty State Component
var EmptyState = function (_a) {
    var icon = _a.icon, title = _a.title, description = _a.description, action = _a.action;
    return (<material_1.Box sx={{
            textAlign: 'center',
            py: 6
        }}>
    <material_1.Box sx={{
            fontSize: '4rem',
            mb: 2,
            opacity: 0.7
        }}>
      {icon}
    </material_1.Box>
    <material_1.Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
      {title}
    </material_1.Typography>
    <material_1.Typography variant="body2" sx={{
            mb: 3,
            opacity: 0.8,
            maxWidth: 400,
            mx: 'auto'
        }}>
      {description}
    </material_1.Typography>
    {action && action}
  </material_1.Box>);
};
exports.EmptyState = EmptyState;
