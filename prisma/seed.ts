import prisma from '../src/config/prisma.config.js';
import { faqSeed } from './seed-data/faq.data.js';
import { contact_categories} from './seed-data/contact-categories.data';

async function main() {
    for(const faq of faqSeed) {
        await prisma.faq.upsert ({
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
}



main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
    