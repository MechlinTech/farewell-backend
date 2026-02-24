// prisma/seed-data/faq.data.ts
import { FaqCategory } from '@prisma/client';

export const faqSeed = [
    {
      question: 'How do I schedule a pickup?',
      answer: 'Choose pickup time, address and confirm booking.',
      category: FaqCategory.GENERAL,
      isActive: true,
    },
    {
      question: 'How is delivery cost calculated?',
      answer: 'Cost depends on distance, parcel size and demand.',
      category: FaqCategory.PAYMENT,
      isActive: true,
    },
    {
      question: 'Can I cancel a pickup?',
      answer: 'Yes, before driver assignment.',
      category: FaqCategory.CUSTOMER,
      isActive: true,
    },
  ];
  