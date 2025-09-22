import {
  RemixiconComponentType,
} from '@remixicon/react';
import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  type LucideIcon,
  Users,
  Mail,
  MousePointer,
  Eye,
  UserMinus,
} from 'lucide-react';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface IHighlightsRow {
  icon: LucideIcon | RemixiconComponentType;
  text: string;
  total: number;
  stats: number;
  increase: boolean;
}
type IHighlightsRows = Array<IHighlightsRow>;

interface IHighlightsItem {
  badgeColor: string;
  label: string;
}
type IHighlightsItems = Array<IHighlightsItem>;

interface IHighlightsProps {
  limit?: number;
}

const Highlights = ({ limit }: IHighlightsProps) => {
  const rows: IHighlightsRows = [
    {
      icon: Users,
      text: 'Active Subscribers',
      total: 12543,
      stats: 12.5,
      increase: true,
    },
    {
      icon: Eye,
      text: 'Email Opens',
      total: 4287,
      stats: 8.2,
      increase: true,
    },
    {
      icon: MousePointer,
      text: 'Click Rate',
      total: 8.7,
      stats: -2.1,
      increase: false,
    },
    {
      icon: Mail,
      text: 'Campaigns Sent',
      total: 24,
      stats: 5.7,
      increase: true,
    },
    { 
      icon: UserMinus, 
      text: 'Unsubscribe Rate', 
      total: 0.8, 
      stats: -1.2, 
      increase: false 
    },
  ];

  const items: IHighlightsItems = [
    { badgeColor: 'bg-green-500', label: 'High Engagement' },
    { badgeColor: 'bg-blue-500', label: 'New Subscribers' },
    { badgeColor: 'bg-orange-500', label: 'Email Campaigns' },
  ];

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-1"
      >
        <div className="flex items-center gap-1">
          <row.icon className="size-4 text-muted-foreground" />
          <span className="text-xs font-normal text-foreground">{row.text}</span>
        </div>
        <div className="flex items-center text-xs font-medium text-foreground gap-4">
          <span className="lg:text-right">
            {row.text === 'Click Rate' || row.text === 'Unsubscribe Rate' 
              ? `${row.total}%` 
              : row.total > 1000 
                ? `${(row.total / 1000).toFixed(1)}k` 
                : row.total
            }
          </span>
          <span className="flex items-center justify-end gap-0.5">
            {row.increase ? (
              <ArrowUp className="text-green-500 size-3" />
            ) : (
              <ArrowDown className="text-destructive size-3" />
            )}
            {row.stats > 0 ? '+' : ''}{row.stats}%
          </span>
        </div>
      </div>
    );
  };

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1">
        <BadgeDot className={item.badgeColor} />
        <span className="text-xs font-normal text-foreground">
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Subscriber Insights</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" mode="icon" size="sm">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-normal text-muted-foreground">
            Total subscribers
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground">12.5k</span>
            <Badge size="xs" variant="success" appearance="light">
              +12.5%
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-1">
          <div className="bg-green-500 h-1.5 w-full max-w-[60%] rounded-xs"></div>
          <div className="bg-destructive h-1.5 w-full max-w-[25%] rounded-xs"></div>
          <div className="bg-violet-500 h-1.5 w-full max-w-[15%] rounded-xs"></div>
        </div>
        <div className="flex items-center flex-wrap gap-3 mb-1">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
        <div className="border-b border-input"></div>
        <div className="grid gap-2">{rows.slice(0, limit).map(renderRow)}</div>
      </CardContent>
    </Card>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps,
};
