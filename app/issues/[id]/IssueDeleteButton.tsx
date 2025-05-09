import { Button } from "@radix-ui/themes";
import { MdDeleteOutline } from "react-icons/md";

const IssueDeleteButton = ({ issueId }: { issueId: number }) => {
  return (
    <Button color="red">
      <MdDeleteOutline />
      Delete Issue
    </Button>
  );
};

export default IssueDeleteButton;
