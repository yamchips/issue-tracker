import { Box, Card, Flex } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

const IssueDetailLoadingPage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Flex align="center" gap="3" my="3">
        <Skeleton width="5rem" />
        <Skeleton width="8rem" />
      </Flex>
      <Card className="max-w-xl prose" mt="4">
        <Skeleton count={5} />
      </Card>
    </Box>
  );
};

export default IssueDetailLoadingPage;
