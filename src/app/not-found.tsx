import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/app-layout';

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h1 className="font-headline text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 font-headline text-2xl">Page Not Found</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          It seems you&apos;ve taken a path that doesn&apos;t exist. Let&apos;s get
          you back on track.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
