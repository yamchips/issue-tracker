import { IssueStatusBadge } from "@/app/components";
import { prisma } from "@/prisma/client";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";

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
        <Heading>{issue.title}</Heading>
        <Flex align="center" gap="3" my="3">
          <IssueStatusBadge status={issue.status} />
          <Text>{issue.createdAt.toDateString()}</Text>
        </Flex>
        <Card className="max-w-xl prose" mt="4">
          <ReactMarkdown>{issue.description}</ReactMarkdown>
        </Card>
      </Box>
      <Box>
        <Button>
          <Pencil2Icon />
          <Link href={`/issues/${issue.id}/edit`}>Edit Issue</Link>
        </Button>
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
