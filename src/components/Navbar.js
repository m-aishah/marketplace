"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const auth = getAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [auth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const isActive = (path) => pathname === path;

  const navItems = [
    { href: "/", text: "Home" },
    { href: "/apartments", text: "Apartments" },
    { href: "/products", text: "Products" },
    { href: "/services", text: "Services" },
    { href: "/requests", text: "Requests" },
  ];

  return (
    <header
      className={`${
        isScrolled
          ? "sticky top-0 shadow-lg shadow-brand/20 z-20"
          : "relative shadow"
      } w-full p-4 flex justify-center bg-white transition-all duration-300`}
    >
      <nav className="max-w-[1400px] flex justify-between items-center w-full">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.svg" alt="Logo" width={40} height={40} />
          <div className="flex items-baseline">
            <h1 className="ml-2 text-lg leading-tight font-bold tracking-tighter md:text-3xl">
              Marketplace
            </h1>
            <div className="ml-1 w-1 h-1 rounded-full bg-gradient-to-r from-[#FF7F50] to-[#98FF98] md:w-2 md:h-2"></div>
          </div>
        </Link>

        <button onClick={toggleMenu} className="lg:hidden z-50">
          {isMenuOpen ? (
            <FiX className="w-5 h-5" />
          ) : (
            <FiMenu className="w-5 h-5" />
          )}
        </button>

        <ul className="hidden gap-5 lg:flex">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              text={item.text}
              isActive={isActive(item.href)}
            />
          ))}
        </ul>

        <div className="hidden gap-5 lg:flex">
          {user ? (
            <>
              <NavButton
                href="/profile"
                text="Profile"
                icon={<FiUser className="mr-2" />}
              />
              <NavButton onClick={handleSignOut} text="Sign Out" primary />
            </>
          ) : (
            <>
              <NavButton href="/login" text="Login" />
              <NavButton href="/signup" text="Get Started" primary />
            </>
          )}
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-200 z-40 p-4">
            <nav className="flex flex-col items-center gap-10 pt-16">
              <ul className="flex flex-col gap-3 items-center">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    text={item.text}
                    isActive={isActive(item.href)}
                    onClick={closeMenu}
                  />
                ))}
              </ul>

              <div className="flex gap-5">
                {user ? (
                  <>
                    <NavButton
                      href="/profile"
                      text="Profile"
                      icon={<FiUser className="mr-2" />}
                      onClick={closeMenu}
                      fullWidth
                    />
                    <NavButton
                      onClick={() => {
                        handleSignOut();
                        closeMenu();
                      }}
                      text="Sign Out"
                      primary
                      fullWidth
                    />
                  </>
                ) : (
                  <>
                    <NavButton
                      href="/login"
                      text="Login"
                      onClick={closeMenu}
                      fullWidth
                    />
                    <NavButton
                      href="/signup"
                      text="Get Started"
                      primary
                      onClick={closeMenu}
                      fullWidth
                    />
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
};

const NavItem = ({ href, text, isActive, onClick }) => (
  <li onClick={onClick}>
    <Link
      className={`transition hover:text-brand ${
        isActive ? "text-brand font-bold" : ""
      }`}
      href={href}
    >
      {text}
    </Link>
  </li>
);

const NavButton = ({ href, text, icon, primary, onClick, fullWidth }) => {
  const baseClasses = "transition font-medium text-sm rounded-full text-center";
  const primaryClasses = primary
    ? "bg-brand text-white hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
    : "bg-transparent text-black ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100";
  const widthClasses = fullWidth ? "w-full" : "";

  const ButtonContent = () => (
    <>
      {icon}
      {text}
    </>
  );

  return href ? (
    <Link
      className={`${baseClasses} ${primaryClasses} ${widthClasses} px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center`}
      href={href}
      onClick={onClick}
    >
      <ButtonContent />
    </Link>
  ) : (
    <button
      onClick={onClick}
      className={`${baseClasses} ${primaryClasses} ${widthClasses} px-4 py-2 sm:px-5 sm:py-3 inline-flex items-center justify-center`}
    >
      <ButtonContent />
    </button>
  );
};

export default Navbar;
