// pages/student/groups.jsx
'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const StudentGroups = () => {

  const {userId} = useAuth();
  const [groups, setGroups] = useState([]);
  const studentId = userId;

  useEffect(() => {
    if (!studentId) {
      console.log('studentId no está disponible');
      return; // No hace la solicitud si studentId es null o undefined
    }
    const fetchGroups = async () => {
      if (!studentId) {
        console.log('studentId is not defined');
        return;
      }
      try {
        const response = await fetch(`/api/student/getGroups?studentId=${studentId}`);
        const data = await response.json();
        console.log('Fetched groups:', data);
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [studentId]);

  return (
    <div className="p-4 mt-28">
      <h1 className="text-3xl font-bold mb-12 text-center text-gray-800">
        Mis Clases
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {Array.isArray(groups) && groups.length > 0 ? (
          groups.map((group, index) => (
            <Link href={`/students/groups/${group.id}`} key={group.id} passHref>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
                {/* Imagen del grupo o fondo alternativo */}
                {group.imageUrl ? (
                  <img
                    src={group.imageUrl}
                    alt={`${group.name}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div
                    className={`h-48 bg-gradient-to-br ${
                      index % 2 === 0
                        ? "from-purple-400 to-indigo-600"
                        : "from-teal-400 to-green-500"
                    }`}
                  ></div>
                )}
                <div className="p-6 flex flex-col justify-between">
                  {/* Nombre del grupo */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {group.name}
                  </h2>

                  {/* Nombre del profesor */}
                  <p className="text-gray-700 text-sm mb-3">
                    Profesor: {group.teachers[0].name}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 w-full">
            No tienes grupos vinculados.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentGroups;