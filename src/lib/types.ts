import type { z } from 'zod';
import type { logUrgeSchema } from '@/components/dashboard/log-urge-flow';

export type LogUrgeFormValues = z.infer<typeof logUrgeSchema>;
