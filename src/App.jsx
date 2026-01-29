import React, { useState, useRef } from 'react'
import { EvaluacionProvider, useEvaluacion } from './context/EvaluacionContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { Button } from './components/ui/button'
import EvaluacionSemanal from './components/EvaluacionSemanal'
import FirmaFinal from './components/FirmaFinal'
import Dashboard from './components/Dashboard'
import RegistroAsesor from './components/RegistroAsesor'
import ReporteImpresion from './components/ReporteImpresion'
import { ConfirmModal, AlertModal } from './components/ui/modal'
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  LayoutDashboard,
  Calendar,
  FileCheck,
  Settings,
  LogOut,
  Printer,
  ChevronRight,
  UserPlus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

const mesesConfig = {
  mes1: {
    titulo: 'Mes 1: Evaluación Intensiva',
    semanas: [
      { id: 'semana1', titulo: 'Semana 1', descripcion: 'Monitoreo en vivo y manejo de sistemas' },
      { id: 'semana2', titulo: 'Semana 2', descripcion: 'Evaluación de conocimiento inicial' },
      { id: 'semana3', titulo: 'Semana 3', descripcion: 'Estratificado del desempeño y retroalimentación' },
      { id: 'semana4', titulo: 'Semana 4', descripcion: 'Validación de evolución y efectividad' },
    ],
  },
  mes2: {
    titulo: 'Mes 2: Maduración Operativa',
    semanas: [
      { id: 'semana1', titulo: 'Semana 5', descripcion: 'Escuchas dirigidas con asesor bench' },
      { id: 'semana2', titulo: 'Semana 6', descripcion: 'Evaluación de retención y aplicación' },
      { id: 'semana3', titulo: 'Semana 7', descripcion: 'Refuerzo e-learning y micro cápsulas' },
      { id: 'semana4', titulo: 'Semana 8', descripcion: 'Monitoreo de mejora y adherencia' },
    ],
  },
  mes3: {
    titulo: 'Mes 3: Validación de Autonomía',
    semanas: [
      { id: 'semana1', titulo: 'Semana 9', descripcion: 'Taller de escucha y análisis de casos' },
      { id: 'semana2', titulo: 'Semana 10', descripcion: 'Seguimiento general de autonomía' },
      { id: 'semana3', titulo: 'Semana 11', descripcion: 'Estratificado final y madurez operativa' },
      { id: 'semana4', titulo: 'Semana 12', descripcion: 'Entrega formal de resultados a jefatura' },
    ],
  },
}

