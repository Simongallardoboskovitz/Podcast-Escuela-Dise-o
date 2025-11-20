import React, { useState, useCallback } from 'react';
import { generatePodcastStructure } from './services/geminiService';
import { type PodcastFormInputs } from './types';
import { DESIGN_SPECIALIZATIONS } from './constants';
import Input from './components/Input';
import Select from './components/Select';
import Button from './components/Button';
import Loader from './components/Loader';
import StructureDisplay from './components/StructureDisplay';
import TopicsModal from './components/TopicsModal';
import GuidelinesModal from './components/GuidelinesModal';

const App: React.FC = () => {
  const [formState, setFormState] = useState<PodcastFormInputs>({
    specialization: '',
    hostName: '',
    hostRole: '',
    guestName: '',
    episodeTitle: '',
    guestHit: '',
    section1: '',
    section2: '',
    section3: '',
  });
  const [generatedStructure, setGeneratedStructure] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTopicsModalOpen, setIsTopicsModalOpen] = useState<boolean>(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedStructure(null);
    setIsTopicsModalOpen(false);

    try {
      const structure = await generatePodcastStructure(formState);
      setGeneratedStructure(structure);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const handleReset = () => {
    setGeneratedStructure(null);
    setError(null);
    setIsTopicsModalOpen(false);
    setIsGuidelinesModalOpen(false);
    setFormState({
        specialization: '',
        hostName: '',
        hostRole: '',
        guestName: '',
        episodeTitle: '',
        guestHit: '',
        section1: '',
        section2: '',
        section3: '',
    });
  };
  
  const handleGuidelinesConfirm = () => {
    setIsGuidelinesModalOpen(false);
    setTimeout(() => setIsTopicsModalOpen(true), 100); // Small delay for smooth transition
  };

  const isInitialFormValid = formState.hostName && formState.hostRole && formState.guestName && formState.guestHit && formState.specialization;

  return (
    <div className="min-h-screen w-full bg-black text-brand-beige flex flex-col items-center justify-center font-sans p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-md z-10">
        {!generatedStructure && !isLoading && !error && (
          <>
            <div className="animate-fade-in text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-4 text-brand-beige">ALTA VOZ</h1>
              <p className="text-brand-beige/60 mt-2 mb-10 text-lg">Un Podcast de la Escuela de Diseño</p>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8 text-left">
                  <Input label="Nombre Host" name="hostName" value={formState.hostName} onChange={handleInputChange} placeholder="Ej: Pancho Malo" required />
                  <Input label="Mi expertis" name="hostRole" value={formState.hostRole} onChange={handleInputChange} placeholder="Ej: 'Diseñador de Nada'" required />
                  <Input label="Nombre del Invitado/a" name="guestName" value={formState.guestName} onChange={handleInputChange} placeholder="Ej: Javiera Mena" required />
                  <Input label="Proyecto destacado del invitado" name="guestHit" value={formState.guestHit} onChange={handleInputChange} placeholder="Ej: El rediseño de la app del banco" required />
                  
                  <Select 
                    label="Especialidad del Invitado/a" 
                    name="specialization" 
                    value={formState.specialization} 
                    onChange={handleInputChange} 
                    options={DESIGN_SPECIALIZATIONS} 
                    placeholder="Seleccionar mención"
                  />
                  
                  <Button type="button" onClick={() => setIsGuidelinesModalOpen(true)} disabled={!isInitialFormValid}>
                      Definir Temas del Programa
                  </Button>
              </form>
            </div>
            
            <GuidelinesModal
                isOpen={isGuidelinesModalOpen}
                onClose={() => setIsGuidelinesModalOpen(false)}
                onConfirm={handleGuidelinesConfirm}
            />

            <TopicsModal
              isOpen={isTopicsModalOpen}
              onClose={() => setIsTopicsModalOpen(false)}
              onSubmit={handleSubmit}
              formState={formState}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </>
        )}

        {isLoading && <Loader />}
        
        {error && (
            <div className="text-center text-red-400 animate-fade-in bg-zinc-900 p-8 rounded-2xl shadow-lg border border-white/10">
                <p className="text-xl font-bold text-brand-beige">Algo salió mal...</p>
                <p className="text-brand-beige/70 mt-2">{error}</p>
                <Button onClick={handleReset} className="mt-6">Intentar de nuevo</Button>
            </div>
        )}

        {generatedStructure && (
          <div className="animate-fade-in w-full">
            <StructureDisplay structure={generatedStructure} episodeTitle={formState.episodeTitle} onReset={handleReset} />
          </div>
        )}
      </main>
      
       <footer className="fixed bottom-4 text-brand-beige/20 text-sm z-10">
        Hecho con IA y buen gusto
      </footer>
    </div>
  );
};

export default App;