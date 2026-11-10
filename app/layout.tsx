import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Anne's Daily Quiz",
  description: 'A daily breakfast quiz.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
