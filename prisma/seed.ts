import prisma from '../src/config/prisma.config.js';
import { faqSeed } from './seed-data/faq.data.js';
import { contact_categories } from './seed-data/contact-categories.data';
import { vehicle_types } from './seed-data/vehicle-type.data.js';

async function main() {
  for (const faq of faqSeed) {
    await prisma.faq.upsert({
      where: { question: faq.question },
      update: {},
      create: faq,
    })
  }
  console.log('FAQ seeding completed');
  for (const category of contact_categories) {
    await prisma.contactCategory.upsert({
      where: { type: category.type },
      update: {},
      create: category,
    });
  }

  console.log('Contact categories seeding completed');
  for (const vehicleType of vehicle_types) {
    await prisma.vehicleTypes.upsert({
      where: { type: vehicleType.type },
      update: {},
      create: vehicleType,
    });
  }

  console.log('Vehicle types seeding completed');
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
