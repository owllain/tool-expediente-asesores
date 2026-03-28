import React, { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useEvaluacion } from '../context/EvaluacionContext'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { Pen, Target, Info, Search, BookOpen, AlertTriangle, Lock, Unlock, ShieldCheck } from 'lucide-react'

const Field = ({ label, value, onChange, type = "text", placeholder = "", options = [] }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
            {label}
        </label>
        {type === "textarea" ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:bg-primary/10 focus:ring-2 focus:ring-primary transition-all outline-none text-sm text-card-foreground placeholder:text-muted-foreground min-h-[80px]"
                placeholder={placeholder}
            />
        ) : type === "select" ? (
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:bg-primary/10 focus:ring-2 focus:ring-primary transition-all outline-none text-sm text-card-foreground"
            >
                <option value="" className="bg-card text-card-foreground">Seleccione una opción...</option>
                {options.map(opt => <option key={opt} value={opt} className="bg-card text-card-foreground">{opt}</option>)}
            </select>
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:bg-primary/10 focus:ring-2 focus:ring-primary transition-all outline-none text-sm text-card-foreground placeholder:text-muted-foreground"
                placeholder={placeholder}
            />
        )}
    </div>
)

// eslint-disable-next-line no-unused-vars
const SectionHeader = ({ icon: IconComponent, title }) => (
    <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-primary/20 rounded-md">
            <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <h4 className="text-lg font-bold text-white">{title}</h4>
    </div>
)

