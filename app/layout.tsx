import type { Metadata } from "next";
import "./global.css";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import LenisProvider from "./components/LenisProvider";
import FloatingNav from "./components/FloatingNav";
import SplashLoader from "./components/SplashLoader";
import GlobalEnquiryModal from "./components/GlobalEnquiryModal";

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
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <SplashLoader>
            <LenisProvider>
             
              <main>{children}</main>
              <GlobalEnquiryModal />
              <Footer />
              <FloatingNav />
            </LenisProvider>
          </SplashLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
