// prisma/seed-data/faq.data.ts
import { Category } from '@prisma/client';

export const faqSeed = [
    {
      question: 'How do I schedule a pickup?',
      answer: 'Choose pickup time, address and confirm booking.',
      category: Category.GENERAL,
      isActive: true,
    },
    {
      question: 'How is delivery cost calculated?',
      answer: 'Cost depends on distance, parcel size and demand.',
      category: Category.PAYMENT,
      isActive: true,
    },
    {
      question: 'Can I cancel a pickup?',
      answer: 'Yes, before driver assignment.',
      category: Category.CUSTOMER,
      isActive: true,
    },
  ];
  