import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const EvaluacionContext = createContext()

export const useEvaluacion = () => {
    const context = useContext(EvaluacionContext)
    if (!context) {
        throw new Error('useEvaluacion must be used within EvaluacionProvider')
    }
    return context
}

const initialState = {
    mes1: {
        semana1: { fechaMonitoreo: '', herramientaUtilizada: '', hallazgosIdentificados: '', retroalimentacion: '', observacionesSistemas: '', comentariosColaborador: '' },
        semana2: { fechaEvaluacion: '', tipoEvaluacion: '', calificacion: '', areasEvaluadas: '', resultados: '', comentariosColaborador: '' },
        semana3: { fechaEstratificado: '', nivelDesempeno: '', analisisResultados: '', buenasPracticas: '', malasPracticas: '', planMejora: '', comentariosColaborador: '' },
        semana4: { fechaEvaluacion: '', calificacion: '', comparacionSemana2: '', evolucionAsesor: '', efectividadAcciones: '', comentariosColaborador: '' },
    },
    mes2: {
        semana1: { fechaEscucha: '', asesorBench: '', criteriosReforzados: '', buenasPracticasObservadas: '', areasMejora: '', comentariosColaborador: '' },
        semana2: { fechaEvaluacion: '', calificacion: '', retencionInformacion: '', aplicacionCorrecta: '', observaciones: '', comentariosColaborador: '' },
        semana3: { fechaCapacitacion: '', eLearningCompletado: '', microCapsulas: '', puntosDolorAbordados: '', progresoObservado: '', comentariosColaborador: '' },
        semana4: { fechaMonitoreo: '', mejoraDesempeno: '', adherenciaProtocolos: '', resolucionConsultas: '', observacionesGenerales: '', comentariosColaborador: '' },
    },
    mes3: {
        semana1: { fechaTaller: '', casosAnalizados: '', buenasPracticasAplicadas: '', oportunidadesMejora: '', observacionesTaller: '', comentariosColaborador: '' },
        semana2: { observacionesGenerales: '', comentariosColaborador: '' },
        semana3: { fechaEstratificadoFinal: '', nivelDesempenoFinal: '', analisisIntegral: '', monitoreosCompletados: '', evaluacionesCompletadas: '', madurezOperativa: '', comentariosColaborador: '' },
        semana4: { fechaEntrega: '', resultadosFinales: '', observacionesJefatura: '', aprobacionPeriodo: '', recomendacionesFinales: '', comentariosColaborador: '' },
    },
    firmaFinal: {
        nombreEvaluador: '', cargoEvaluador: '', firmaEvaluador: null, fechaFirma: '', comentariosFinalesColaborador: '', firmaColaborador: null,
    },
    datosAsesor: {
        nombre: '', cedula: '', campania: '', supervisor: '', fechaInicio: new Date().toLocaleDateString(),
    }
}

