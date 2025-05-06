import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const IssueDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const newId = parseInt(id);
  if (isNaN(newId)) {
    notFound();
  }
  const issue = await prisma.issue.findUnique({
    where: { id: newId },
  });
  if (!issue) notFound();
  return (
    <div>
      <p>{issue.title}</p>
      <p>{issue.description}</p>
      <p>{issue.status}</p>
      <p>{issue.createdAt.toDateString()}</p>
    </div>
  );
};

export default IssueDetailPage;
