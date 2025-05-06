import NextLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

interface Props {
  href: string;
  name: string;
}

const Link = ({ href, name }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RadixLink>{name}</RadixLink>
    </NextLink>
  );
};

export default Link;
