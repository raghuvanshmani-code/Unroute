'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Wind } from 'lucide-react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { UrgeSurfingMindfulnessOutput } from '@/ai/flows/urge-surfing-mindfulness-prompts';
import { getUrgeSurfingScript } from '@/lib/actions';
import { URGE_TYPES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  urgeType: z.enum(URGE_TYPES.map(u => u.id) as [string, ...string[]]),
  intensityBefore: z.number().min(1).max(10),
});

type FormValues = z.infer<typeof formSchema>;

export default function UrgeSurfingTool() {
  const [script, setScript] =
    React.useState<UrgeSurfingMindfulnessOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intensityBefore: 5,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setScript(null);
    const result = await getUrgeSurfingScript(data);
    setIsLoading(false);

    if (result.success && result.data) {
      setScript(result.data);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.error ||
          'Could not generate a mindfulness script. Please try again.',
      });
    }
  };

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Urge Surfing
              </CardTitle>
              <CardDescription>
                Ride the wave of your urge instead of letting it crash over you.
                This exercise helps you observe the feeling until it passes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="urgeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urge Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an urge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {URGE_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="intensityBefore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Intensity (1-10)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">1</span>
                        <Slider
                          value={[field.value]}
                          onValueChange={vals => field.onChange(vals[0])}
                          max={10}
                          min={1}
                          step={1}
                        />
                        <span className="text-sm text-muted-foreground">
                          10
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wind className="mr-2 h-4 w-4" />
                )}
                Start Urge Surfing
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Guided Mindfulness
            </DialogTitle>
            <DialogDescription>
              Find a comfortable position, close your eyes if you wish, and
              follow along.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-h-[60vh] overflow-y-auto rounded-md bg-muted p-4">
            {script?.script.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              After the exercise, the AI estimated your urge intensity dropped
              to:
            </p>
            <p className="text-3xl font-bold text-primary">
              {script?.intensityAfter} / 10
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
