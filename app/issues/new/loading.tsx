import { Box } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";

const NewIssueLoadingPage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton height="2rem" />
      <Skeleton height="20rem" />
    </Box>
  );
};

export default NewIssueLoadingPage;
