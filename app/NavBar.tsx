"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBug } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Box } from "@radix-ui/themes";

const NavBar = () => {
  const currentPath = usePathname();
  const { status, data: session } = useSession();
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Issues", href: "/issues/list" },
  ];
  return (
    <nav className="flex space-x-6 border-b border-gray-300 mb-5 px-5 h-14 items-center">
      <Link href="/">
        <FaBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={classNames("hover:text-zinc-800 transition-colors", {
                "text-zinc-900": link.href === currentPath,
                "text-zinc-500": link.href !== currentPath,
              })}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <Box>
        {status === "unauthenticated" && (
          <Link href="/api/auth/signin">Log in</Link>
        )}
        {status === "authenticated" && (
          <Link href="/api/auth/signout">Sign Out</Link>
        )}
      </Box>
    </nav>
  );
};

export default NavBar;
