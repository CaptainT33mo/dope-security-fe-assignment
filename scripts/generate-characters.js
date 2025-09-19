import { faker } from '@faker-js/faker'
import fs from 'fs'

const locations = ['Konoha', 'Suna', 'Kiri', 'Iwa', 'Kumo']
const healthStatuses = ['Healthy', 'Injured', 'Critical']

const generateCharacter = (id) => {
  return {
    id,
    name: faker.person.fullName(),
    location: faker.helpers.arrayElement(locations),
    health: faker.helpers.arrayElement(healthStatuses),
    power: faker.number.int({ min: 100, max: 10000 }),
    viewed: false,
  }
}

const generateCharacters = (count) => {
  return Array.from({ length: count }, (_, index) => 
    generateCharacter(`char_${index + 1}`)
  )
}

const characters = generateCharacters(1200)
const db = { characters }

fs.writeFileSync('db.json', JSON.stringify(db, null, 2))
console.log(`Generated ${characters.length} characters in db.json`)
