import {
  type Icon,
  Heart,
  ShoppingBag,
  Smartphone,
  Utensils,
  GlassWater,
  Sparkles,
  Wand2,
  Home,
  History,
} from 'lucide-react';

export const URGE_TYPES = [
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'social media', label: 'Social Media', icon: Smartphone },
  { id: 'sex', label: 'Sex/Porn', icon: Heart },
  { id: 'alcohol', label: 'Alcohol', icon: GlassWater },
  {
    id: 'validation-seeking',
    label: 'Validation-seeking',
    icon: Sparkles,
  },
  { id: 'other', label: 'Other', icon: Wand2 },
] as const;

export type UrgeType = (typeof URGE_TYPES)[number]['id'];

export const NAV_LINKS: {
  href: string;
  label: string;
  icon: Icon;
  end?: boolean;
}[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, end: true },
  { href: '/history', label: 'History', icon: History },
  { href: '/tools', label: 'Tools', icon: Wand2 },
];
