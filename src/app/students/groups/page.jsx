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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(groups) && groups.length > 0 ? (
          groups.map((group) => (
            <Link href={`/students/groups/${group.id}`} key={group.id}>
              <div
                key={group.id}
                className="bg-gradient-to-r from-green-400 to-blue-500 shadow-lg rounded-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <h2 className="text-2xl font-semibold mb-2 text-gray-950">
                  {group.name}
                </h2>
                <p className="text-gray-950">Grupo : {group.id}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No estás vinculado a ningún grupo.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentGroups;