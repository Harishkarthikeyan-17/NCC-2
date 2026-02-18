import React, { useEffect } from 'react';

const CadetProfileModal = ({ cadet, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!cadet) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#6C00A6] text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white text-[#6C00A6] px-3 py-1 rounded-lg font-bold text-sm uppercase">
                            {cadet.rank}
                        </div>
                        <h2 className="text-xl font-bold">Cadet Profile</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:rotate-90 transition-transform p-1 hover:bg-white/20 rounded-full"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
                        {/* Profile Photo Placeholder */}
                        <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{cadet.name}</h3>
                            <p className="text-lg font-mono text-[#6C00A6] mb-4">{cadet.regNo}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoBadge label="Rank" value={cadet.rank} />
                                <InfoBadge label="Year" value={cadet.year} />
                                <InfoBadge label="Company" value={cadet.company || 'Alpha'} />
                                <InfoBadge label="Platoon" value={cadet.platoon || 'Platoon 1'} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailField label="Performance" value={cadet.performance} />
                            <DetailField label="Attendance %" value={cadet.attendanceReport} />
                            <DetailField label="College CGPA" value={cadet.collegeCGPA} />
                            <DetailField label="Camps Attended" value={cadet.campsAttended} />
                        </div>

                        <hr className="border-gray-100" />

                        <DetailField fullWidth label="Technical / Non-Technical Achievements" value={cadet.achievements} />

                        <hr className="border-gray-100" />

                        <DetailField fullWidth label="Admin Remarks" value={cadet.adminRemarks} />

                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-6">
                            <h4 className="text-xs font-bold text-[#6C00A6] uppercase tracking-widest mb-2">Emergency Contact</h4>
                            <p className="text-gray-700 font-medium">+91 98765 43210</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoBadge = ({ label, value }) => (
    <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
        <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
);

const DetailField = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? "w-full" : ""}>
        <h4 className="text-xs font-bold text-[#6C00A6] uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-gray-800 font-medium leading-relaxed">{value || 'N/A'}</p>
    </div>
);

export default CadetProfileModal;
