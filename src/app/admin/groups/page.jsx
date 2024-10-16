'use client';
//src/app/admin/groups/page.jsx
import { useEffect, useState } from 'react';
import LinkStudentModal from '../../../components/Modales/Groups/ModalLinkStudent';
import LinkTeacherModal from '../../../components/Modales/Groups/ModalLinkTeacher';
import EditGroupModal from '../../../components/Modales/Groups/ModalEditGroup';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModalTeacher, setShowModalTeacher] = useState(false);
  const [showModalStudent, setShowModalStudent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición del grupo

  const openModalTeacher = (groupId) => {
    setSelectedGroup(groupId);
    setShowModalTeacher(true);
  };

  const openModalStudents = (groupId) => {
    setSelectedGroup(groupId);
    setShowModalStudent(true);
  };

  const openEditModal = (groupId) => {
    setSelectedGroup(groupId);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowModalStudent(false);
    setShowModalTeacher(false);
    setShowEditModal(false); // Cierra la modal de edición del grupo
    setSelectedGroup(null);
  };

  useEffect(() => {
    // Lógica para obtener la lista de todos los estudiantes
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/groups?schoolId=1");
        const data = await response.json();
        setGroups(data);
        console.log('data:', data);
        setFilteredGroups(data); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error fetching Groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(term)
    );

    setFilteredGroups(filtered);
  };

  const handleDelete = async (groupId) => {
    try {
      const response = await fetch('/api/admin/groups', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: groupId }),
      });
      if (response.ok) {
        setGroups(groups.filter(group => group.id !== groupId)); // Eliminar el estudiante del estado
        alert('Grupo eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando grupo:', error);
      alert('Hubo un error al eliminar al grupo');
    }
  };

  return (
    <div className="container mx-auto mt-28 ">
      <h1 className="text-4xl font-bold ">Listado de grupos</h1>

      {/* Barra de búsqueda */}
      <div className="mt-14 mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Lista de estudiantes */}
      {filteredGroups.length === 0 ? (
        <p>No hay grupos disponibles.</p>
      ) : (
        <ul className="list-disc list-inside">
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              className="flex justify-between items-center p-4 bg-gray-100 mb-2 rounded shadow-md"
            >
              <div>
                <span className="font-bold">ID:</span> {group.id} - {group.name}
              </div>
              <div className="flex space-x-4">
                <button onClick={() => handleDelete(group.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Borrar
                </button>
                <button onClick={() => openEditModal(group.id)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => openModalTeacher(group.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-900"
                >
                  Vincular profesor
                </button>
                <button
                  onClick={() => openModalStudents(group.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-900"
                >
                  Vincular alumno
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Estadísticas
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showModalStudent && (
        <LinkStudentModal groupId={selectedGroup} onClose={closeModal} />
      )}
      {showModalTeacher && (
        <LinkTeacherModal groupId={selectedGroup} onClose={closeModal} />
      )}
      {showEditModal && (
        <EditGroupModal groupId={selectedGroup} onClose={closeModal} />
      )}
    </div>
  );
};

export default GroupsPage;
