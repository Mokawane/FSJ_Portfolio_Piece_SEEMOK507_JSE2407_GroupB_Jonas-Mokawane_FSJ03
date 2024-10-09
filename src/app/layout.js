import "./globals.css";
import Header from "../components/Header";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Header />
      <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
