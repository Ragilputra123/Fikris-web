"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, X, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/fikris/logo";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#profil", label: "Profil" },
  { href: "#kegiatan", label: "Kegiatan" },
  { href: "#pendaftaran", label: "Daftar" },
  { href: "#kontak", label: "Kontak" },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/">
          <Logo size="sm" className="flex-shrink-0" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-gray-600 transition-colors",
                "hover:text-emerald-600 hover:underline underline-offset-4"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dasbor
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-emerald-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-emerald-600">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:w-80 bg-white border-l-emerald-100"
          >
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6">
                <Logo size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-emerald-600"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium text-gray-700 rounded-lg",
                      "hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Mobile Auth */}
              <div className="mt-auto pt-6 border-t border-emerald-100 space-y-2">
                {session ? (
                  <>
                    <Link href="/auth/signin" className="block">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Buka Dasbor
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-200 text-emerald-600"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="block">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        Daftar Akun
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
