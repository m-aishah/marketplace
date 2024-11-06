import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black p-4 transition-all duration-300 flex justify-center">
      <nav className="max-w-[1400px] flex flex-col gap-5 justify-between items-center w-full md:flex-row">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-light.svg"
            alt="Logo"
            width={40}
            height={40}
          />
          <div className="flex items-baseline">
            <h1 className="ml-2 text-lg text-white leading-tight font-bold tracking-tighter md:text-3xl">
              FindAll
            </h1>
            <div className="ml-1 w-1 h-1 rounded-full bg-gradient-to-r from-[#FF7F50] to-[#98FF98] md:w-2 md:h-2"></div>
          </div>
        </Link>

        <ul className="flex gap-4 items-center text-gray-500">
          <li>
            <Link
              href="/about"
              className="transition duration-200 hover:text-white active:text-white"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="transition duration-200 hover:text-white active:text-white"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="transition duration-200 hover:text-white active:text-white"
            >
              FAQ
            </Link>
          </li>
        </ul>

        <p className="text-gray-500 text-xs text-center">
          &copy; {new Date().getFullYear()} Student Marketplace. All rights
          reserved.
        </p>
      </nav>
    </footer>
  );
};

export default Footer;
