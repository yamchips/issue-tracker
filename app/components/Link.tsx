import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof NextLink> {
  name: string;
}

const Link = ({ href, name, ...props }: Props) => {
  return (
    <RadixLink asChild>
      <NextLink href={href} {...props}>
        {name}
      </NextLink>
    </RadixLink>
  );
};

export default Link;
