import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";

// backend 4:16:20, need search modal and page search, favorites page, anime/manga lists with status, ratings, keep track of how many episodes watched
// user profile page for stats, need functionality to add anime and manga to lists and favorites, checking github 

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const {user} = useUser();
  const {openSignIn} = useClerk();

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      {/* Logo - Left Side */}
      <Link to="/" className="flex-shrink-0">
        <img src="/homelogo.svg" alt="Logo" className="w-36 h-auto" />
      </Link>

      {/* Navigation Links - Center */}
      <div className="hidden md:flex items-center justify-center gap-8 px-8 py-3 rounded-full backdrop-blur bg-white/10 border border-gray-300/20">
        <Link
          to="/"
          className="hover:text-primary transition-colors"
          onClick={closeMobile}
        >
          Home
        </Link>
        <Link
          to="/anime"
          className="hover:text-primary transition-colors"
          onClick={closeMobile}
        >
          Anime
        </Link>
        <Link
          to="/manga"
          className="hover:text-primary transition-colors"
          onClick={closeMobile}
        >
          Manga
        </Link>
        <Link
          to="/favorites"
          className="hover:text-primary transition-colors"
          onClick={closeMobile}
        >
          Favorites
        </Link>
        <Link
          to="/my-anime"
          className="hover:text-primary transition-colors"
          onClick={closeMobile}
        >
          Anime List
        </Link>
        <Link
          to="/my-manga"
          className="hover:text-primary transition-colors"
          onClick={closeMobile}
        >
          Manga List
        </Link>
      </div>

      {/* Mobile Menu - Hidden by default, shows when menu is clicked */}
      <div
        className={
          "md:hidden absolute top-0 left-0 w-full h-screen bg-black/70 backdrop-blur flex flex-col items-center justify-center gap-8 text-lg font-medium transform transition-transform duration-300 " +
          (mobileOpen ? "translate-x-0" : "translate-x-full")
        }
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        id="mobile-menu"
      >
        <XIcon
          className="absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={closeMobile}
        />
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/anime" className="hover:text-primary transition-colors">
          Anime
        </Link>
        <Link to="/manga" className="hover:text-primary transition-colors">
          Manga
        </Link>
        <Link to="/favorites" className="hover:text-primary transition-colors">
          Favorites
        </Link>
        <Link to="/my-anime" className="hover:text-primary transition-colors">
          Anime List
        </Link>
        <Link to="/my-manga" className="hover:text-primary transition-colors">
          Manga List
        </Link>
      </div>

      {/* Right Side - Search & Login */}
      <div className="flex items-center gap-4">
        <SearchIcon className="hidden md:block w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
        {
          !user ? (
            <button onClick={openSignIn} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary-dull hover:bg-primary transition 
            rounded-full font-medium cursor-pointer">
              Login
            </button>
          ) : (
            <UserButton />
          )
        }
        <MenuIcon
          className="md:hidden w-8 h-8 cursor-pointer"
          onClick={openMobile}
          aria-controls="mobile-menu"
          aria-expanded={mobileOpen}
        />
      </div>
    </div>
  );
};

export default Navbar;
