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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Function to generate random data for demonstration
const generateUrgesData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    date: day,
    resisted: Math.floor(Math.random() * 8),
    acted: Math.floor(Math.random() * 4),
  }));
};

const generateIntensityData = () => {
  return [
    { week: 'Week 1', avgIntensity: Math.random() * 3 + 6 },
    { week: 'Week 2', avgIntensity: Math.random() * 2 + 5 },
    { week: 'Week 3', avgIntensity: Math.random() * 2 + 4 },
    { week: 'Week 4', avgIntensity: Math.random() * 2 + 3 },
  ].map(d => ({ ...d, avgIntensity: Number(d.avgIntensity.toFixed(1)) }));
};

const generateTriggersData = () => {
  const triggers = ['Boredom', 'Stress', 'Loneliness', 'Time of Day'];
  return triggers.map(trigger => ({
    name: trigger,
    value: Math.floor(Math.random() * 300 + 100),
  }));
};

const COLORS = ['#63BDBD', '#FFB347', '#8884d8', '#82ca9d'];

// Chart Components
export function UrgesChart() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    setData(generateUrgesData());
  }, []);

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    setData(generateIntensityData());
  }, []);
  
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    setData(generateTriggersData());
  }, []);

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
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
          {data.map((entry, index) => (
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