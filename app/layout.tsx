import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sistema de Facturación',
  description: 'Sistema completo de facturación y gestión de clientes',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen flex flex-col`}>
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer con créditos */}
        <footer className="bg-muted/50 border-t border-border py-6 mt-auto">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  © 2025 Sistema de Facturación. Todos los derechos reservados.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">
                  Creado con ❤️ por{' '}
                  <span className="font-semibold text-primary hover:text-primary/80 transition-colors">
                    Jairo Teran
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Desarrollador Full Stack
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
