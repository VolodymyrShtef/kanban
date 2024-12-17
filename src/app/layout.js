import "./globals.css";

export const metadata = {
  title: "Kanban",
  description: "Best progress board ever",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
