import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";

import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "CHATAI",
  description: "Full Stack Project",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          
          <body
            // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            className={`${inter.className} antialiased bg-[#292a2d] text-white`}
          >
            <Toaster
              toastOptions={{
                success: {
                  style: {
                    background: "#333",
                    color: "#fff"
                  }
                },
                error: {
                  style: {
                    background: "red",
                    color: "#fff"
                  }
                }
              }}
            />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
