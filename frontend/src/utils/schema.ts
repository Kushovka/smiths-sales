import { business } from '../data/business'

export const autoDealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: business.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address,
    addressLocality: 'Commodore',
    addressRegion: 'PA',
    postalCode: business.postalCode,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: business.latitude,
    longitude: business.longitude,
  },
  url: business.website || business.mapsUrl,
  openingHours: 'Mo-Sa 09:30-17:00',
}
