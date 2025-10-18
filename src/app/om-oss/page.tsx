import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-card p-6 rounded-xl shadow border border-border">
            <h1 className="text-2xl font-bold text-foreground mb-4">Om oss</h1>

            <p className="text-muted-foreground mb-4">Under vår utbildning på Lexicon har vi arbetat med att utveckla denna applikation som en del av vårt projektarbete.</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Josefine</h3>
                <p className="text-sm text-muted-foreground">Roll: Fokus på Frontend UX/UI design</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">Ahamed</h3>
                <p className="text-sm text-muted-foreground">Roll: Fokus på...</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">Johan</h3>
                <p className="text-sm text-muted-foreground">Roll: Fokus på....</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">Maugi</h3>
                <p className="text-sm text-muted-foreground">Roll: Fokus på ... </p>
              </div>
            </div>

            <p className="text-muted-foreground mt-6">Vill du bidra eller lära dig mer? Kontakta oss via formuläret eller skicka en (simulerad) e-post till noreplay@dagensdos.se.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
