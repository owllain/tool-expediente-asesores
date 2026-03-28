import React from 'react'
import { useEvaluacion } from '../context/EvaluacionContext'
import { QRCodeSVG } from 'qrcode.react'

const ReporteImpresion = ({ mesesConfig }) => {
    const { evaluaciones, printConfig } = useEvaluacion()
    const { datosAsesor } = evaluaciones

    const tipoProceso = datosAsesor?.tipoProceso
    const printTipo = printConfig ? printConfig.tipo : tipoProceso
    const isIngresos = printTipo !== 'partitura'
    const isPartitura = printTipo === 'partitura'

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
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        {isPartitura ? 'Reforzamiento Operativo' : 'Expediente de Desempeño'}
                    </h1>
                    <p className="text-xl font-bold text-gray-600">
                        {isPartitura ? 'Periodo de Apoyo (4 Semanas)' : 'Periodo de Adaptación (90 Días)'}
                    </p>
                    {datosAsesor?.idExpediente && (
                        <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest bg-gray-100 inline-block px-2 py-1 rounded">
                            {datosAsesor.idExpediente}
                        </p>
                    )}
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
            {isIngresos && Object.entries(mesesConfig).map(([mesKey, config]) => {
                if (printConfig && printConfig.mes !== mesKey) return null;
                
                return (
                <div key={mesKey} className="mb-12 break-inside-avoid">
                    <h2 className="text-2xl font-black mb-6 pb-2 border-b-2 border-gray-200 uppercase">{config.titulo}</h2>

                    <div className="space-y-8">
                        {config.semanas.map((semana) => {
                            if (printConfig && printConfig.semana !== semana.id) return null;
                            
                            const data = evaluaciones[mesKey]?.[semana.id] || {}
                            const keys = Object.keys(data).filter(k => k !== 'comentariosColaborador' && k !== 'firmaSemanal' && data[k])

                            if (keys.length === 0 && !data.comentariosColaborador && !data.firmaSemanal) return null

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

                                    {data.firmaSemanal && (
                                        <div className="mt-4 flex flex-col items-start border-t border-gray-100 pt-4">
                                            <p className="text-[9px] font-bold uppercase text-gray-400 mb-2">Conformidad Opcional (Semana)</p>
                                            <img src={data.firmaSemanal} alt="Firma semanal" className="max-h-16 mix-blend-multiply -ml-2" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )})}

            {/* Partitura (Bitácora de Reforzamiento Operativo) */}
            {isPartitura && evaluaciones.partitura && Object.entries(evaluaciones.partitura).some(([, data]) => Object.values(data || {}).filter(v => v).length > 0) && (
                <div className="mb-12 break-inside-avoid page-break-before-always">
                    <h2 className="text-2xl font-black mb-6 pb-2 border-b-2 border-gray-200 uppercase">
                        Reforzamiento Positivo / Oportunidad de Mejora (Partitura)
                    </h2>

                    <div className="space-y-12">
                        {['semana1', 'semana2', 'semana3', 'semana4'].map((semana) => {
                            if (printConfig && printConfig.semana !== semana) return null;
                            
                            const data = evaluaciones.partitura?.[semana] || {}
                            const hasData = Object.values(data).filter(v => v).length > 0
                            if (!hasData) return null

                            return (
                                <div key={semana} className="border-2 border-gray-200 rounded-xl p-6 break-inside-avoid">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                                        <h3 className="text-xl font-black uppercase text-blue-900 tracking-tight">
                                            {semana.replace('semana', 'Semana ')}
                                        </h3>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Periodo</p>
                                            <p className="text-sm font-medium">{data.fechaInicio || '--'} al {data.fechaFin || '--'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase bg-gray-100 p-2 rounded text-gray-700 tracking-wider">Métricas</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Meta AHT / Resultado</p>
                                                    <p className="text-sm font-medium border-b border-gray-50 pb-1">{data.metaAHT || '--'} / {data.resultadoAHT || '--'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Meta Calidad / Resultado</p>
                                                    <p className="text-sm font-medium border-b border-gray-50 pb-1">{data.metaCalidad || '--'} / {data.resultadoCalidad || '--'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-bold uppercase bg-gray-100 p-2 rounded text-gray-700 tracking-wider">Monitoreos</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">ID NQC / Llamada</p>
                                                    <p className="text-sm font-medium border-b border-gray-50 pb-1">{data.idNQC || '--'} / {data.idLlamada || '--'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 mb-8">
                                        {(data.hallazgos || data.retroalimentacion) && (
                                            <div className="grid grid-cols-2 gap-8">
                                                {data.hallazgos && (
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 border-l-4 border-red-400 pl-2">Hallazgos</p>
                                                        <p className="text-sm text-gray-800 bg-red-50 p-3 rounded-r-lg">{data.hallazgos}</p>
                                                    </div>
                                                )}
                                                {data.retroalimentacion && (
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 border-l-4 border-green-400 pl-2">Retroalimentación</p>
                                                        <p className="text-sm text-gray-800 bg-green-50 p-3 rounded-r-lg">{data.retroalimentacion}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(data.temaCoaching || data.observacionesCoaching) && (
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
                                                <h4 className="text-xs font-bold uppercase text-blue-800 tracking-wider mb-4 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                    Sesión de Coaching
                                                </h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {data.temaCoaching && (
                                                        <div>
                                                            <p className="text-[9px] font-bold uppercase text-blue-400 mb-1">Tema</p>
                                                            <p className="text-sm font-medium text-blue-900 border-b border-blue-100 pb-1">{data.temaCoaching}</p>
                                                        </div>
                                                    )}
                                                    {data.observacionesCoaching && (
                                                        <div>
                                                            <p className="text-[9px] font-bold uppercase text-blue-400 mb-1">Observaciones</p>
                                                            <p className="text-sm text-blue-800 italic">{data.observacionesCoaching}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {(data.causaRaiz || data.compromisos) && (
                                            <div className="grid grid-cols-2 gap-8 mt-6">
                                                {data.causaRaiz && (
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 border-l-4 border-orange-400 pl-2">Causa Raíz</p>
                                                        <p className="text-sm text-gray-800 bg-orange-50 p-3 rounded-r-lg">{data.causaRaiz}</p>
                                                    </div>
                                                )}
                                                {data.compromisos && (
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 border-l-4 border-[#ff004f] pl-2">Compromisos Adquiridos</p>
                                                        <p className="text-sm text-gray-800 bg-[#ff004f]/5 p-3 rounded-r-lg">{data.compromisos}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 border-t border-gray-100 pt-6 flex justify-between items-center bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                                        <div className="text-xs font-bold uppercase text-gray-400">
                                            Conformidad del Asesor
                                        </div>
                                        <div className="flex flex-col items-center justify-center w-64 h-24 border-2 border-dashed border-gray-200 rounded-lg bg-white relative">
                                            {data.firmaSemanal ? (
                                                <img src={data.firmaSemanal} alt="Firma Semanal Partitura" className="max-h-20 mix-blend-multiply absolute inset-0 m-auto" />
                                            ) : (
                                                <p className="text-[10px] font-bold uppercase tracking-widest italic text-gray-300">Firma Física</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* --- PIE DE PÁGINA CON CÓDIGO QR --- */}
            <div className="mt-16 pt-6 border-t-2 border-gray-300 flex justify-between items-end">
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">PRRHH07.FO-07 | Documento generado digitalmente</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Este documento es válido únicamente con firma digital del supervisor y del asesor evaluado.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <QRCodeSVG
                        value={`[EDA] ID:${datosAsesor?.idExpediente || 'N/A'} | Asesor:${datosAsesor?.nombre || 'N/A'} | Campaña:${datosAsesor?.campania || 'N/A'} | Proceso:${tipoProceso || 'N/A'}`}
                        size={72}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Scan para verificar</p>
                </div>
            </div>
        </div>
    )
}

export default ReporteImpresion

