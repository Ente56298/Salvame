import { sql } from '@vercel/postgres'

export async function createUser(email: string, name: string, phone?: string) {
  const result = await sql`
    INSERT INTO users (email, name, phone)
    VALUES (${email}, ${name}, ${phone})
    RETURNING id, email, name, phone, created_at
  `
  return result.rows[0]
}

export async function createSOSEvent(userId: number, lat: number, lng: number) {
  const result = await sql`
    INSERT INTO sos_events (user_id, latitude, longitude)
    VALUES (${userId}, ${lat}, ${lng})
    RETURNING id, created_at, status
  `
  return result.rows[0]
}

export async function findNearbyMechanics(lat: number, lng: number, radius = 10) {
  const result = await sql`
    SELECT *, 
    (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * 
    cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * 
    sin(radians(latitude)))) AS distance
    FROM mechanics 
    WHERE verified = true
    HAVING distance < ${radius}
    ORDER BY distance
    LIMIT 5
  `
  return result.rows
}

export async function getActiveSOSCount() {
  const result = await sql`
    SELECT COUNT(*) as count FROM sos_events WHERE status = 'active'
  `
  return parseInt(result.rows[0].count)
}