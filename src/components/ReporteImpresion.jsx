import React from 'react'
import { useEvaluacion } from '../context/EvaluacionContext'
import { QRCodeSVG } from 'qrcode.react'
import logoImg from '../assets/image.png'

// ─── Celda de tabla institucional ────────────────────────────────────────────
const CampoTabla = ({ label, value, colSpan = 1 }) => (
    <td
        colSpan={colSpan}
        style={{
            border: '1px solid #000',
            padding: '4px 8px',
            verticalAlign: 'top',
        }}
    >
        <span style={{
            fontSize: '7px', fontWeight: '700', textTransform: 'uppercase',
            color: '#555', display: 'block', letterSpacing: '0.05em',
        }}>
            {label}
        </span>
        <span style={{
            fontSize: '11px', fontWeight: '600', display: 'block',
            marginTop: '2px', color: '#111',
        }}>
            {value || '—'}
        </span>
    </td>
)

// ─── Encabezado de sección formal ────────────────────────────────────────────
const SeccionTitulo = ({ titulo, subtitulo }) => (
    <div style={{ marginBottom: '10px', marginTop: '18px', pageBreakInside: 'avoid' }}>
        <div style={{
            background: '#1a1a2e', color: '#fff',
            padding: '5px 10px',
        }}>
            <span style={{
                fontSize: '9px', fontWeight: '800',
                textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
                {titulo}
            </span>
        </div>
        {subtitulo && (
            <div style={{
                background: '#f0f0f0', borderLeft: '4px solid #1a1a2e',
                padding: '3px 10px',
            }}>
                <span style={{ fontSize: '8px', color: '#555', fontStyle: 'italic' }}>{subtitulo}</span>
            </div>
        )}
    </div>
)

// ─── Fila de detalle con línea punteada ──────────────────────────────────────
const FilaDetalle = ({ label, value }) => {
    if (!value) return null
    return (
        <div style={{
            display: 'grid', gridTemplateColumns: '150px 1fr',
            gap: '0 8px', marginBottom: '5px', alignItems: 'baseline',
        }}>
            <span style={{
                fontSize: '8px', fontWeight: '700', textTransform: 'uppercase',
                color: '#666', letterSpacing: '0.04em',
            }}>
                {label}
            </span>
            <span style={{
                fontSize: '10px', color: '#111',
                borderBottom: '1px dotted #bbb',
                paddingBottom: '2px', lineHeight: '1.5',
            }}>
                {value}
            </span>
        </div>
    )
}

// ─── Bloque de texto largo ────────────────────────────────────────────────────
const BloqueTexto = ({ label, value, colorBorde = '#333' }) => {
    if (!value) return null
    return (
        <div style={{ marginBottom: '9px' }}>
            <p style={{
                fontSize: '8px', fontWeight: '700', textTransform: 'uppercase',
                color: '#555', letterSpacing: '0.05em', margin: '0 0 3px 0',
                borderLeft: `3px solid ${colorBorde}`, paddingLeft: '6px',
            }}>
                {label}
            </p>
            <p style={{
                fontSize: '10px', color: '#222', lineHeight: '1.6',
                background: '#f9f9f9', border: '1px solid #e0e0e0',
                padding: '5px 10px', margin: 0,
                borderLeft: `3px solid ${colorBorde}`,
            }}>
                {value}
            </p>
        </div>
    )
}

// ─── Bloque de 2 firmas (Asesor Manual + Supervisor Digital) ────────────────
const BloqueFirmas = ({ firmaSupervisor }) => (
    <div style={{
        marginTop: '10px', paddingTop: '8px',
        borderTop: '1px solid #ddd',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    }}>
        {/* FIRMA DEL ASESOR (MANUAL) */}
        <div>
            <div style={{ borderBottom: '1px solid #000', height: '36px', marginBottom: '3px' }} />
            <span style={{
                fontSize: '7px', color: '#666',
                textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
                Firma del Asesor / Colaborador
            </span>
        </div>

        {/* FIRMA DEL SUPERVISOR (DIGITAL) */}
        <div>
            {firmaSupervisor ? (
                <>
                    <img
                        src={firmaSupervisor}
                        alt="Firma Supervisor"
                        style={{ maxHeight: '48px', mixBlendMode: 'multiply', display: 'block', marginBottom: '3px' }}
                    />
                    <span style={{
                        fontSize: '7px', color: '#666',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                        Firma del Supervisor (Digital)
                    </span>
                </>
            ) : (
                <>
                    <div style={{ borderBottom: '1px solid #000', height: '36px', marginBottom: '3px' }} />
                    <span style={{
                        fontSize: '7px', color: '#666',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                        Firma del Supervisor
                    </span>
                </>
            )}
        </div>
    </div>
)

// ─── Mapa de etiquetas amigables ─────────────────────────────────────────────
const LABEL_MAP = {
    fechaMonitoreo: 'Fecha de Monitoreo',
    herramientaUtilizada: 'Herramienta Utilizada',
    hallazgosIdentificados: 'Hallazgos Identificados',
    retroalimentacion: 'Retroalimentación',
    observacionesSistemas: 'Observaciones de Sistemas',
    fechaEvaluacion: 'Fecha de Evaluación',
    tipoEvaluacion: 'Tipo de Evaluación',
    calificacion: 'Calificación',
    areasEvaluadas: 'Áreas Evaluadas',
    resultados: 'Resultados',
    fechaEstratificado: 'Fecha de Estratificado',
    nivelDesempeno: 'Nivel de Desempeño',
    analisisResultados: 'Análisis de Resultados',
    buenasPracticas: 'Buenas Prácticas',
    malasPracticas: 'Malas Prácticas',
    planMejora: 'Plan de Mejora',
    comparacionSemana2: 'Comparación con Semana 2',
    evolucionAsesor: 'Evolución del Asesor',
    efectividadAcciones: 'Efectividad de Acciones',
    fechaEscucha: 'Fecha de Escucha',
    asesorBench: 'Asesor Bench',
    criteriosReforzados: 'Criterios Reforzados',
    buenasPracticasObservadas: 'Buenas Prácticas Observadas',
    areasMejora: 'Áreas de Mejora',
    retencionInformacion: 'Retención de Información',
    aplicacionCorrecta: 'Aplicación Correcta',
    observaciones: 'Observaciones',
    fechaCapacitacion: 'Fecha de Capacitación',
    eLearningCompletado: 'E-Learning Completado',
    microCapsulas: 'Micro Cápsulas',
    puntosDolorAbordados: 'Puntos de Dolor Abordados',
    progresoObservado: 'Progreso Observado',
    mejoraDesempeno: 'Mejora en Desempeño',
    adherenciaProtocolos: 'Adherencia a Protocolos',
    resolucionConsultas: 'Resolución de Consultas',
    observacionesGenerales: 'Observaciones Generales',
    fechaTaller: 'Fecha del Taller',
    casosAnalizados: 'Casos Analizados',
    buenasPracticasAplicadas: 'Buenas Prácticas Aplicadas',
    oportunidadesMejora: 'Oportunidades de Mejora',
    observacionesTaller: 'Observaciones del Taller',
    fechaEstratificadoFinal: 'Fecha Estratificado Final',
    nivelDesempenoFinal: 'Nivel de Desempeño Final',
    analisisIntegral: 'Análisis Integral',
    monitoreosCompletados: 'Monitoreos Completados',
    evaluacionesCompletadas: 'Evaluaciones Completadas',
    madurezOperativa: 'Madurez Operativa',
    fechaEntrega: 'Fecha de Entrega',
    resultadosFinales: 'Resultados Finales',
    observacionesJefatura: 'Observaciones de Jefatura',
    aprobacionPeriodo: 'Aprobación del Período',
    recomendacionesFinales: 'Recomendaciones Finales',
}

const formatLabel = (key) =>
    LABEL_MAP[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

// ─── Componente Principal ─────────────────────────────────────────────────────
const ReporteImpresion = ({ mesesConfig }) => {
    const { evaluaciones, printConfig } = useEvaluacion()
    const { datosAsesor } = evaluaciones

    const tipoProceso = datosAsesor?.tipoProceso
    const printTipo = printConfig ? printConfig.tipo : tipoProceso
    const isPartitura = printTipo === 'partitura'
    const isIngresos = !isPartitura

    const hoy = new Date().toLocaleDateString('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    })

    const tituloFormulario = isPartitura
        ? 'BDI Reforzamiento Positivo — Oportunidad de Mejora'
        : 'Expediente de Desempeño — Nuevos Ingresos'

    const subtituloFormulario = isPartitura
        ? 'Período de Apoyo Operativo (4 Semanas) · Llamada de Atención'
        : 'Período de Adaptación y Certificación (90 Días · 12 Semanas)'

    return (
        <div
            className="hidden print:block"
            style={{
                fontFamily: "'Calibri', 'Arial', sans-serif",
                background: '#fff',
                color: '#000',
                // Padding propio para compensar @page margin: 0
                padding: '14mm 16mm 14mm 16mm',
                fontSize: '11px',
                lineHeight: '1.4',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
            }}
        >

            {/* ══════════════════════════════════════════════════
                ENCABEZADO INSTITUCIONAL — PRRHH07.FO-07
            ══════════════════════════════════════════════════ */}
            <table style={{
                width: '100%', borderCollapse: 'collapse',
                border: '2px solid #000', tableLayout: 'fixed',
            }}>
                <tbody>
                    <tr>
                        {/* Logo de la empresa */}
                        <td style={{
                            width: '20%', border: '1px solid #000',
                            padding: '6px 8px', verticalAlign: 'middle', textAlign: 'center',
                        }}>
                            <img
                                src={logoImg}
                                alt="Logo empresa"
                                style={{
                                    maxWidth: '100%', maxHeight: '52px',
                                    objectFit: 'contain', display: 'block', margin: '0 auto',
                                }}
                            />
                        </td>

                        {/* Título del formulario */}
                        <td style={{
                            border: '1px solid #000',
                            padding: '8px 14px', verticalAlign: 'middle', textAlign: 'center',
                        }}>
                            <div style={{
                                fontSize: '12px', fontWeight: '800',
                                textTransform: 'uppercase', letterSpacing: '0.03em',
                                lineHeight: '1.3', color: '#1a1a2e',
                            }}>
                                {tituloFormulario}
                            </div>
                            <div style={{ fontSize: '8px', color: '#555', marginTop: '4px', fontStyle: 'italic' }}>
                                {subtituloFormulario}
                            </div>
                        </td>

                        {/* Metadatos del documento */}
                        <td style={{
                            width: '21%', border: '1px solid #000',
                            padding: '0', verticalAlign: 'top',
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', height: '100%' }}>
                                <tbody>
                                    {[
                                        ['Código', 'PRRHH07.FO-07'],
                                        ['Versión', 'v2.2'],
                                        ['Fecha emisión', '07 / Mar / 2025'],
                                        ['Fecha impresión', hoy],
                                    ].map(([lbl, val]) => (
                                        <tr key={lbl}>
                                            <td style={{ border: '1px solid #ccc', padding: '3px 8px' }}>
                                                <span style={{
                                                    fontSize: '7px', fontWeight: '700',
                                                    textTransform: 'uppercase', color: '#666', display: 'block',
                                                }}>
                                                    {lbl}
                                                </span>
                                                <span style={{ fontSize: '9px', fontWeight: '800', color: '#111' }}>
                                                    {val}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ══════════════════════════════════════════════════
                SECCIÓN I — DATOS DEL COLABORADOR
            ══════════════════════════════════════════════════ */}
            <table style={{
                width: '100%', borderCollapse: 'collapse',
                border: '1px solid #000', borderTop: 'none', marginBottom: '14px',
            }}>
                <thead>
                    <tr>
                        <th colSpan={4} style={{
                            background: '#1a1a2e', color: '#fff',
                            padding: '4px 10px', textAlign: 'left',
                            fontSize: '8px', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                        }}>
                            Sección I — Datos del Colaborador
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <CampoTabla label="Nombre Completo del Colaborador" value={datosAsesor?.nombre} colSpan={2} />
                        <CampoTabla label="ID / Cédula del Empleado" value={datosAsesor?.cedula} />
                        <CampoTabla label="ID Expediente" value={datosAsesor?.idExpediente} />
                    </tr>
                    <tr>
                        <CampoTabla label="Campaña / Área" value={datosAsesor?.campania} />
                        <CampoTabla label="Supervisor Directo" value={datosAsesor?.supervisor} />
                        <CampoTabla label="Fecha de Inicio" value={datosAsesor?.fechaInicio} />
                        <CampoTabla
                            label="Tipo de Proceso"
                            value={isPartitura ? 'Reforzamiento Operativo (Partitura)' : 'Nuevos Ingresos (90 Días)'}
                        />
                    </tr>
                </tbody>
            </table>

            {/* ══════════════════════════════════════════════════
                SECCIÓN II — NUEVOS INGRESOS
            ══════════════════════════════════════════════════ */}
            {isIngresos && Object.entries(mesesConfig).map(([mesKey, config]) => {
                if (printConfig && printConfig.mes !== mesKey) return null

                return (
                    <div key={mesKey} style={{ marginBottom: '18px', pageBreakInside: 'avoid' }}>
                        <SeccionTitulo titulo={`Sección II — ${config.titulo}`} />

                        {config.semanas.map((semana) => {
                            if (printConfig && printConfig.semana !== semana.id) return null

                            const data = evaluaciones[mesKey]?.[semana.id] || {}
                            const keys = Object.keys(data).filter(k =>
                                k !== 'comentariosColaborador' && k !== 'firmaSemanal' && data[k]
                            )
                            if (keys.length === 0 && !data.comentariosColaborador && !data.firmaSemanal) return null

                            return (
                                <div key={semana.id} style={{
                                    border: '1px solid #ccc', marginBottom: '10px',
                                    pageBreakInside: 'avoid',
                                }}>
                                    {/* Sub-encabezado semana */}
                                    <div style={{
                                        background: '#f0f0f0', borderBottom: '1px solid #ccc',
                                        padding: '4px 10px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <span style={{
                                            fontSize: '9px', fontWeight: '800',
                                            textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a1a2e',
                                        }}>
                                            {semana.titulo}
                                        </span>
                                        <span style={{ fontSize: '8px', color: '#666', fontStyle: 'italic' }}>
                                            {semana.descripcion}
                                        </span>
                                    </div>

                                    <div style={{ padding: '10px 12px' }}>
                                        <div style={{
                                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                                            gap: '5px 20px', marginBottom: '8px',
                                        }}>
                                            {keys.map(key => (
                                                <FilaDetalle key={key} label={formatLabel(key)} value={data[key]} />
                                            ))}
                                        </div>

                                        {data.comentariosColaborador && (
                                            <BloqueTexto
                                                label="Comentarios del Colaborador"
                                                value={`"${data.comentariosColaborador}"`}
                                                colorBorde="#888"
                                            />
                                        )}

                                        <BloqueFirmas firmaSupervisor={data.firmaSemanal} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}

            {/* ══════════════════════════════════════════════════
                SECCIÓN II — PARTITURA
            ══════════════════════════════════════════════════ */}
            {isPartitura && evaluaciones.partitura && (
                <div style={{ marginBottom: '18px' }}>
                    <SeccionTitulo
                        titulo="Sección II — Bitácora de Reforzamiento Positivo / Oportunidad de Mejora"
                        subtitulo="Período de Apoyo Operativo — 4 Semanas"
                    />

                    {['semana1', 'semana2', 'semana3', 'semana4'].map((semana) => {
                        if (printConfig && printConfig.semana !== semana) return null

                        const data = evaluaciones.partitura?.[semana] || {}
                        const hasData = Object.values(data).some(v => v && v !== '')
                        if (!hasData) return null

                        const numSemana = semana.replace('semana', 'Semana ')

                        return (
                            <div key={semana} style={{
                                border: '1px solid #000', marginBottom: '14px',
                                pageBreakInside: 'avoid',
                            }}>
                                {/* Encabezado semana Partitura */}
                                <div style={{
                                    background: '#1a1a2e', color: '#fff',
                                    padding: '5px 12px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <span style={{
                                        fontSize: '9px', fontWeight: '800',
                                        textTransform: 'uppercase', letterSpacing: '0.1em',
                                    }}>
                                        {numSemana} — Reforzamiento Operativo
                                    </span>
                                    {(data.fechaInicio || data.fechaFin) && (
                                        <span style={{ fontSize: '8px', opacity: 0.85 }}>
                                            Período: {data.fechaInicio || '—'} al {data.fechaFin || '—'}
                                        </span>
                                    )}
                                </div>

                                <div style={{ padding: '10px 12px' }}>
                                    {/* Tabla de métricas */}
                                    <table style={{
                                        width: '100%', borderCollapse: 'collapse',
                                        marginBottom: '10px', border: '1px solid #ddd',
                                    }}>
                                        <thead>
                                            <tr style={{ background: '#f5f5f5' }}>
                                                {['Meta AHT', 'Resultado AHT', 'Meta Calidad', 'Resultado Calidad', 'ID NQC', 'ID Llamada'].map(h => (
                                                    <th key={h} style={{
                                                        border: '1px solid #ddd', padding: '3px 6px',
                                                        fontSize: '7px', fontWeight: '700',
                                                        textTransform: 'uppercase', color: '#555',
                                                        letterSpacing: '0.04em', textAlign: 'center',
                                                    }}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {[data.metaAHT, data.resultadoAHT, data.metaCalidad, data.resultadoCalidad, data.idNQC, data.idLlamada].map((val, i) => (
                                                    <td key={i} style={{
                                                        border: '1px solid #ddd', padding: '4px 6px',
                                                        fontSize: '10px', fontWeight: '700',
                                                        textAlign: 'center', color: '#111',
                                                    }}>
                                                        {val || '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Hallazgos y Retroalimentación */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                                        <BloqueTexto label="Hallazgos del Monitoreo" value={data.hallazgos} colorBorde="#c0392b" />
                                        <BloqueTexto label="Retroalimentación Otorgada" value={data.retroalimentacion} colorBorde="#27ae60" />
                                    </div>

                                    {/* Coaching */}
                                    {(data.temaCoaching || data.observacionesCoaching) && (
                                        <div style={{
                                            border: '1px solid #bcd', background: '#f4f8ff',
                                            padding: '7px 10px', marginBottom: '8px',
                                        }}>
                                            <p style={{
                                                fontSize: '7px', fontWeight: '800',
                                                textTransform: 'uppercase', color: '#2c6fad',
                                                letterSpacing: '0.08em', margin: '0 0 5px 0',
                                            }}>
                                                ▸ Sesión de Coaching
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                                <FilaDetalle label="Tema" value={data.temaCoaching} />
                                                <FilaDetalle label="Observaciones" value={data.observacionesCoaching} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Causa Raíz y Compromisos */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                                        <BloqueTexto label="Causa Raíz Identificada" value={data.causaRaiz} colorBorde="#e67e22" />
                                        <BloqueTexto label="Compromisos Adquiridos" value={data.compromisos} colorBorde="#8e44ad" />
                                    </div>

                                    {/* Firmas: Asesor + Supervisor únicamente */}
                                    <BloqueFirmas firmaSupervisor={data.firmaSemanal} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                PIE DE PÁGINA — QR + METADATOS
            ══════════════════════════════════════════════════ */}
            <div style={{
                borderTop: '2px solid #1a1a2e',
                marginTop: '14px', paddingTop: '9px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            }}>
                <div style={{ flex: 1 }}>
                    <p style={{
                        fontSize: '7px', fontWeight: '700', color: '#333',
                        textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px 0',
                    }}>
                        PRRHH07.FO-07 · v2.2 · Documento generado digitalmente — Sistema EDA
                    </p>
                    <p style={{ fontSize: '7px', color: '#888', margin: 0 }}>
                        Válido únicamente con firma del supervisor y del asesor evaluado.
                    </p>
                </div>

                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '3px', marginLeft: '14px',
                }}>
                    <QRCodeSVG
                        value={`[PRRHH07.FO-07] ID:${datosAsesor?.idExpediente || 'N/A'} | ${datosAsesor?.nombre || 'N/A'} | ${datosAsesor?.campania || 'N/A'} | ${tipoProceso === 'partitura' ? 'Partitura' : 'Nuevos Ingresos'} | ${hoy}`}
                        size={64}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#1a1a2e"
                    />
                    <p style={{
                        fontSize: '6px', color: '#999',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        margin: 0, textAlign: 'center',
                    }}>
                        Verificar documento
                    </p>
                </div>
            </div>

        </div>
    )
}

export default ReporteImpresion
