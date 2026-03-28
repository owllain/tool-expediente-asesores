import React, { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useEvaluacion } from '../context/EvaluacionContext'
import { motion } from 'framer-motion'
import { PenTool, CheckCircle2 } from 'lucide-react'

const FirmaFinal = () => {
    const { evaluaciones, updateFirmaFinal } = useEvaluacion()
    const sigCanvas = useRef(null)
    const { firmaFinal } = evaluaciones

    const handleSave = () => {
        const firma = sigCanvas.current.isEmpty()
            ? null
            : sigCanvas.current.toDataURL()

        updateFirmaFinal({
            firmaEvaluador: firma,
            fechaFirma: new Date().toLocaleDateString(),
        })
    }

    const clearSignature = () => {
        sigCanvas.current.clear()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
        >
            <Card className="w-full shadow-2xl border border-border/50 rounded-2xl bg-card">
                <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Certificación Final del Periodo</CardTitle>
                            <CardDescription>
                                Firma de validación de autonomía y cierre del proceso de adaptación (3 meses)
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 space-y-8 min-h-[450px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Nombre del Evaluador</label>
                            <input
                                type="text"
                                value={firmaFinal.nombreEvaluador}
                                onChange={(e) => updateFirmaFinal({ nombreEvaluador: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 text-card-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Nombre completo"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Cargo / Rol</label>
                            <input
                                type="text"
                                value={firmaFinal.cargoEvaluador}
                                onChange={(e) => updateFirmaFinal({ cargoEvaluador: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-secondary/50 text-card-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Ej. Supervisor de Operaciones"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-foreground">Comentarios Finales del Colaborador</label>
                        <textarea
                            value={firmaFinal.comentariosFinalesColaborador}
                            onChange={(e) => updateFirmaFinal({ comentariosFinalesColaborador: e.target.value })}
                            className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-border bg-secondary/50 text-card-foreground focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
                            placeholder="El colaborador puede expresar sus impresiones finales aquí..."
                        />
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <PenTool className="h-4 w-4 text-primary" />
                                Firma del Evaluador
                            </label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSignature}
                                className="text-muted-foreground hover:text-destructive h-8 px-2"
                            >
                                Limpiar
                            </Button>
                        </div>
                        <div className="border-2 border-dashed border-border rounded-xl bg-muted/20 p-1">
                            <div className="bg-white rounded-lg overflow-hidden signature-area-small">
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    canvasProps={{
                                        className: 'w-full h-32 cursor-crosshair',
                                    }}
                                    backgroundColor="rgb(255, 255, 255)"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-secondary/10 border-t border-border/30 p-8 flex justify-center">
                    <Button
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary/90 text-white px-12 py-7 text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Finalizar y Certificar Expediente
                    </Button>
                </CardFooter>
            </Card>

            {firmaFinal.firmaEvaluador && (
                <div className="flex justify-center p-8 border-2 border-primary/20 bg-primary/5 rounded-2xl animate-fade-in">
                    <div className="text-center space-y-4">
                        <p className="text-primary font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Expediente Certificado el {firmaFinal.fechaFirma}
                        </p>
                        <img
                            src={firmaFinal.firmaEvaluador}
                            alt="Firma del evaluador"
                            className="mx-auto border-2 border-white rounded-lg shadow-corporate bg-white p-4 max-w-[300px]"
                        />
                        <div className="text-sm text-foreground">
                            <p className="font-bold">{firmaFinal.nombreEvaluador}</p>
                            <p className="text-muted-foreground">{firmaFinal.cargoEvaluador}</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default FirmaFinal
