/**
 * JSON-LD structured data components for schema.org markup.
 * Use in page Server Components — they render as <script type="application/ld+json"> tags.
 */

const BASE_URL = 'https://soniatravels.in'

const ORGANIZATION = {
  '@type': 'TravelAgency',
  '@id': `${BASE_URL}/#organization`,
  name: 'Sonia Tour & Travels',
  url: BASE_URL,
  logo: `${BASE_URL}/favicons/favicon-192x192.png`,
  telephone: '+918460222809',
  email: 'soniatravels@gmail.com',
  foundingDate: '2008',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Defence Road, Mamoon',
    addressLocality: 'Pathankot',
    addressRegion: 'Punjab',
    postalCode: '145001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 32.2643,
    longitude: 75.6421,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.6',
    reviewCount: '90',
    bestRating: '5',
  },
  sameAs: [
    'https://wa.me/918460222809',
  ],
}

/** Homepage: LocalBusiness + Organization + WebSite search */
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...ORGANIZATION,
        '@type': ['TravelAgency', 'LocalBusiness'],
        priceRange: '₹₹',
        hasMap: 'https://maps.google.com/?q=Sonia+Tour+Travels+Pathankot',
        servesCuisine: undefined,
        description: 'Trusted travel agency in Pathankot since 2008 — cab bookings, outstation taxis, tour packages, air ticketing, railway & bus booking, visa assistance.',
        areaServed: [
          { '@type': 'City', name: 'Pathankot' },
          { '@type': 'State', name: 'Punjab' },
          { '@type': 'State', name: 'Himachal Pradesh' },
        ],
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: { '@type': 'GeoCoordinates', latitude: 32.2643, longitude: 75.6421 },
          geoRadius: '500000',
        },
        knowsAbout: [
          'Outstation cab service Pathankot',
          'Taxi to Dalhousie from Pathankot',
          'Dharamshala cab booking',
          'Vaishno Devi cab from Pathankot',
          'Tour packages Himachal Pradesh',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Sonia Tour & Travels',
        publisher: { '@id': `${BASE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/packages?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Cab services page + individual route pages */
export function CabServiceSchema({ route }: {
  route?: { from: string; to: string; sedanPrice: number; suvPrice: number; description: string; slug: string }
}) {
  if (route) {
    // Individual route page
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: `Cab from ${route.from} to ${route.to}`,
          description: route.description,
          url: `${BASE_URL}/cabs/${route.slug}`,
          provider: { '@id': `${BASE_URL}/#organization` },
          areaServed: [
            { '@type': 'City', name: route.from },
            { '@type': 'City', name: route.to },
          ],
          offers: [
            {
              '@type': 'Offer',
              name: 'Sedan (AC)',
              price: route.sedanPrice,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              validFrom: new Date().toISOString().split('T')[0],
            },
            {
              '@type': 'Offer',
              name: 'SUV / MUV (AC)',
              price: route.suvPrice,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              validFrom: new Date().toISOString().split('T')[0],
            },
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Cabs', item: `${BASE_URL}/cabs` },
            { '@type': 'ListItem', position: 3, name: `${route.from} to ${route.to}`, item: `${BASE_URL}/cabs/${route.slug}` },
          ],
        },
      ],
    }
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    )
  }

  // Cab listing page
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Cab & Taxi Service in Pathankot',
    description: 'Outstation cab service from Pathankot to Dalhousie, Dharamshala, Amritsar, Jammu, Katra, Manali and more. AC sedans, SUVs and Tempo Travellers. Verified drivers, 24×7.',
    provider: { '@id': `${BASE_URL}/#organization` },
    url: `${BASE_URL}/cabs`,
    areaServed: { '@type': 'City', name: 'Pathankot' },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '1800',
      priceCurrency: 'INR',
      offerCount: '10',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** FAQ structured data — use on any page that has a FAQ section */
export function FAQSchema({ items }: { items: { q: string; a: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Blog post / Article schema */
export function ArticleSchema({ post }: {
  post: {
    title: string
    slug: string
    excerpt: string
    publishedAt: string
    readTime: string
    tags: string[]
    category: string
  }
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Sonia Tour & Travels',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sonia Tour & Travels',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/favicons/favicon-192x192.png`,
      },
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'en-IN',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Tour package schema */
export function PackageSchema({ pkg }: {
  pkg: {
    id: string
    name: string
    description?: string
    desc?: string
    price: number
    nights: number
    days: number
    region: string
  }
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: pkg.description || pkg.desc || `${pkg.days}-day ${pkg.name} tour package from Pathankot`,
    url: `${BASE_URL}/packages/${pkg.id}`,
    provider: { '@id': `${BASE_URL}/#organization` },
    touristType: 'Family, Couple, Group',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.days,
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      description: `${pkg.nights} nights · ${pkg.days} days · per person twin sharing`,
    },
    location: {
      '@type': 'Place',
      name: pkg.region,
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
