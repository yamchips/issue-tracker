import Link from "next/link";
import { FaBug } from "react-icons/fa";

const NavBar = () => {
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Issues", href: "/issues" },
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
              className="text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
