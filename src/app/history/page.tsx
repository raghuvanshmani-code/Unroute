import { AppLayout } from '@/components/app-layout';
import { HistoryList } from '@/components/history/history-list';

export default function HistoryPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">Your History</h1>
          <p className="text-muted-foreground">
            Review your journey and learn from your patterns.
          </p>
        </div>
        <HistoryList />
      </div>
    </AppLayout>
  );
}
