import type { Metadata } from "next";
import "./global.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import LenisProvider from "./components/LenisProvider";
import FloatingNav from "./components/FloatingNav";
import SplashLoader from "./components/SplashLoader";

export const metadata: Metadata = {
  title: "The Happy Safar",
  description: "The Happy Safar Your Travel Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="antialiased">
        <ThemeProvider>
          <SplashLoader>
            <LenisProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingNav />
            </LenisProvider>
          </SplashLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
