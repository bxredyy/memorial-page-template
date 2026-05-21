import "./globals.css";

export const metadata = {
  title: "In Loving Memory of Name of Deceased",
  description:
    "A memorial page honouring the life and memories of [Name] (1977 – 2025).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream-100 text-ink-900 font-serif">
        {children}
      </body>
    </html>
  );
}
