# 🧾 Sistema de Facturación

Un sistema moderno y elegante para la gestión de facturas, clientes y productos, construido con Next.js 15, TypeScript, Tailwind CSS y Supabase.

## ✨ Características

- **Dashboard en tiempo real** con estadísticas actualizadas automáticamente
- **Gestión de clientes** completa con información de contacto
- **Catálogo de productos** con precios, IVA y unidades
- **Sistema de facturas** para generar documentos profesionales
- **Interfaz moderna** con animaciones y diseño responsive
- **Base de datos en la nube** con Supabase
- **Actualizaciones en tiempo real** entre páginas

## 🚀 Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS 4, CSS Modules
- **Base de datos**: Supabase (PostgreSQL)
- **UI Components**: Radix UI, Lucide React
- **Formularios**: React Hook Form, Zod
- **Animaciones**: CSS Transitions, Framer Motion

## 📋 Requisitos previos

- Node.js 18+ 
- npm o pnpm
- Cuenta en Supabase

## 🛠️ Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/billing-system.git
   cd billing-system
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configura Supabase**
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Obtén tu URL y API Key
   - Crea un archivo `.env.local` con:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_api_key_de_supabase
   ```

4. **Configura la base de datos**
   - Ejecuta los scripts SQL en `scripts/` en tu base de datos de Supabase
   - O crea las tablas manualmente según el esquema

5. **Ejecuta el proyecto**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

## 🗄️ Estructura de la base de datos

### Tabla: `products`
- `id` (int, primary key)
- `name` (text)
- `description` (text)
- `price` (decimal)
- `tax_rate` (decimal)
- `unit` (text)
- `active` (boolean)
- `created_at` (timestamp)

### Tabla: `customers`
- `id` (int, primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `address` (text)
- `tax_id` (text)
- `created_at` (timestamp)

### Tabla: `invoices`
- `id` (int, primary key)
- `customer_id` (int, foreign key)
- `invoice_number` (text)
- `issue_date` (date)
- `due_date` (date)
- `total_amount` (decimal)
- `tax_amount` (decimal)
- `status` (enum: draft, sent, paid, overdue)
- `created_at` (timestamp)

## 📁 Estructura del proyecto

```
billing-system/
├── app/                    # App Router de Next.js
│   ├── clientes/          # Página de gestión de clientes
│   ├── facturas/          # Página de facturas
│   ├── productos/         # Página de gestión de productos
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard principal
├── components/             # Componentes reutilizables
│   ├── ui/                # Componentes de UI base
│   └── animated-counter.tsx
├── lib/                   # Utilidades y configuración
│   ├── supabase.ts        # Cliente y funciones de Supabase
│   └── utils.ts           # Funciones utilitarias
├── hooks/                 # Hooks personalizados
├── public/                # Archivos estáticos
└── scripts/               # Scripts SQL para la base de datos
```

## 🔧 Scripts disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## 🌟 Características destacadas

### Dashboard en tiempo real
- Contadores animados con estadísticas actualizadas
- Resumen de facturas, clientes y productos
- Navegación rápida a todas las secciones

### Gestión de productos
- CRUD completo de productos
- Cálculo automático de precios e IVA
- Estados activo/inactivo
- Búsqueda y filtrado

### Gestión de clientes
- Información completa de contacto
- Validación de datos
- Búsqueda por nombre, email o NIF
- Historial de transacciones

### Sistema de facturas
- Generación de facturas profesionales
- Selección de clientes y productos
- Cálculo automático de totales
- Estados de facturación

## 🎨 Diseño y UX

- **Diseño responsive** que funciona en todos los dispositivos
- **Animaciones suaves** para una experiencia fluida
- **Paleta de colores** profesional y accesible
- **Iconografía** consistente con Lucide React
- **Tipografía** legible y jerárquica

## 🔒 Seguridad

- Autenticación con Supabase Auth
- Validación de datos en frontend y backend
- Sanitización de inputs
- Variables de entorno para credenciales

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Despliega automáticamente

### Netlify
1. Conecta tu repositorio
2. Configura el build command: `npm run build`
3. Configura las variables de entorno

### Otros
- Cualquier plataforma que soporte Next.js
- Asegúrate de configurar las variables de entorno

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Supabase](https://supabase.com/) por la base de datos
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Radix UI](https://www.radix-ui.com/) por los componentes
- [Lucide](https://lucide.dev/) por los iconos

## 📞 Soporte

Si tienes alguna pregunta o problema:

- Abre un issue en GitHub
- Contacta en: [tu-email@ejemplo.com]
- Documentación: [link-a-docs]

---

**Desarrollado con ❤️ por [Tu Nombre]**
