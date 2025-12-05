import React from 'react';
import { UserProgress } from '../types';
import { Award, CheckCircle, Printer } from 'lucide-react';

interface CertificateProps {
  user: UserProgress;
  onBack: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ user, onBack }) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = (orientation: 'portrait' | 'landscape') => {
    // Create a style element to force orientation
    const style = document.createElement('style');
    style.innerHTML = `
      @page { 
        size: ${orientation}; 
        margin: 0;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact; 
          print-color-adjust: exact;
        }
      }
    `;
    style.id = 'print-orientation-style';
    document.head.appendChild(style);

    window.print();

    // Clean up
    setTimeout(() => {
      const existingStyle = document.getElementById('print-orientation-style');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent">
      <div className="no-print mb-8 flex flex-wrap gap-4 justify-center animate-pop">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 font-bold shadow-md transition-all"
        >
          ⬅️ Kembali
        </button>
        <button 
          onClick={() => handlePrint('portrait')}
          className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold flex items-center shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <Printer className="w-5 h-5 mr-2" />
          Cetak Portrait
        </button>
        <button 
          onClick={() => handlePrint('landscape')}
          className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-bold flex items-center shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <Printer className="w-5 h-5 mr-2" />
          Cetak Landscape
        </button>
      </div>

      {/* Certificate Container - Always Light */}
      <div className="bg-white p-10 md:p-16 rounded-xl shadow-2xl max-w-4xl w-full border-8 border-double border-orange-900 text-center relative overflow-hidden print:shadow-none print:border-4 print:w-full print:h-full print:absolute print:top-0 print:left-0 print:m-0 animate-pop">
        
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Award className="w-96 h-96 text-orange-900" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-orange-900 mb-2 uppercase tracking-widest">Sertifikat Kompetensi</h1>
          <p className="text-xl text-orange-600 font-serif italic mb-12">Keselamatan dan Kesehatan Kerja (K3)</p>

          <p className="text-slate-600 text-lg mb-4">Diberikan kepada:</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 border-b-4 border-slate-200 inline-block px-12 pb-4">
            {user.name}
          </h2>

          <p className="text-slate-600 text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            Telah berhasil menyelesaikan seluruh modul pelatihan dasar K3 yang meliputi keselamatan bekerja di ketinggian, bahaya listrik, dan pengoperasian forklift dengan predikat:
          </p>

          <div className="text-3xl font-black text-orange-800 mt-6 mb-16 tracking-wide bg-orange-50 inline-block px-8 py-2 rounded-lg border border-orange-200">
            LEVEL {user.level} - {user.level > 5 ? "MASTER K3" : user.level > 2 ? "AHLI K3" : "PRACTITIONER K3"}
          </div>

          <div className="flex justify-between items-end mt-16 px-8 md:px-20">
            <div className="text-center">
              <p className="font-bold text-slate-800 mb-16">{currentDate}</p>
              <div className="h-0.5 w-48 bg-slate-400 mx-auto"></div>
              <p className="text-sm text-slate-500 mt-2 font-semibold uppercase tracking-wider">Tanggal</p>
            </div>
            
            <div className="text-center">
              {/* Signature simulation */}
              <div className="font-serif italic text-4xl text-orange-800 mb-8 transform -rotate-6 opacity-80">SafetyHero</div>
              <div className="h-0.5 w-48 bg-slate-400 mx-auto"></div>
              <p className="text-sm text-slate-500 mt-2 font-semibold uppercase tracking-wider">Direktur Pelatihan</p>
            </div>
          </div>

          <div className="mt-12 text-xs text-slate-400">
             ID Sertifikat: SH-{Date.now().toString().slice(-8)}-{user.level}
          </div>
        </div>
      </div>
    </div>
  );
};