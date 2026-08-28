/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useLocale, useTranslations } from "next-intl";
import { useNotifications } from "@/providers/NotificationProvider";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  HeartPulse,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  User,
  X,
  Bell,
} from "lucide-react";

// --------------------------------------------------
// Navigation
// --------------------------------------------------
const navLinks = [
  { key: "home", href: "/", icon: HeartPulse },
  { key: "findDoctors", href: "/doctors", icon: Search },
  { key: "specialties", href: "/specialties", icon: Stethoscope },
  { key: "appointments", href: "/user/appointments", icon: CalendarDays },
];

// --------------------------------------------------
// Animation variants
// --------------------------------------------------
const mobileContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const mobileItem: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// --------------------------------------------------
// Component
// --------------------------------------------------
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  const locale = useLocale();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  const dashboardUrl = user?.role
    ? getDefaultDashboardRoute(user.role as UserRole)
    : "/dashboard";

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const userImage = user?.uploadedImage || user?.image || undefined;

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/75 backdrop-blur-xl">
      {/* Main Navbar */}
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.06, rotate: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-doctorly-primary text-white shadow-lg shadow-doctorly-primary/20"
          >
            {/* animated glow */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-xl bg-white"
            />
            <Activity className="relative size-5" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-doctorly-text">
              Doctorly
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Better healthcare
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center rounded-full border border-border/60 bg-muted/40 p-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActiveRoute(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-background shadow-sm"
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.12, y: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="relative z-10"
                >
                  <Icon
                    className={`size-4 ${
                      active ? "text-doctorly-primary" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <span
                  className={`relative z-10 ${
                    active
                      ? "font-semibold text-doctorly-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(link.key as any)}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={switchLanguage}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-doctorly-primary"
          >
            {locale === 'en' ? 'বাংলা' : 'EN'}
          </button>
          {isAuthenticated && user ? (
            <>
              {/* Dashboard shortcut */}
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full text-muted-foreground hover:bg-muted hover:text-doctorly-primary"
                  asChild
                >
                  <Link href={dashboardUrl}>
                    <LayoutDashboard className="size-4" />
                    <span className="sr-only">Dashboard</span>
                  </Link>
                </Button>
              </motion.div>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative size-9 rounded-full text-muted-foreground hover:bg-muted hover:text-doctorly-primary">
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-background text-[8px] font-bold text-white items-center justify-center">
                        </span>
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-2xl border-border/60 shadow-2xl p-0 overflow-hidden">
                  <div className="bg-muted/50 p-3 border-b flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-doctorly-primary/10 text-doctorly-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!n.isRead ? 'bg-primary/5' : ''}`}
                          onClick={() => !n.isRead && markAsRead(n.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm">{n.title}</span>
                            {!n.isRead && <span className="h-2 w-2 rounded-full bg-doctorly-primary flex-shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group h-auto rounded-full border border-border/60 bg-background/60 px-1.5 py-1.5 shadow-sm transition-all hover:border-doctorly-primary/30 hover:bg-muted/50"
                  >
                    <Avatar className="size-8">
                      {userImage && (
                        <AvatarImage src={userImage} alt={user.name || "User"} />
                      )}
                      <AvatarFallback className="bg-doctorly-primary/10 text-xs font-bold text-doctorly-primary">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden max-w-[110px] text-left lg:block">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {user.name || user.email?.split("@")[0]}
                      </p>
                      <p className="truncate text-[10px] capitalize text-muted-foreground">
                        {user.role?.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="mr-1 size-3.5 text-muted-foreground" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-64 rounded-2xl border-border/60 p-2 shadow-2xl"
                >
                  <DropdownMenuLabel className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        {userImage && <AvatarImage src={userImage} />}
                        <AvatarFallback className="bg-doctorly-primary/10 font-semibold text-doctorly-primary">
                          {getInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name || "My Account"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {user.role && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-doctorly-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-doctorly-primary">
                        <ShieldCheck className="size-3" />
                        {user.role}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5">
                      <Link href={dashboardUrl} className="flex items-center gap-3">
                        <LayoutDashboard className="size-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5">
                      <Link href="/user/appointments" className="flex items-center gap-3">
                        <ClipboardList className="size-4" />
                        <span>My Appointments</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5">
                      <Link href="/user/profile" className="flex items-center gap-3">
                        <CircleUserRound className="size-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5">
                      <Link href="/settings" className="flex items-center gap-3">
                        <Settings className="size-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer rounded-xl py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-doctorly-primary"
              >
                <LogIn className="size-4" />
                {t("login")}
              </Link>
              {/* CTA */}
              <motion.div whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.97 }}>
                <Button
                  asChild
                  className="rounded-full bg-doctorly-primary px-5 font-semibold text-white shadow-lg shadow-doctorly-primary/20 transition-all hover:bg-doctorly-primary/90 hover:shadow-doctorly-primary/30"
                >
                  <Link href="/book" className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    Book Consultation
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={switchLanguage}
            className="flex h-9 items-center justify-center rounded-full border border-border/70 px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {locale === 'en' ? 'বাংলা' : 'EN'}
          </button>
          {isAuthenticated && user && (
            <Link href={dashboardUrl}>
              <Avatar className="size-9 border border-border">
                {userImage && (
                  <AvatarImage src={userImage} alt={user.name || "User"} />
                )}
                <AvatarFallback className="bg-doctorly-primary/10 text-xs font-bold text-doctorly-primary">
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full border-border/70"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] max-w-[90vw] border-l border-border/60 p-0"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <SheetHeader className="border-b border-border/50 p-5 text-left">
                  <SheetTitle>
                    <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-doctorly-primary text-white">
                        <Activity className="size-5" />
                      </div>
                      <span className="text-lg font-extrabold text-doctorly-text">
                        Doctorly
                      </span>
                    </Link>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Doctorly navigation menu
                  </SheetDescription>
                </SheetHeader>

                {/* User */}
                {isAuthenticated && user && (
                  <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
                    <Avatar className="size-10">
                      {userImage && <AvatarImage src={userImage} />}
                      <AvatarFallback className="bg-doctorly-primary/10 font-semibold text-doctorly-primary">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <motion.nav
                  variants={mobileContainer}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-1 p-4"
                >
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActiveRoute(link.href);
                    return (
                      <motion.div key={link.href} variants={mobileItem}>
                        <Link
                          href={link.href}
                          onClick={closeMobileMenu}
                          className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                            active
                              ? "bg-doctorly-primary/10 text-doctorly-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <motion.div whileHover={{ scale: 1.1, x: 2 }}>
                            <Icon className="size-5" />
                          </motion.div>
                          <span>{t(link.key as any)}</span>
                          {active && (
                            <motion.div
                              layoutId="mobile-active"
                              className="absolute right-3 size-1.5 rounded-full bg-doctorly-primary"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Authenticated Links */}
                  {isAuthenticated && (
                    <>
                      <motion.div variants={mobileItem}>
                        <Link
                          href={dashboardUrl}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <LayoutDashboard className="size-5" />
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div variants={mobileItem}>
                        <Link
                          href="/user/profile"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <User className="size-5" />
                          Profile
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.nav>

                {/* Bottom Actions */}
                <div className="mt-auto border-t border-border/50 p-4">
                  {isAuthenticated ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        closeMobileMenu();
                        logout();
                      }}
                    >
                      <LogOut className="mr-2 size-4" />
                      Log Out
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full rounded-xl" asChild>
                        <Link href="/login" onClick={closeMobileMenu}>
                          <LogIn className="mr-2 size-4" />
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        className="w-full rounded-xl bg-doctorly-primary text-white hover:bg-doctorly-primary/90"
                        asChild
                      >
                        <Link href="/book" onClick={closeMobileMenu}>
                          <CalendarDays className="mr-2 size-4" />
                          Book Consultation
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}