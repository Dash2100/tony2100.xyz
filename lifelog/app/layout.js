import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto",
});

export const metadata = {
  title: "Tony2100's Life Log",
  description: "Personal blog and life log",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSans.variable} font-noto antialiased`}>
        {children}
      </body>
    </html>
  );
}
