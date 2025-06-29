
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';

const mockStats = {
  totalAlerts: 24,
  activeAlerts: 3,
  resolvedToday: 8,
  avgResponseTime: '2.3m'
};

const mockRecentAlerts = [
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

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockStats.totalAlerts}</div>
            <p className="text-xs text-blue-600 mt-1">Active monitoring rules</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{mockStats.activeAlerts}</div>
            <p className="text-xs text-red-600 mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockStats.resolvedToday}</div>
            <p className="text-xs text-green-600 mt-1">Issues resolved</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockStats.avgResponseTime}</div>
            <p className="text-xs text-purple-600 mt-1">Response time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Recent Alerts</span>
            </CardTitle>
            <CardDescription>Latest alert activities across all services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      <Badge variant={
                        alert.status === 'critical' ? 'destructive' :
                        alert.status === 'warning' ? 'default' : 'secondary'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{alert.provider}</span>
                      <span>•</span>
                      <span>{alert.service}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>System Health</span>
            </CardTitle>
            <CardDescription>Overall health metrics for monitored services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Service Availability</span>
                  <span className="font-medium text-green-600">99.8%</span>
                </div>
                <Progress value={99.8} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Alert Response Rate</span>
                  <span className="font-medium text-blue-600">96.2%</span>
                </div>
                <Progress value={96.2} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Provider Connectivity</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">2</div>
                    <div className="text-xs text-gray-500">Connected Providers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">12</div>
                    <div className="text-xs text-gray-500">Monitored Services</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
