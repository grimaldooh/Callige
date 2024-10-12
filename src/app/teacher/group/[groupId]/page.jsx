'use client'
import { useParams } from 'next/navigation';
import AttendanceList from '../../../../components/Teachers/AttendanceList';

const GroupPage = () => {
  const { groupId } = useParams();

  return (
    <div>
      <h1>Asistencia para el Grupo {groupId}</h1>
      <div className="mt-12 p-8">
      <AttendanceList groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupPage;