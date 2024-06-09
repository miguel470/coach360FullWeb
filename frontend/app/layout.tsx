import BarraNav from "@/components/BarraNav";
import "./globals.css";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="coach360.png" />
      </head>
      <body className="flex flex-col min-h-screen">
        <BarraNav />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
