"use client";
import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const assignStatus = (val: string) => {
    axios
      .patch("/xapi/issues/" + issue.id, {
        ...issue,
        status: val,
      })
      .catch(() => {
        toast.error("Changes cannot be saved.");
      });
    router.refresh();
  };
  return (
    <>
      <Select.Root defaultValue={issue.status} onValueChange={assignStatus}>
        <Select.Trigger placeholder="Status..." />
        <Select.Content>
          {Object.values(Status).map((status) => (
            <Select.Item key={status} value={status}>
              {status}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default StatusSelect;
