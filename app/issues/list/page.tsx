import Pagination from "@/app/components/Pagination";
import { prisma } from "@/prisma/client";
import { Status } from "@prisma/client";
import { Flex } from "@radix-ui/themes";
import IssuesToolBar from "./IssuesToolBar";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const query = await searchParams;
  const { status, orderBy, sortOrder, page } = query;

  const statusVal = Object.values(Status);
  const statusParam = statusVal.includes(status) ? status : undefined;

  const orderByParam = columnNames.includes(orderBy)
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
    <Flex direction="column" gap="4">
      <IssuesToolBar />
      <IssueTable query={query} issues={issues} />
      <Pagination
        totalItem={totalItem}
        pageSize={pageSize}
        currentPage={pageNum}
      />
    </Flex>
  );
};
export const dynamic = "force-dynamic";
export default IssuesPage;