export const EvaluacionProvider = ({ children }) => {
    const [evaluaciones, setEvaluaciones] = useState(() => {
        const saved = localStorage.getItem('expediente-asesor-data')
        if (saved) {
            const parsed = JSON.parse(saved)
            return { ...initialState, ...parsed, datosAsesor: parsed.datosAsesor || initialState.datosAsesor }
        }
        return initialState
    })

    useEffect(() => {
        localStorage.setItem('expediente-asesor-data', JSON.stringify(evaluaciones))
    }, [evaluaciones])

    const updateEvaluacion = (mes, semana, data) => {
        setEvaluaciones((prev) => ({
            ...prev,
            [mes]: { ...prev[mes], [semana]: { ...prev[mes][semana], ...data } },
        }))
    }

    const updateFirmaFinal = (data) => {
        setEvaluaciones((prev) => ({ ...prev, firmaFinal: { ...prev.firmaFinal, ...data } }))
    }

    const updateDatosAsesor = (data) => {
        setEvaluaciones((prev) => ({ ...prev, datosAsesor: { ...prev.datosAsesor, ...data } }))
    }

    const exportData = () => {
        const nombreSaneado = (evaluaciones.datosAsesor?.nombre || 'Expediente').trim().replace(/\s+/g, '_').toLowerCase()
        const fecha = new Date().toISOString().split('T')[0]
        const dataStr = JSON.stringify(evaluaciones, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `expediente_${nombreSaneado}_${fecha}.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    const importData = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result)
                    setEvaluaciones(data)
                    resolve(data)
                } catch (error) { reject(error) }
            }
            reader.onerror = reject
            reader.readAsText(file)
        })
    }

    const resetData = () => {
        setEvaluaciones(initialState)
        localStorage.removeItem('expediente-asesor-data')
    }

    // --- CÁLCULOS DINÁMICOS PARA EL DASHBOARD ---

    const stats = useMemo(() => {
        let totalCalificadas = 0
        let sumaCalificaciones = 0
        let semanasConAlgo = 0
        const completionByWeek = []

        const levelsMap = { 'Excelente': 100, 'Bueno': 85, 'Regular': 70, 'Bajo': 50 }

        for (let m = 1; m <= 3; m++) {
            const mesKey = `mes${m}`
            for (let s = 1; s <= 4; s++) {
                const semKey = `semana${s}`
                const data = evaluaciones[mesKey][semKey]

                // Calcular grado de cumplimiento del formulario (progreso de llenado)
                const relevantFields = Object.keys(data).filter(k => k !== 'comentariosColaborador')
                const filledFields = relevantFields.filter(k => data[k] && data[k] !== '').length
                const progress = Math.round((filledFields / relevantFields.length) * 100)

                completionByWeek.push(progress)

                const hasData = filledFields > 0
                if (hasData) semanasConAlgo++

                // Extraer puntuación para el promedio
                let score = null
                if (data.calificacion && !isNaN(data.calificacion)) {
                    score = parseFloat(data.calificacion)
                } else if (data.nivelDesempeno && levelsMap[data.nivelDesempeno]) {
                    score = levelsMap[data.nivelDesempeno]
                } else if (data.nivelDesempenoFinal && levelsMap[data.nivelDesempenoFinal]) {
                    score = levelsMap[data.nivelDesempenoFinal]
                }

                if (score !== null) {
                    totalCalificadas++
                    sumaCalificaciones += score
                }
            }
        }

        const promedio = totalCalificadas > 0 ? Math.round(sumaCalificaciones / totalCalificadas) : 0
        const cumplimiento = Math.round((semanasConAlgo / 12) * 100)

        // Próximos pasos
        let proximoPaso = "Completar Registro"
        let statusAsesor = "Pendiente de Inicio"

        if (!evaluaciones.datosAsesor.nombre) {
            proximoPaso = "Registrar datos del asesor"
            statusAsesor = "Registro incompleto"
        } else {
            let foundNext = false
            let weekCounter = 0
            for (let m = 1; m <= 3; m++) {
                for (let s = 1; s <= 4; s++) {
                    weekCounter++
                    const data = evaluaciones[`mes${m}`][`semana${s}`]
                    const hasData = Object.keys(data).some(k => k !== 'comentariosColaborador' && data[k] !== '')
                    if (!hasData && !foundNext) {
                        proximoPaso = `Completar Evaluación Mes ${m} - Semana ${s}`
                        statusAsesor = `En proceso: Mes ${m}`
                        foundNext = true
                    }
                }
            }
            if (!foundNext) {
                if (!evaluaciones.firmaFinal.firmaEvaluador) {
                    proximoPaso = "Firmar y certificar expediente"
                    statusAsesor = "Esperando certificación"
                } else {
                    proximoPaso = "Proceso completado exitosamente"
                    statusAsesor = "Certificado / Autónomo"
                }
            }
        }

        return {
            promedioGlobal: `${promedio}%`,
            cumplimientoTotal: `${cumplimiento}%`,
            totalEvaluaciones: semanasConAlgo,
            alertasPendientes: 12 - semanasConAlgo,
            completionByWeek,
            proximoPaso,
            statusAsesor
        }
    }, [evaluaciones])

    return (
        <EvaluacionContext.Provider
            value={{
                evaluaciones,
                updateEvaluacion,
                updateFirmaFinal,
                exportData,
                importData,
                resetData,
                updateDatosAsesor,
                ...stats
            }}
        >
            {children}
        </EvaluacionContext.Provider>
    )
}
