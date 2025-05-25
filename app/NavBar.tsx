"use client";
import { Avatar, Container, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBug, FaRegUserCircle } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="border-b border-gray-300 mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="5">
            <Link href="/">
              <FaBug />
            </Link>
            <NavLinks />
          </Flex>
          <AuthStatus />
        </Flex>
      </Container>
    </nav>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading")
    return <div className="w-8 h-8 bg-gray-200 rounded-full" />;
  if (status === "unauthenticated")
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Log in
      </Link>
    );
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {session?.user?.image ? (
          <button className="cursor-pointer rounded-full p-0 border-0 bg-transparent">
            <Avatar
              src={session.user.image}
              fallback="?"
              size="2"
              radius="full"
              referrerPolicy="no-referrer"
            />
          </button>
        ) : (
          <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
            <FaRegUserCircle size={20} />
          </button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>
          <Text size="2">{session!.user!.email}</Text>
        </DropdownMenu.Label>
        <DropdownMenu.Item>
          <Link href="/api/auth/signout">Sign Out</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Issues", href: "/issues/list" },
  ];
  return (
    <ul className="flex space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={classNames({
              "nav-link": true,
              "!text-zinc-900": link.href === currentPath,
            })}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default NavBar;
