'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ReportDownloadPage() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [fileType, setFileType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [breakdown, setBreakdown] = useState<string>('all');
  const [metricType, setMetricType] = useState<string>('all');

  // Reset page when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fileTypeOptions = [
    { value: 'all', label: 'All File Types' },
    { value: 'csv', label: '.CSV' },
    { value: 'pdf', label: '.PDF' },
    { value: 'excel', label: '.XLSX' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-90-days', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' },
  ];

  const breakdownOptions = [
    { value: 'all', label: 'All Breakdowns' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  const metricTypeOptions = [
    { value: 'all', label: 'All Metrics' },
    { value: 'newsletters', label: 'Newsletters' },
    { value: 'ads', label: 'Ads' },
    { value: 'content', label: 'Content' },
    { value: 'users', label: 'Users' },
  ];

  const reportData = [
    {
      id: 1,
      date: '21 Oct, 2024 - 21 Nov 2024',
      metric: 'Newsletters',
      breakdown: 'Weekly',
      fileType: '.CSV',
    },
    {
      id: 2,
      date: '21 Oct, 2024 - 21 Nov 2024',
      metric: 'Ads',
      breakdown: 'Monthly',
      fileType: '.CSV',
    },
    {
      id: 3,
      date: '21 Jul, 2024 - 21 Sep 2024',
      metric: 'Newsletters',
      breakdown: 'Weekly',
      fileType: '.CSV',
    },
    {
      id: 4,
      date: '21 Jun, 2024 - 21 Aug 2024',
      metric: 'Content',
      breakdown: 'Monthly',
      fileType: '.PDF',
    },
    {
      id: 5,
      date: '21 May, 2024 - 21 Jul 2024',
      metric: 'Users',
      breakdown: 'Weekly',
      fileType: '.XLSX',
    },
    {
      id: 6,
      date: '21 Apr, 2024 - 21 Jun 2024',
      metric: 'Newsletters',
      breakdown: 'Monthly',
      fileType: '.CSV',
    },
    {
      id: 7,
      date: '21 Mar, 2024 - 21 May 2024',
      metric: 'Ads',
      breakdown: 'Weekly',
      fileType: '.PDF',
    },
    {
      id: 8,
      date: '21 Feb, 2024 - 21 Apr 2024',
      metric: 'Content',
      breakdown: 'Monthly',
      fileType: '.CSV',
    },
    {
      id: 9,
      date: '21 Jan, 2024 - 21 Mar 2024',
      metric: 'Users',
      breakdown: 'Weekly',
      fileType: '.XLSX',
    },
    {
      id: 10,
      date: '21 Dec, 2023 - 21 Feb 2024',
      metric: 'Newsletters',
      breakdown: 'Monthly',
      fileType: '.CSV',
    },
  ];

  // Filter the data based on selected filters
  const filteredData = reportData.filter((item) => {
    // Filter by file type
    if (fileType !== 'all') {
      const itemFileType = item.fileType.toLowerCase().replace('.', '');
      const filterFileType = fileType === 'excel' ? 'xlsx' : fileType;
      if (itemFileType !== filterFileType) {
        return false;
      }
    }
    
    // Filter by metric type
    if (metricType !== 'all' && item.metric.toLowerCase() !== metricType.toLowerCase()) {
      return false;
    }
    
    // Filter by breakdown
    if (breakdown !== 'all' && item.breakdown.toLowerCase() !== breakdown.toLowerCase()) {
      return false;
    }
    
    // Filter by date range (simplified - in real app you'd parse actual dates)
    if (dateRange !== 'all') {
      // This is a simplified date filtering - in a real app you'd parse actual dates
      // For now, we'll just return true for all items
      return true;
    }
    
    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setFileType('all');
    setDateRange('all');
    setBreakdown('all');
    setMetricType('all');
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(currentData.map(item => item.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 pt-2 pb-6 space-y-6 max-w-6xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Report Download</h1>
          <p className="text-base text-muted-foreground">
            Generate and download custom reports with analytics and insights
          </p>
        </div>
      </div>

      {/* Report Generation Section */}
      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Generate New Report</h2>
              <div className="ml-8">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => {
                    // Generate new report logic
                    const newReport = {
                      id: Date.now(),
                      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                      metric: 'Custom Report',
                      breakdown: 'Generated',
                      fileType: '.CSV'
                    };
                    // In a real app, this would call an API to generate the report
                    console.log('Generating new report:', newReport);
                    alert('Report generation started! Check back in a few minutes.');
                  }}
                  className="text-xs"
                >
                  Generate Report
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Report Type */}
              <div className="space-y-3">
                <Label htmlFor="report-type" className="text-sm font-medium text-foreground">
                  Report Type
                </Label>
                <Select defaultValue="analytics">
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytics" className="py-2.5">Analytics Report</SelectItem>
                    <SelectItem value="user-activity" className="py-2.5">User Activity</SelectItem>
                    <SelectItem value="content-performance" className="py-2.5">Content Performance</SelectItem>
                    <SelectItem value="financial" className="py-2.5">Financial Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Period */}
              <div className="space-y-3">
                <Label htmlFor="time-period" className="text-sm font-medium text-foreground">
                  Time Period
                </Label>
                <Select defaultValue="last-30-days">
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days" className="py-2.5">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days" className="py-2.5">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days" className="py-2.5">Last 90 days</SelectItem>
                    <SelectItem value="custom" className="py-2.5">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Output Format */}
              <div className="space-y-3">
                <Label htmlFor="output-format" className="text-sm font-medium text-foreground">
                  Output Format
                </Label>
                <Select defaultValue="csv">
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv" className="py-2.5">CSV</SelectItem>
                    <SelectItem value="pdf" className="py-2.5">PDF</SelectItem>
                    <SelectItem value="excel" className="py-2.5">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Include Data */}
              <div className="space-y-3">
                <Label htmlFor="include-data" className="text-sm font-medium text-foreground">
                  Include Data
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="py-2.5">All Data</SelectItem>
                    <SelectItem value="summary" className="py-2.5">Summary Only</SelectItem>
                    <SelectItem value="detailed" className="py-2.5">Detailed Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filter Reports</h2>
              <div className="ml-8">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* File Type Filter */}
              <div className="space-y-3">
                <Label htmlFor="file-type" className="text-sm font-medium text-foreground">
                  File Type
                </Label>
                <Select value={fileType} onValueChange={(value) => handleFilterChange(setFileType, value)}>
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2.5">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <Label htmlFor="date-range" className="text-sm font-medium text-foreground">
                  Date Range
                </Label>
                <Select value={dateRange} onValueChange={(value) => handleFilterChange(setDateRange, value)}>
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2.5">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Breakdown Filter */}
              <div className="space-y-3">
                <Label htmlFor="breakdown" className="text-sm font-medium text-foreground">
                  Breakdown
                </Label>
                <Select value={breakdown} onValueChange={(value) => handleFilterChange(setBreakdown, value)}>
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select breakdown" />
                  </SelectTrigger>
                  <SelectContent>
                    {breakdownOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2.5">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Metric Type Filter */}
              <div className="space-y-3">
                <Label htmlFor="metric-type" className="text-sm font-medium text-foreground">
                  Metric Type
                </Label>
                <Select value={metricType} onValueChange={(value) => handleFilterChange(setMetricType, value)}>
                  <SelectTrigger className="h-11 border-border/50 focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2.5">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="space-y-3 p-4 pb-0">
            <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Available Reports</h2>
            </div>
              <div className="text-sm text-muted-foreground">
                {selectedRows.size > 0 && (
                  <span className="text-primary font-medium">
                    {selectedRows.size} of {currentData.length} selected
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl">
              <thead className="border-t border-b bg-muted/30">
                <tr>
                  <th className="text-left px-1 py-3 w-8">
                    <div className="p-1">
                      <Checkbox
                        checked={selectedRows.size === currentData.length && currentData.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                      />
                    </div>
                  </th>
                  <th 
                    className="text-left pl-1 pr-0 py-3 cursor-pointer hover:bg-muted/50 transition-colors group w-20"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">Date</span>
                      {getSortIcon('date')}
                    </div>
                  </th>
                  <th 
                    className="text-left pl-1 pr-0 py-3 cursor-pointer hover:bg-muted/50 transition-colors group w-24"
                    onClick={() => handleSort('metric')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">Metric</span>
                      {getSortIcon('metric')}
                    </div>
                  </th>
                  <th 
                    className="text-left pl-1 pr-0 py-3 cursor-pointer hover:bg-muted/50 transition-colors group w-20"
                    onClick={() => handleSort('breakdown')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">Breakdown</span>
                      {getSortIcon('breakdown')}
                    </div>
                  </th>
                  <th 
                    className="text-left pl-1 pr-0 py-3 cursor-pointer hover:bg-muted/50 transition-colors group w-16"
                    onClick={() => handleSort('fileType')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">File Type</span>
                      {getSortIcon('fileType')}
                    </div>
                  </th>
                  <th className="text-left px-1 py-3 w-8">
                    <span className="font-semibold text-xs text-foreground">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors group">
                    <td className="px-1 py-3">
                      <div className="p-1">
                        <Checkbox
                          checked={selectedRows.has(item.id)}
                          onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="pl-1 pr-0 py-3">
                      <div className="text-xs font-medium text-foreground truncate">{item.date}</div>
                    </td>
                    <td className="pl-1 pr-0 py-3">
                      <div className="text-xs text-foreground truncate">{item.metric}</div>
                    </td>
                    <td className="pl-1 pr-0 py-3">
                      <div className="text-xs text-foreground truncate">{item.breakdown}</div>
                    </td>
                    <td className="pl-1 pr-0 py-3">
                      <div className="text-xs text-foreground truncate">{item.fileType}</div>
                    </td>
                    <td className="px-1 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/20">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-muted-foreground">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-16 h-7 text-xs border-border/50 focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5" className="py-1 text-xs">5</SelectItem>
                  <SelectItem value="10" className="py-1 text-xs">10</SelectItem>
                  <SelectItem value="25" className="py-1 text-xs">25</SelectItem>
                  <SelectItem value="50" className="py-1 text-xs">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs font-medium text-muted-foreground">per page</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-muted-foreground">
                <span className="text-foreground font-semibold">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span> of <span className="text-foreground font-semibold">{totalItems}</span>
              </span>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-7 w-7 p-0 text-xs ${
                        currentPage === pageNum 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
