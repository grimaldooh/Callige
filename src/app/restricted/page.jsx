// pages/access-denied.js
import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-red-600">Acceso Denegado</h1>
      <p className="mb-8 text-lg text-gray-600">No tienes permiso para acceder a esta página.</p>

      <Link href="/auth/login" passHref>
        <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Volver al inicio
        </span>
      </Link>
    </div>
  );
}