const Partitura = ({ semana, titulo, descripcion }) => {
    const { evaluaciones, updatePartitura, setPrintConfig } = useEvaluacion()
    const data = evaluaciones.partitura?.[semana] || {}
    const sigCanvas = useRef(null)
    const isLocked = !!data.firmaSemanal

    const handleChange = (field, value) => {
        if (isLocked) return
        updatePartitura(semana, { [field]: value })
    }

    const handleSaveFirma = () => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) return
        updatePartitura(semana, { firmaSemanal: sigCanvas.current.toDataURL() })
    }

    const clearFirma = () => {
        updatePartitura(semana, { firmaSemanal: null })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col gap-1 mb-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">PARTITURA MÓDULO</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{titulo}</h3>
                </div>
                <p className="text-muted-foreground text-sm font-medium">{descripcion}</p>
            </div>

            <Card className="w-full shadow-2xl border-white/5 rounded-3xl bg-card/40 backdrop-blur-sm overflow-hidden border">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-8 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-extrabold text-white tracking-tight">Oportunidad de Mejora</CardTitle>
                            <CardDescription className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">
                                Seguimiento de Reforzamiento Operativo
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 pb-10 px-8 min-h-[450px]">
                    <div className="space-y-10 max-w-4xl mx-auto">
                        
                        {/* 1. Periodo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-white/5 bg-white/5 shadow-inner">
                            <Field label="Fecha de Inicio" type="date" value={data.fechaInicio} onChange={(v) => handleChange('fechaInicio', v)} />
                            <Field label="Fecha de Fin" type="date" value={data.fechaFin} onChange={(v) => handleChange('fechaFin', v)} />
                        </div>

                        {/* 2. Métricas AHT y Calidad */}
                        <div>
                            <SectionHeader icon={Target} title="Métricas del Periodo" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl border border-white/5 bg-secondary/10">
                                <Field label="Meta AHT" value={data.metaAHT} onChange={(v) => handleChange('metaAHT', v)} />
                                <Field label="Resultado AHT" value={data.resultadoAHT} onChange={(v) => handleChange('resultadoAHT', v)} />
                                <Field label="Meta Calidad" value={data.metaCalidad} onChange={(v) => handleChange('metaCalidad', v)} />
                                <Field label="Resultado Calidad" value={data.resultadoCalidad} onChange={(v) => handleChange('resultadoCalidad', v)} />
                            </div>
                        </div>

                        {/* 3. Monitoreos */}
                        <div>
                            <SectionHeader icon={Search} title="Monitoreos" />
                            <div className="space-y-6 p-6 rounded-2xl border border-white/5 bg-secondary/10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="ID NQC" value={data.idNQC} onChange={(v) => handleChange('idNQC', v)} placeholder="# Ticket, Caso o Folio" />
                                    <Field label="ID Llamada" value={data.idLlamada} onChange={(v) => handleChange('idLlamada', v)} placeholder="ID único" />
                                </div>
                                <Field label="Hallazgos" type="textarea" value={data.hallazgos} onChange={(v) => handleChange('hallazgos', v)} />
                                <Field label="Retroalimentación dada" type="textarea" value={data.retroalimentacion} onChange={(v) => handleChange('retroalimentacion', v)} />
                            </div>
                        </div>

                        {/* 4. Coaching */}
                        <div>
                            <SectionHeader icon={BookOpen} title="Coaching" />
                            <div className="space-y-6 p-6 rounded-2xl border border-white/5 bg-secondary/10">
                                <Field label="Tema del Coaching" value={data.temaCoaching} onChange={(v) => handleChange('temaCoaching', v)} />
                                <Field label="Observaciones" type="textarea" value={data.observacionesCoaching} onChange={(v) => handleChange('observacionesCoaching', v)} />
                            </div>
                        </div>

                        {/* 5. Causa Raíz y Compromisos */}
                        <div>
                            <SectionHeader icon={AlertTriangle} title="Causa Raíz y Compromisos" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-white/5 bg-secondary/10">
                                <Field label="Causa Raíz" type="textarea" value={data.causaRaiz} onChange={(v) => handleChange('causaRaiz', v)} placeholder="¿Por qué ocurrió el problema?" />
                                <Field label="Compromisos" type="textarea" value={data.compromisos} onChange={(v) => handleChange('compromisos', v)} placeholder="Acciones específicas para mejorar" />
                            </div>
                        </div>
                        
                        {/* 6. Módulo de Firma Semanal */}
                        <div className="p-6 bg-secondary/20 rounded-2xl border border-primary/20 shadow-sm">
                            <label className="text-sm font-bold text-white/90 flex items-center gap-2 tracking-wide uppercase mb-4">
                                <Pen className="h-4 w-4 text-primary" />
                                Conformidad Semanal <span className="text-[10px] text-muted-foreground">(Opcional)</span>
                            </label>

                            {isLocked ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                        <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Semana Sellada</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">Esta semana está firmada y sus datos están protegidos.</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if(window.confirm('¿Romper el sello? La firma se eliminará y los campos quedarán editables nuevamente.'))
                                                    clearFirma()
                                            }}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 px-3 py-1.5 rounded-lg transition-all shrink-0"
                                        >
                                            <Unlock className="h-3 w-3" />
                                            Romper Sello
                                        </button>
                                    </div>
                                    <div className="flex justify-center p-6 bg-white rounded-xl border border-white/20 shadow-inner">
                                        <img src={data.firmaSemanal} alt="Firma semanal" className="max-h-24 mix-blend-multiply" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-white/20 rounded-xl bg-white p-1">
                                        <SignatureCanvas
                                            ref={sigCanvas}
                                            canvasProps={{ className: 'w-full h-24 cursor-crosshair rounded-lg' }}
                                            backgroundColor="rgb(255, 255, 255)"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" size="sm" onClick={() => sigCanvas.current?.clear()} className="rounded-lg">Limpiar</Button>
                                        <Button size="sm" onClick={handleSaveFirma} className="rounded-lg shadow-primary/20 shadow-lg gap-2">
                                            <Lock className="h-3 w-3" />
                                            Firmar y Sellar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botón de Impresión Semanal */}
                        <div className="mt-8 flex justify-end">
                            <Button
                                onClick={() => {
                                    setPrintConfig({ tipo: 'partitura', semana })
                                    setTimeout(() => window.print(), 100)
                                }}
                                className="bg-primary/20 text-primary hover:bg-primary/30 hover:text-white rounded-xl px-6 py-6 h-auto flex items-center gap-3 shadow-none border border-primary/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                <div>
                                    <span className="block font-bold">Guardar PDF de la Semana</span>
                                    <span className="block text-[10px] opacity-70">Documento individual ({titulo})</span>
                                </div>
                            </Button>
                        </div>

                    </div>
                </CardContent>

                <CardFooter className="bg-black/20 border-t border-white/5 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary/60">
                        <Info className="h-4 w-4" />
                        <p className="text-[10px] uppercase tracking-widest font-extrabold">
                            Persistencia Local Activa
                        </p>
                    </div>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                        Alpha v0.2.0 - Partitura
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default Partitura
