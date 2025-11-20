import React, { useEffect } from 'react';
import Button from './Button';

interface GuidelinesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const GuidelinesModal: React.FC<GuidelinesModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guidelines-title"
        >
            <div 
                className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all animate-slide-up border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 sm:p-8 border-b border-white/10 bg-white/5 rounded-t-2xl">
                    <h2 id="guidelines-title" className="text-2xl sm:text-3xl font-extrabold text-brand-beige tracking-tight">
                        Lineamientos Editoriales
                    </h2>
                    <p className="text-brand-beige/60 mt-2 text-sm sm:text-base">
                        Directrices esenciales para el Vodcast ALTA VOZ.
                    </p>
                </div>

                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-8 text-brand-beige/90">
                        
                        <section>
                            <h3 className="font-bold text-brand-orange text-lg mb-3 uppercase tracking-wide text-sm">Contenido de largo plazo</h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
                                <li>Temas alejados de la contingencia y del día a día del diseño.</li>
                                <li>Enfoque en tópicos transversales, reflexivos y conceptualmente sólidos.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-brand-orange text-lg mb-3 uppercase tracking-wide text-sm">Marco conceptual y perspectiva</h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
                                <li>Construcción de un mindset con altura de mirada.</li>
                                <li>Perspectiva situada en Latinoamérica.</li>
                                <li>Relevancia del uso de tecnologías en el diseño.</li>
                                <li>Valor del quehacer colaborativo y sus metodologías.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-brand-orange text-lg mb-3 uppercase tracking-wide text-sm">Foco de las discusiones</h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
                                <li>Centrar las conversaciones en proyectos concretos.</li>
                                <li>Poner especial énfasis en iniciativas que hayan tenido impacto real en el medio, en la disciplina o en comunidades específicas.</li>
                                <li>Evitar la abstracción vacía: conectar ideas con prácticas, experiencias y casos aplicados.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-brand-orange text-lg mb-3 uppercase tracking-wide text-sm">Rol de los hosts</h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
                                <li>Conducir y orientar la conversación con claridad.</li>
                                <li>Impulsar al invitado a lucir sus ideas a través de ejemplos, relatos y aprendizajes.</li>
                                <li>Generar fragmentos breves, memorables y dinámicos que mantengan la atención.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-brand-orange text-lg mb-3 uppercase tracking-wide text-sm">Estilo de conversación</h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
                                <li>Tono reflexivo y de discusión con altura.</li>
                                <li>No se busca el acuerdo permanente; la diferencia enriquece el formato.</li>
                                <li>Intercambio de ideas que aporte matices y abra perspectivas.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-brand-orange text-lg mb-3 uppercase tracking-wide text-sm">Uso del lenguaje</h3>
                            <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
                                <li>Puede ser cercano e informal, pero siempre preciso.</li>
                                <li>Cuidado por el lenguaje como herramienta para generar conocimiento.</li>
                            </ul>
                        </section>

                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-2xl flex justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 text-brand-beige/70 font-bold hover:text-brand-beige transition-colors text-sm sm:text-base"
                    >
                        Cancelar
                    </button>
                    <div className="w-full sm:w-auto">
                        <Button onClick={onConfirm} className="!py-3 !w-auto">
                            Entendido, continuar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidelinesModal;