'use client';
//src/app/admin/groups/page.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LinkStudentModal from '../../../components/Modales/Groups/ModalLinkStudent';
import LinkTeacherModal from '../../../components/Modales/Groups/ModalLinkTeacher';
import ListaAsistentes from '../../../components/Modales/Groups/ListaAsistentes';
import { TrashIcon, PencilIcon, UserAddIcon, ClipboardListIcon, UserGroupIcon , EyeIcon} from '@heroicons/react/solid';


import EditGroupModal from '../../../components/Modales/Groups/ModalEditGroup';
import { useAuth } from '../../context/AuthContext';

const GroupsPage = () => {

  const router = useRouter();
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;

  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModalTeacher, setShowModalTeacher] = useState(false);
  const [showModalStudent, setShowModalStudent] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición del grupo
  const [activeGroup, setActiveGroup] = useState(false);
  const [showListaAsistentesModal, setShowListaAsistentesModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null); 
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);


  const openModalTeacher = (groupId) => {
    setSelectedGroup(groupId);
    setShowModalTeacher(true);
  };

  const openModalStudents = (groupId) => {
    setSelectedGroup(groupId);
    setShowModalStudent(true);
  };

  const openEditModal = (groupId, group) => {
    setCurrentGroup(group);
    setSelectedGroup(groupId);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowModalStudent(false);
    setShowModalTeacher(false);
    setShowEditModal(false); // Cierra la modal de edición del grupo
    setSelectedGroup(null);
  };

  const openListaAsistentesModal = (groupId) => {
    setSelectedGroup(groupId);
    setShowListaAsistentesModal(true);
  };

  const closeListaAsistentesModal = () => {
    setShowListaAsistentesModal(false);
    setSelectedGroup(null);
  };

  const handleOpenDeleteModal = (groupId) => {
    setSelectedGroup(groupId);
    setIsModalDeleteOpen(true);
  };

  useEffect(() => {
    if (!globalSchoolId) return;

    // Lógica para obtener la lista de todos los grupos
    const fetchGroups = async () => {
      try {
        const response = await fetch(`/api/admin/groups?schoolId=${globalSchoolId}`);
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        if (Array.isArray(data.groups)) {
          setGroups(data.groups);
          setFilteredGroups(data.groups);
        } else {
          console.error('La respuesta no es un array:', data);
        }
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
      }
    };

    fetchGroups();
  }, [globalSchoolId]);

  // useEffect para depurar el estado de groups
  useEffect(() => {
    console.log('groups:', groups);
  }, [groups]);

  // useEffect para depurar el estado de filteredGroups
  useEffect(() => {
    console.log('filteredGroups:', filteredGroups);
  }, [filteredGroups]);

  // Función para manejar el cambio en la barra de búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(term) || group.id.toString().includes(term)
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
        setGroups(groups.filter(group => group.id !== groupId)); // Eliminar el grupo del estado
        setFilteredGroups(filteredGroups.filter(group => group.id !== groupId)); // Eliminar el grupo del estado filtrado
        alert('Grupo eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando grupo:', error);
      alert('Hubo un error al eliminar al grupo');
    }
  };

  const handleViewGroup = (groupId) => {
    console.log('Ver detalles del grupo:', groupId);
    router.push(`/admin/group/${groupId}`);
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-4xl font-bold ">Listado de grupos</h1>

      {/* Barra de búsqueda */}
      <div className="mt-14 mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre o Id..."
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Lista de grupos */}
      {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
        <ul className="list-none">
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              className="flex justify-between items-center p-4 bg-gray-100 mb-4 rounded shadow-md mr-4 "
            >
              <div className="flex flex-col">
                <span className="font-bold">ID: {group.id}</span>
                <span>{group.name}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenDeleteModal(group.id)}
                  className="bg-red-500 text-white p-3 rounded hover:bg-red-700 transition-colors"
                  title="Borrar"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openEditModal(group.id, group, filteredGroups)}
                  className="bg-blue-500 text-white p-3 rounded hover:bg-blue-700 transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModalTeacher(group.id)}
                  className="bg-green-500 text-white p-3 rounded hover:bg-green-700 transition-colors"
                  title="Vincular profesor"
                >
                  <UserAddIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openModalStudents(group.id)}
                  className="bg-orange-500 text-white p-3 rounded hover:bg-orange-700 transition-colors"
                  title="Vincular alumno"
                >
                  <UserGroupIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openListaAsistentesModal(group.id)}
                  className="bg-yellow-500 text-white p-3 rounded hover:bg-yellow-700 transition-colors "
                  title="Ver lista de alumnos y profesores"
                >
                  <ClipboardListIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleViewGroup(group.id)}
                  className="bg-purple-500 text-white p-3 rounded hover:bg-blue-700 transition-colors"
                  title="Ver detalles del grupo"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay grupos disponibles.</p>
      )}

      {isModalDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Estás seguro de eliminar el grupo?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsModalDeleteOpen(false)}
                className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { handleDelete(selectedGroup); setIsModalDeleteOpen(false); }}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )  
      }

      {showModalStudent && (
        <LinkStudentModal groupId={selectedGroup} onClose={closeModal} />
      )}
      {showModalTeacher && (
        <LinkTeacherModal groupId={selectedGroup} onClose={closeModal} />
      )}
      {showEditModal && (
        <EditGroupModal
          groupId={selectedGroup}
          setCurrentGroup={setCurrentGroup}
          setGroups={setFilteredGroups}
          onClose={closeModal}
        />
      )}
      {showListaAsistentesModal && (
        <ListaAsistentes
          groupId={selectedGroup}
          onClose={closeListaAsistentesModal}
        />
      )}
    </div>
  );
};

export default GroupsPage;