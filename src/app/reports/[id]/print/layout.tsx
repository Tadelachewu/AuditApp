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
    <>
      <style>
        {`
          body {
            background: white !important;
          }
          /* Hide the toaster on the print page */
          [data-radix-toast-viewport] {
            display: none;
          }
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
      {children}
    </>
  );
}
