import { CheckCircle2, Clock3, CircleAlert } from "lucide-react";
import type { DocumentStatus } from "../types";

const variants: Record<
  DocumentStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  ready: {
    label: "Ready",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  error: {
    label: "Needs attention",
    className: "bg-rose-50 text-rose-700",
    icon: CircleAlert,
  },
};

export default function StatusBadge({ status }: { status: DocumentStatus }) {
  const variant = variants[status];
  const Icon = variant.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${variant.className}`}>
      <Icon size={13} strokeWidth={2} />
      {variant.label}
    </span>
  );
}
