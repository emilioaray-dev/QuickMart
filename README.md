# QuickMart Checkout

## Descripción

QuickMart Checkout es una moderna aplicación de punto de venta (POS) desarrollada con Electron, diseñada para sistemas de autoservicio en supermercados y tiendas minoristas. La aplicación proporciona una interfaz intuitiva para la gestión de productos, creación de órdenes, procesamiento de pagos y emisión de recibos.

## Características Principales

- **Interfaz multilingüe**: Soporte para inglés, español, francés y alemán
- **Gestión de productos**: Catálogo categorizado con imágenes, precios y códigos de barra
- **Sistema de carrito**: Agregar, eliminar y modificar cantidades de productos
- **Búsqueda de productos**: Filtro rápido por nombre o categoría
- **Historial de órdenes**: Seguimiento de todas las transacciones realizadas
- **Estadísticas**: Dashboard con productos más vendidos y análisis de ventas
- **Impresión de recibos**: Generación de recibos con formato profesional
- **Códigos de descuento**: Soporte para cupones y descuentos promocionales
- **Escáner de código de barras**: Integración para procesamiento rápido de productos
- **Diseño responsivo**: Adecuado para diferentes tamaños de pantalla y dispositivos

## Tecnologías Utilizadas

- **Electron**: Desarrollo de aplicaciones de escritorio multiplataforma
- **React 19**: Framework para interfaces de usuario
- **TypeScript**: Tipado estático para mejor mantenimiento del código
- **Vite**: Herramienta de build rápida
- **Tailwind CSS**: Estilado con utilidades de bajo nivel
- **shadcn/ui**: Componentes de interfaz reutilizables
- **Lucide React**: Iconos de código abierto
- **Sonner**: Sistema de notificaciones
- **electron-builder**: Empaquetado y distribución multiplataforma

## Instalación

### Requisitos previos

- Node.js (versión 18 o superior)
- Bun (para scripts de desarrollo)
- npm o yarn

### Configuración del entorno

```bash
# Clonar el repositorio
git clone https://github.com/emilioaray-dev/QuickMart.git
cd QuickMart

# Instalar dependencias
bun install

# Iniciar el modo desarrollo
bun run dev
```

### Desarrollo con Electron

```bash
# Iniciar en modo desarrollo con Electron
bun run dev:electron
```

## Compilación

### Para desarrollo

```bash
# Build de desarrollo
bun run build:dev
```

### Para producción (todos los sistemas)

```bash
# Build para Mac (universal - Intel + Apple Silicon)
bun run build:mac:universal

# Build para Windows
bun run build:win

# Build para Linux
bun run build:linux
```

### Scripts de compilación multiplataforma

El proyecto incluye scripts automatizados para construir la aplicación en múltiples plataformas:

```bash
# En sistemas Unix (macOS/Linux)
./build-all-platforms.sh [opción]

# En Windows
build-all-platforms.bat [opción]
```

Opciones disponibles:
- `all`: Construye para todas las plataformas (por defecto)
- `mac`: Construye para macOS universal (Intel + Apple Silicon)
- `mac:universal`: Igual que 'mac'
- `mac:intel`: Construye solo para macOS Intel (x64)
- `mac:arm`: Construye solo para macOS Apple Silicon (arm64)
- `win`: Construye solo para Windows
- `linux`: Construye solo para Linux
- `help`: Muestra mensaje de ayuda

## Página de Demostración

Puedes ver una demostración funcional de la aplicación y descargar las versiones compiladas en: [https://quick-mart-demo-page.vercel.app/](https://quick-mart-demo-page.vercel.app/)

La página incluye capturas de pantalla, descripción detallada y archivos de instalación para Windows, macOS y Linux.

## Estructura del Proyecto

```
QuickMart/
├── electron/                 # Código del proceso principal de Electron
│   ├── main.ts              # Proceso principal de Electron
│   └── preload.ts           # Script preload para seguridad
├── src/                     # Código fuente de la aplicación
│   ├── components/          # Componentes de React
│   ├── contexts/            # Contextos de React
│   ├── data/                # Datos de productos
│   ├── i18n/                # Internacionalización
│   ├── pages/               # Páginas principales
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Utilidades
├── public/                  # Recursos estáticos
└── ...
```

## Características Técnicas

- **Seguridad**: Aislamiento de contexto de Electron con preload scripts seguros
- **Internacionalización**: Sistema completo de traducción con 4 idiomas
- **Persistencia**: Almacenamiento local con hooks personalizados
- **Accesibilidad**: Componentes accesibles siguiendo estándares WCAG
- **Empaquetado**: Configuración para distribución multiplataforma

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request en el repositorio para discutir cambios o mejoras.

## Licencia

Este proyecto está licenciado bajo los términos especificados en el archivo LICENSE (si existe) o bajo términos estándar si no se especifica ninguna licencia.

## Autor

Desarrollado por Celsius Emilio Aray - [emilioaray@gmail.com](mailto:emilioaray@gmail.com)

## Demostración Profesional

Este proyecto fue creado para demostrar capacidades en desarrollo multiplataforma con Electron, empaquetado y distribución para diferentes sistemas operativos. La implementación incluye seguridad avanzada, internacionalización, y patrones de diseño modernos para aplicaciones de escritorio.
