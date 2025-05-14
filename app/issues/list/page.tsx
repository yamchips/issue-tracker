import { prisma } from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import NextLink from "next/link";
import { Link, IssueStatusBadge } from "@/app/components";
import IssuesToolBar from "./IssuesToolBar";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/components/Pagination";

interface Props {
  searchParams: Promise<{
    status: Status;
    orderBy: keyof Issue;
    sortOrder: "asc" | "desc";
    page: string;
  }>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const result = await searchParams;
  const { status, orderBy, sortOrder, page } = result;

  const statusVal = Object.values(Status);
  const statusParam = statusVal.includes(status) ? status : undefined;

  const orderByParam = columns.map((col) => col.value).includes(orderBy)
    ? ["asc", "desc"].includes(sortOrder)
      ? { [orderBy]: sortOrder }
      : undefined
    : undefined;

  const pageNum = parseInt(page) || 1;
  const pageSize = 10;
  const totalItem = await prisma.issue.count({
    where: { status: statusParam },
  });

  const issues = await prisma.issue.findMany({
    where: { status: statusParam },
    orderBy: orderByParam,
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
  });
  return (
    <div>
      <IssuesToolBar />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
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
      <Pagination
        totalItem={totalItem}
        pageSize={pageSize}
        currentPage={pageNum}
      />
    </div>
  );
};
export const dynamic = "force-dynamic";
export default IssuesPage;
