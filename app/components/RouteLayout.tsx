"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";
import LenisProvider from "./LenisProvider";
import FloatingNav from "./FloatingNav";

type RouteLayoutProps = {
  children: React.ReactNode;
};

export default function RouteLayout({ children }: RouteLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <LenisProvider>
      {children}
      <Footer />
      <FloatingNav />
    </LenisProvider>
  );
}
