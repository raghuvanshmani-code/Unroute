'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { URGE_TYPES } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';

const mockHistory = [
  {
    id: 1,
    urgeType: 'social media',
    intensity: 7,
    outcome: 'resisted',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    urgeType: 'food',
    intensity: 5,
    outcome: 'acted',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 3,
    urgeType: 'shopping',
    intensity: 8,
    outcome: 'resisted',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    urgeType: 'sex',
    intensity: 9,
    outcome: 'acted',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    urgeType: 'social media',
    intensity: 6,
    outcome: 'resisted',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export function HistoryList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Urges</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Urge</TableHead>
              <TableHead>Intensity</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map(entry => {
              const urgeInfo = URGE_TYPES.find(u => u.id === entry.urgeType);
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {urgeInfo && <urgeInfo.icon className="h-4 w-4" />}
                      <span>{urgeInfo?.label || entry.urgeType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{entry.intensity}/10</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.outcome === 'resisted' ? 'secondary' : 'destructive'
                      }
                      className={
                        entry.outcome === 'resisted'
                          ? 'bg-primary/20 text-primary-foreground'
                          : ''
                      }
                    >
                      {entry.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(entry.date, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
