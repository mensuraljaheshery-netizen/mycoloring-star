import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const themes = [
  { name: 'Superhero', category: 'Adventure', description: 'Soar through the city in an original cape and hero suit' },
  { name: 'Princess', category: 'Fantasy', description: 'Royal adventures in an enchanted garden palace' },
  { name: 'Astronaut', category: 'Space', description: 'Floating among starry constellations and lunar craters' },
  { name: 'School Day', category: 'Jobs', description: 'Fun science experiments and art projects at school' },
  { name: 'Jungle Explorer', category: 'Adventure', description: 'Discovering hidden ruins with friendly tropical birds' },
  { name: 'Outer Space', category: 'Space', description: 'Piloting a friendly research shuttle past ringed planets' },
  { name: 'Mars Mission', category: 'Space', description: 'Rover driving across red canyons under two moons' },
  { name: 'Playing with Animals', category: 'Animals and Nature', description: 'Sunny meadow picnic with puppies, kittens, and bunnies' },
  { name: 'Desert Adventure', category: 'Adventure', description: 'Riding friendly camels across golden rippling dunes' },
  { name: 'Snow and Winter', category: 'Seasonal', description: 'Building cheerful snow creatures and ice skating' },
  { name: 'Soccer Stadium', category: 'Sports', description: 'Scoring the winning goal under bright stadium lights' },
  { name: 'Basketball Champion', category: 'Sports', description: 'Dunking the ball in a high-energy court showdown' },
  { name: 'Under the Sea', category: 'Animals and Nature', description: 'Swimming alongside dolphins and glowing coral reefs' },
  { name: 'Dinosaur Explorer', category: 'Adventure', description: 'Excavating gentle dinosaur footprints in prehistoric vales' },
  { name: 'Pirate Adventure', category: 'Adventure', description: 'Hunting for island treasure maps with a feathered parrot friend' },
  { name: 'Farm Day', category: 'Animals and Nature', description: 'Tending gentle sheep and driving a friendly tractor' },
  { name: 'Fairy Forest', category: 'Fantasy', description: 'Wandering through giant glowing mushroom glades' },
  { name: 'Knights and Dragons', category: 'Fantasy', description: 'Tea party with a friendly miniature green dragon' },
  { name: 'Race Car Driver', category: 'Sports', description: 'Zooming along a colorful winding speedway' },
  { name: 'Firefighter', category: 'Jobs', description: 'Guiding the fire engine and rescuing friendly tree kittens' },
  { name: 'Doctor and Vet', category: 'Jobs', description: 'Checking puppy heartbeats with a stethoscope' },
  { name: 'Chef in the Kitchen', category: 'Jobs', description: 'Baking giant strawberry celebration cupcakes' },
  { name: 'Robot World', category: 'Fantasy', description: 'Building friendly solar robots with gears and dials' },
  { name: 'Camping Trip', category: 'Adventure', description: 'Roasting marshmallows beneath pine trees and starry skies' },
  { name: 'Ballet and Dance', category: 'Sports', description: 'Leaping gracefully across the grand theater stage' },
  { name: 'Music Band', category: 'Jobs', description: 'Rocking out on an electric guitar with energetic rhythm' },
  { name: 'Arctic Animals', category: 'Animals and Nature', description: 'Sliding down ice hills with cheerful baby penguins' },
  { name: 'Safari', category: 'Animals and Nature', description: 'Spotting giraffes and zebras under the umbrella trees' },
  { name: 'Magical Wizard Academy', category: 'Fantasy', description: 'Levitating glowing orbs in an ancient starlit library' },
  { name: 'Birthday Party', category: 'Seasonal', description: 'Blowing out birthday candles surrounded by floating balloons' },
  { name: 'Halloween', category: 'Seasonal', description: 'Trick-or-treating with friendly glowing jack-o-lanterns' },
  { name: 'Winter Holidays', category: 'Seasonal', description: 'Decorating festive pine boughs with twinkle lights' },
  { name: 'Eid and Ramadan', category: 'Seasonal', description: 'Crescent lanterns and festive celebration sweets' },
  { name: 'Spring Flowers', category: 'Seasonal', description: 'Planting sunflowers and catching butterflies in the garden' },
];

async function main() {
  await prisma.theme.deleteMany();
  for (let i = 0; i < themes.length; i++) {
    const t = themes[i];
    const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.theme.create({
      data: {
        name: t.name,
        slug,
        category: t.category,
        description: t.description,
        costumePrompt: 'Original costume suited for ' + t.name + ', child-safe, completely non-branded, whimsical detailing.',
        styleRules: 'Clear, crisp vector-style line art, no grayscale shading, thick outlines.',
        sortOrder: i,
      },
    });
  }
  console.log('Seeded ' + themes.length + ' themes successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
