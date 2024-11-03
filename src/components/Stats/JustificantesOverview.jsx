import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../app/context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JustificantesOverview = () => {
  const { schoolId } = useAuth();
  const globalSchoolId = schoolId;
  const [justificanteData, setJustificanteData] = useState([]);
  const [approvalRate, setApprovalRate] = useState(0);
  const [rejectionRate, setRejectionRate] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchJustificanteData = async () => {
      try {
        const response = await axios.get(`/api/stats/justificantesOverview`, {
          params: { schoolId: globalSchoolId }
        });

        const data = response.data;
        setJustificanteData(data);

        // Calcular tasas de aceptación y rechazo
        const totalJustificantes = data.length;
        const approvedCount = data.filter(just => just.status === 1).length;
        const rejectedCount = data.filter(just => just.status === 3).length;
        const pendingCount = data.filter(just => just.status === 2).length;

        setApprovalRate(((approvedCount / totalJustificantes) * 100).toFixed(2));
        setRejectionRate(((rejectedCount / totalJustificantes) * 100).toFixed(2));
        setPendingCount(((pendingCount / totalJustificantes) * 100).toFixed(2));
      } catch (error) {
        console.error('Error fetching justificantes data:', error);
      }
    };

    fetchJustificanteData();
  }, [globalSchoolId]);

  // Preparar datos para el gráfico
  const reasons = ["Cita médica", "Falla en sistema", "Razón personal"];
  const reasonData = reasons.map(reason => {
    const filteredData = justificanteData.filter(just => just.razon === reason);
    const approved = filteredData.filter(just => just.status === 1).length;
    const rejected = filteredData.filter(just => just.status === 3).length;
    return { reason, approved, rejected };
  });

  const barChartData = {
    labels: reasons,
    datasets: [
      {
        label: 'Aprobados',
        data: reasonData.map(r => r.approved),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'Rechazados',
        data: reasonData.map(r => r.rejected),
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Frecuencia de Razones de Justificantes y Tasa de Aceptación/Rechazo' }
    }
  };

  return (
    <div className='p-8'>
      <div className="container mx-auto p-4 mt-12 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Resumen de Justificantes</h2>
        <div className="text-lg text-gray-700">
          <p className="mb-2">Total de justificantes expedidos: <span className="font-semibold text-blue-600">{justificanteData.length}</span></p>
          <p className="mb-2">Tasa de aprobación: <span className="font-semibold text-green-600">{approvalRate}%</span></p>
          <p className="mb-2">Tasa de rechazo: <span className="font-semibold text-red-600">{rejectionRate}%</span></p>
          <p className="mb-2">Justificantes pendientes: <span className="font-semibold text-yellow-600">{pendingCount}%</span></p>
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', marginTop: '2rem' }}>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default JustificantesOverview;