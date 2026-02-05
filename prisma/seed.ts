import prisma from '../src/config/prisma.js';
import { faqSeed } from './seed-data/faq.data.js';

async function main() {
    for(const faq of faqSeed) {
        await prisma.faq.upsert ({
            where: { question: faq.question },
            update: {},
            create: faq,
        })
    }
    console.log('FAQ seeding completed');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());