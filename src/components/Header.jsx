import React from 'react'
import { Building2, FileText } from 'lucide-react'

const Header = () => {
    return (
        <header className="gradient-header shadow-corporate-lg">
            <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <FileText className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Expediente de Evaluación
                            </h1>
                            <p className="text-white/80 text-sm mt-1">
                                Sistema de Seguimiento Trimestral de Asesores
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">Corporativo</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
