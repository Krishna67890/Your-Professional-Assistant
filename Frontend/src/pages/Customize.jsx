import { BsImages } from "react-icons/bs";
import React, { useContext, useRef, useState } from 'react';
import { UserDataContext } from '../Context/UserContext';
import aiGif from '../assets/ai.gif';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/authBg.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.jpeg';
import image7 from '../assets/image7.jpeg';
import { useNavigate } from "react-router-dom";

function Customize() {
  const { userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(UserDataContext);
  const navigate = useNavigate();
  const inputImage = useRef();

  // Define 6 AI agents with their images from assets folder (AI Agent 2 to 7)
  const aiAgents = [
    { id: 1, name: "AI Agent 2", image: image1 },
    { id: 2, name: "AI Agent 3", image: image2 },
    { id: 3, name: "AI Agent 4", image: image3 },
    { id: 4, name: "AI Agent 5", image: image4 },
    { id: 5, name: "AI Agent 6", image: image5 },
    { id: 6, name: "AI Agent 7", image: image6 },
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage('custom');
  };

  const selectAgent = (agent) => {
    setSelectedImage(agent.image);
  };

  const handleNext = () => {
    if (selectedImage || frontendImage) {
      const selectedImageUrl = selectedImage === 'custom' ? frontendImage : selectedImage;
      const updatedUserData = {
        ...userData,
        assistantImage: selectedImageUrl,
        assistantType: selectedImage === 'custom' ? 'Custom' : 'Predefined'
      };
      setUserData(updatedUserData);
    }
    navigate("/customize2");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-bold text-center text-white mb-3">Select Your AI Agent</h1>
        <p className="text-gray-300 text-center mb-10">Choose from our premium AI agents or upload your own</p>

        {/* Grid of 6 AI Agents */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {aiAgents.map((agent) => (
            <div 
              key={agent.id}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 flex flex-col items-center ${
                selectedImage === agent.image 
                  ? 'ring-4 ring-yellow-400 rounded-xl scale-105' 
                  : 'hover:ring-2 hover:ring-white/50 rounded-lg'
              }`}
              onClick={() => selectAgent(agent)}
            >
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-lg bg-gray-800">
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                {/* Selection indicator */}
                {selectedImage === agent.image && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center w-full">
                <p className="text-white text-xs sm:text-sm font-medium truncate px-1">{agent.name}</p>
              </div>
            </div>
          ))}
          
          {/* Custom Image Option */}
          <div 
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 flex flex-col items-center ${
              selectedImage === 'custom' 
                ? 'ring-4 ring-yellow-400 rounded-xl scale-105' 
                : 'hover:ring-2 hover:ring-white/50 rounded-lg'
            }`}
            onClick={() => {
              inputImage.current.click();
              setSelectedImage('custom');
            }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-lg border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-800/50">
                {frontendImage ? (
                  <img 
                    src={frontendImage} 
                    alt="Custom Agent" 
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="text-center">
                    <BsImages className="text-gray-300 w-8 h-8 mx-auto mb-1" />
                    <span className="text-gray-300 text-xs block">Import</span>
                    <span className="text-gray-400 text-[10px]">Your Photo</span>
                  </div>
                )}
              </div>
              
              {/* Selection indicator */}
              {selectedImage === 'custom' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-2 text-center w-full">
              <p className="text-white text-xs sm:text-sm font-medium truncate px-1">Custom Agent</p>
            </div>
          </div>
        </div>

        {/* Selection Status */}
        {selectedImage ? (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-700/30 border border-green-500 rounded-full px-6 py-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-bold">
                {selectedImage === 'custom' ? 'Custom agent is selected!' : 'AI agent is selected!'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gray-700/30 border border-gray-500 rounded-full px-6 py-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-gray-400 font-medium">
                No agent selected
              </span>
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleNext}
            disabled={!selectedImage}
            className={`px-12 py-4 text-lg font-bold rounded-full transition-all duration-300 transform ${
              selectedImage 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 hover:scale-105 shadow-lg shadow-yellow-500/30' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Proceed to Next
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        className='hidden' 
        ref={inputImage}
        onChange={handleImage} 
      />
    </div>
  );
}

export default Customize;