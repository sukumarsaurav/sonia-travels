import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Services in Pathankot | Cab, Air, Rail, Hotel, Tour & Visa | Sonia Travels',
  description: 'Complete travel services from Pathankot — tourist taxi, air ticketing, railway & bus booking, tour packages, hotel reservations and visa assistance. All under one roof since 2008.',
  keywords: 'travel services pathankot, cab service pathankot, air ticketing pathankot, railway booking pathankot, bus booking pathankot, visa assistance pathankot, hotel booking pathankot',
  openGraph: {
    title: 'All Travel Services in Pathankot — Sonia Tour & Travels',
    description: 'Cab hire, air tickets, train & bus booking, tour packages, hotels and visa processing — all from our Pathankot office.',
    url: 'https://soniatravels.in/services',
    type: 'website',
  },
  alternates: { canonical: 'https://soniatravels.in/services' },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
