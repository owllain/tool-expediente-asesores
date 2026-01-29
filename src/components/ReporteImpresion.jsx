import React from 'react'
import { useEvaluacion } from '../context/EvaluacionContext'

const ReporteImpresion = ({ mesesConfig }) => {
    const { evaluaciones } = useEvaluacion()
    const { datosAsesor, firmaFinal } = evaluaciones

    // Helper para formatear nombres de campos (e.g. "fechaMonitoreo" -> "Fecha Monitoreo")
    const formatLabel = (key) => {
        const result = key.replace(/([A-Z])/g, " $1")
        return result.charAt(0).toUpperCase() + result.slice(1)
    }

    return (
        <div className="hidden print:block p-10 bg-white text-black min-h-screen printable-report font-sans">
            {/* Encabezado del Reporte */}
            <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Expediente de Desempeño</h1>
                    <p className="text-xl font-bold text-gray-600">Periodo de Adaptación (90 Días)</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-blue-600">NETCOM</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Certificación de Autonomía</p>
                </div>
            </div>

            {/* Datos del Asesor */}
            <div className="grid grid-cols-2 gap-8 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Nombre del Asesor</p>
                    <p className="text-xl font-bold">{datosAsesor?.nombre || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">ID / Cédula</p>
                    <p className="text-xl font-bold">{datosAsesor?.cedula || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Campaña</p>
                    <p className="text-lg font-bold">{datosAsesor?.campania || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Supervisor</p>
                    <p className="text-lg font-bold">{datosAsesor?.supervisor || 'N/A'}</p>
                </div>
            </div>

            {/* Ciclo de Evaluación */}
            {Object.entries(mesesConfig).map(([mesKey, config]) => (
                <div key={mesKey} className="mb-12 break-inside-avoid">
                    <h2 className="text-2xl font-black mb-6 pb-2 border-b-2 border-gray-200 uppercase">{config.titulo}</h2>

                    <div className="space-y-8">
                        {config.semanas.map((semana) => {
                            const data = evaluaciones[mesKey]?.[semana.id] || {}
                            const keys = Object.keys(data).filter(k => k !== 'comentariosColaborador' && data[k])

                            if (keys.length === 0 && !data.comentariosColaborador) return null

                            return (
                                <div key={semana.id} className="ml-4 border-l-2 border-gray-100 pl-6 mb-10 break-inside-avoid">
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <span className="bg-black text-white px-2 py-0.5 text-xs rounded uppercase">{semana.titulo}</span>
                                        <span className="text-gray-400 text-sm font-medium">— {semana.descripcion}</span>
                                    </h3>

                                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-4">
                                        {keys.map(key => (
                                            <div key={key}>
                                                <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">{formatLabel(key)}</p>
                                                <p className="text-sm font-medium border-b border-gray-50 pb-1">{data[key]}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {data.comentariosColaborador && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg italic">
                                            <p className="text-[9px] font-bold uppercase text-gray-400 mb-2">Comentarios del Colaborador</p>
                                            <p className="text-sm text-gray-700">"{data.comentariosColaborador}"</p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}

            {/* Firma y Cierre Final */}
            <div className="mt-20 border-t-4 border-black pt-10 break-inside-avoid">
                <div className="grid grid-cols-2 gap-20">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black uppercase tracking-tight mb-4 text-blue-800 italic">Certificación Final</h4>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase text-gray-400">Evaluador Responsable</p>
                            <p className="text-lg font-bold">{firmaFinal?.nombreEvaluador || '____________________'}</p>
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">{firmaFinal?.cargoEvaluador || 'Cargo'}</p>
                        </div>
                        {firmaFinal?.comentariosFinalesColaborador && (
                            <div className="mt-6">
                                <p className="text-[9px] font-bold uppercase text-gray-400 mb-2">Observaciones de Cierre</p>
                                <p className="text-sm text-gray-700 italic border-l-2 border-gray-200 pl-4">{firmaFinal.comentariosFinalesColaborador}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50">
                        {firmaFinal?.firmaEvaluador ? (
                            <div className="text-center space-y-4">
                                <img src={firmaFinal.firmaEvaluador} alt="Firma" className="max-h-32 mb-4 mix-blend-multiply" />
                                <div className="h-px w-48 bg-gray-300 mx-auto" />
                                <p className="text-xs font-bold uppercase tracking-widest">Fecha de Validación: {firmaFinal.fechaFirma}</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-300">
                                <p className="text-sm font-bold uppercase tracking-widest italic">Espacio para Firma Autógrafa</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-gray-300">
                        NETCOM Expediente Digital — Reservado para uso corporativo
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ReporteImpresion
