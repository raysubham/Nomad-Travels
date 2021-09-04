import { google } from 'googleapis'
import {
  Client,
  AddressComponent,
  AddressType,
  GeocodingAddressComponentType,
} from '@googlemaps/google-maps-services-js'

const maps = new Client({})

const authRedirectUrl = `${process.env.PUBLIC_URL}/login`

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  authRedirectUrl
)

const parseAddress = (addressComponents: AddressComponent[]) => {
  let country = null
  let admin = null
  let city = null

  for (const component of addressComponents) {
    if (component.types.includes(AddressType.country)) {
      country = component.long_name
    }

    if (component.types.includes(AddressType.administrative_area_level_1)) {
      admin = component.long_name
    }

    if (
      component.types.includes(AddressType.locality) ||
      component.types.includes(GeocodingAddressComponentType.postal_town)
    ) {
      city = component.long_name
    }
  }

  return { country, admin, city }
}

export const Google = {
  authUrl: auth.generateAuthUrl({
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  }),

  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code)
    auth.setCredentials(tokens)

    const { data } = await google.people({ version: 'v1', auth }).people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    })

    return { user: data }
  },

  geocode: async (address: string) => {
    if (!process.env.GOOGLE_GEOCODE_API)
      throw new Error('missing Google Maps API key')

    const res = await maps.geocode({
      params: { address, key: process.env.GOOGLE_GEOCODE_API },
    })

    if (res.status < 200 || res.status > 299) {
      throw new Error('failed to geocode address')
    }

    return parseAddress(res.data.results[0].address_components)
  },
}
