'use client'; // Asegúrate de incluir esta directiva si estás usando el nuevo sistema de enrutamiento de Next.js (App Router)

import React, { useState, useEffect } from 'react';

// Modal para crear escuelas
const CreateSchoolModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleCreate = () => {
    onCreate({ name, location });
    setName('');
    setLocation('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create School</h2>
        <label className="block mb-2">School Name:</label>
        <input
          className="border p-2 w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block mb-2">Location:</label>
        <input
          className="border p-2 w-full mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleCreate}
          >
            Create
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main page component
const SuperAdminPage = () => {
  const [schools, setSchools] = useState([]); // Inicia con un array vacío
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch schools and their admins from the API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/superadmin/schools');
        const data = await response.json();
        // Asegúrate de que cada escuela tiene un array de admins (para evitar undefined)
        const formattedData = data.map((school) => ({
          ...school,
          admins: school.admins || [], // Asegurar que admins siempre sea un array
        }));
        setSchools(formattedData);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setSchools([]); // En caso de error, aseguramos que schools sea un array vacío
      }
    };

    fetchSchools();
  }, []);

  const handleCreateSchool = async (school) => {
    try {
      const response = await fetch('/api/superadmin/createSchool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(school),
      });

      if (response.ok) {
        const newSchool = await response.json();
        setSchools((prevSchools) => [...prevSchools, { ...newSchool, admins: [] }]); // Asegura admins como array vacío
        setIsModalOpen(false);
      } else {
        console.error('Error creating school');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateAdmin = async (schoolId) => {
    const adminName = prompt('Enter admin name');
    const adminEmail = prompt('Enter admin email');
    const adminPassword = prompt('Enter admin password');

    if (adminName && adminEmail && adminPassword) {
      try {
        const response = await fetch(`/api/superadmin/createAdmin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: adminName, email: adminEmail, password: adminPassword, schoolId }),
        });

        if (response.ok) {
          const updatedSchool = await response.json();
          setSchools((prevSchools) =>
            prevSchools.map((school) =>
              school.id === updatedSchool.id ? updatedSchool : school
            )
          );
        } else {
          console.error('Error creating admin');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-20">
        <h1 className="text-3xl font-bold mb-4">SuperAdmin Dashboard</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}
        >
          Create School
        </button>
      </div>

      <CreateSchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSchool}
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">Schools List</h2>

      {/* Asegúrate de que schools es un array antes de mapear */}
      {Array.isArray(schools) && schools.length > 0 ? (
        schools.map((school) => (
          <div key={school.id} className="mb-6">
            <h3 className="text-xl font-semibold">
              {school.name} ({school.location})
            </h3>
            <ul className="list-disc list-inside ml-4">
              {/* Asegúrate de que school.admins es un array */}
              {Array.isArray(school.admins) && school.admins.length > 0 ? (
                school.admins.map((admin) => (
                  <li key={admin.id} className="mb-2">
                    <strong>{admin.name}</strong> - {admin.email} - {admin.password}
                  </li>
                ))
              ) : (
                <li>No admins available for this school.</li>
              )}
            </ul>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              onClick={() => handleCreateAdmin(school.id)}
            >
              Add Admin
            </button>
          </div>
        ))
      ) : (
        <p>No schools available. Please create a new school.</p>
      )}
    </div>
  );
};

export default SuperAdminPage;