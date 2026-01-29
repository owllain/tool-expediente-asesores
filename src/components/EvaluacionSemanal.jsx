import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useEvaluacion } from '../context/EvaluacionContext'
import { motion } from 'framer-motion'
import { ClipboardCheck, Calendar, Star, Info } from 'lucide-react'

const Field = ({ label, value, onChange, type = "text", placeholder = "", options = [] }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
            {label}
        </label>
        {type === "textarea" ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 focus:bg-primary/10 focus:ring-2 focus:ring-primary transition-all outline-none text-sm text-card-foreground placeholder:text-muted-foreground"
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

const EvaluacionSemanal = ({ mes, semana, titulo, descripcion }) => {
    const { evaluaciones, updateEvaluacion } = useEvaluacion()
    const data = evaluaciones[mes][semana]

    const handleChange = (field, value) => {
        updateEvaluacion(mes, semana, { [field]: value })
    }

    const renderFields = () => {
        // Campos comunes
        const commonFields = (
            <Field
                label="Comentarios del Colaborador"
                value={data.comentariosColaborador || ''}
                onChange={(v) => handleChange('comentariosColaborador', v)}
                type="textarea"
                placeholder="El asesor puede dejar sus dudas o feedback aquí..."
            />
        )

        // Campos específicos por Mes/Semana
        if (mes === 'mes1') {
            switch (semana) {
                case 'semana1': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Monitoreo" type="date" value={data.fechaMonitoreo} onChange={(v) => handleChange('fechaMonitoreo', v)} />
                            <Field label="Herramienta (Teramind/Observer)" value={data.herramientaUtilizada} onChange={(v) => handleChange('herramientaUtilizada', v)} />
                        </div>
                        <Field label="Hallazgos Identificados" type="textarea" value={data.hallazgosIdentificados} onChange={(v) => handleChange('hallazgosIdentificados', v)} />
                        <Field label="Retroalimentación Inmediata" type="textarea" value={data.retroalimentacion} onChange={(v) => handleChange('retroalimentacion', v)} />
                        <Field label="Observaciones Manejo de Sistemas" type="textarea" value={data.observacionesSistemas} onChange={(v) => handleChange('observacionesSistemas', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana2': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Evaluación" type="date" value={data.fechaEvaluacion} onChange={(v) => handleChange('fechaEvaluacion', v)} />
                            <Field label="Tipo (Quiz/Examen)" value={data.tipoEvaluacion} onChange={(v) => handleChange('tipoEvaluacion', v)} />
                            <Field label="Calificación Obtenida" value={data.calificacion} onChange={(v) => handleChange('calificacion', v)} />
                            <Field label="Áreas Evaluadas" value={data.areasEvaluadas} onChange={(v) => handleChange('areasEvaluadas', v)} />
                        </div>
                        <Field label="Resultados y Observaciones" type="textarea" value={data.resultados} onChange={(v) => handleChange('resultados', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana3': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Estratificado" type="date" value={data.fechaEstratificado} onChange={(v) => handleChange('fechaEstratificado', v)} />
                            <Field label="Nivel de Desempeño" type="select" options={['Excelente', 'Bueno', 'Regular', 'Bajo']} value={data.nivelDesempeno} onChange={(v) => handleChange('nivelDesempeno', v)} />
                        </div>
                        <Field label="Análisis de Resultados" type="textarea" value={data.analisisResultados} onChange={(v) => handleChange('analisisResultados', v)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Buenas Prácticas Identifiedas" type="textarea" value={data.buenasPracticas} onChange={(v) => handleChange('buenasPracticas', v)} />
                            <Field label="Desviaciones a Corregir" type="textarea" value={data.malasPracticas} onChange={(v) => handleChange('malasPracticas', v)} />
                        </div>
                        <Field label="Plan de Mejora" type="textarea" value={data.planMejora} onChange={(v) => handleChange('planMejora', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana4': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Evaluación" type="date" value={data.fechaEvaluacion} onChange={(v) => handleChange('fechaEvaluacion', v)} />
                            <Field label="Calificación Actual" value={data.calificacion} onChange={(v) => handleChange('calificacion', v)} />
                            <Field label="Comparación con Semana 2" value={data.comparacionSemana2} onChange={(v) => handleChange('comparacionSemana2', v)} />
                            <Field label="Nivel de Evolución" value={data.evolucionAsesor} onChange={(v) => handleChange('evolucionAsesor', v)} />
                        </div>
                        <Field label="Efectividad de Acciones Aplicadas" type="textarea" value={data.efectividadAcciones} onChange={(v) => handleChange('efectividadAcciones', v)} />
                        {commonFields}
                    </div>
                )
            }
        }

        if (mes === 'mes2') {
            switch (semana) {
                case 'semana1': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Escucha" type="date" value={data.fechaEscucha} onChange={(v) => handleChange('fechaEscucha', v)} />
                            <Field label="Asesor Referente (Bench)" value={data.asesorBench} onChange={(v) => handleChange('asesorBench', v)} />
                        </div>
                        <Field label="Criterios Operativos Reforzados" type="textarea" value={data.criteriosReforzados} onChange={(v) => handleChange('criteriosReforzados', v)} />
                        <Field label="Buenas Prácticas Observadas" type="textarea" value={data.buenasPracticasObservadas} onChange={(v) => handleChange('buenasPracticasObservadas', v)} />
                        <Field label="Áreas de Mejora" type="textarea" value={data.areasMejora} onChange={(v) => handleChange('areasMejora', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana2': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Evaluación" type="date" value={data.fechaEvaluacion} onChange={(v) => handleChange('fechaEvaluacion', v)} />
                            <Field label="Calificación Obtenida" value={data.calificacion} onChange={(v) => handleChange('calificacion', v)} />
                        </div>
                        <Field label="Nivel de Retención de Información" type="textarea" value={data.retencionInformacion} onChange={(v) => handleChange('retencionInformacion', v)} />
                        <Field label="Evidencia de Aplicación Correcta" type="textarea" value={data.aplicacionCorrecta} onChange={(v) => handleChange('aplicacionCorrecta', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana3': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Capacitación" type="date" value={data.fechaCapacitacion} onChange={(v) => handleChange('fechaCapacitacion', v)} />
                            <Field label="E-learning Completado" value={data.eLearningCompletado} onChange={(v) => handleChange('eLearningCompletado', v)} />
                        </div>
                        <Field label="Micro cápsulas Formativas Aplicadas" type="textarea" value={data.microCapsulas} onChange={(v) => handleChange('microCapsulas', v)} />
                        <Field label="Puntos de Dolor Abordados" type="textarea" value={data.puntosDolorAbordados} onChange={(v) => handleChange('puntosDolorAbordados', v)} />
                        <Field label="Progreso Observado" type="textarea" value={data.progresoObservado} onChange={(v) => handleChange('progresoObservado', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana4': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Monitoreo" type="date" value={data.fechaMonitoreo} onChange={(v) => handleChange('fechaMonitoreo', v)} />
                            <Field label="Mejora en Desempeño (%)" value={data.mejoraDesempeno} onChange={(v) => handleChange('mejoraDesempeno', v)} />
                            <Field label="Adherencia a Protocolos (%)" value={data.adherenciaProtocolos} onChange={(v) => handleChange('adherenciaProtocolos', v)} />
                            <Field label="Efectividad en Resolución" value={data.resolucionConsultas} onChange={(v) => handleChange('resolucionConsultas', v)} />
                        </div>
                        <Field label="Observaciones Generales" type="textarea" value={data.observacionesGenerales} onChange={(v) => handleChange('observacionesGenerales', v)} />
                        {commonFields}
                    </div>
                )
            }
        }

        if (mes === 'mes3') {
            switch (semana) {
                case 'semana1': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha del Taller" type="date" value={data.fechaTaller} onChange={(v) => handleChange('fechaTaller', v)} />
                        </div>
                        <Field label="Casos Reales Analizados" type="textarea" value={data.casosAnalizados} onChange={(v) => handleChange('casosAnalizados', v)} />
                        <Field label="Buenas Prácticas Aplicadas" type="textarea" value={data.buenasPracticasAplicadas} onChange={(v) => handleChange('buenasPracticasAplicadas', v)} />
                        <Field label="Oportunidades de Mejora" type="textarea" value={data.oportunidadesMejora} onChange={(v) => handleChange('oportunidadesMejora', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana2': return (
                    <div className="space-y-6">
                        <Field label="Observaciones de Seguimiento de Autonomía" type="textarea" value={data.observacionesGenerales} onChange={(v) => handleChange('observacionesGenerales', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana3': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Estratificado Final" type="date" value={data.fechaEstratificadoFinal} onChange={(v) => handleChange('fechaEstratificadoFinal', v)} />
                            <Field label="Nivel de Desempeño Final" type="select" options={['Apto', 'En Proceso', 'No Apto']} value={data.nivelDesempenoFinal} onChange={(v) => handleChange('nivelDesempenoFinal', v)} />
                            <Field label="Monitoreos Completados" value={data.monitoreosCompletados} onChange={(v) => handleChange('monitoreosCompletados', v)} />
                            <Field label="Evaluaciones Completadas" value={data.evaluacionesCompletadas} onChange={(v) => handleChange('evaluacionesCompletadas', v)} />
                        </div>
                        <Field label="Análisis Integral de Resultados" type="textarea" value={data.analisisIntegral} onChange={(v) => handleChange('analisisIntegral', v)} />
                        <Field label="¿Alcanzó Madurez Operativa?" type="select" options={['Sí', 'No', 'Parcialmente']} value={data.madurezOperativa} onChange={(v) => handleChange('madurezOperativa', v)} />
                        {commonFields}
                    </div>
                )
                case 'semana4': return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="Fecha de Entrega de Resultados" type="date" value={data.fechaEntrega} onChange={(v) => handleChange('fechaEntrega', v)} />
                            <Field label="Calificación Final" value={data.resultadosFinales} onChange={(v) => handleChange('resultadosFinales', v)} />
                            <Field label="Aprobación del Periodo" type="select" options={['Aprobado', 'Extensión', 'No Aprobado']} value={data.aprobacionPeriodo} onChange={(v) => handleChange('aprobacionPeriodo', v)} />
                        </div>
                        <Field label="Observaciones Presentadas a Jefatura" type="textarea" value={data.observacionesJefatura} onChange={(v) => handleChange('observacionesJefatura', v)} />
                        <Field label="Recomendaciones Finales" type="textarea" value={data.recomendacionesFinales} onChange={(v) => handleChange('recomendacionesFinales', v)} />
                        {commonFields}
                    </div>
                )
            }
        }

        return commonFields
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col gap-1 mb-2">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{mes} • {semana}</p>
                <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{titulo}</h3>
                </div>
                <p className="text-muted-foreground text-sm font-medium">{descripcion}</p>
            </div>

            <Card className="w-full shadow-2xl border-white/5 rounded-3xl bg-card/40 backdrop-blur-sm overflow-hidden border">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-8 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                            <ClipboardCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-extrabold text-white tracking-tight">Formulario de Captura</CardTitle>
                            <CardDescription className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">
                                Registro de información operativa
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 pb-10 px-8 min-h-[450px]">
                    <div className="space-y-8 max-w-3xl mx-auto">
                        {renderFields()}
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
                        Alpha v0.1.0
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    )

}

export default EvaluacionSemanal
