import './style.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Atharva Satellite Ground Station',
  description: 'Student-run satellite ground station committee, Atharva College of Engineering, Mumbai.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink font-body min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}