import "./globals.css";
import Header from "../components/Header";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body>
      <Header />
        {children}
      </body>
    </html>
    </AuthProvider>
  );
}
