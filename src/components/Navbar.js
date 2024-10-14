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

        <div
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden"
        >
          {isMenuOpen ? (
            <FiX className="relative z-50 w-5 h-5" />
          ) : (
            <FiMenu className="relative z-50 w-5 h-5" />
          )}
        </div>

        <ul className="hidden gap-5 md:flex">
          <li>
            <Link
              className={`transition hover:text-brand ${
                isActive("/") ? "text-brand font-bold" : ""
              }`}
              href="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`transition hover:text-brand ${
                isActive("/apartments") ? "text-brand font-bold" : ""
              }`}
              href="/apartments"
            >
              Apartments
            </Link>
          </li>
          <li>
            <Link
              className={`transition hover:text-brand ${
                isActive("/goods") ? "text-brand font-bold" : ""
              }`}
              href="/goods"
            >
              Goods
            </Link>
          </li>
          <li>
            <Link
              className={`transition hover:text-brand ${
                isActive("/services") ? "text-brand font-bold" : ""
              }`}
              href="/services"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              className={`transition hover:text-brand ${
                isActive("/requests") ? "text-brand font-bold" : ""
              }`}
              href="/requests"
            >
              Requests
            </Link>
          </li>
        </ul>

        <div className="hidden gap-5 md:flex">
          {user ? (
            <>
              <Link
                className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 flex items-center"
                href="/profile"
              >
                <FiUser className="mr-2" /> Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="transition bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="transition bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
                href="/signup"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {isMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-200 z-40 p-4">
            <nav className="flex flex-col items-center gap-10">
              <div
                onClick={closeMenu}
                className="self-start flex w-full justify-between items-center"
              >
                <Link href="/">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                  />
                </Link>
                <FiX className="z-50 w-5 h-5" />
              </div>

              <ul className="flex flex-col gap-3 items-center">
                <li onClick={closeMenu}>
                  <Link
                    className={`transition active:text-brand ${
                      isActive("/") ? "text-brand font-bold" : ""
                    }`}
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link
                    className={`transition active:text-brand ${
                      isActive("/apartments") ? "text-brand font-bold" : ""
                    }`}
                    href="/apartments"
                  >
                    Apartments
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link
                    className={`transition active:text-brand ${
                      isActive("/goods") ? "text-brand font-bold" : ""
                    }`}
                    href="/goods"
                  >
                    Goods
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link
                    className={`transition active:text-brand ${
                      isActive("/services") ? "text-brand font-bold" : ""
                    }`}
                    href="/services"
                  >
                    Services
                  </Link>
                </li>
                <li onClick={closeMenu}>
                  <Link
                    className={`transition active:text-brand ${
                      isActive("/requests") ? "text-brand font-bold" : ""
                    }`}
                    href="/requests"
                  >
                    Requests
                  </Link>
                </li>
              </ul>

              <div className="flex gap-5">
                {user ? (
                  <>
                    <div onClick={closeMenu}>
                      <Link
                        className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100 flex items-center"
                        href="/profile"
                      >
                        <FiUser className="mr-2" /> Profile
                      </Link>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMenu();
                      }}
                      className="transition bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div onClick={closeMenu}>
                      <Link
                        className="transition bg-transparent font-medium text-black px-5 py-3 rounded-full text-sm ring-1 ring-black hover:shadow-md hover:shadow-brand/30 hover:ring-brand hover:bg-gray-100"
                        href="/login"
                      >
                        Login
                      </Link>
                    </div>
                    <div onClick={closeMenu}>
                      <Link
                        className="transition bg-brand font-medium text-white px-5 py-3 rounded-full text-sm ring-1 ring-transparent hover:shadow-md hover:shadow-black/30 hover:ring-gray-100 hover:bg-brand/80"
                        href="/signup"
                      >
                        Get Started
                      </Link>
                    </div>
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

export default Navbar;
