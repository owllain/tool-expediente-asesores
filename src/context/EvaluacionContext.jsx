import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const EvaluacionContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useEvaluacion = () => {
    const context = useContext(EvaluacionContext)
    if (!context) {
        throw new Error('useEvaluacion must be used within EvaluacionProvider')
    }
    return context
}

const initialState = {
    mes1: {
        semana1: { fechaMonitoreo: '', herramientaUtilizada: '', hallazgosIdentificados: '', retroalimentacion: '', observacionesSistemas: '', comentariosColaborador: '', firmaSemanal: null },
        semana2: { fechaEvaluacion: '', tipoEvaluacion: '', calificacion: '', areasEvaluadas: '', resultados: '', comentariosColaborador: '', firmaSemanal: null },
        semana3: { fechaEstratificado: '', nivelDesempeno: '', analisisResultados: '', buenasPracticas: '', malasPracticas: '', planMejora: '', comentariosColaborador: '', firmaSemanal: null },
        semana4: { fechaEvaluacion: '', calificacion: '', comparacionSemana2: '', evolucionAsesor: '', efectividadAcciones: '', comentariosColaborador: '', firmaSemanal: null },
    },
    mes2: {
        semana1: { fechaEscucha: '', asesorBench: '', criteriosReforzados: '', buenasPracticasObservadas: '', areasMejora: '', comentariosColaborador: '', firmaSemanal: null },
        semana2: { fechaEvaluacion: '', calificacion: '', retencionInformacion: '', aplicacionCorrecta: '', observaciones: '', comentariosColaborador: '', firmaSemanal: null },
        semana3: { fechaCapacitacion: '', eLearningCompletado: '', microCapsulas: '', puntosDolorAbordados: '', progresoObservado: '', comentariosColaborador: '', firmaSemanal: null },
        semana4: { fechaMonitoreo: '', mejoraDesempeno: '', adherenciaProtocolos: '', resolucionConsultas: '', observacionesGenerales: '', comentariosColaborador: '', firmaSemanal: null },
    },
    mes3: {
        semana1: { fechaTaller: '', casosAnalizados: '', buenasPracticasAplicadas: '', oportunidadesMejora: '', observacionesTaller: '', comentariosColaborador: '', firmaSemanal: null },
        semana2: { observacionesGenerales: '', comentariosColaborador: '', firmaSemanal: null },
        semana3: { fechaEstratificadoFinal: '', nivelDesempenoFinal: '', analisisIntegral: '', monitoreosCompletados: '', evaluacionesCompletadas: '', madurezOperativa: '', comentariosColaborador: '', firmaSemanal: null },
        semana4: { fechaEntrega: '', resultadosFinales: '', observacionesJefatura: '', aprobacionPeriodo: '', recomendacionesFinales: '', comentariosColaborador: '', firmaSemanal: null },
    },
    partitura: {
        semana1: { fechaInicio: '', fechaFin: '', metaAHT: '', resultadoAHT: '', metaCalidad: '', resultadoCalidad: '', idNQC: '', idLlamada: '', hallazgos: '', retroalimentacion: '', temaCoaching: '', observacionesCoaching: '', causaRaiz: '', compromisos: '', firmaSemanal: null },
        semana2: { fechaInicio: '', fechaFin: '', metaAHT: '', resultadoAHT: '', metaCalidad: '', resultadoCalidad: '', idNQC: '', idLlamada: '', hallazgos: '', retroalimentacion: '', temaCoaching: '', observacionesCoaching: '', causaRaiz: '', compromisos: '', firmaSemanal: null },
        semana3: { fechaInicio: '', fechaFin: '', metaAHT: '', resultadoAHT: '', metaCalidad: '', resultadoCalidad: '', idNQC: '', idLlamada: '', hallazgos: '', retroalimentacion: '', temaCoaching: '', observacionesCoaching: '', causaRaiz: '', compromisos: '', firmaSemanal: null },
        semana4: { fechaInicio: '', fechaFin: '', metaAHT: '', resultadoAHT: '', metaCalidad: '', resultadoCalidad: '', idNQC: '', idLlamada: '', hallazgos: '', retroalimentacion: '', temaCoaching: '', observacionesCoaching: '', causaRaiz: '', compromisos: '', firmaSemanal: null },
    },
    datosAsesor: {
        nombre: '', cedula: '', campania: '', supervisor: '', fechaInicio: new Date().toLocaleDateString(), tipoProceso: '', idExpediente: ''
    }
}

