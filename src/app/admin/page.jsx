"use client";

import { useState , useEffect} from 'react';
import Link from 'next/link';
import ModalAddSuperAdmin from '../../components/Modales/ModaAddSuperAdmin';
import ModalAddStudent from '../../components/Modales/ModalAddStudent';
import ModalAddTeacher from '../../components/Modales/ModalAddTeacher'; // Modal para profesores
import ModalAddGroup from '../../components/Modales/ModalAddClass'; // Importa el modal para añadir grupos
import ModalAddAdmin from '../../components/Modales/ModalAddAdmin'; // Importa el modal para añadir admin
import ModalAddEvent from '../../components/Modales/Events/ModalAddEvent'; // Importa el modal para añadir eventos
import ModalEventDetails from '../../components/Modales/Events/EventDetails'; // Importa el modal para ver detalles de eventos
import SchoolGroups from '../../components/Group/SchoolGroups'; // Importa el componente para mostrar grupos
import SchoolTeachers from '../../components/SchoolTeachers'; // Importa el componente para mostrar profesores
import SchoolStudents from '../../components/SchoolStudents'; // Importa el componente para mostrar estudiantes
import GroupList from '../../components/Group/GroupList'; // Importa el componente para mostrar grupos
import AttendanceList from '../../components/Group/AttendanceList'; // Importa el componente para mostrar la lista de asistencia
import ListaAsistentes from '../../components/Modales/Events/ListaAsistentes'; // Importa el componente para mostrar la lista de asistentes
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, UserAddIcon, UserGroupIcon, UserIcon, AcademicCapIcon, CalendarIcon, UserCircleIcon, MailIcon} from '@heroicons/react/solid'; // Asegúrate de tener instalada la biblioteca heroicons
import { set } from 'date-fns';



