"use client";

import { useState } from 'react';

export default function ModalAddAdmin({ isOpen, onClose, onSubmit, error }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Añadir Admin</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Añadir Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}