export const EvaluacionProvider = ({ children }) => {
    const [evaluaciones, setEvaluaciones] = useState(() => {
        const saved = localStorage.getItem('expediente-asesor-data')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                return {
                    ...initialState,
                    ...parsed,
                    datosAsesor: { ...initialState.datosAsesor, ...(parsed.datosAsesor || {}) },
                    partitura: { ...initialState.partitura, ...(parsed.partitura || {}) },
                    mes1: { ...initialState.mes1, ...(parsed.mes1 || {}) },
                    mes2: { ...initialState.mes2, ...(parsed.mes2 || {}) },
                    mes3: { ...initialState.mes3, ...(parsed.mes3 || {}) }
                }
            } catch (err) {
                console.error("Local Storage parsing failed", err)
                return initialState
            }
        }
        return initialState
    })

    const [printConfig, setPrintConfig] = useState(null)

    const [expedientesLocales, setExpedientesLocales] = useState(() => {
        const saved = localStorage.getItem('eda-multisession')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('expediente-asesor-data', JSON.stringify(evaluaciones))
        
        const currentId = evaluaciones.datosAsesor?.idExpediente
        if (currentId) {
            // eslint-disable-next-line
            setExpedientesLocales(prev => {
                const index = prev.findIndex(e => e.datosAsesor?.idExpediente === currentId)
                let newArray = [...prev]
                if (index >= 0) {
                    newArray[index] = evaluaciones
                } else {
                    newArray.push(evaluaciones)
                }
                localStorage.setItem('eda-multisession', JSON.stringify(newArray))
                return newArray
            })
        }
    }, [evaluaciones])

    const loadExpedienteLocal = (id) => {
        const target = expedientesLocales.find(e => e.datosAsesor?.idExpediente === id)
        if (target) {
            setEvaluaciones(target)
        }
    }

    const deleteExpedienteLocal = (id) => {
        setExpedientesLocales(prev => {
            const newArray = prev.filter(e => e.datosAsesor?.idExpediente !== id)
            localStorage.setItem('eda-multisession', JSON.stringify(newArray))
            return newArray
        })
        if (evaluaciones.datosAsesor?.idExpediente === id) {
             setEvaluaciones(initialState)
             localStorage.removeItem('expediente-asesor-data')
        }
    }

    const updateEvaluacion = (mes, semana, data) => {
        setEvaluaciones((prev) => ({
            ...prev,
            [mes]: { ...prev[mes], [semana]: { ...prev[mes][semana], ...data } },
        }))
    }

    const updatePartitura = (semana, data) => {
        setEvaluaciones((prev) => ({
            ...prev,
            partitura: { ...prev.partitura, [semana]: { ...prev.partitura[semana], ...data } },
        }))
    }

    const updateDatosAsesor = (data) => {
        setEvaluaciones((prev) => ({ ...prev, datosAsesor: { ...prev.datosAsesor, ...data } }))
    }

    const exportData = () => {
        const nombreSaneado = (evaluaciones.datosAsesor?.nombre || 'Expediente').trim().replace(/\s+/g, '_').toLowerCase()
        const id = evaluaciones.datosAsesor?.idExpediente || (evaluaciones.datosAsesor?.tipoProceso === 'partitura' ? 'PT-0000' : 'NI-0000')
        const fecha = new Date().toISOString().split('T')[0]
        const dataStr = JSON.stringify(evaluaciones, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `EXP_${id}_${nombreSaneado}_${fecha}.json`
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
        let partituraSemanas = 0
        const completionByWeek = []

        const levelsMap = { 'Excelente': 100, 'Bueno': 85, 'Regular': 70, 'Bajo': 50 }
        const tipoProceso = evaluaciones.datosAsesor?.tipoProceso

        if (tipoProceso !== 'partitura') {
            // Nuevos Ingresos (12 semanas) - Default behavior if empty
            for (let m = 1; m <= 3; m++) {
                const mesKey = `mes${m}`
                for (let s = 1; s <= 4; s++) {
                    const semKey = `semana${s}`
                    const data = evaluaciones[mesKey]?.[semKey] || {}

                    const relevantFields = Object.keys(data).filter(k => k !== 'comentariosColaborador' && k !== 'firmaSemanal')
                    const filledFields = relevantFields.filter(k => data[k] && data[k] !== '').length
                    const progress = Math.round((filledFields / relevantFields.length) * 100)

                    completionByWeek.push({ type: 'ingresos', progress })
                    if (filledFields > 0) semanasConAlgo++

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
        }

        if (tipoProceso === 'partitura') {
            // Partitura (4 semanas)
            for (let s = 1; s <= 4; s++) {
                const semKey = `semana${s}`
                const data = evaluaciones.partitura?.[semKey] || {}
                const relevantFields = Object.keys(data).filter(k => k !== 'firmaSemanal')
                const filledFields = relevantFields.filter(k => data[k] && data[k] !== '').length
                const progress = relevantFields.length > 0 ? Math.round((filledFields / relevantFields.length) * 100) : 0
                
                completionByWeek.push({ type: 'partitura', progress })
                if (filledFields > 0) partituraSemanas++
            }
        }

        const promedio = totalCalificadas > 0 ? Math.round(sumaCalificaciones / totalCalificadas) : 0
        const divisor = tipoProceso === 'partitura' ? 4 : 12
        const avanceGlobal = semanasConAlgo + partituraSemanas
        const cumplimiento = Math.round((avanceGlobal / divisor) * 100)

        let proximoPaso = "Registrar tipo de Expediente"
        let statusAsesor = "Sin Expediente Activo"

        if (!evaluaciones.datosAsesor?.nombre || !tipoProceso) {
            proximoPaso = "Crear Nuevo Expediente desde el Registro"
            statusAsesor = "En Espera"
        } else {
            let foundNext = false
            if (tipoProceso !== 'partitura') {
                for (let m = 1; m <= 3; m++) {
                    for (let s = 1; s <= 4; s++) {
                        const data = evaluaciones[`mes${m}`]?.[`semana${s}`] || {}
                        const hasData = Object.keys(data).some(k => k !== 'comentariosColaborador' && k !== 'firmaSemanal' && data[k] && data[k] !== '')
                        if (!hasData && !foundNext) {
                            proximoPaso = `Documentar Semana ${(m - 1) * 4 + s} de Nuevos Ingresos`
                            statusAsesor = `Ingresos Activo (Mes ${m})`
                            foundNext = true
                        }
                    }
                }
            } else {
                for (let s = 1; s <= 4; s++) {
                    const data = evaluaciones.partitura?.[`semana${s}`] || {}
                    const hasData = Object.keys(data).some(k => k !== 'firmaSemanal' && data[k] && data[k] !== '')
                    if (!hasData && !foundNext) {
                        proximoPaso = `Llenar Formato de Semana ${s} (Partitura)`
                        statusAsesor = `Periodo de Apoyo en Curso`
                        foundNext = true
                    }
                }
            }

            if (!foundNext) {
                proximoPaso = "Bitácora Finalizada Totalmente"
                statusAsesor = tipoProceso === 'partitura' ? "Partitura Completada" : "3 Meses Completados (Autónomo)"
            }
        }

        return {
            promedioGlobal: `${promedio}%`,
            cumplimientoTotal: `${cumplimiento}%`,
            totalEvaluaciones: avanceGlobal,
            alertasPendientes: Math.max(0, divisor - avanceGlobal),
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
                updatePartitura,
                exportData,
                importData,
                resetData,
                updateDatosAsesor,
                printConfig,
                setPrintConfig,
                expedientesLocales,
                loadExpedienteLocal,
                deleteExpedienteLocal,
                ...stats
            }}
        >
            {children}
        </EvaluacionContext.Provider>
    )
}
