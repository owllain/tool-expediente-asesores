import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useEvaluacion } from '../context/EvaluacionContext'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { UserPlus, IdCard, Briefcase, Users, Calendar, Save, CheckCircle, AlertCircle, Lock } from 'lucide-react'

const RegistroAsesor = () => {
    const { evaluaciones, updateDatosAsesor } = useEvaluacion()
    const { datosAsesor } = evaluaciones

    // Estado local de formulario — desacoplado del contexto global hasta guardar
    const [form, setForm] = useState({
        nombre: datosAsesor?.nombre || '',
        cedula: datosAsesor?.cedula || '',
        campania: datosAsesor?.campania || '',
        supervisor: datosAsesor?.supervisor || '',
        tipoProceso: datosAsesor?.tipoProceso || '',
    })
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const expedienteExistente = datosAsesor?.idExpediente
    const isLocked = !!expedienteExistente

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
        setSaved(false)
        setError('')
    }

    const handleGuardar = () => {
        if (!form.nombre.trim()) return setError('El nombre del asesor es obligatorio.')
        if (!form.tipoProceso) return setError('Debes seleccionar el tipo de proceso.')

        const prefix = form.tipoProceso === 'partitura' ? 'PT' : 'NI'
        // Solo genera nuevo ID si no existía uno previo o si el tipo de proceso cambió
        const idActual = datosAsesor?.idExpediente
        const tipoAnterior = datosAsesor?.tipoProceso
        const necesitaNuevoId = !idActual || (tipoAnterior && tipoAnterior !== form.tipoProceso)

        const nuevoId = necesitaNuevoId
            ? `EXP-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
            : idActual

        updateDatosAsesor({
            ...form,
            idExpediente: nuevoId,
            fechaInicio: datosAsesor?.fechaInicio || new Date().toLocaleDateString(),
        })
        setSaved(true)
        setError('')
    }

    const handleNuevoExpediente = () => {
        if (!window.confirm('¿Iniciar un expediente completamente nuevo? El registro actual se mantendrá en "Mis Expedientes" si ya fue guardado.')) return
        setForm({ nombre: '', cedula: '', campania: '', supervisor: '', tipoProceso: '' })
        setSaved(false)
        setError('')
        updateDatosAsesor({ nombre: '', cedula: '', campania: '', supervisor: '', tipoProceso: '', idExpediente: '' })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-3xl mx-auto pb-10"
        >
            <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Registro Inicial</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">Registro de Expediente</h3>
                <p className="text-muted-foreground text-sm font-medium">Complete los datos base y presione <strong>"Guardar Expediente"</strong> para iniciar el seguimiento.</p>
            </div>

            {/* Banner de expediente activo */}
            {expedienteExistente && (
                <div className="flex items-center gap-4 bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest">Expediente Activo</p>
                        <p className="text-sm text-white font-bold mt-0.5">{datosAsesor?.nombre || 'Sin nombre'}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{expedienteExistente}</p>
                    </div>
                    <button
                        onClick={handleNuevoExpediente}
                        className="text-[10px] font-bold text-muted-foreground hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                    >
                        + Nuevo Expediente
                    </button>
                </div>
            )}

            <Card className="w-full shadow-2xl border-white/5 rounded-3xl bg-card/40 backdrop-blur-sm overflow-hidden border">
                <CardHeader className="bg-white/5 border-b border-white/5 pb-8 pt-8 px-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-extrabold text-white tracking-tight">Datos Generales</CardTitle>
                            <CardDescription className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">
                                Estos datos aparecerán en todos los reportes
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 pb-10 px-8 space-y-8">
                    {/* Tipo de Proceso */}
                    <div className="p-6 bg-secondary/10 rounded-2xl border border-primary/20">
                        <label className="text-sm font-bold text-white/90 uppercase tracking-wider flex items-center gap-2 mb-3">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Tipo de Proceso
                        </label>
                        <select
                            value={form.tipoProceso}
                            onChange={(e) => handleFormChange('tipoProceso', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
                        >
                            <option value="" className="bg-card text-muted-foreground">Seleccione el flujo operativo...</option>
                            <option value="ingresos" className="bg-card text-white">Nuevos Ingresos (Plan 3 Meses)</option>
                            <option value="partitura" className="bg-card text-white">Reforzamiento Operativo / Partitura (Plan 4 Semanas)</option>
                        </select>
                        {form.tipoProceso && (
                            <p className="text-[10px] text-primary/70 mt-3 font-bold uppercase tracking-widest">
                                ✓ Prefijo de ID: {form.tipoProceso === 'partitura' ? 'EXP-PT-XXXX' : 'EXP-NI-XXXX'}
                            </p>
                        )}
                        {isLocked && form.tipoProceso !== datosAsesor?.tipoProceso && (
                            <p className="text-[10px] text-amber-400 mt-2 font-bold">
                                ⚠ Cambiar el tipo de proceso generará un nuevo ID de expediente al guardar.
                            </p>
                        )}
                    </div>

                    {/* Campos del formulario */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {[
                            { id: 'nombre', label: 'Nombre Completo del Asesor', icon: UserPlus, placeholder: 'Ej. Roberto Gómez' },
                            { id: 'cedula', label: 'Cédula / ID Personal', icon: IdCard, placeholder: 'Ej. 12345678', type: 'number' },
                            { id: 'campania', label: 'Proyecto / Campaña', icon: Briefcase, placeholder: 'Ej. Ventas Móvil' },
                            { id: 'supervisor', label: 'Supervisor', icon: Users, placeholder: 'Ej. Martha Salas' },
                        ].map((field) => {
                            const Icon = field.icon
                            return (
                                <div key={field.id} className="space-y-2">
                                    <label className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
                                        <Icon className="h-3 w-3 text-primary" />
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type || 'text'}
                                        value={form[field.id]}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (field.id === 'cedula' && !/^\d*$/.test(val)) return
                                            handleFormChange(field.id, val)
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-primary outline-none hover:bg-black/30 transition-all placeholder:text-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* Fecha de inicio */}
                    <div className="flex items-center gap-3 text-muted-foreground italic">
                        <Calendar className="h-4 w-4" />
                        <p className="text-xs">Fecha de Inicio: <span className="text-white font-bold">{datosAsesor?.fechaInicio || new Date().toLocaleDateString()}</span></p>
                    </div>

                    {/* Mensajes de estado */}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                            <p className="text-sm text-red-400 font-medium">{error}</p>
                        </div>
                    )}
                    {saved && (
                        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                            <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                            <div>
                                <p className="text-sm text-green-400 font-bold">Expediente guardado correctamente</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">ID: {datosAsesor?.idExpediente}</p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="bg-black/20 border-t border-white/5 p-6 flex justify-between items-center gap-4">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                        El ID se genera al guardar
                    </p>
                    <Button
                        onClick={handleGuardar}
                        className="flex items-center gap-2 px-6 py-3 h-auto rounded-xl shadow-lg shadow-primary/20 font-bold"
                    >
                        <Save className="h-4 w-4" />
                        Guardar Expediente
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default RegistroAsesor
