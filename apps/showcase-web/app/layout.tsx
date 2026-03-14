import "./globals.css";
import "@craft/theme-core/tokens.css"; // <-- ADD THIS LINE

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