function AppContent() {
  const { evaluaciones, exportData, importData, resetData } = useEvaluacion()
  const [activeView, setActiveView] = useState('dashboard')
  const [mesActual, setMesActual] = useState('mes1')
  const [semanaActual, setSemanaActual] = useState('semana1')
  const fileInputRef = useRef(null)

  const handlePrint = () => {
    const nombreSaneado = (evaluaciones.datosAsesor?.nombre || 'Expediente')
      .trim()
      .replace(/\s+/g, '_')

    const originalTitle = document.title
    document.title = `Expediente_${nombreSaneado}`
    window.print()
    document.title = originalTitle
  }

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' })

  const showAlert = (title, message) => {
    setAlertConfig({ title, message })
    setIsAlertOpen(true)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await importData(file)
        showAlert('Éxito', 'Los datos del expediente han sido importados correctamente.')
      } catch (error) {
        showAlert('Error', 'Hubo un problema al importar el archivo JSON: ' + error.message)
      }
    }
  }

  const onConfirmReset = () => {
    resetData()
    showAlert('Completado', 'Todos los datos han sido borrados y el sistema ha sido reiniciado.')
  }

  return (
    <div className="min-h-screen bg-mesh flex text-foreground font-sans selection:bg-primary/30">
      {/* Sidebar Moderno */}
      <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Expedientes</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">v1.2 Beta</span>
            </div>
          </div>

          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20 border border-white/10 mx-2">
            <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest mb-1">Empresa</p>
            <p className="text-xl font-black text-white tracking-widest">NETCOM</p>
          </div>

          <nav className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Principal</p>

              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium text-sm">Panel de Control</span>
              </button>

              <button
                onClick={() => setActiveView('registro')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'registro' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
              >
                <UserPlus className="h-5 w-5" />
                <span className="font-medium text-sm">Datos del Asesor</span>
              </button>

              <button
                onClick={() => setActiveView('evaluaciones')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'evaluaciones' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-secondary'}`}
              >
                <Calendar className="h-5 w-5" />
                <span className="font-medium text-sm">Evaluaciones</span>
              </button>

              <button
                onClick={() => setActiveView('firma')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'firma' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white hover:bg-secondary'}`}
              >
                <FileCheck className="h-5 w-5" />
                <span className="font-medium text-sm">Cierre y Firma</span>
              </button>
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 px-4 mb-3">
                <Settings className="h-3 w-3 text-primary" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Sistema</p>
              </div>
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-white transition-all hover:bg-white/5 rounded-xl group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <Printer className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Guardar PDF</span>
              </button>
              <button
                onClick={exportData}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-white transition-all hover:bg-white/5 rounded-xl group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <Download className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Exportar JSON</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-white transition-all hover:bg-white/5 rounded-xl group"
              >
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <Upload className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Importar JSON</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            </div>
          </nav>
        </div>

        <div className="mt-auto p-8 pt-0">
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-medium text-sm"
          >
            <RotateCcw className="h-5 w-5" />
            Resetear Todo
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-y-scroll bg-mesh">
        <section className="p-8 pt-12 max-w-7xl mx-auto w-full flex-grow flex flex-col min-h-[700px] interactive-view">
          <AnimatePresence mode="wait">
            {activeView === 'registro' && (
              <motion.div
                key="registro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <RegistroAsesor />
              </motion.div>
            )}

            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <Dashboard />
              </motion.div>
            )}

            {activeView === 'evaluaciones' && (
              <motion.div
                key="evaluaciones"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <Tabs value={mesActual} onValueChange={setMesActual}>
                  <TabsList className="grid grid-cols-3 mb-8 bg-card/50 p-1.5 rounded-2xl border border-white/5 no-print uppercase tracking-widest text-[10px] font-bold">
                    <TabsTrigger value="mes1">Mes 1</TabsTrigger>
                    <TabsTrigger value="mes2">Mes 2</TabsTrigger>
                    <TabsTrigger value="mes3">Mes 3</TabsTrigger>
                  </TabsList>

                  {Object.keys(mesesConfig).map((mes) => (
                    <TabsContent key={mes} value={mes}>
                      <Tabs value={semanaActual} onValueChange={setSemanaActual}>
                        <TabsList className="grid grid-cols-4 mb-6 bg-card/30 border border-white/5 p-1 rounded-xl no-print">
                          {mesesConfig[mes].semanas.map((semana) => (
                            <TabsTrigger key={semana.id} value={semana.id} className="text-[10px] font-bold uppercase tracking-tighter border-none shadow-none">
                              {semana.titulo}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {mesesConfig[mes].semanas.map((semana) => (
                          <TabsContent key={semana.id} value={semana.id}>
                            <EvaluacionSemanal mes={mes} semana={semana.id} titulo={semana.titulo} descripcion={semana.descripcion} />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
            )}

            {activeView === 'firma' && (
              <motion.div
                key="firma"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <FirmaFinal />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Reporte oculto que solo se activa en impresión */}
      <ReporteImpresion mesesConfig={mesesConfig} />

      <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={onConfirmReset} title="Reiniciar Sistema" message="Se perderán todos los datos capturados. ¿Proceder?" confirmText="Confirmar Reset" variant="destructive" />
      <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title={alertConfig.title} message={alertConfig.message} />
    </div>
  )
}

function App() {
  return (
    <EvaluacionProvider>
      <AppContent />
    </EvaluacionProvider>
  )
}

export default App