export default function AdminPage() {

  // const token = localStorage.getItem('token');
  // console.log('token:', token);
  const { userId, schoolId, role, login, logout } = useAuth();
  console.log('userId:', userId);


  const globalSchoolId = schoolId;
  console.log('globalSchoolId:', globalSchoolId);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0); // Nuevo estado para contar grupos
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);


  // Estados para manejar los modales
  const [isModalSuperAdminOpen, setIsModalSuperAdminOpen] = useState(false);
  const [isModalAdminOpen, setIsModalAdminOpen] = useState(false); // Estado para el modal de admin
  const [isModalStudentOpen, setIsModalStudentOpen] = useState(false);
  const [isModalTeacherOpen, setIsModalTeacherOpen] = useState(false);
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false); // Estado para el modal de grupo
  const [isModalEventOpen, setIsModalEventOpen] = useState(false);
  const [isModalEventDetailsOpen, setIsModalEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showListaAsistentesModal, setShowListaAsistentesModal] = useState(false);


  // Estados para obtencion de grupos y alumnos
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();

  

  // Funciones para abrir y cerrar modales

  const handleOpenAdminModal = () => setIsModalAdminOpen(true);
  const handleCloseAdminModal = () => setIsModalAdminOpen(false);

  const handleOpenSuperAdminModal = () => setIsModalSuperAdminOpen(true);
  const handleCloseSuperAdminModal = () => setIsModalSuperAdminOpen(false);

  const handleOpenStudentModal = () => setIsModalStudentOpen(true);
  const handleCloseStudentModal = () => setIsModalStudentOpen(false);

  const handleOpenTeacherModal = () => setIsModalTeacherOpen(true);
  const handleCloseTeacherModal = () => setIsModalTeacherOpen(false);

  const handleOpenGroupAddModal = () => setIsModalGroupOpen(true);
  const handleCloseGroupModal = () => setIsModalGroupOpen(false);

  const handleOpenEventModal = () => setIsModalEventOpen(true);
  const handleCloseEventModal = () => setIsModalEventOpen(false);

  useEffect(() => {
    setError(null);
  } , [isModalAdminOpen, isModalSuperAdminOpen, isModalStudentOpen, isModalTeacherOpen, isModalGroupOpen, isModalEventOpen]);


  useEffect(() => {
    if (!globalSchoolId) return; // No hacer nada si no hay schoolId

    console.log('globalSchoolId:', globalSchoolId);
    async function fetchGroups() {
      try {
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
        const response = await fetch(`/api/stats?schoolId=${globalSchoolId}`); 
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
        console.log("globalSchoolId:", globalSchoolId);
        const response = await fetch(`/api/events?schoolId=${globalSchoolId}`);
        const data = await response.json();
        console.log("data:", data);
        const upcomingEvents = data
          .filter((event) => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3); // Mostrar solo los primeros 3 eventos
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    const fetchStudents = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }

        console.log('globalSchoolId:', globalSchoolId);
        const response = await fetch(`/api/admin/students?schoolId=${globalSchoolId}`);
        const data = await response.json();
        console.log('Fetched students:', data.students);
        setFilteredStudents(data.students); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        if (!globalSchoolId) {
          console.log('globalSchoolId is not defined');
          return;
        }

        const response = await fetch(`/api/admin/teachers?schoolId=${globalSchoolId}`);
        const data = await response.json();
        setFilteredTeachers(data.teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
    fetchStudents();
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

  const openListaAsistentesModal = (eventId) => {
    setSelectedEvent(eventId);
    setShowListaAsistentesModal(true);
  };

  const closeListaAsistentesModal = () => {
    setShowListaAsistentesModal(false);
    setSelectedEvent(null);
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
        toast.success('Evento añadido exitosamente. Haz clic aquí para añadir otro evento', {
          onClick: () => handleSelect("event"),
        }); 
      } else {
        toast.error('Error al añadir evento');
        console.error('Failed to add event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Función para añadir superadmins
  const handleAddSuperAdmin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/superadmins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Actualiza el estado si es necesario, por ejemplo:
        // setTotalAdmins(totalAdmins + 1);
        handleCloseSuperAdminModal(); // Cierra el modal
        toast.success('SuperAdmin añadido exitosamente. Haz clic aquí para añadir otro superadmin', {
          onClick: () => handleSelect("superadmin"),
        });
      } else {
        toast.error('Error al añadir superadmin');
        setError('El correo electrónico ya está en uso');
        console.error("Failed to add superadmin");
      }
    } catch (error) {
      toast.error('Error al añadir superadmin');
      console.error("Error adding superadmin:", error);
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
        toast.success('Admin añadido exitosamente. Haz clic aquí para añadir otro admin', {
          onClick: () => handleSelect("admin"),
        });
      } else {
        toast.error('Error al añadir admin');
        setError('El correo electrónico ya está en uso');
        console.error("Failed to add admin");
      }
    } catch (error) {
      toast.error('Error al añadir admin');
      console.error("Error adding admin:", error);
    }
  };

  // Función para añadir estudiantes
  const handleAddStudent = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target); 
    formData.append('globalSchoolId', globalSchoolId); // Agregar schoolId al formData
  
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        body: formData,  // Enviar el formData con el archivo de imagen incluido
      });
  
      if (response.ok) {
        setTotalStudents(totalStudents + 1);
        handleCloseStudentModal(); // Cierra el modal
        toast.success('Estudiante añadido exitosamente. Haz clic aquí para añadir otro alumno.', {
          onClick: () => handleSelect("student"),
        });
        setError(null);
      } else {
        if(response.status === 400){
          setError('El correo electrónico ya está en uso');
        }
        toast.error('Error al añadir estudiante');
        console.error("Failed to add student");
      }

    } catch (error) {
      toast.error('Error al añadir estudiante');
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
    const school_id = globalSchoolId;

    try {
      const response = await fetch("/api/teacher/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, school_id }),
      });

      if (response.ok) {
        setTotalTeachers(totalTeachers + 1); // Actualiza el contador de profesores
        handleCloseTeacherModal(); // Cierra el modal
        toast.success('Profesor añadido exitosamente. Haz clic aquí para añadir otro profesor', {
          onClick: () => handleSelect("teacher"),
        });
      } else {
        toast.error('Error al añadir profesor');
        setError('El correo electrónico ya está en uso');
        console.error("Failed to add teacher");
      }
    } catch (error) {
      toast.error('Error al añadir profesor');
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
        toast.success('Grupo añadido exitosamente, haz clic aqui para añadir otro grupo', {
          onClick: () => handleSelect("group"),
        });
        handleCloseGroupModal(); // Cierra el modal

      } else {
        toast.error('Error al añadir grupo');
        console.error("Failed to add group");
      }
    } catch (error) {
      toast.error('Error al añadir grupo');
      console.error("Error adding group:", error);
    }
  };

  const handleSelect = (eventKey) => {
    switch (eventKey) {
      case 'student':
        handleOpenStudentModal();
        break;
      case 'teacher':
        handleOpenTeacherModal();
        break;
      case 'group':
        handleOpenGroupAddModal();
        break;
      case 'admin':
        handleOpenAdminModal();
        break;
      case 'superadmin':
        handleOpenSuperAdminModal();
        break;
      case 'event':
        handleOpenEventModal();
        break;
      default:
        break;
    }
  };

  const handleSendEmails = async () => {
    try {
      // Hacer la solicitud POST a la API que enviará los correos
      const response = await fetch('/api/dailyAttendanceNotification', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Correos enviados exitosamente');
      } else {
        alert('Hubo un error al enviar los correos');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      alert('Hubo un error al hacer la solicitud');
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mt-4 mb-6">Panel de Administración</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="absolute top-8 right-6">
        <button
          id="dropdownHoverButton"
          onClick={() => setIsOpen(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-3 inline-flex items-center justify-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          title="Añadir"
          type="button"
        >
          <PlusIcon className="w-5 h-5" aria-hidden="true" />
        </button>
        {isOpen && (
          <div
            id="dropdownHover"
            className="z-10 absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-56 dark:bg-gray-700 dark:border-gray-600"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownHoverButton"
            >
              <li>
                <button
                  onClick={() => handleSelect("student")}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  Añadir Estudiante
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect("teacher")}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <AcademicCapIcon className="w-5 h-5 mr-2" />
                  Añadir Profesor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect("admin")}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <UserAddIcon className="w-5 h-5 mr-2" />
                  Añadir Admin
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect("group")}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Añadir Grupo
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSelect("event")}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Añadir Evento
                </button>
              </li>
              
              {/* <li>
                <button
                  onClick={() => handleSelect("superadmin")}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <UserCircleIcon className="w-5 h-5 mr-2" />
                  Añadir SuperAdmin
                </button>
              </li> */}
              <li>
                <button
                  onClick={handleSendEmails}
                  className="flex items-center w-full text-left px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <MailIcon className="w-5 h-5 mr-2" />
                  Enviar correos de asistencia
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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

      <div className="flex space-x-4 mb-8 z-20">
        <div className="flex-1 h-full z-20">
          <SchoolStudents students={filteredStudents} />
        </div>
        <div className="flex-1 h-full">
          <SchoolTeachers teachers={filteredTeachers} />
        </div>
        <div className="flex-1 h-full">
          <SchoolGroups
            groups={groups}
            handleOpenGroupModal={handleOpenGroupModal}
          />
        </div>
      </div>

      <div className="p-2 rounded-lg grid grid-cols-2 gap-12 mb-4">
        <h1 className="text-2xl font-semibold">Eventos</h1>
      </div>

      <div className="events-section mb-16 w-full gap-12 0">
        {Array.isArray(events) && events.length === 0 ? (
          <p className="text-center text-xl text-gray-600">
            No hay eventos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-0">
            {Array.isArray(events) &&
              events.map((event) => (
                <div
                  key={event.id}
                  className="event-card bg-white shadow-xl rounded-xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-semibold mb-2">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {new Date(event.date).toLocaleDateString()} -{" "}
                      {event.location}
                    </p>
                    <p className="text-gray-800 mb-6 flex-1">
                      {event.description}
                    </p>
                    <button
                      onClick={() => openListaAsistentesModal(event.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-auto"
                    >
                      Lista de asistencia
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex space-x-4">
          <div className="relative inline-block text-left"></div>
        </div>
      </div>


      {/* Componente para mostrar la lista de asistencia si hay un grupo seleccionado */}
      {selectedGroup && <AttendanceList groupId={selectedGroup} />}

      {showListaAsistentesModal && (
        <ListaAsistentes
          eventId={selectedEvent}
          onClose={closeListaAsistentesModal}
        />
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
        error={error}
      />

      {/* Modal para añadir superadmin */}
      <ModalAddSuperAdmin
        isOpen={isModalSuperAdminOpen}
        onClose={handleCloseSuperAdminModal}
        onSubmit={handleAddSuperAdmin}
        error={error}
      />

      {/* Modal para añadir estudiantes */}
      <ModalAddStudent
        isOpen={isModalStudentOpen}
        onClose={handleCloseStudentModal}
        onSubmit={handleAddStudent}
        error={error}
      />

      {/* Modal para añadir profesores */}
      <ModalAddTeacher
        isOpen={isModalTeacherOpen}
        onClose={handleCloseTeacherModal}
        onSubmit={handleAddTeacher}
        error={error}
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