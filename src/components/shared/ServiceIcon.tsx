import {
  Home,
  Car,
  Wrench,
  Briefcase,
  FileText,
  HeartHandshake,
  Building2,
  FileCheck,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Home,
  Car,
  Wrench,
  Briefcase,
  FileText,
  HeartHandshake,
  Building2,
  FileCheck,
  LifeBuoy,
};

/** Resolve lucide icon by ERP/static name; defaults to Briefcase. */
export default function ServiceIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Briefcase;
  return <Icon size={size} />;
}
