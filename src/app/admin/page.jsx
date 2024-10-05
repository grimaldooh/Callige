"use client";

import { useState , useEffect} from 'react';
import ModalAddStudent from '../../components/Modales/ModalAddStudent';
import ModalAddTeacher from '../../components/Modales/ModalAddTeacher'; // Modal para profesores
import ModalAddGroup from '../../components/Modales/ModalAddClass'; // Importa el modal para añadir grupos
import ModalAddAdmin from '../../components/Modales/ModalAddAdmin'; // Importa el modal para añadir admin
import ModalAddEvent from '../../components/Modales/ModalAddEvent'; // Importa el modal para añadir eventos


export default function AdminPage() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0); // Nuevo estado para contar grupos

  // Estados para manejar los modales
  const [isModalAdminOpen, setIsModalAdminOpen] = useState(false); // Estado para el modal de admin
  const [isModalStudentOpen, setIsModalStudentOpen] = useState(false);
  const [isModalTeacherOpen, setIsModalTeacherOpen] = useState(false);
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false); // Estado para el modal de grupo
  const [isModalEventOpen, setIsModalEventOpen] = useState(false);

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
    async function fetchGroups() {
      try {
        const response = await fetch("/api/groups?schoolId=1");
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }

    fetchGroups();
  }, []);

  const handleOpenGroupModal = async (groupId) => {
    try {
      const response = await fetch(`/api/groups?groupId=${groupId}`);
      const data = await response.json();
      setStudents(data);
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
    const name = formData.get('name');
    const date = formData.get('date');
    const location = formData.get('location');
    const description = formData.get('description');
    const school_id = parseInt(formData.get('school_id'), 10);
    const teacher_id = parseInt(formData.get('teacher_id'), 10);
    
    // const uploadImage = async (file) => {
    //   const imageData = new FormData();
    //   imageData.append('file', file);
  
    //   // Adjust this based on your upload API (local, S3, etc.)
    //   const response = await fetch('/api/upload', {
    //     method: 'POST',
    //     body: imageData,
    //   });
  
    //   if (response.ok) {
    //     const imagePath = await response.json();
    //     return imagePath;
    //   } else {
    //     throw new Error('Error uploading image');
    //   }
    // };
  
    try {
      //const imageUrl = selectedFile ? await uploadImage(selectedFile) : null;
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, date, description,location, school_id, teacher_id }),
      });
  
      if (response.ok) {
        console.log('Event added successfully');
        // Handle UI updates
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
    const school_id = parseInt(formData.get("school_id"), 10);

    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password , school_id}),
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
    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const group_id = parseInt(formData.get("group_id"), 10);
    console.log(name, email, password, group_id);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, group_id }),
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
    const group_id = parseInt(formData.get("group_id"), 10);

    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, group_id }),
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
    const school_id = parseInt(formData.get("school_id"), 10);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, school_id }),
      });

      if (response.ok) {
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
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

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
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Bienestar Estudiantil</h2>
          <p>Estadísticas de bienestar físico, mental, académico...</p>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
          <ul>
            <li>- Evento 1</li>
            <li>- Evento 2</li>
            <li>- Evento 3</li>
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
          <button
            onClick={handleOpenEventModal}
            className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 shadow-md transition-all"
          >
            + Añadir Nuevo Evento
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Grupos de la Escuela</h2>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <button
                onClick={() => handleOpenGroupModal(group.id)}
                className="text-blue-500 underline"
              >
                {group.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para mostrar estudiantes del grupo seleccionado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              Estudiantes del Grupo {selectedGroup}
            </h2>
            <ul>
              {students.length > 0 ? (
                students.map((student) => (
                  <li key={student.id}>{student.name}</li>
                ))
              ) : (
                <p>No hay estudiantes en este grupo.</p>
              )}
            </ul>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para añadir eventos */}
      <ModalAddEvent
        isOpen={isModalEventOpen}
        onClose={handleCloseEventModal}
        onSubmit={handleAddEvent}
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