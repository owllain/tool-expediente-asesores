import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border mt-12">
            <div className="container mx-auto px-6 py-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        © {currentYear} Sistema de Evaluación de Asesores. Todos los derechos reservados.
                    </p>
                    <p>
                        Versión 1.0.0
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
