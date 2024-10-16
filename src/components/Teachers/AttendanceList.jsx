import { useEffect, useState } from 'react';

const AttendanceList = ({ groupId }) => {
  const [attendanceLists, setAttendanceLists] = useState([]);
  const [students, setStudents] = useState([]);
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
        const response = await fetch(`/api/students?groupId=${groupId}`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    if (groupId) {
      fetchAttendanceLists();
      fetchStudents();
    }
  }, [groupId]);

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
        //absences = absences * 3;
      }
    });
    return absences;
  }

  // Función para determinar el color del cuadrado según las inasistencias
  function getAbsenceColor(absences) {
    const percentage = (absences / MAX_ABSENCES) * 100;
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
  {/* Agregar scroll horizontal */}
  <h2 className="text-2xl font-bold mb-4 sticky">Lista de Asistencia</h2>
  {attendanceLists.length > 0 ? (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-200 p-2 sticky left-0 bg-white z-10">Alumno</th> {/* Fijar la celda */}
          {attendanceLists.map(attendanceList => (
            <th key={attendanceList.id} className="border border-gray-200 p-2 min-w-[150px]"> {/* Ancho mínimo */}
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
              <td className="border border-gray-200 p-2 flex items-center w-80 sticky left-0 bg-white z-10"> {/* Fijar la celda */}
                {/* Cuadrado de color */}
                <span
                  className={`inline-block w-4 h-4 mr-2 ${getAbsenceColor(absences)}`}
                  style={{ borderRadius: '4px' }} // Opcional: puedes ajustar la forma
                ></span>
                {/* Nombre del estudiante con inasistencias */}
                {student.name} - {absences}/{MAX_ABSENCES}
              </td>
              {attendanceLists.map(attendanceList => {
                const attendance = attendanceList.attendances.find(a => a.student_id === student.id);
                return (
                  <td key={attendanceList.id} className="border border-gray-200 p-2">
                    {attendance ? (attendance.present ? '✔️' : '❌') : 'N/A'}
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