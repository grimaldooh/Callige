'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';

const TeachersPage = () => {
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    // Lógica para obtener los grupos vinculados al profesor
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/teacher/groups');
        const data = await response.json();
        setGroups(data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    // Obtener los eventos vinculados al profesor
    const fetchEvents = async () => {
        try {
          const response = await fetch('/api/teacher/events?teacherId=9');
          const data = await response.json();
          setEvents(data.events);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };

    fetchEvents();
    fetchGroups();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-6">Panel de Docente</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Eventos del Docente</h1>
      
    </div>

        {/* Sección de Eventos del Docente */}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8">Eventos del Docente</h1>
          {events.length === 0 ? (
            <p>No hay eventos disponibles.</p>
          ) : (
            <ul className="list-disc list-inside">
              {events.map((event) => (
                <li key={event.id} className="text-lg mb-2">
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tarjeta para acceder a los grupos */}
        <Link
          href="/teachers/groups"
          className="p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        >
          <h2 className="text-2xl font-bold mb-2">Grupos</h2>
          <p>Ver los grupos vinculados al profesor</p>
        </Link>

        {/* Placeholder para futuras funcionalidades */}
        <div className="p-6 bg-gray-400 text-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Futuras funcionalidades</h2>
          <p>Más secciones en desarrollo</p>
        </div>
      </div>

      {/* Sección de Grupos */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4">Grupos Vinculados</h2>
        {groups.length > 0 ? (
          <ul className="list-disc list-inside">
            {groups.map((group) => (
              <li key={group.id} className="text-lg mb-2">
                {group.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No estás vinculado a ningún grupo.</p>
        )}
      </div>
    </div>
  );
};

export default TeachersPage;
