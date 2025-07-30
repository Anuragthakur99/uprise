"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GraduationCap, LogIn, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const Header = ({ isAuth = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">UpRise</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
            <ThemeToggle />
            {isAuth ? (
              <Link to="/account">
                <Button variant="outline" size="sm">
                  Account
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              className="ml-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="px-4 py-3 space-y-3">
            <NavLinks mobile />
            {isAuth ? (
              <Link
                to="/account"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

const NavLinks = ({ mobile = false }) => {
  const linkClass = mobile
    ? "block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
    : "text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"

  return (
    <>
      <Link to="/" className={linkClass}>
        Home
      </Link>
      <Link to="/courses" className={linkClass}>
        Courses
      </Link>
      <Link to="/about" className={linkClass}>
        About
      </Link>
    </>
  )
}

export default Header
