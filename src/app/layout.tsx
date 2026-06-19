import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DocuMind | AI Document Chat',
  description: 'Upload PDFs, DOCX, PPTs and instantly get accurate answers from your own knowledge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
