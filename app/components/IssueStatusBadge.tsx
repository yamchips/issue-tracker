import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";

const statusMap: Record<
  Status,
  { name: string; color: "red" | "violet" | "green" }
> = {
  OPEN: { name: "Open", color: "red" },
  IN_PROGRESS: {
    name: "In Progress",
    color: "violet",
  },
  CLOSED: {
    name: "Closed",
    color: "green",
  },
};

const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].name}</Badge>
  );
};

export default IssueStatusBadge;
