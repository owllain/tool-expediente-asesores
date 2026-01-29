import React from 'react'
import { useEvaluacion } from '../context/EvaluacionContext'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, AlertCircle, ArrowRight, ShieldCheck, Target, Zap } from 'lucide-react'

const Dashboard = () => {
    const {
        totalEvaluaciones,
        promedioGlobal,
        cumplimientoTotal,
        alertasPendientes,
        completionByWeek,
        proximoPaso,
        statusAsesor,
        evaluaciones
    } = useEvaluacion()

    const { datosAsesor } = evaluaciones

    const stats = [
        { label: 'Promedio General', value: promedioGlobal, icon: TrendingUp, color: 'text-primary' },
        { label: 'Cumplimiento', value: cumplimientoTotal, icon: CheckCircle, color: 'text-green-400' },
        { label: 'Semanas Evaluadas', value: totalEvaluaciones, icon: Clock, color: 'text-blue-400' },
        { label: 'Semanas Restantes', value: alertasPendientes, icon: AlertCircle, color: 'text-destructive' },
    ]

    return (
        <div className="space-y-8 pb-10 max-w-5xl mx-auto">
            {/* Header con Info del Asesor */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
                <header className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Ejecución Bimestral</p>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Resumen de Resultados</h2>
                    <p className="text-muted-foreground text-sm font-medium">Visualización integral del desempeño y evolución del asesor</p>
                </header>
                {datosAsesor?.nombre && (
                    <div className="flex flex-col items-start md:items-end bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 transition-all hover:bg-primary/10">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">ID: {datosAsesor.cedula}</p>
                        <p className="text-2xl font-black text-white tracking-tight leading-none mb-1">{datosAsesor.nombre}</p>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{datosAsesor.campania}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Grid de Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="dashboard-card"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="metric-value mb-1 text-3xl">{stat.value}</div>
                            <p className="metric-label">{stat.label}</p>
                        </motion.div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico de Evolución */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Progreso de Documentación</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Grado de cumplimiento por formulario</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Completado</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-48 flex items-end justify-between gap-3 px-2">
                            {completionByWeek.map((progress, idx) => {
                                const isCompleted = progress === 100
                                const isPending = progress === 0
                                const isInProgress = progress > 0 && progress < 100

                                return (
                                    <div key={idx} className="flex-grow h-full flex flex-col justify-end items-center group relative">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-700 relative group-hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]
                                                ${isCompleted ? 'bg-primary shadow-lg shadow-primary/20' :
                                                    isInProgress ? 'bg-primary/40' :
                                                        'bg-white/5 border-t border-x border-white/10'}`}
                                            style={{ height: `${Math.max(progress, 5)}%` }}
                                        >
                                            {/* Tooltip con porcentaje */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-border px-2 py-1 rounded text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
                                                {progress}% Completado
                                            </div>

                                            {/* Efecto de brillo para completados */}
                                            {isCompleted && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-t-lg" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-bold mt-3 transition-colors ${isCompleted ? 'text-primary' : isPending ? 'text-white/20' : 'text-primary/60'}`}>
                                            S{idx + 1}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Próximos Pasos y Estatus */}
                <div className="space-y-6">
                    {/* Tarjeta de Estatus */}
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-primary/10 rotate-12 transition-transform group-hover:scale-110">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Estatus Advisor</p>
                            <h4 className="text-xl font-black text-white leading-tight mb-4">{statusAsesor}</h4>
                            <div className="flex items-center gap-2 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5">
                                <Target className="h-3 w-3 text-primary" />
                                <span className="text-[9px] font-bold text-white/80 uppercase">Rumbo a Certificación</span>
                            </div>
                        </div>
                    </div>

                    {/* Próximos Pasos */}
                    <div className="bg-card/50 border border-white/5 rounded-3xl p-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            Próximos Pasos
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 group">
                                <div className="mt-1 h-5 w-5 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center shrink-0">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{proximoPaso}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Pendiente de completar</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 opacity-40 grayscale">
                                <div className="mt-1 h-5 w-5 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0">
                                    <ArrowRight className="h-3 w-3 text-white/40" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/60">Sesión de retroalimentación final</p>
                                    <p className="text-[10px] text-white/20 mt-0.5">Programado para Mes 3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
