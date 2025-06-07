import { prisma } from "@/prisma/client";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { Status } from "@prisma/client";
import IssueChart from "./IssueChart";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export default async function Home() {
  const open = await prisma.issue.count({ where: { status: Status.OPEN } });
  const inProgress = await prisma.issue.count({
    where: { status: Status.IN_PROGRESS },
  });
  const closed = await prisma.issue.count({ where: { status: Status.CLOSED } });
  const count = { open, inProgress, closed };
  return (
    <>
      <Grid
        columns={{
          initial: "1",
          md: "2",
        }}
        gap="5"
      >
        <Flex direction="column" gap="5">
          <IssueSummary {...count} />
          <IssueChart {...count} />
        </Flex>

        <LatestIssues />
      </Grid>
    </>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summary of project issues",
  openGraph: {
    title: "Issue Tracker",
    description: "An example app to deal with issues.",
    url: "https://issue-tracker-gamma-puce.vercel.app",
    images: [
      { url: "https://issue-tracker-gamma-puce.vercel.app/home-page.png" },
    ],
    type: "website",
  },
  twitter: {
    title: "Issue Tracker",
    description: "An example app to deal with issues.",
    images: ["https://issue-tracker-gamma-puce.vercel.app/home-page.png"],
    card: "summary_large_image",
  },
};

export const dynamic = "force-dynamic";
