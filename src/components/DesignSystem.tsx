import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  IconButton,
  useTheme,
  alpha
} from '@mui/material';

// Simple Design System Colors
export const colors = {
  primary: '#1976d2',
  secondary: '#dc004e',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

// Simple Card Component
export const GlassCard: React.FC<{ children: React.ReactNode; sx?: any }> = ({ children, sx = {} }) => (
  <Card sx={{ 
    backgroundColor: 'background.paper',
    borderRadius: 2,
    boxShadow: 2,
    '&:hover': {
      boxShadow: 4,
    },
    transition: 'box-shadow 0.2s ease',
    ...sx
  }}>
    <CardContent sx={{ p: 2 }}>
      {children}
    </CardContent>
  </Card>
);

// Status Chip Component
export const StatusChip: React.FC<{ 
  status: 'active' | 'acknowledged' | 'resolved' | 'attended' | 'pending';
  label: string;
  size?: 'small' | 'medium';
}> = ({ status, label, size = 'small' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return { bg: colors.error, text: 'white' };
      case 'acknowledged':
        return { bg: colors.warning, text: 'white' };
      case 'resolved':
        return { bg: colors.success, text: 'white' };
      case 'attended':
        return { bg: colors.info, text: 'white' };
      case 'pending':
        return { bg: alpha(colors.warning, 0.2), text: colors.warning };
      default:
        return { bg: colors.info, text: 'white' };
    }
  };

  const color = getStatusColor();

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: color.bg,
        color: color.text,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        '& .MuiChip-label': {
          px: 1.5,
        }
      }}
    />
  );
};

// Severity Chip Component
export const SeverityChip: React.FC<{ 
  severity: 'low' | 'medium' | 'high' | 'critical';
  size?: 'small' | 'medium';
}> = ({ severity, size = 'small' }) => {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return { color: colors.error, icon: '🔴', label: 'CRÍTICO' };
      case 'high':
        return { color: colors.warning, icon: '🟡', label: 'ALTO' };
      case 'medium':
        return { color: colors.info, icon: '🔵', label: 'MÉDIO' };
      case 'low':
        return { color: colors.success, icon: '🟢', label: 'BAIXO' };
      default:
        return { color: colors.info, icon: '🔵', label: 'MÉDIO' };
    }
  };

  const config = getSeverityConfig();

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      size={size}
      sx={{
        backgroundColor: alpha(config.color, 0.2),
        color: config.color,
        border: `1px solid ${alpha(config.color, 0.3)}`,
        fontWeight: 700,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        '& .MuiChip-label': {
          px: 1.5,
        }
      }}
    />
  );
};

// Provider Chip Component
export const ProviderChip: React.FC<{ 
  provider: 'newrelic' | 'datadog' | 'grafana';
  size?: 'small' | 'medium';
}> = ({ provider, size = 'small' }) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'newrelic':
        return { icon: '🔵', label: 'NEW RELIC', color: '#00AC69' };
      case 'datadog':
        return { icon: '🟣', label: 'DATADOG', color: '#632CA6' };
      case 'grafana':
        return { icon: '🟠', label: 'GRAFANA', color: '#F46800' };
      default:
        return { icon: '📊', label: 'UNKNOWN', color: colors.info };
    }
  };

  const config = getProviderConfig();

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      size={size}
      variant="outlined"
      sx={{
        borderColor: alpha(config.color, 0.5),
        color: config.color,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        '& .MuiChip-label': {
          px: 1.5,
        }
      }}
    />
  );
};

// Simple Button Component
export const ModernButton: React.FC<{
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  sx?: any;
}> = ({ 
  children, 
  variant = 'contained', 
  color = 'primary',
  size = 'medium',
  startIcon,
  onClick,
  disabled = false,
  sx = {}
}) => (
  <Button
    variant={variant}
    color={color}
    size={size}
    startIcon={startIcon}
    onClick={onClick}
    disabled={disabled}
    sx={{
      textTransform: 'none',
      fontWeight: 600,
      ...sx
    }}
  >
    {children}
  </Button>
);

// Simple Icon Button Component
export const ModernIconButton: React.FC<{
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  sx?: any;
}> = ({ 
  children, 
  color = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  sx = {}
}) => (
  <IconButton
    color={color}
    size={size}
    onClick={onClick}
    disabled={disabled}
    sx={{
      ...sx
    }}
  >
    {children}
  </IconButton>
);

// Section Title Component
export const SectionTitle: React.FC<{ 
  children: React.ReactNode;
  icon?: string;
  sx?: any;
}> = ({ children, icon, sx = {} }) => (
  <Typography
    variant="h5"
    sx={{
      fontWeight: 600,
      mb: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      ...sx
    }}
  >
    {icon && <span>{icon}</span>}
    {children}
  </Typography>
);

// Subtitle Component
export const Subtitle: React.FC<{ 
  children: React.ReactNode;
  sx?: any;
}> = ({ children, sx = {} }) => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      mb: 2,
      ...sx
    }}
  >
    {children}
  </Typography>
);

// Body Text Component
export const BodyText: React.FC<{ 
  children: React.ReactNode;
  sx?: any;
}> = ({ children, sx = {} }) => (
  <Typography
    variant="body2"
    sx={{
      lineHeight: 1.6,
      ...sx
    }}
  >
    {children}
  </Typography>
);

// Caption Text Component
export const CaptionText: React.FC<{ 
  children: React.ReactNode;
  sx?: any;
}> = ({ children, sx = {} }) => (
  <Typography
    variant="caption"
    sx={{
      fontSize: '0.75rem',
      ...sx
    }}
  >
    {children}
  </Typography>
);

// Empty State Component
export const EmptyState: React.FC<{
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <Box sx={{ 
    textAlign: 'center', 
    py: 6
  }}>
    <Box sx={{ 
      fontSize: '4rem', 
      mb: 2,
      opacity: 0.7
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ 
      mb: 3, 
      opacity: 0.8,
      maxWidth: 400,
      mx: 'auto'
    }}>
      {description}
    </Typography>
    {action && action}
  </Box>
); 