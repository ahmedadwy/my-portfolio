import "./globals.css";

export const metadata = {
  title: "Video Editor & Motion Designer Portfolio",
  description: "Crafting compelling visual narratives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}