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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

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

  return (
    <header
      className={`${
        isScrolled
          ? "fixed top-0 shadow-lg shadow-brand/20 z-20"
          : "relative shadow"
      } w-full p-2 sm:p-4 flex justify-center bg-white transition-all duration-300`}
    >
      <nav className="max-w-[1400px] flex flex-wrap justify-between items-center w-full">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="sm:w-10 sm:h-10"
          />
          <div className="flex items-baseline">
            <h1 className="ml-2 text-base leading-tight font-bold tracking-tighter sm:text-lg md:text-3xl">
              Marketplace
            </h1>
            <div className="ml-1 w-1 h-1 rounded-full bg-gradient-to-r from-[#FF7F50] to-[#98FF98] sm:w-1.5 sm:h-1.5 md:w-2 md:h-2"></div>
          </div>
        </Link>

        <div
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="lg:hidden"
        >
          {isMenuOpen ? (
            <FiX className="relative z-50 w-5 h-5" />
          ) : (
            <FiMenu className="relative z-50 w-5 h-5" />
          )}
        </div>

        <ul className="hidden lg:flex gap-5">
          <NavItem href="/" text="Home" isActive={isActive("/")} />
          <NavItem
            href="/apartments"
            text="Apartments"
            isActive={isActive("/apartments")}
          />
          <NavItem href="/goods" text="Goods" isActive={isActive("/goods")} />
          <NavItem
            href="/services"
            text="Services"
            isActive={isActive("/services")}
          />
          <NavItem
            href="/requests"
            text="Requests"
            isActive={isActive("/requests")}
          />
        </ul>

        <div className="hidden lg:flex gap-5">
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
          <div className="fixed top-0 left-0 w-full h-full bg-gray-200 z-40 p-4 overflow-y-auto lg:hidden">
            <nav className="flex flex-col items-center gap-6 sm:gap-10">
              <div
                onClick={closeMenu}
                className="self-start flex w-full justify-between items-center"
              >
                <Link href="/">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="sm:w-10 sm:h-10"
                  />
                </Link>
                <FiX className="z-50 w-5 h-5" />
              </div>

              <ul className="flex flex-col gap-3 items-center">
                <NavItem
                  href="/"
                  text="Home"
                  isActive={isActive("/")}
                  onClick={closeMenu}
                />
                <NavItem
                  href="/apartments"
                  text="Apartments"
                  isActive={isActive("/apartments")}
                  onClick={closeMenu}
                />
                <NavItem
                  href="/goods"
                  text="Goods"
                  isActive={isActive("/goods")}
                  onClick={closeMenu}
                />
                <NavItem
                  href="/services"
                  text="Services"
                  isActive={isActive("/services")}
                  onClick={closeMenu}
                />
                <NavItem
                  href="/requests"
                  text="Requests"
                  isActive={isActive("/requests")}
                  onClick={closeMenu}
                />
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
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
