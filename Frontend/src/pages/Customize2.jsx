import React, { useContext, useState, useEffect } from 'react';
import { UserDataContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || '');
  const [country, setCountry] = useState(userData?.country || 'India');
  const [state, setState] = useState(userData?.state || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const countries = [
    "India", "USA", "UK", "Canada", "Australia", "Germany", "France", "Japan", "China", "Russia", "Brazil", "South Africa"
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
  ];

  const handleFinish = () => {
    if (!assistantName.trim() || !country || (country === 'India' && !state)) {
      alert("Please fill in all details");
      return;
    }

    setLoading(true);
    
    const updatedUserData = {
      ...userData,
      assistantName: assistantName,
      country: country,
      state: country === 'India' ? state : 'N/A'
    };
    setUserData(updatedUserData);
    
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">J</span>
            </div>
            <h1 className="text-white font-black text-2xl tracking-tighter">JARVIS <span className="text-red-600">AI</span></h1>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">System Initialization</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Finalizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Parameters</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Calibrating your intelligence agent with regional and personal identifiers.</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Side: Preview */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-800 bg-black flex items-center justify-center">
                  {userData?.assistantImage ? (
                    <img 
                      src={userData?.assistantImage} 
                      alt="Agent" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <span className="text-gray-700 font-bold text-4xl">AI</span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full shadow-lg"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Current Designation</h3>
                <p className="text-red-500 font-mono text-sm">{assistantName || 'AWAITING INPUT...'}</p>
              </div>
            </div>

            {/* Right Side: Inputs */}
            <div className="space-y-6">
              {/* Assistant Name */}
              <div>
                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Assistant Name</label>
                <input
                  type="text"
                  placeholder="e.g. JARVIS"
                  className="w-full h-14 px-5 bg-black/50 border border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-all font-bold text-lg"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                />
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Country</label>
                <select
                  className="w-full h-14 px-5 bg-black/50 border border-gray-800 rounded-2xl text-white focus:outline-none focus:border-red-600 transition-all font-bold appearance-none cursor-pointer"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value !== 'India') setState('');
                  }}
                >
                  {countries.map(c => (
                    <option key={c} value={c} className="bg-black text-white">{c}</option>
                  ))}
                </select>
              </div>

              {/* State Selection (Conditional) */}
              {country === 'India' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2 ml-1">Select State</label>
                  <select
                    className="w-full h-14 px-5 bg-black/50 border border-gray-800 rounded-2xl text-white focus:outline-none focus:border-red-600 transition-all font-bold appearance-none cursor-pointer"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="" disabled>Choose your state</option>
                    {indianStates.map(s => (
                      <option key={s} value={s} className="bg-black text-white">{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <button 
              onClick={() => navigate('/customize')}
              className="group flex items-center space-x-2 text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              <span>Back</span>
            </button>
            
            <button 
              onClick={handleFinish}
              disabled={loading || !assistantName.trim() || (country === 'India' && !state)}
              className={`relative px-12 py-4 rounded-2xl font-black uppercase tracking-tighter text-lg transition-all overflow-hidden ${
                loading || !assistantName.trim() || (country === 'India' && !state)
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-900/30 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Engaging Protocols...</span>
                </div>
              ) : (
                "Initiate Deployment"
              )}
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Core Sync", status: "Active" },
            { label: "Neural Link", status: "Established" },
            { label: "Voice Matrix", status: "Optimized" },
            { label: "Security", status: "Level 4" }
          ].map((item, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{item.label}</span>
              <span className="text-xs text-green-500 font-mono font-bold uppercase">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customize2;