import { AppLayout } from '@/components/app-layout';
import {
  UrgesChart,
  IntensityChart,
  TriggersChart,
  StreakCard,
} from '@/components/progress/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProgressPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">Your Progress</h1>
          <p className="text-muted-foreground">
            Celebrate your wins and learn from your journey.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StreakCard
            title="Current Streak"
            value="5 days"
            change="+2 since last week"
          />
          <StreakCard
            title="Urges Resisted"
            value="78%"
            change="Up from 60%"
            isPositive
          />
          <StreakCard
            title="Toughest Time"
            value="10 PM"
            change="Previously 11 PM"
          />
          <StreakCard
            title="Top Trigger"
            value="Boredom"
            change="Replaced 'Stress'"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Resisted vs. Acted On
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UrgesChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Urge Intensity Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IntensityChart />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Trigger Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <TriggersChart />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
