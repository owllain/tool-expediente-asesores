import React from 'react'
import { useEvaluacion } from '../context/EvaluacionContext'
import { FolderOpen, Trash2, FileJson, ArrowRight, ShieldCheck, User } from 'lucide-react'

// Helper component to display progress natively
const MiniProgressBar = ({ data }) => {
    let filled = 0
    let total = 0
    const tipo = data.datosAsesor?.tipoProceso

    if (tipo !== 'partitura') {
        total = 12
        for (let m = 1; m <= 3; m++) {
            for (let s = 1; s <= 4; s++) {
                const semData = data[`mes${m}`]?.[`semana${s}`] || {}
                const hasData = Object.keys(semData).some(k => k !== 'comentariosColaborador' && k !== 'firmaSemanal' && semData[k])
                if (hasData) filled++
            }
        }
    } else {
        total = 4
        for (let s = 1; s <= 4; s++) {
            const semData = data.partitura?.[`semana${s}`] || {}
            const hasData = Object.keys(semData).some(k => k !== 'firmaSemanal' && semData[k])
            if (hasData) filled++
        }
    }

    const progress = Math.round((filled / total) * 100) || 0

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                <span>Progreso Local</span>
                <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500 rounded-full" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>
    )
}

const DirectorioLocal = ({ onSelect }) => {
    const { expedientesLocales, loadExpedienteLocal, deleteExpedienteLocal, evaluaciones } = useEvaluacion()

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col gap-1 border-b border-white/5 pb-8">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <FolderOpen className="w-3 h-3" />
                    Bandeja Multisesión
                </p>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Mis Expedientes</h2>
                <p className="text-muted-foreground text-sm font-medium">Gestione y cambie entre los expedientes guardados temporalmente en este navegador.</p>
            </header>

            {expedientesLocales.length === 0 ? (
                <div className="text-center py-20 px-4 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-4">
                        <FileJson className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Bandeja Vacía</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">No hay expedientes almacenados en la memoria de este navegador. Cree uno desde Registro o cargue un archivo JSON.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {expedientesLocales.map((exp) => {
                        const id = exp.datosAsesor?.idExpediente
                        const isActive = evaluaciones?.datosAsesor?.idExpediente === id
                        const isPartitura = exp.datosAsesor?.tipoProceso === 'partitura'

                        return (
                            <div 
                                key={id}
                                className={`group relative bg-card/40 border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5
                                    ${isActive ? 'border-primary/40 shadow-lg shadow-primary/10' : 'border-white/5'}`}
                            >
                                {isActive && (
                                    <div className="absolute -top-3 -right-3">
                                        <div className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-widest border border-white/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            En Uso
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white truncate max-w-[140px]">{exp.datosAsesor?.nombre || 'Sin Nombre'}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground font-medium">Proceso:</span>
                                        <span className="text-white/80 font-bold">{isPartitura ? 'Partitura (4 Sem)' : 'Nuevos Ingresos'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground font-medium">Campaña:</span>
                                        <span className="text-white/80 font-bold truncate max-w-[100px]">{exp.datosAsesor?.campania || 'N/A'}</span>
                                    </div>
                                </div>

                                <MiniProgressBar data={exp} />

                                <div className="mt-8 flex items-center justify-between gap-3">
                                    <button
                                        onClick={() => {
                                            if (!isActive) {
                                                loadExpedienteLocal(id)
                                                if (onSelect) onSelect()
                                            }
                                        }}
                                        disabled={isActive}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all
                                            ${isActive 
                                                ? 'bg-white/5 text-muted-foreground cursor-not-allowed' 
                                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                        {isActive ? 'Abierto' : 'Retomar'}
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            if(window.confirm(`¿Seguro que deseas eliminar el expediente de ${exp.datosAsesor?.nombre}? Esta acción no se puede deshacer si no exportaste el JSON.`)) {
                                                deleteExpedienteLocal(id)
                                            }
                                        }}
                                        className="p-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors group-hover:opacity-100 opacity-60"
                                        title="Eliminar de memoria local"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default DirectorioLocal
