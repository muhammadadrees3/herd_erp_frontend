"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import birthRecordsService from '@/services/birthRecordsService';
import animalService from '@/services/animalService';
import {
  Search, Plus, Edit, Trash2, X, Download, Baby
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTheme } from '@/context/ThemeContext';
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function BirthRecordsManagement() {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    motherTagId: '',
    offspringTagId: '',
    birthDate: new Date().toISOString().split('T')[0],
    gender: 'Female',
    weight: '',
    easeOfCalving: 'Normal',
    notes: ''
  });

  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);

  const pathname = usePathname();

  useEffect(() => {
    fetchRecords();
    fetchAnimals();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await birthRecordsService.getBirthRecords();
      if (data && data.success) {
        setRecords(data.data || []);
      }
    } catch (err) {
      console.error("❌ Error fetching birth records:", err);
      setError("Failed to fetch birth/calving records");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const resp = await animalService.getAnimals();
      if (resp && resp.success) {
        setAnimals(resp.data || []);
      }
    } catch (err) {
      console.error("Error fetching animals:", err);
    }
  };

  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (record.motherTagId || '').toLowerCase().includes(searchLower) ||
      (record.offspringTagId || '').toLowerCase().includes(searchLower) ||
      (record.notes || '').toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  const handleOpenForm = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        motherTagId: record.motherTagId || '',
        offspringTagId: record.offspringTagId || '',
        birthDate: record.birthDate || new Date().toISOString().split('T')[0],
        gender: record.gender || 'Female',
        weight: record.weight || '',
        easeOfCalving: record.easeOfCalving || 'Normal',
        notes: record.notes || ''
      });
    } else {
      setEditingRecord(null);
      const females = animals.filter(a => a.gender === 'Female');
      setFormData({
        motherTagId: females.length > 0 ? females[0].animalTagId : '',
        offspringTagId: '',
        birthDate: new Date().toISOString().split('T')[0],
        gender: 'Female',
        weight: '',
        easeOfCalving: 'Normal',
        notes: ''
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
    setFormData({
      motherTagId: '',
      offspringTagId: '',
      birthDate: new Date().toISOString().split('T')[0],
      gender: 'Female',
      weight: '',
      easeOfCalving: 'Normal',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.motherTagId || !formData.birthDate || !formData.gender) {
      return;
    }

    setSubmitting(true);
    setError(null);
    const apiData = {
      motherTagId: formData.motherTagId,
      offspringTagId: formData.offspringTagId,
      birthDate: formData.birthDate,
      gender: formData.gender,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      easeOfCalving: formData.easeOfCalving,
      notes: formData.notes
    };

    try {
      if (editingRecord) {
        await birthRecordsService.updateBirthRecord(editingRecord.id, apiData);
      } else {
        await birthRecordsService.createBirthRecord(apiData);
      }
      await fetchRecords();
      handleCloseForm();
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await birthRecordsService.deleteBirthRecord(id);
      await fetchRecords();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("❌ Delete failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Mother Tag ID', 'Offspring Tag ID', 'Birth Date', 'Gender', 'Weight (kg)', 'Ease of Calving', 'Notes'],
      ...filteredRecords.map(r => [
        r.motherTagId, 
        r.offspringTagId || '', 
        r.birthDate, 
        r.gender, 
        r.weight || '', 
        r.easeOfCalving || '', 
        r.notes?.replace(/,/g, '') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birth-calving-records.csv';
    a.click();
  };

  const CornerBrackets = () => {
    const borderColor = isDark ? "border-purple-500/20" : "border-neutral-300";
    return (
      <>
        <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${borderColor} transition-all duration-300`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${borderColor} transition-all duration-300`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${borderColor} transition-all duration-300`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${borderColor} transition-all duration-300`} />
      </>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.03),transparent_70%)]" />
          </>
        ) : (
          <>
             <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.02),transparent_70%)]" />
          </>
        )}
      </div>

      {(showForm || deleteConfirm) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => { handleCloseForm(); setDeleteConfirm(null); }}></div>
      )}

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} searchPlaceholder="Search births..." />

      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </div>
                <span className="font-mono text-[10px] text-purple-500/80 uppercase tracking-[0.3em]">[REPRODUCTION_LOGS]</span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Birth / Calving <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Records</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Monitor incoming offspring and mother performance.
              </p>
              {loading && <span className="text-xs text-purple-500 font-mono mt-2">SYNCING_DATA...</span>}
            </div>

             <div className={`flex p-1.5 border backdrop-blur-md ${isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
              <Link href="/dashboard/livestockmanagement/animal/animals">
                <button
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                      isDark
                        ? 'text-neutral-400 hover:text-purple-400 hover:bg-white/5'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                >
                  Animals
                </button>
              </Link>
              <button
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isDark
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                  }`}
              >
                  Birth Records
              </button>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-purple-500/50' : 'bg-purple-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Calving Log</h2>
                <button onClick={fetchRecords} disabled={loading} className={`ml-2 text-xs font-mono px-2 py-1 border transition-all ${loading ? 'opacity-50 cursor-not-allowed' : isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-neutral-50 border-neutral-200'}`} title="Refresh Data">
                  {loading ? '...' : '⟲'}
                </button>
              </div>
              <button onClick={() => handleOpenForm()} disabled={submitting} className={`cursor-pointer group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${isDark ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm'}`}>
                <Plus className="w-4 h-4" />
                {submitting ? 'Saving...' : 'Log Birth'}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className={`relative flex-1 p-5 border group/search ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'}`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input type="text" placeholder="Search by tags or notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`flex-1 bg-transparent outline-none text-sm font-medium ${isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'}`} />
                  {searchTerm && <button onClick={() => setSearchTerm('')} className={`p-1 transition-all ${isDark ? 'hover:text-white text-neutral-400' : 'hover:text-neutral-900 text-neutral-500'}`}><X className="w-4 h-4" /></button>}
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${isDark ? 'bg-purple-500' : 'bg-purple-600'}`} />
                <CornerBrackets />
              </div>
              <div className="flex gap-3">
                 <button onClick={handleExport} className={`cursor-pointer flex items-center gap-2 px-5 py-3 border transition-all font-bold text-[11px] uppercase tracking-widest ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300 shadow-sm'}`}>
                    <Download className="w-4 h-4" />
                    Export
                 </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className={`relative border overflow-hidden ${isDark ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-neutral-300 shadow-sm'}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-neutral-50 border-neutral-200'}`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Mother Tag</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Offspring Tag</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Birth Date</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Gender</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Ease</th>
                      <th className={`px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/5">
                    {filteredRecords.map(record => (
                      <tr key={record.id} className={`group transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-3 py-1 border text-[11px] font-bold font-mono tracking-wider ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                            {record.motherTagId}
                          </div>
                        </td>
                         <td className="px-6 py-4">
                           {record.offspringTagId ? (
                             <div className={`inline-flex items-center px-3 py-1 border text-[11px] font-bold font-mono tracking-wider ${isDark ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                {record.offspringTagId}
                              </div>
                           ) : (
                             <span className={`text-sm ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>TBD</span>
                           )}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{record.birthDate}</span>
                        </td>
                        <td className="px-6 py-4">
                             <div className="flex flex-col gap-1">
                                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{record.gender}</span>
                                {record.weight && <span className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{record.weight} kg</span>}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{record.easeOfCalving || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenForm(record)} className={`p-2 border transition-all ${isDark ? 'hover:bg-white/10 hover:text-white border-white/10 text-neutral-400' : 'hover:bg-neutral-100 hover:text-neutral-900 border-neutral-200 text-neutral-500'}`}>
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteConfirm(record)} className={`p-2 border transition-all ${isDark ? 'hover:bg-red-500/20 hover:text-red-400 border-white/10 text-neutral-400' : 'hover:bg-red-50 hover:text-red-600 border-neutral-200 text-neutral-500'}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan="6" className={`px-6 py-12 text-center text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          No birth/calving records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <CornerBrackets />
            </div>
          </section>

        </main>
      </div>

       <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${
        showForm ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'} shadow-2xl overflow-y-auto`}>
        <div className="p-8">
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-purple-500' : 'bg-purple-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {editingRecord ? 'EDIT_MODE' : 'LOG_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingRecord ? 'Edit Birth Record' : 'Log Birth'}
              </h2>
            </div>
            <button onClick={handleCloseForm} className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10' : 'hover:bg-neutral-50 border-neutral-200'}`} disabled={submitting}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wider border border-red-200 rounded">
                {error}
              </div>
            )}

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Mother Tag ID *
              </label>
              <select required value={formData.motherTagId} onChange={(e) => setFormData({...formData, motherTagId: e.target.value})} className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} disabled={submitting}>
                <option value="">Select mother...</option>
                {animals.filter(a => a.gender === 'Female').map((a) => (
                  <option key={a.id} value={a.animalTagId}>{a.animalTagId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Offspring Tag ID (Optional)
              </label>
              <select value={formData.offspringTagId} onChange={(e) => setFormData({...formData, offspringTagId: e.target.value})} className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} disabled={submitting}>
                <option value="">Pending / Not Registered</option>
                {animals.filter(a => a.id !== editingRecord?.id).map((a) => (
                  <option key={a.id} value={a.animalTagId}>{a.animalTagId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Birth Date *
              </label>
              <input type="date" required value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} disabled={submitting} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Gender *
                  </label>
                  <select required value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} disabled={submitting}>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                 <div>
                    <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Weight (kg)
                    </label>
                    <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} placeholder="e.g. 35.5" disabled={submitting} />
                </div>
            </div>
            
            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Ease of Calving
              </label>
              <select value={formData.easeOfCalving} onChange={(e) => setFormData({...formData, easeOfCalving: e.target.value})} className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} disabled={submitting}>
                <option value="Normal">Normal</option>
                <option value="Assisted">Assisted</option>
                <option value="Difficult">Difficult</option>
                <option value="Surgery/Vet">Surgery/Vet Required</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Notes
              </label>
              <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3" className={`w-full px-4 py-3.5 border outline-none transition-all font-medium resize-none ${isDark ? 'bg-neutral-900 border-white/10 focus:border-purple-500' : 'bg-neutral-50 border-neutral-300 focus:border-purple-500'}`} placeholder="Complications, details..." disabled={submitting} />
            </div>

            <div className="flex gap-3 pt-6">
              <button type="button" onClick={handleCloseForm} className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'}`} disabled={submitting}>Cancel</button>
              <button type="submit" disabled={submitting} className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${submitting ? 'bg-purple-400 cursor-not-allowed border-purple-400' : 'bg-purple-600 hover:bg-purple-700 border-purple-600 text-white'}`}>
                {submitting ? 'Saving...' : (editingRecord ? 'Update' : 'Log Birth')}
              </button>
            </div>
          </form>
        </div>
      </div>

       {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'} shadow-2xl`}>
            <div className="text-center">
              <div className={`inline-flex p-5 border mb-5 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                <Trash2 className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-3`}>Delete Record?</h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete this birth record for mother {deleteConfirm.motherTagId}?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' : 'bg-white hover:bg-neutral-50 border-neutral-300'}`} disabled={submitting}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} disabled={submitting} className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${submitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white border-red-600`}>
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}

    </div>
  );
}
