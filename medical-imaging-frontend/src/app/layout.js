import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import Footer from "@/components/Footer";

export const metadata = {
  title: "MIEB | Medical Imaging Equipment",
  description: "Medical imaging equipment for hospitals and clinics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SplashScreen />
        {children}
        <Footer />
      </body>
    </html>
  );
}