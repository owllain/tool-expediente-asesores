import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useEvaluacion } from '../context/EvaluacionContext'
import { motion } from 'framer-motion'
import { UserPlus, IdCard, Briefcase, Users, Calendar } from 'lucide-react'

const RegistroAsesor = () => {
    const { evaluaciones, updateDatosAsesor } = useEvaluacion()
    const { datosAsesor } = evaluaciones

    const handleChange = (field, value) => {
        updateDatosAsesor({ [field]: value })
    }

    const fields = [
        { id: 'nombre', label: 'Nombre Completo del Asesor', icon: UserPlus, placeholder: 'Ej. Roberto Gómez' },
        { id: 'cedula', label: 'Cédula / ID Personal', icon: IdCard, placeholder: 'Ej. 12345678', type: 'number' },
        { id: 'campania', label: 'Proyecto', icon: Briefcase, placeholder: 'Ej. Ventas Móvil' },
        { id: 'supervisor', label: 'Supervisor', icon: Users, placeholder: 'Ej. Martha Salas' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-3xl mx-auto pb-10"
        >
            <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Registro Inicial</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">Información del Asesor</h3>
                <p className="text-muted-foreground text-sm font-medium">Capture los datos base para iniciar el proceso de seguimiento</p>
            </div>

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

                <CardContent className="pt-8 pb-10 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        {fields.map((field) => {
                            const Icon = field.icon
                            return (
                                <div key={field.id} className="space-y-2">
                                    <label className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-2">
                                        <Icon className="h-3 w-3 text-primary" />
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type || "text"}
                                        value={datosAsesor?.[field.id] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (field.id === 'cedula') {
                                                // Solo permitir números
                                                if (/^\d*$/.test(val)) {
                                                    handleChange(field.id, val);
                                                }
                                            } else {
                                                handleChange(field.id, val);
                                            }
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 italic">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <p className="text-xs">Fecha de Inicio de Proceso: <span className="text-white font-bold">{datosAsesor.fechaInicio}</span></p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-black/20 border-t border-white/5 p-6 flex justify-center">
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                        Los cambios se guardan automáticamente
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default RegistroAsesor
