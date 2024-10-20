"use client";

import { useState , useEffect} from 'react';
import Link from 'next/link';
import ModalAddStudent from '../../components/Modales/ModalAddStudent';
import ModalAddTeacher from '../../components/Modales/ModalAddTeacher'; // Modal para profesores
import ModalAddGroup from '../../components/Modales/ModalAddClass'; // Importa el modal para añadir grupos
import ModalAddAdmin from '../../components/Modales/ModalAddAdmin'; // Importa el modal para añadir admin
import ModalAddEvent from '../../components/Modales/Events/ModalAddEvent'; // Importa el modal para añadir eventos
import ModalEventDetails from '../../components/Modales/Events/EventDetails'; // Importa el modal para ver detalles de eventos
import SchoolGroups from '../../components/Group/SchoolGroups'; // Importa el componente para mostrar grupos
import GroupList from '../../components/Group/GroupList'; // Importa el componente para mostrar grupos
import AttendanceList from '../../components/Group/AttendanceList'; // Importa el componente para mostrar la lista de asistencia
import { useAuth } from '../context/AuthContext';


export default function AdminPage() {

  const token = localStorage.getItem('token');
  console.log('token:', token);
  const { userId, schoolId, role, login, logout } = useAuth();
  console.log('userId:', userId);


  const globalSchoolId = schoolId;
  console.log('globalSchoolId:', globalSchoolId);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0); // Nuevo estado para contar grupos
  const [events, setEvents] = useState([]);

  // Estados para manejar los modales
  const [isModalAdminOpen, setIsModalAdminOpen] = useState(false); // Estado para el modal de admin
  const [isModalStudentOpen, setIsModalStudentOpen] = useState(false);
  const [isModalTeacherOpen, setIsModalTeacherOpen] = useState(false);
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false); // Estado para el modal de grupo
  const [isModalEventOpen, setIsModalEventOpen] = useState(false);
  const [isModalEventDetailsOpen, setIsModalEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estados para obtencion de grupos y alumnos
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funciones para abrir y cerrar modales

  const handleOpenAdminModal = () => setIsModalAdminOpen(true);
  const handleCloseAdminModal = () => setIsModalAdminOpen(false);

  const handleOpenStudentModal = () => setIsModalStudentOpen(true);
  const handleCloseStudentModal = () => setIsModalStudentOpen(false);

  const handleOpenTeacherModal = () => setIsModalTeacherOpen(true);
  const handleCloseTeacherModal = () => setIsModalTeacherOpen(false);

  const handleOpenGroupAddModal = () => setIsModalGroupOpen(true);
  const handleCloseGroupModal = () => setIsModalGroupOpen(false);

  const handleOpenEventModal = () => setIsModalEventOpen(true);
  const handleCloseEventModal = () => setIsModalEventOpen(false);

  useEffect(() => {
    if (!globalSchoolId) return; // No hacer nada si no hay schoolId

    console.log('globalSchoolId:', globalSchoolId);
    async function fetchGroups() {
      try {
        //const response = await fetch("/api/groups?schoolId=1");
        console.log('globalSchoolId:', globalSchoolId);
        const response = await fetch(`/api/groups?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }

    async function fetchStats() {
      try {
        const response = await fetch(`/api/stats?schoolId=${globalSchoolId}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });        
        const data = await response.json();
        setTotalStudents(data.totalStudents);
        setTotalTeachers(data.totalTeachers);
        setTotalGroups(data.totalGroups);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    async function fetchEvents() {
      try {
        console.log('globalSchoolId:', globalSchoolId);
        const response = await fetch(`/api/events?schoolId=${globalSchoolId}`);
        const data = await response.json();
        console.log('data:', data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
    fetchStats();
    fetchGroups();
  }, [globalSchoolId]);

  const handleViewEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalEventDetailsOpen(true);
  };

  const handleOpenGroupModal = async (groupId) => {
    try {
      const response = await fetch(`/api/groups?groupId=${groupId}`);
      const data = await response.json();
      setStudents(data);
      console.log('studentes:', data);
      setSelectedGroup(groupId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setStudents([]);
  };

  const handleAddEvent = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('schoolId', globalSchoolId); // Agregar schoolId al formData
    
    try {      
      const response = await fetch('/api/events', {
        method: 'POST',
        
        body: formData,
      });
  
      if (response.ok) {
        const newEvent = await response.json();

        console.log('Event added successfully');
        // Handle UI updates
        setEvents((prevEvents) => [...prevEvents, newEvent]);

        handleCloseEventModal(); // Close modal after submission
      } else {
        
        console.error('Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Función para añadir admins
  const handleAddAdmin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, schoolId: globalSchoolId }),
      });

      if (response.ok) {
        // Actualiza el estado si es necesario, por ejemplo:
        // setTotalAdmins(totalAdmins + 1);
        handleCloseAdminModal(); // Cierra el modal
      } else {
        console.error("Failed to add admin");
      }
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  // Función para añadir estudiantes
  const handleAddStudent = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target); // Ya no necesitas obtener campos por separado
  
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        body: formData,  // Enviar el formData con el archivo de imagen incluido
      });
  
      if (response.ok) {
        setTotalStudents(totalStudents + 1);
        handleCloseStudentModal(); // Cierra el modal
      } else {
        console.error("Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Función para añadir profesores
  const handleAddTeacher = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/teacher/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setTotalTeachers(totalTeachers + 1); // Actualiza el contador de profesores
        handleCloseTeacherModal(); // Cierra el modal
      } else {
        console.error("Failed to add teacher");
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  // Función para añadir grupos
  const handleAddGroup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const school_id = globalSchoolId;
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, school_id}),
      });

      if (response.ok) {
        const newGroup = await response.json(); 
        setGroups((prevGroups) => [...prevGroups, newGroup]);

        setTotalGroups(totalGroups + 1); // Incrementa el total de grupos
        handleCloseGroupModal(); // Cierra el modal

      } else {
        console.error("Failed to add group");
      }
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mt-20 mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Estudiantes Totales</h2>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Profesores Totales</h2>
          <p className="text-3xl font-bold">{totalTeachers}</p>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Grupos Totales</h2>
          <p className="text-3xl font-bold">{totalGroups}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-md rounded-lg grid grid-cols-2 gap-4">
          <Link href="/admin/students">
            <div className="relative flex flex-col items-center justify-end bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer overflow-hidden h-48 w-full">
              <img
                src="https://www.coldelvalle.edu.mx/wp-content/uploads/2021/07/como-aprenden-los-alumnos-de-secundaria.jpg"
                alt="Alumnos"
                className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <span className="absolute bottom-0 text-lg font-semibold text-white z-10 bg-black bg-opacity-50 w-full text-center py-2">
                Alumnos
              </span>
            </div>
          </Link>
          <Link href="/admin/teachers">
            <div className="relative flex flex-col items-center justify-end bg-green-100 rounded-lg hover:bg-green-200 cursor-pointer overflow-hidden h-48 w-full">
              <img
                src="https://images.ecestaticos.com/Xg4lK7IufEiYj5ZH3zivHw78erk=/0x62:1251x769/1338x752/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F47a%2Fc1d%2Ff66%2F47ac1df669dd66d669d59e33a479f6bd.jpg"
                alt="Profesores"
                className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <span className="absolute bottom-0 text-lg font-semibold text-white z-10 bg-black bg-opacity-50 w-full text-center py-2">
                Profesores
              </span>
            </div>
          </Link>
          <Link href="/admin/groups">
            <div className="relative flex flex-col items-center justify-end bg-yellow-100 rounded-lg hover:bg-yellow-200 cursor-pointer overflow-hidden h-48 w-full">
              <img
                src="https://static.studyusa.com/article/aws_Fy4QcSQJTJun7wzrZr2dQl8YB47orbzO_sm_2x.jpg?format=webp"
                alt="Grupos"
                className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <span className="absolute bottom-0 text-lg font-semibold text-white z-10 bg-black bg-opacity-50 w-full text-center py-2">
                Grupos
              </span>
            </div>
          </Link>
          <Link href="/admin/events">
            <div className="relative flex flex-col items-center justify-end bg-red-100 rounded-lg hover:bg-red-200 cursor-pointer overflow-hidden h-48 w-full">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5x6UXNCRyiNWA5u9sdC1Xq5X5HDADElqTqGXdOKXG18eueMBcusXKV4h0GfkdVJ8LUKg&usqp=CAU"
                alt="Eventos"
                className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
              <span className="absolute bottom-0 text-lg font-semibold text-white z-10 bg-black bg-opacity-50 w-full text-center py-2">
                Eventos
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>

          <ul>
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{event.name}</span>
                  <button
                    onClick={() => handleViewEventDetails(event)}
                    className="text-blue-500 underline"
                  >
                    Ver Detalles
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No hay eventos disponibles.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleOpenStudentModal}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Añadir Estudiante
          </button>
          <button
            onClick={handleOpenTeacherModal}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Añadir Profesor
          </button>
          <button
            onClick={handleOpenGroupAddModal} // Botón para abrir modal grupo
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Añadir Grupo
          </button>
          <button
            onClick={handleOpenAdminModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Añadir Admin
          </button>
          <div className="flex-grow"></div> {/* Espaciador flexible */}
          <button
            onClick={handleOpenEventModal}
            className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 shadow-md transition-all"
          >
            + Añadir Nuevo Evento
          </button>
        </div>
      </div>

      <SchoolGroups
        groups={groups}
        handleOpenGroupModal={handleOpenGroupModal}
      />

      {/* Componente para mostrar la lista de asistencia si hay un grupo seleccionado */}
    {selectedGroup && (
      <AttendanceList groupId={selectedGroup} />
    )}

      {/* Modal para mostrar estudiantes del grupo seleccionado */}
      {isModalOpen && (
        <GroupList
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={students}
          selectedGroup={selectedGroup}
        />
      )}

      {/* Modal para añadir eventos */}
      <ModalAddEvent
        isOpen={isModalEventOpen}
        onClose={handleCloseEventModal}
        onSubmit={handleAddEvent}
      />

      {/* Modal para mostrar detalles de eventos */}
      <ModalEventDetails
        isOpen={isModalEventDetailsOpen}
        onClose={() => setIsModalEventDetailsOpen(false)}
        event={selectedEvent}
      />

      {/* Modal para añadir admin */}
      <ModalAddAdmin
        isOpen={isModalAdminOpen}
        onClose={handleCloseAdminModal}
        onSubmit={handleAddAdmin}
      />

      {/* Modal para añadir estudiantes */}
      <ModalAddStudent
        isOpen={isModalStudentOpen}
        onClose={handleCloseStudentModal}
        onSubmit={handleAddStudent}
      />

      {/* Modal para añadir profesores */}
      <ModalAddTeacher
        isOpen={isModalTeacherOpen}
        onClose={handleCloseTeacherModal}
        onSubmit={handleAddTeacher}
      />

      {/* Modal para añadir grupos */}
      <ModalAddGroup
        isOpen={isModalGroupOpen} // Nuevo modal para grupos
        onClose={handleCloseGroupModal}
        onSubmit={handleAddGroup}
      />
    </div>
  );
}