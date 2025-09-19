'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock Data
const urgesData = [
  { date: 'Mon', resisted: 4, acted: 2 },
  { date: 'Tue', resisted: 3, acted: 1 },
  { date: 'Wed', resisted: 5, acted: 1 },
  { date: 'Thu', resisted: 2, acted: 3 },
  { date: 'Fri', resisted: 6, acted: 0 },
  { date: 'Sat', resisted: 4, acted: 2 },
  { date: 'Sun', resisted: 7, acted: 1 },
];

const intensityData = [
  { week: 'Week 1', avgIntensity: 8.2 },
  { week: 'Week 2', avgIntensity: 7.5 },
  { week: 'Week 3', avgIntensity: 6.8 },
  { week: 'Week 4', avgIntensity: 6.1 },
];

const triggersData = [
  { name: 'Boredom', value: 400 },
  { name: 'Stress', value: 300 },
  { name: 'Loneliness', value: 200 },
  { name: 'Time of Day', value: 100 },
];

const COLORS = ['#63BDBD', '#FFB347', '#8884d8', '#82ca9d'];

// Chart Components
export function UrgesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={urgesData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend />
        <Bar dataKey="resisted" fill="hsl(var(--primary))" name="Resisted" />
        <Bar dataKey="acted" fill="hsl(var(--accent))" name="Acted On" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IntensityChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={intensityData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="week" />
        <YAxis domain={[0, 10]} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="avgIntensity"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Average Intensity"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TriggersChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={triggersData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {triggersData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Stat Card Component
interface StreakCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
}

export function StreakCard({
  title,
  value,
  change,
  isPositive,
}: StreakCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={cn(
            'text-xs text-muted-foreground',
            isPositive ? 'text-emerald-500' : ''
          )}
        >
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
