'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  CheckCircle,
  Eye,
  MousePointer,
  LineChart,
  RefreshCw,
  Download,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { SubscriberMetrics } from '@/components/subscriber-metrics';
import { Highlights } from '@/components/highlights';

interface SourceData {
  source: string;
  count: number;
  percentage: number;
}

interface GrowthData {
  date: string;
  subscribers: number;
  newSubscribers: number;
}

interface MetricsData {
  total: number;
  new: number;
  churn: number;
  confirmRate: number;
  openRate: number;
  clickRate: number;
  bySource: SourceData[];
  growthData: GrowthData[];
}

export default function SubscriberMetricsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricsData>({
    total: 0,
    new: 0,
    churn: 0,
    confirmRate: 0,
    openRate: 0,
    clickRate: 0,
    bySource: [],
    growthData: [],
  });

  const [timeRange, setTimeRange] = useState('30d');

  // Simulate loading with different data based on time range
  useEffect(() => {
    const timer = setTimeout(() => {
      // Different data sets based on time range
      const dataSets = {
        '7d': {
          total: 12543,
          new: 23,
          churn: 8,
          confirmRate: 89.2,
          openRate: 36.8,
          clickRate: 9.1,
          bySource: [
            { source: 'Modal Popup', count: 8, percentage: 34.8 },
            { source: 'Footer Form', count: 6, percentage: 26.1 },
            { source: 'Article CTA', count: 5, percentage: 21.7 },
            { source: 'Social Media', count: 3, percentage: 13.0 },
            { source: 'Email Campaign', count: 1, percentage: 4.3 },
          ],
          growthData: [
            { date: 'Day 1', subscribers: 12520, newSubscribers: 8 },
            { date: 'Day 2', subscribers: 12515, newSubscribers: 3 },
            { date: 'Day 3', subscribers: 12528, newSubscribers: 13 },
            { date: 'Day 4', subscribers: 12522, newSubscribers: 2 },
            { date: 'Day 5', subscribers: 12535, newSubscribers: 15 },
            { date: 'Day 6', subscribers: 12530, newSubscribers: 7 },
            { date: 'Day 7', subscribers: 12543, newSubscribers: 18 },
          ],
        },
        '30d': {
          total: 12543,
          new: 156,
          churn: 23,
          confirmRate: 87.5,
          openRate: 34.2,
          clickRate: 8.7,
          bySource: [
            { source: 'Modal Popup', count: 45, percentage: 28.8 },
            { source: 'Footer Form', count: 38, percentage: 24.4 },
            { source: 'Article CTA', count: 32, percentage: 20.5 },
            { source: 'Social Media', count: 25, percentage: 16.0 },
            { source: 'Email Campaign', count: 16, percentage: 10.3 },
          ],
          growthData: [
            { date: 'Week 1', subscribers: 12387, newSubscribers: 67 },
            { date: 'Week 2', subscribers: 12415, newSubscribers: 28 },
            { date: 'Week 3', subscribers: 12468, newSubscribers: 53 },
            { date: 'Week 4', subscribers: 12543, newSubscribers: 75 },
          ],
        },
        '90d': {
          total: 12543,
          new: 487,
          churn: 67,
          confirmRate: 85.3,
          openRate: 32.1,
          clickRate: 7.9,
          bySource: [
            { source: 'Modal Popup', count: 142, percentage: 29.2 },
            { source: 'Footer Form', count: 118, percentage: 24.2 },
            { source: 'Article CTA', count: 98, percentage: 20.1 },
            { source: 'Social Media', count: 78, percentage: 16.0 },
            { source: 'Email Campaign', count: 51, percentage: 10.5 },
          ],
          growthData: [
            { date: 'Month 1', subscribers: 12056, newSubscribers: 156 },
            { date: 'Month 2', subscribers: 12189, newSubscribers: 133 },
            { date: 'Month 3', subscribers: 12543, newSubscribers: 354 },
          ],
        },
        '1y': {
          total: 12543,
          new: 1847,
          churn: 234,
          confirmRate: 83.7,
          openRate: 29.8,
          clickRate: 6.4,
          bySource: [
            { source: 'Modal Popup', count: 531, percentage: 28.8 },
            { source: 'Footer Form', count: 451, percentage: 24.4 },
            { source: 'Article CTA', count: 378, percentage: 20.5 },
            { source: 'Social Media', count: 295, percentage: 16.0 },
            { source: 'Email Campaign', count: 192, percentage: 10.4 },
          ],
          growthData: [
            { date: 'Q1', subscribers: 10696, newSubscribers: 456 },
            { date: 'Q2', subscribers: 11089, newSubscribers: 393 },
            { date: 'Q3', subscribers: 11892, newSubscribers: 803 },
            { date: 'Q4', subscribers: 12543, newSubscribers: 651 },
          ],
        },
      };

      setMetrics(dataSets[timeRange as keyof typeof dataSets] || dataSets['30d']);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color, 
    isLoading: loading,
    format = 'number',
    description
  }: {
    title: string;
    value: number;
    change: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    isLoading: boolean;
    format?: 'number' | 'percentage';
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20 mb-2" />
        ) : (
          <div className="text-2xl font-bold">
            {format === 'percentage' ? `${value}%` : value.toLocaleString()}
          </div>
        )}
        {loading ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {change > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(change)}%
            </span>
            <span>vs previous period</span>
          </div>
        )}
        {description && (
          <div className="mt-2 text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call - this will trigger the useEffect with current timeRange
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="ml-6">
          <h1 className="text-3xl font-bold tracking-tight">Subscriber Metrics</h1>
          <p className="text-muted-foreground">
            Track newsletter subscription growth and engagement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Subscriber Metrics and Highlights Section */}
      <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5 items-stretch">
        {/* Subscriber Metrics */}
        <div className="space-y-3 ml-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Subscriber Metrics</h2>
            <p className="text-xs text-muted-foreground">Visualize subscription growth & engagement</p>
          </div>
          
          <SubscriberMetrics />
        </div>

        {/* Highlights */}
        <Highlights limit={3} />
      </div>

      {/* Time Range Selector */}
      <Card className="ml-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Time Range:</span>
              <div className="flex space-x-2">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    disabled={isLoading}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {timeRange === '7d' && 'Last 7 days'}
              {timeRange === '30d' && 'Last 30 days'}
              {timeRange === '90d' && 'Last 90 days'}
              {timeRange === '1y' && 'Last year'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="ml-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Key Metrics Overview</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Subscribers"
            value={metrics.total}
            change={12.5}
            icon={Users}
            color="bg-blue-500"
            isLoading={isLoading}
            description="Complete count of all active subscribers in your database"
          />
          
          <MetricCard
            title="New Subscribers"
            value={metrics.new}
            change={22.1}
            icon={UserPlus}
            color="bg-green-500"
            isLoading={isLoading}
            description="Number of new subscribers who joined in the selected period"
          />
          
          <MetricCard
            title="Churn Rate"
            value={metrics.churn}
            change={-5.2}
            icon={UserMinus}
            color="bg-red-500"
            isLoading={isLoading}
            description="Percentage of subscribers who unsubscribed during the period"
          />
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="ml-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Engagement Metrics</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Confirmation Rate"
            value={metrics.confirmRate}
            change={3.2}
            icon={CheckCircle}
            color="bg-emerald-500"
            isLoading={isLoading}
            format="percentage"
            description="Percentage of subscribers who confirmed their email subscription"
          />
          
          <MetricCard
            title="Open Rate"
            value={metrics.openRate}
            change={-1.8}
            icon={Eye}
            color="bg-purple-500"
            isLoading={isLoading}
            format="percentage"
            description="Percentage of emails that were opened by subscribers"
          />
          
          <MetricCard
            title="Click Rate"
            value={metrics.clickRate}
            change={0.5}
            icon={MousePointer}
            color="bg-orange-500"
            isLoading={isLoading}
            format="percentage"
            description="Percentage of subscribers who clicked links in your emails"
          />
        </div>
      </div>

      {/* Growth Chart */}
      <Card className="ml-6">
        <CardHeader>
          <CardTitle>Subscriber Growth</CardTitle>
          <CardDescription>
            Line chart showing subscriber growth over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading growth data...</p>
              </div>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={metrics.growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(value) => value}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'subscribers' ? `${(value / 1000).toFixed(1)}k` : value,
                      name === 'subscribers' ? 'Total Subscribers' : 'New Subscribers'
                    ]}
                    labelFormatter={(label) => `Period: ${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line 
                    yAxisId="left"
                    type="natural" 
                    dataKey="subscribers" 
                    name="Total Subscribers"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  <Line 
                    yAxisId="right"
                    type="natural" 
                    dataKey="newSubscribers" 
                    name="New Subscribers"
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acquisition Sources */}
      <Card className="ml-6">
        <CardHeader>
          <CardTitle>Acquisition Sources</CardTitle>
          <CardDescription>
            Where your subscribers are coming from
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.bySource.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{source.count} subscribers</span>
                    <Badge variant="outline">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unsubscribe Reasons */}
      <Card className="ml-6">
        <CardHeader>
          <CardTitle>Unsubscribe Reasons</CardTitle>
          <CardDescription>
            Top reasons why subscribers are leaving
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { reason: 'Too many emails', count: 8, percentage: 34.8 },
                { reason: 'Content not relevant', count: 6, percentage: 26.1 },
                { reason: 'Never signed up', count: 4, percentage: 17.4 },
                { reason: 'Technical issues', count: 3, percentage: 13.0 },
                { reason: 'Other', count: 2, percentage: 8.7 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.reason}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="ml-6">
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Connect your email service provider for real-time data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Mailchimp Connected</p>
                <p className="text-sm text-muted-foreground">Last synced: 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                View in Mailchimp
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State Example */}
      <Card className="border-dashed ml-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Subscriber Data</h3>
            <p className="text-muted-foreground mb-4">
              Connect your email service provider to start tracking subscriber metrics.
            </p>
            <Button>
              <ExternalLink className="mr-2 h-4 w-4" />
              Connect ESP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
