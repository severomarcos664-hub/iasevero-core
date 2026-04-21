import './globals.css'
export const metadata = { title: 'IASevero Ω', description: 'Severlopes Elite' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-[#010409]">{children}</body>
    </html>
  )
}
