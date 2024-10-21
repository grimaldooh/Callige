import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faFileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const AttendanceList = ({ groupId }) => {
  const [attendanceLists, setAttendanceLists] = useState([]);
  const [students, setStudents] = useState([]);
  const [maxAbsences, setMaxAbsences] = useState(20); // Inicializa con un valor predeterminado
  const [newMaxAbsences, setNewMaxAbsences] = useState(""); // Para el input de max_absences
  const [group, setGroup] = useState(null);

  const MAX_ABSENCES = 20; // Máximo de inasistencias permitidas

  useEffect(() => {
    const fetchAttendanceLists = async () => {
      try {
        const response = await fetch(`/api/attendance?groupId=${groupId}`);
        const data = await response.json();
        setAttendanceLists(data);
      } catch (error) {
        console.error("Error fetching attendance lists:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/groups?groupId=${groupId}`);
        const data = await response.json();
        setStudents(data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/admin/findGroup?id=${groupId}`);
        const data = await response.json();
        console.log('Group data:', data);
        setGroup(data); // Establece los datos del grupo
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };

    if (groupId) {
      fetchGroup();
      fetchAttendanceLists();
      fetchStudents();
    }
  }, [groupId]);

  useEffect(() => { 
    console.log('attendanceLists:', attendanceLists);
    console.log('students:', students);
  }, [attendanceLists, students]);

  useEffect(() => {
    if (group) {
      setMaxAbsences(group.max_absences);
      //setNewMaxAbsences(group.max_absences);
    }
  }, [group]);

  const handleMaxAbsencesChange = (event) => {
    setNewMaxAbsences(event.target.value);
  };

  const updateMaxAbsences = async () => {
    try {
      const response = await fetch('/api/teacher/maxAbsences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ max_absences: newMaxAbsences , groupId }),
      });

      if (response.ok) {
        setMaxAbsences(newMaxAbsences);
        alert('Límite de faltas actualizado correctamente.');
      } else {
        alert('Error al actualizar el límite de faltas.');
      }
    } catch (error) {
      console.error("Error updating max absences:", error);
      alert('Hubo un error al actualizar el límite de faltas.');
    }
  };

  // Función para formatear fechas
  const formattedDate = (fecha) => {
    const date = new Date(fecha);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const formattedDate = adjustedDate.toLocaleDateString();
    return formattedDate;
  };

  // Función para calcular inasistencias
  function calculateAbsences(studentId) {
    let absences = 0;
    attendanceLists.forEach((attendanceList) => {
      const attendance = attendanceList.attendances.find(
        (a) => a.student_id === studentId
      );
      if (attendance && attendance.present === 0) {
        absences++;
      }
    });
    return absences;
  }

  // Función para determinar el color del cuadrado según las inasistencias
  function getAbsenceColor(absences) {
    const percentage = (absences / maxAbsences) * 100;
    if (percentage <= 25) {
      return "bg-green-500"; // Verde
    } else if (percentage <= 75) {
      return "bg-orange-500"; // Naranja
    } else {
      return "bg-red-500"; // Rojo
    }
  }

  return (
    <div
      className="mt-6 overflow-x-auto scrollbar-hide"
      style={{
        msOverflowStyle: "none", // Para IE y Edge
        scrollbarWidth: "none",  // Para Firefox
      }}
    >
      <h2 className="text-2xl font-bold mb-4 sticky">Lista de Asistencia</h2>
      {/* Input para cambiar el límite de faltas */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Establecer límite máximo de faltas:
        </label>
        <input
          type="number"
          value={newMaxAbsences}
          onChange={handleMaxAbsencesChange}
          placeholder={`Actual: ${group?.max_absences}`}
          className="border p-2 mb-2"
        />
        <button
          onClick={updateMaxAbsences}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-6"
        >
          Actualizar límite de faltas
        </button>
      </div>
      {attendanceLists.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2 sticky left-0 bg-white z-10">Alumno</th>
              {attendanceLists.map(attendanceList => (
                <th key={attendanceList.id} className="border border-gray-200 p-2 min-w-[150px]">
                  {formattedDate(attendanceList.fecha)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const absences = calculateAbsences(student.id);
              return (
                <tr key={student.id}>
                  <td className="border border-gray-200 p-2 flex items-center w-80 sticky left-0 bg-white z-10">
                    {/* Icono de correo */}
                    <a href={`mailto:${student.email}`} target="_blank" rel="noopener noreferrer" className="mr-2">
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 hover:text-blue-700" />
                    </a>
                    {/* Cuadrado de color */}
                    <span
                      className={`inline-block w-4 h-4 mr-2 ${getAbsenceColor(absences)}`}
                      style={{ borderRadius: '4px' }}
                    ></span>
                    {/* Nombre del estudiante con inasistencias */}
                    {student.name} - {absences}/{maxAbsences}
                  </td>
                  {attendanceLists.map(attendanceList => {
                    const attendance = attendanceList.attendances.find(a => a.student_id === student.id);
                    return (
                      <td
                        key={attendanceList.id}
                        className="border border-gray-200 p-2"
                      >
                        {attendance ? (
                          attendance.present === 1 ? (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-green-500"
                            />
                          ) : attendance.present === 2 ? (
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              className="text-blue-500"
                            />
                          ) : attendance.present === 0 ? (
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-red-500"
                            />
                          ) : attendance.present === 3 ? (
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-red-500"
                            />
                          ) : (
                            "N/A"
                          )
                        ) : (
                          "N/A"
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hay listas de asistencia disponibles para este grupo.</p>
      )}
    </div>
  );
};

export default AttendanceList;