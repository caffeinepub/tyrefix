import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status.toLowerCase()] ??
    "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <Badge variant="outline" className={`capitalize font-medium ${style}`}>
      {status}
    </Badge>
  );
}
