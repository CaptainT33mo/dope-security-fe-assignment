import { faker } from "@faker-js/faker";

export type Character = {
	id: string;
	name: string;
	location: "Konoha" | "Suna" | "Kiri" | "Iwa" | "Kumo";
	health: "Healthy" | "Injured" | "Critical";
	power: number;
	viewed: boolean;
};

const locations: Character["location"][] = [
	"Konoha",
	"Suna",
	"Kiri",
	"Iwa",
	"Kumo",
];
const healthStatuses: Character["health"][] = [
	"Healthy",
	"Injured",
	"Critical",
];

const generateCharacter = (id: string): Character => {
	return {
		id,
		name: faker.person.fullName(),
		location: faker.helpers.arrayElement(locations),
		health: faker.helpers.arrayElement(healthStatuses),
		power: faker.number.int({ min: 100, max: 10000 }),
		viewed: false,
	};
};

export const generateCharacters = (count: number): Character[] => {
	return Array.from({ length: count }, (_, index) =>
		generateCharacter(`char_${index + 1}`),
	);
};

// Generate 1000+ characters for the JSON server
export const characters = generateCharacters(1200);
