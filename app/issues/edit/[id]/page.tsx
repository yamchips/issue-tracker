import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import IssueFormWrapper from "@/app/issues/_components/IssueFormWrapper";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

const IssueEditPage = async ({ params }: Props) => {
  const { id } = await params;
  const inputId = parseInt(id);
  const issue = await prisma.issue.findUnique({
    where: { id: inputId },
  });
  if (!issue) notFound();
  return <IssueFormWrapper issue={issue} />;
};

export const metadata: Metadata = {
  title: "Issue Tracker - Edit Issue",
  description: "Edit an issue",
};

export default IssueEditPage;
