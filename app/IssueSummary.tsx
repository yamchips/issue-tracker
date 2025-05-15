import { Status } from "@prisma/client";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const statuses: {
    label: string;
    count: number;
    status: Status;
  }[] = [
    { label: "Open Issues", count: open, status: "OPEN" },
    { label: "In progress Issues", count: inProgress, status: "IN_PROGRESS" },
    { label: "Closed Issues", count: closed, status: "CLOSED" },
  ];
  return (
    <Flex gap="4">
      {statuses.map((status) => (
        <Card key={status.label}>
          <Flex direction="column" gap="2">
            <Link
              href={`/issues/list?status=${status.status}`}
              className="text-sm font-medium"
            >
              {status.label}
            </Link>
            <Text size={"5"} className="font-bold">
              {status.count}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
