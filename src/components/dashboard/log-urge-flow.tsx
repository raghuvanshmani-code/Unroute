'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Sparkles, Wind } from 'lucide-react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getIntervention } from '@/lib/actions';
import { URGE_TYPES } from '@/lib/constants';
import type { LogUrgeFormValues } from '@/lib/types';
import type { InterventionOutput } from '@/ai/flows/personalized-intervention-suggestions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useHistory } from '@/contexts/history-context';
import type { HistoryEntry } from '@/contexts/history-context';

export const logUrgeSchema = z.object({
  urgeType: z.enum(URGE_TYPES.map(u => u.id) as [string, ...string[]], {
    required_error: 'You need to select an urge type.',
  }),
  intensity: z.number().min(1).max(10),
  motivation: z.number().min(1).max(10),
  ability: z.number().min(1).max(10),
});

type Step = 'INITIAL' | 'CLASSIFY' | 'FOGG_MODEL' | 'INTERVENTION' | 'DELAY';

export default function LogUrgeFlow() {
  const [step, setStep] = React.useState<Step>('INITIAL');
  const [intervention, setIntervention] =
    React.useState<InterventionOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const { addHistoryEntry } = useHistory();

  const { toast } = useToast();

  const form = useForm<LogUrgeFormValues>({
    resolver: zodResolver(logUrgeSchema),
    defaultValues: {
      intensity: 5,
      motivation: 5,
      ability: 5,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = form;
  const urgeType = watch('urgeType');

  React.useEffect(() => {
    if (step === 'DELAY' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (step === 'DELAY' && timeLeft === 0) {
      // Optional: show a modal or message when timer finishes
    }
  }, [step, timeLeft]);

  const onGetIntervention = async (data: LogUrgeFormValues) => {
    setIsLoading(true);
    setIntervention(null);
    const result = await getIntervention({
      urgeType: data.urgeType,
      motivationLevel: data.motivation,
      abilityLevel: data.ability,
    });
    setIsLoading(false);
    if (result.success && result.data) {
      setIntervention(result.data);
      setStep('INTERVENTION');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.error || 'Something went wrong. Please try again.',
      });
    }
  };

  const startDelay = () => {
    setTimeLeft(20 * 60); // 20 minutes in seconds
    setStep('DELAY');
  };

  const handleEndFlow = (outcome: HistoryEntry['outcome']) => {
    const values = getValues();
    addHistoryEntry({
      urgeType: values.urgeType,
      intensity: values.intensity,
      outcome: outcome,
      date: new Date(),
    });
    resetFlow();
  };

  const resetFlow = () => {
    form.reset({ intensity: 5, motivation: 5, ability: 5 });
    setStep('INITIAL');
    setIntervention(null);
    setIsLoading(false);
    setTimeLeft(0);
  };

  if (step === 'INITIAL') {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full border-8 border-primary/10 bg-primary/20 p-4">
              <Wind className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="font-headline text-2xl">Acknowledge the Moment</h2>
            <p className="max-w-md text-muted-foreground">
              You&apos;ve taken the first step: awareness. Let&apos;s explore
              this feeling together without judgment.
            </p>
            <Button
              size="lg"
              onClick={() => setStep('CLASSIFY')}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              I&apos;m aware of an urge
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'CLASSIFY':
        return (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                What are you feeling?
              </CardTitle>
              <CardDescription>
                First, let&apos;s identify the urge and its strength.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>What type of urge is it?</Label>
                <Controller
                  name="urgeType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4 md:grid-cols-3"
                    >
                      {URGE_TYPES.map(type => (
                        <Label
                          key={type.id}
                          className={cn(
                            'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/50',
                            field.value === type.id &&
                              'border-primary bg-primary/10'
                          )}
                        >
                          <RadioGroupItem value={type.id} className="sr-only" />
                          <type.icon className="mb-2 h-6 w-6" />
                          {type.label}
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.urgeType && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.urgeType.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>How intense is the urge? (1-10)</Label>
                <Controller
                  name="intensity"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">1</span>
                      <Slider
                        value={[field.value]}
                        onValueChange={vals => field.onChange(vals[0])}
                        max={10}
                        min={1}
                        step={1}
                      />
                      <span className="text-sm text-muted-foreground">10</span>
                    </div>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => urgeType && setStep('FOGG_MODEL')}
                disabled={!urgeType}
              >
                Next
              </Button>
            </CardFooter>
          </>
        );

      case 'FOGG_MODEL':
        return (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Check in with yourself
              </CardTitle>
              <CardDescription>
                How motivated and able are you to resist right now?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Motivation to change (1-10)</Label>
                <Controller
                  name="motivation"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Low</span>
                      <Slider
                        value={[field.value]}
                        onValueChange={vals => field.onChange(vals[0])}
                        max={10}
                        min={1}
                        step={1}
                      />
                      <span className="text-sm text-muted-foreground">
                        High
                      </span>
                    </div>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Ability to act differently (1-10)</Label>
                <Controller
                  name="ability"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Low</span>
                      <Slider
                        value={[field.value]}
                        onValueChange={vals => field.onChange(vals[0])}
                        max={10}
                        min={1}
                        step={1}
                      />
                      <span className="text-sm text-muted-foreground">
                        High
                      </span>
                    </div>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep('CLASSIFY')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleSubmit(onGetIntervention)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get my intervention
              </Button>
            </CardFooter>
          </>
        );

      case 'INTERVENTION':
        return (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Your Personalized Action
              </CardTitle>
              <CardDescription>
                Here&apos;s a micro-action you can take right now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-headline text-xl text-primary-foreground">
                  {intervention?.intervention}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Why this helps:</span>{' '}
                {intervention?.explanation}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Button variant="ghost" onClick={() => handleEndFlow('resisted')}>
                I did it! / Urge passed
              </Button>
              <Button onClick={startDelay}>Delay 20 minutes</Button>
            </CardFooter>
          </>
        );

      case 'DELAY':
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return (
          <>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Creating Space
              </CardTitle>
              <CardDescription>
                The urge is a wave. Let&apos;s watch it without getting swept
                away.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-center">
              <div className="font-mono text-6xl font-bold text-primary-foreground">
                {String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
              </div>
              <p className="text-muted-foreground">
                While you wait, try an urge-surfing exercise.
              </p>
              <Button variant="secondary" asChild>
                <Link href="/tools">Go to Urge Surfing Tool</Link>
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => handleEndFlow('resisted')}>
                I&apos;m done, the urge faded
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleEndFlow('acted')}
              >
                I acted on the urge
              </Button>
            </CardFooter>
          </>
        );

      default:
        return null;
    }
  };

  return <Card className="w-full">{renderContent()}</Card>;
}
