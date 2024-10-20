"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { use } from "react";

const StudentHomePage = () => {
  const { userId: studentId } = useAuth();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    console.log("studentId:", studentId);
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `/api/student/findStudent?id=${studentId}`
        );
        const data = await response.json();
        console.log("data:", data);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [studentId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-12">
          {student ? `Bienvenido, ${student.name}` : "Cargando..."}
      </h1>

      <div className="w-full max-w-sm space-y-6">
        {/* Cuadro de Eventos */}
        <Link href="/students/events">
          <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <img
              src="https://asociacionmexicanadepedagogia.com/wp-content/uploads/estudiantes-de-universidad.jpg"
              alt="Eventos"
              className="w-full h-40 object-cover opacity-70 transition duration-500 hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition duration-500 hover:bg-opacity-30">
              <h2 className="text-white text-2xl font-semibold">Eventos</h2>
            </div>
          </div>
        </Link>

        {/* Cuadro de Grupos */}
        <Link href="/students/groups">
          <div className="relative bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-2xl mt-12">
            <img
              src="https://pymempresario.com/wp-content/uploads/2018/12/multidisiplinario.jpg"
              alt="Grupos"
              className="w-full h-40 object-cover opacity-70 transition duration-500 hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition duration-500 hover:bg-opacity-30">
              <h2 className="text-white text-2xl font-semibold">Grupos</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentHomePage;
