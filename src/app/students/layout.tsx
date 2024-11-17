// src/app/admin/layout.tsx
import NavbarHandler from "../../components/NavbarHandler"; // Ajusta la ruta según tu estructura
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
        <div className="flex">
          <NavbarHandler />
          <main className="flex-1">{children}</main>
        </div>
  );
}
