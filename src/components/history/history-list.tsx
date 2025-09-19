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
import { useHistory } from '@/contexts/history-context';
import { Smile, Frown } from 'lucide-react';

export function HistoryList() {
  const { history } = useHistory();

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Urges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
            <Smile className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-headline text-xl">No History Yet</h3>
            <p className="text-muted-foreground">
              Your logged urges will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {history.map((entry, index) => {
              const urgeInfo = URGE_TYPES.find(u => u.id === entry.urgeType);
              return (
                <TableRow key={index}>
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
                        entry.outcome === 'resisted'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        entry.outcome === 'resisted'
                          ? 'bg-primary/20 text-primary-foreground'
                          : ''
                      }
                    >
                      {entry.outcome === 'resisted' ? (
                        <Smile className="mr-1 h-3 w-3" />
                      ) : (
                        <Frown className="mr-1 h-3 w-3" />
                      )}
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
