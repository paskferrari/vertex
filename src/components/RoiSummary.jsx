import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const RoiSummary = () => {
  const { getAuthHeaders } = useAuth();
  const [roiData, setRoiData] = useState({
    total_followed: 0,
    total_won: 0,
    total_lost: 0,
    total_pending: 0,
    roi: 0,
    roi_percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoiData();
  }, []);

  const fetchRoiData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/user/roi', {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ROI data');
      }

      const data = await response.json();
      setRoiData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ROI data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="text-red-500 text-center">
          <p>Errore nel caricamento dei dati ROI</p>
          <button 
            onClick={fetchRoiData}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  const getRoiColor = (percentage) => {
    if (percentage > 0) return 'text-green-600';
    if (percentage < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRoiBgColor = (percentage) => {
    if (percentage > 0) return 'bg-green-50 border-green-200';
    if (percentage < 0) return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Riepilogo ROI</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{roiData.total_followed}</div>
          <div className="text-sm text-gray-600">Pronostici Seguiti</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{roiData.total_won}</div>
          <div className="text-sm text-gray-600">Vinti</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{roiData.total_lost}</div>
          <div className="text-sm text-gray-600">Persi</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{roiData.total_pending}</div>
          <div className="text-sm text-gray-600">In Attesa</div>
        </div>
      </div>

      <div className={`p-4 rounded-lg border-2 ${getRoiBgColor(roiData.roi_percentage)}`}>
        <div className="text-center">
          <div className={`text-3xl font-bold ${getRoiColor(roiData.roi_percentage)}`}>
            {roiData.roi_percentage > 0 ? '+' : ''}{roiData.roi_percentage.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">ROI Percentuale</div>
          <div className={`text-lg font-semibold mt-2 ${getRoiColor(roiData.roi)}`}>
            {roiData.roi > 0 ? '+' : ''}{roiData.roi.toFixed(2)} unità
          </div>
        </div>
      </div>

      {roiData.total_followed === 0 && (
        <div className="text-center text-gray-500 mt-4">
          <p>Inizia a seguire alcuni pronostici per vedere il tuo ROI!</p>
        </div>
      )}
    </div>
  );
};

export default RoiSummary;