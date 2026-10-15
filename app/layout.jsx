import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageWrapper from '@/components/PageWrapper'

export const metadata = {
  title: 'Atharva Satellite Ground Station',
  description: 'Student-run satellite ground station committee, Atharva College of Engineering, Mumbai.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink font-body min-h-screen flex flex-col">
        <Navbar />
        <PageWrapper>
          {children}
        </PageWrapper>
        <Footer />
      </body>
    </html>
  )
}