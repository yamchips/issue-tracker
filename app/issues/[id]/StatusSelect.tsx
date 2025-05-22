import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import React from "react";

const StatusSelect = () => {
  return (
    <>
      <Select.Root>
        <Select.Trigger placeholder="Status..." />
        <Select.Content>
          {Object.values(Status).map((status) => (
            <Select.Item key={status} value={status}>
              {status}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
  );
};

export default StatusSelect;
