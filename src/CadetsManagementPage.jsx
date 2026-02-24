import React, { useState, useMemo, useRef } from 'react';
import CadetProfileModal from './components/CadetProfileModal';

/**
 * CadetsManagementPage Component - Vertical Flow Edition
 * 
 * Layout:
 * 1. Summary Cards (Horizontal)
 * 2. Selected Cadet Details (Full Width, Conditional) - REPLACED BY MODAL
 * 3. Cadet List (Full Width, Scrollable, Year-grouped)
 */

const CadetsManagementPage = () => {
  // --- State Management ---
  const [cadets, setCadets] = useState([
    {
      id: 1,
      rank: 'CUO',
      name: 'John Doe',
      regNo: 'TN/2021/SDA/123456',
      year: '3rd Year',
      performance: 'Excellent',
      campsAttended: 'RDC, CATC',
      attendanceReport: '95%',
      collegeCGPA: '8.5',
      achievements: 'Best Cadet Award 2023',
      adminRemarks: 'Highly disciplined and proactive.',
    },
    {
      id: 2,
      rank: 'SGT',
      name: 'Jane Smith',
      regNo: 'TN/2022/SWA/654321',
      year: '2nd Year',
      performance: 'Good',
      campsAttended: 'ALC, ATC',
      attendanceReport: '88%',
      collegeCGPA: '9.0',
      achievements: 'Gold Medal in Firing',
      adminRemarks: 'Regular and hardworking.',
    },
    {
      id: 3,
      rank: 'CDT',
      name: 'Robert Brown',
      regNo: 'TN/2023/SDA/789012',
      year: '1st Year',
      performance: 'Average',
      campsAttended: 'ATC',
      attendanceReport: '82%',
      collegeCGPA: '7.8',
      achievements: 'N/A',
      adminRemarks: 'Needs improvement in drill.',
    },
  ]);

  const [selectedCadetId, setSelectedCadetId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');

  // --- Derived State ---
  const yearCounts = useMemo(() => {
    return cadets.reduce(
      (acc, cadet) => {
        if (cadet.year === '1st Year') acc.first++;
        else if (cadet.year === '2nd Year') acc.second++;
        else if (cadet.year === '3rd Year') acc.third++;
        return acc;
      },
      { first: 0, second: 0, third: 0 }
    );
  }, [cadets]);

  const groupedCadets = useMemo(() => {
    return {
      '1st Year': cadets.filter(c => c.year === '1st Year'),
      '2nd Year': cadets.filter(c => c.year === '2nd Year'),
      '3rd Year': cadets.filter(c => c.year === '3rd Year'),
    };
  }, [cadets]);

  const filteredGroupedCadets = useMemo(() => {
    if (selectedYear === 'all') return groupedCadets;
    const key = selectedYear === '1' ? '1st Year' : selectedYear === '2' ? '2nd Year' : '3rd Year';
    return { [key]: groupedCadets[key] ?? [] };
  }, [groupedCadets, selectedYear]);

  const selectedCadet = useMemo(
    () => cadets.find((c) => c.id === selectedCadetId),
    [cadets, selectedCadetId]
  );

  // --- Handlers ---
  const handleAddCadet = (newCadet) => {
    const id = cadets.length > 0 ? Math.max(...cadets.map((c) => c.id)) + 1 : 1;
    setCadets([...cadets, { ...newCadet, id }]);
    setIsAddModalOpen(false);
  };

  const handleDeleteCadet = (id, e) => {
    e.stopPropagation();
    setCadets(cadets.filter((c) => c.id !== id));
    if (selectedCadetId === id) setSelectedCadetId(null);
  };

  const handleSelectCadet = (id) => {
    setSelectedCadetId(id);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] p-4 md:p-8 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cadets Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#6C00A6] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5A008A] transition-all shadow-md active:scale-95"
        >
          + Add Cadet
        </button>
      </div>

      {/* 1. Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="1st Year Cadets Count" count={yearCounts.first} />
        <SummaryCard title="2nd Year Cadets Count" count={yearCounts.second} />
        <SummaryCard title="3rd Year Cadets Count" count={yearCounts.third} />
      </div>

      {/* Year Filter Navbar */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {[
          { label: 'All', value: 'all' },
          { label: 'First Year', value: '1' },
          { label: 'Second Year', value: '2' },
          { label: 'Third Year', value: '3' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSelectedYear(value)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 ${selectedYear === value
                ? 'bg-[#6C00A6] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-[#6C00A6]'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {/* 2. Cadets List Section (Full Width) */}
        <div className="w-full bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-lg">Cadet Roster</h2>
          </div>

          <div className="max-h-[800px] overflow-y-auto p-6 space-y-12">
            {Object.entries(filteredGroupedCadets).map(([year, yearCadets]) => (
              <div key={year} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-800 whitespace-nowrap">{year} Cadets</h3>
                  <div className="h-[2px] w-full bg-gray-100 rounded-full"></div>
                </div>

                {yearCadets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearCadets.map((cadet) => (
                      <div
                        key={cadet.id}
                        onClick={() => handleSelectCadet(cadet.id)}
                        className="p-4 rounded-xl border-2 border-transparent bg-white hover:bg-purple-50 hover:border-purple-100 shadow-sm cursor-pointer transition-all duration-300 relative group"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#6C00A6] uppercase tracking-wider mb-1">{cadet.rank}</span>
                          <span className="text-lg font-bold truncate">{cadet.name}</span>
                          <span className="text-xs text-gray-500 font-mono">{cadet.regNo}</span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteCadet(cadet.id, e)}
                          className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 p-1 rounded"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center text-gray-400">
                    <p>No cadets registered for {year}</p>
                  </div>
                )}
              </div>
            ))}

            {cadets.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl font-medium">No cadets found.</p>
                <p className="text-sm">Click "+ Add Cadet" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Cadet Modal */}
      {isAddModalOpen && (
        <AddCadetModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCadet}
        />
      )}

      {/* Profile Detail Modal */}
      {isProfileModalOpen && selectedCadet && (
        <CadetProfileModal
          cadet={selectedCadet}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

// --- Sub-components ---

const SummaryCard = ({ title, count }) => (
  <div className="bg-white p-6 rounded-xl shadow-soft border-b-4 border-[#6C00A6] hover:translate-y-[-4px] transition-transform duration-300">
    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
    <p className="text-4xl font-bold text-[#6C00A6]">{count}</p>
  </div>
);

const AddCadetModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rank: '',
    name: '',
    regNo: '',
    year: '1st Year',
    performance: '',
    campsAttended: '',
    attendanceReport: '',
    collegeCGPA: '',
    achievements: '',
    adminRemarks: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#6C00A6] text-white">
          <h2 className="text-xl font-bold">Add New Cadet</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Rank" name="rank" value={formData.rank} onChange={handleChange} required />
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Regimental Number" name="regNo" value={formData.regNo} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C00A6] focus:border-[#6C00A6] outline-none transition-all"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
              </select>
            </div>
            <InputField label="Performance" name="performance" value={formData.performance} onChange={handleChange} />
            <InputField label="Camps Attended" name="campsAttended" value={formData.campsAttended} onChange={handleChange} />
            <InputField label="Attendance Report" name="attendanceReport" value={formData.attendanceReport} onChange={handleChange} />
            <InputField label="College CGPA" name="collegeCGPA" value={formData.collegeCGPA} onChange={handleChange} />
            <div className="col-span-full">
              <label className="block text-sm font-bold text-gray-700 mb-1">Technical / Non-Technical Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C00A6] focus:border-[#6C00A6] outline-none transition-all"
              ></textarea>
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-bold text-gray-700 mb-1">Admin Remarks</label>
              <textarea
                name="adminRemarks"
                value={formData.adminRemarks}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C00A6] focus:border-[#6C00A6] outline-none transition-all"
              ></textarea>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#6C00A6] text-white py-3 rounded-xl font-bold hover:bg-[#5A008A] transition-all shadow-lg active:scale-95"
            >
              Save Cadet
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, required = false, type = 'text' }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label} {required && '*'}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C00A6] focus:border-[#6C00A6] outline-none transition-all"
    />
  </div>
);

export default CadetsManagementPage;

