'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { ImplementationIntentionOutput } from '@/ai/flows/implementation-intention-generator';
import { getImplementationIntention } from '@/lib/actions';
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
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  loggedTriggers: z
    .string()
    .min(10, 'Please describe your triggers in a bit more detail.'),
  habitCategory: z.enum(URGE_TYPES.map(u => u.id) as [string, ...string[]]),
});

type FormValues = z.infer<typeof formSchema>;

export default function ImplementationIntentionForm() {
  const [intention, setIntention] =
    React.useState<ImplementationIntentionOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setIntention(null);
    const result = await getImplementationIntention(data);
    setIsLoading(false);

    if (result.success && result.data) {
      setIntention(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          result.error || 'Could not generate a plan. Please try again.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Create an If-Then Plan
        </CardTitle>
        <CardDescription>
          Prepare for future urges by creating a specific plan of action. This is
          a powerful technique called an &quot;implementation intention.&quot;
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="habitCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the habit you're working on" />
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
              name="loggedTriggers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Triggers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'When I feel lonely at night', 'after a stressful meeting', 'scrolling Instagram before bed'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List some situations, feelings, or times that trigger your
                    urge. Be specific.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate My Plan
            </Button>
          </CardFooter>
        </form>
      </Form>
      {intention && (
        <div className="p-6 pt-0">
          <div className="mt-4 rounded-lg border bg-primary/10 p-4">
            <h4 className="mb-2 flex items-center font-headline text-lg text-primary-foreground">
              <Lightbulb className="mr-2 h-5 w-5" /> Your New Plan
            </h4>
            <p className="font-serif text-lg italic">
              &quot;{intention.implementationIntention}&quot;
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
