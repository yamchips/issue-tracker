import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";

interface Props {
  totalItem: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ currentPage, pageSize, totalItem }: Props) => {
  const totalPage = Math.ceil(totalItem / pageSize);
  if (totalPage <= 1) return null;
  return (
    <Flex align="center" gap="2">
      <Text>
        Page {currentPage} of {totalPage}
      </Text>
      <Button color="gray" variant="soft" disabled={currentPage === 1}>
        <DoubleArrowLeftIcon />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === 1}>
        <ArrowLeftIcon />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === totalPage}>
        <ArrowRightIcon />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === totalPage}>
        <DoubleArrowRightIcon />
      </Button>
    </Flex>
  );
};

export default Pagination;
