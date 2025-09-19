import { AppLayout } from '@/components/app-layout';
import LogUrgeFlow from '@/components/dashboard/log-urge-flow';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">
            Welcome to Your Space
          </h1>
          <p className="text-muted-foreground">
            Acknowledge your feelings, understand your patterns, and choose your
            path.
          </p>
        </div>
        <LogUrgeFlow />
      </div>
    </AppLayout>
  );
}
