# 📂 Expediente Digital de Asesores (EDA)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![React](https://img.shields.io/badge/React-18-61dafb.svg) ![Vite](https://img.shields.io/badge/Vite-Fast-yellow.svg) ![Security](https://img.shields.io/badge/Security-Offline%20First-green.svg)

Sistema integral de evaluación de desempeño y seguimiento para nuevos ingresos (Curva de Aprendizaje - 3 Meses). Diseñado para operar en entornos de alta seguridad sin dependencia de bases de datos externas.

---

## 🚀 Características Principales

Este aplicativo resuelve la necesidad de digitalizar expedientes en un entorno con restricciones de red (Banking/Contact Center Standard):

* **🔒 Arquitectura Offline-First:** Todos los datos se procesan en el navegador del cliente (Client-side). Nada sale de la red local.
* **💾 Persistencia JSON:** Sistema de guardado y carga mediante archivos `.json` encriptados localmente, funcionando como "Save Files".
* **✍️ Firma Digital Biométrica:** Captura de firma manuscrita del colaborador directamente en pantalla (Canvas API).
* **📊 Dashboard Reactivo:** Visualización en tiempo real del progreso trimestral con animaciones fluidas (Framer Motion).
* **📄 Exportación PDF:** Generación de reportes finales listos para auditoría.

## 🛠️ Stack Tecnológico

La "Artillería Pesada" detrás de la interfaz:

* **Core:** React + Vite (Rendimiento optimizado).
* **UI/UX:** Tailwind CSS + Shadcn/UI (Diseño de sistemas corporativo).
* **Visualización:** Recharts (Métricas de cumplimiento).
* **Interactividad:** Framer Motion (Transiciones de estado).
* **Utilidades:** `react-signature-canvas`, `file-saver`.

## 📦 Instalación y Uso Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tool-expediente-asesores.git](https://github.com/tu-usuario/tool-expediente-asesores.git)
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Generar Build (Para producción/entregable):**
    ```bash
    npm run build
    ```
    *El resultado estará en la carpeta `/dist`, listo para ejecutarse en cualquier navegador moderno.*

## 📖 Guía de Uso del Expediente

1.  **Nuevo Ingreso:** Iniciar con el formulario limpio.
2.  **Seguimiento Semanal:** Llenar los campos de la semana correspondiente (Evaluaciones, Quices, Observaciones).
3.  **Guardar Progreso:** Clic en "Exportar Expediente". Esto descargará un archivo `Nombre_Apellido.json`.
4.  **Retomar Sesión:** Arrastrar el archivo `.json` al área de carga para restaurar todo el historial del asesor.

---

**Desarrollado para optimización de procesos de supervisión.**
*Propiedad Privada / Uso Interno*