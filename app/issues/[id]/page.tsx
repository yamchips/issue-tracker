import { prisma } from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import IssueDetails from "./IssueDetails";
import IssueEditButton from "./IssueEditButton";

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
    <Grid columns={{ initial: "1", xs: "2" }} gap="5">
      <Box>
        <IssueDetails issue={issue} />
      </Box>
      <Box>
        <IssueEditButton issueId={issue.id} />
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
