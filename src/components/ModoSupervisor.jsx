import React, { useState, useRef } from 'react'
import { BarChart2, Upload, FileJson, Trash2, AlertTriangle, CheckCircle, Download, Users } from 'lucide-react'

const calculateProgress = (exp) => {
    const tipo = exp.datosAsesor?.tipoProceso
    let filled = 0, total = 0
    if (tipo === 'partitura') {
        total = 4
        for (let s = 1; s <= 4; s++) {
            const d = exp.partitura?.[`semana${s}`] || {}
            if (Object.keys(d).some(k => k !== 'firmaSemanal' && d[k])) filled++
        }
    } else {
        total = 12
        for (let m = 1; m <= 3; m++) {
            for (let s = 1; s <= 4; s++) {
                const d = exp[`mes${m}`]?.[`semana${s}`] || {}
                if (Object.keys(d).some(k => k !== 'comentariosColaborador' && k !== 'firmaSemanal' && d[k])) filled++
            }
        }
    }
    return total > 0 ? Math.round((filled / total) * 100) : 0
}

const calculateSemanasFirmadas = (exp) => {
    const tipo = exp.datosAsesor?.tipoProceso
    let firmadas = 0
    if (tipo === 'partitura') {
        for (let s = 1; s <= 4; s++) {
            if (exp.partitura?.[`semana${s}`]?.firmaSemanal) firmadas++
        }
    } else {
        for (let m = 1; m <= 3; m++) {
            for (let s = 1; s <= 4; s++) {
                if (exp[`mes${m}`]?.[`semana${s}`]?.firmaSemanal) firmadas++
            }
        }
    }
    return firmadas
}

const ModoSupervisor = () => {
    const [expedientes, setExpedientes] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [errors, setErrors] = useState([])
    const fileInputRef = useRef(null)

    const processFiles = (files) => {
        const newErrors = []
        const readers = Array.from(files).filter(f => f.name.endsWith('.json')).map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result)
                        if (data.datosAsesor) {
                            resolve(data)
                        } else {
                            newErrors.push(`${file.name}: No es un expediente EDA válido.`)
                            resolve(null)
                        }
                    } catch {
                        newErrors.push(`${file.name}: Error al leer el archivo.`)
                        resolve(null)
                    }
                }
                reader.readAsText(file)
            })
        })

        Promise.all(readers).then(results => {
            const valid = results.filter(Boolean)
            setExpedientes(prev => {
                const combined = [...prev]
                valid.forEach(v => {
                    const id = v.datosAsesor?.idExpediente
                    if (id && !combined.find(e => e.datosAsesor?.idExpediente === id)) {
                        combined.push(v)
                    }
                })
                return combined
            })
            setErrors(newErrors)
        })
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        processFiles(e.dataTransfer.files)
    }

    const handleFileInput = (e) => processFiles(e.target.files)

    const removeExpediente = (id) => {
        setExpedientes(prev => prev.filter(e => e.datosAsesor?.idExpediente !== id))
    }

    const exportCSV = () => {
        const headers = ['ID Expediente', 'Nombre', 'Cédula', 'Campaña', 'Supervisor', 'Tipo Proceso', 'Progreso (%)', 'Semanas Firmadas']
        const rows = expedientes.map(exp => {
            const d = exp.datosAsesor || {}
            return [
                d.idExpediente || '',
                d.nombre || '',
                d.cedula || '',
                d.campania || '',
                d.supervisor || '',
                d.tipoProceso || '',
                calculateProgress(exp),
                calculateSemanasFirmadas(exp)
            ]
        })
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `EDA_Supervisor_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    const avgProgress = expedientes.length
        ? Math.round(expedientes.reduce((acc, e) => acc + calculateProgress(e), 0) / expedientes.length)
        : 0

    const countAlerts = expedientes.filter(e => calculateProgress(e) < 50).length

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-4">
                <div>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <BarChart2 className="w-3 h-3" />
                        Analítica en Lote
                    </p>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Modo Supervisor</h2>
                    <p className="text-muted-foreground text-sm font-medium">Carga hasta 50 expedientes para un análisis gerencial consolidado.</p>
                </div>
                {expedientes.length > 0 && (
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 px-5 py-3 rounded-xl text-sm font-bold transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Exportar Sábana CSV
                    </button>
                )}
            </header>

            {/* Zona de Drop */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
                    ${isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5'}`}
            >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Arrastra archivos JSON aquí</h3>
                <p className="text-sm text-muted-foreground">o haz clic para seleccionar múltiples expedientes</p>
                <input ref={fileInputRef} type="file" accept=".json" multiple onChange={handleFileInput} className="hidden" />
            </div>

            {/* Errores */}
            {errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-2">
                    {errors.map((err, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-red-400">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {err}
                        </div>
                    ))}
                </div>
            )}

            {/* Métricas Rápidas */}
            {expedientes.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card/50 border border-white/5 rounded-2xl p-6 text-center">
                            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                            <p className="text-3xl font-black text-white">{expedientes.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Expedientes Cargados</p>
                        </div>
                        <div className="bg-card/50 border border-white/5 rounded-2xl p-6 text-center">
                            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <p className="text-3xl font-black text-white">{avgProgress}%</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Progreso Promedio General</p>
                        </div>
                        <div className="bg-card/50 border border-white/5 rounded-2xl p-6 text-center">
                            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                            <p className="text-3xl font-black text-white">{countAlerts}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Asesores con Progreso &lt; 50%</p>
                        </div>
                    </div>

                    {/* Tabla Gerencial */}
                    <div className="bg-card/30 border border-white/5 rounded-3xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Tabla Comparativa</h3>
                            <p className="text-xs text-muted-foreground">{expedientes.length} registros</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="text-left px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asesor</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tipo</th>
                                        <th className="text-left px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Campaña</th>
                                        <th className="text-center px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Progreso</th>
                                        <th className="text-center px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selladas</th>
                                        <th className="text-center px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estado</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expedientes.map((exp) => {
                                        const d = exp.datosAsesor || {}
                                        const progress = calculateProgress(exp)
                                        const firmadas = calculateSemanasFirmadas(exp)
                                        const totalSemanas = d.tipoProceso === 'partitura' ? 4 : 12
                                        const isRisk = progress < 50
                                        return (
                                            <tr key={d.idExpediente} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-[10px] text-primary">{d.idExpediente || 'N/A'}</td>
                                                <td className="px-6 py-4 font-bold text-white">{d.nombre || 'Sin Nombre'}</td>
                                                <td className="px-6 py-4 text-muted-foreground text-xs">{d.tipoProceso === 'partitura' ? 'Partitura' : 'Ingresos'}</td>
                                                <td className="px-6 py-4 text-muted-foreground text-xs">{d.campania || '—'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-green-400' : progress >= 50 ? 'bg-primary' : 'bg-amber-400'}`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-white w-10 text-right">{progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-xs font-bold text-muted-foreground">{firmadas}/{totalSemanas}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest
                                                        ${progress === 100 ? 'bg-green-500/10 text-green-400' :
                                                          isRisk ? 'bg-amber-500/10 text-amber-400' :
                                                          'bg-primary/10 text-primary'}`}>
                                                        {progress === 100 ? 'Completo' : isRisk ? 'En Riesgo' : 'En Curso'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => removeExpediente(d.idExpediente)}
                                                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ModoSupervisor
