"use client";

import { useEffect } from 'react';

export default function PrintTrigger() {
  useEffect(() => {
    // A slight delay can help ensure all content is rendered before printing
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    // Close the window after printing or cancellation.
    // This is not perfectly reliable across all browsers, but works in many cases.
    const handleAfterPrint = () => {
      window.close();
    };
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return null;
}
