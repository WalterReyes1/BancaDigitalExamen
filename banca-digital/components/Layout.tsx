import { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Banca Digital
          </Link>
          <div>
            <Link href="/dashboard" className="hover:text-green-200">
              Dashboard
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <footer className="bg-green-600 text-white p-4 text-center">
        © 2025 Banca Digital. Todos los derechos reservados.
      </footer>
    </div>
  );
}