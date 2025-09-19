import { AppLayout } from '@/components/app-layout';
import UrgeSurfingTool from '@/components/tools/urge-surfing-tool';

export default function ToolsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">Your Toolkit</h1>
          <p className="text-muted-foreground">
            Use these exercises to build resilience and create new habits.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-1">
          <UrgeSurfingTool />
        </div>
      </div>
    </AppLayout>
  );
}
