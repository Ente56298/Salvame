import { track } from '@vercel/analytics'

export const trackSOSActivation = (location: { lat: number, lng: number }) => {
  track('sos_activated', {
    latitude: location.lat,
    longitude: location.lng,
    timestamp: Date.now()
  })
}

export const trackMechanicContact = (mechanicId: string, distance: number) => {
  track('mechanic_contacted', {
    mechanic_id: mechanicId,
    distance_km: distance
  })
}

export const trackUserRegistration = (method: 'email' | 'phone' | 'google') => {
  track('user_registered', { method })
}