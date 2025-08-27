# Sistema de Facturación

Sistema completo de facturación y gestión de clientes desarrollado con Next.js, React, TypeScript y Supabase.

## 🚀 Características

- **Gestión de Clientes** - Añade, edita y organiza información de clientes
- **Catálogo de Productos** - Administra productos y servicios con precios e IVA
- **Generación de Facturas** - Crea facturas profesionales con números consecutivos
- **Vista Previa** - Visualiza facturas antes de enviarlas
- **Dashboard en Tiempo Real** - Estadísticas actualizadas automáticamente
- **Base de Datos en la Nube** - Supabase para almacenamiento seguro

## 🛠️ Tecnologías

- **Frontend:** Next.js 15, React 19, TypeScript
- **UI:** Tailwind CSS, Shadcn/ui
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Despliegue:** Vercel (recomendado)

## 📦 Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/jairoteran/billing-system.git
cd billing-system
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
```bash
cp env.example .env.local
```
Edita `.env.local` con tus credenciales de Supabase.

4. **Configura la base de datos:**
- Ejecuta el script `scripts/01-create-database-schema.sql` en Supabase
- Opcional: Ejecuta `scripts/02-seed-sample-data.sql` para datos de ejemplo

5. **Ejecuta el proyecto:**
```bash
npm run dev
```

## 🔧 Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Obtén tu URL y clave anónima
3. Configura las variables en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

## 📱 Uso

- **Dashboard:** Vista general con estadísticas
- **Clientes:** Gestión completa de clientes
- **Productos:** Catálogo de productos y servicios
- **Facturas:** Crear y gestionar facturas
- **Nueva Factura:** Generador de facturas con vista previa

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel
3. ¡Listo! Tu aplicación estará en línea

### Otros proveedores
El proyecto es compatible con cualquier proveedor que soporte Next.js.

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 👨‍💻 Desarrollador

**Jairo Teran**
- Email: [jteran0901@gmail.com](mailto:jteran0901@gmail.com)
- GitHub: [@jairoteran](https://github.com/jairoteran)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
