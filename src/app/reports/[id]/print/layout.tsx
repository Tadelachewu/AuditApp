import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Print Report',
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <head>
          <style>
            {`
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              @page {
                size: A4;
                margin: 1.5cm;
              }
            `}
          </style>
        </head>
        <body className="bg-white">{children}</body>
      </html>
  );
}
