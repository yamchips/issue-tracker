import { prisma } from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { Link, IssueStatusBadge } from "@/app/components";
import IssuesToolBar from "./IssuesToolBar";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: Promise<{
    status: Status;
    orderBy: keyof Issue;
    sortOrder?: "asc" | "desc";
  }>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];
  const statusVal = Object.values(Status);

  const result = await searchParams;
  const { status, orderBy, sortOrder } = result;
  const category = statusVal.includes(status) ? status : undefined;

  const issues = await prisma.issue.findMany({
    where: { status: category },
    orderBy: { [orderBy]: sortOrder },
  });
  return (
    <div>
      <IssuesToolBar />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value}>
                <NextLink
                  href={{
                    query: {
                      ...result,
                      orderBy: column.value,
                      sortOrder: sortOrder === "asc" ? "desc" : "asc",
                    },
                  }}
                >
                  {column.label}
                  {column.value === result.orderBy && (
                    <ArrowUpIcon
                      className={`inline transition-transform ${
                        result.sortOrder === "desc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </NextLink>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`} name={issue.title}></Link>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
export const dynamic = "force-dynamic";
export default IssuesPage;
