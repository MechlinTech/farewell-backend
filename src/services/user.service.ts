import prisma from '../config/prisma.config.js';
import { contactUsCategories } from '@prisma/client';

export class ContactService {
static async createContact(data: {
  userId: string;
  name: string;
  emailId: string;
  message: string;
  category: "PAYMENT_AND_REFUND" | "DELIVERY_AND_RIDER" | "ACCOUNT_AND_VERIFICATION" | "TECHNICAL_ISSUES" | "SAFETY_FRAUD_AND_POLICY";
}) {

  // const existing = await prisma.contactUs.findFirst({
  //   where: {emailId: data.emailId,}
  // });
  // if (existing) {
  //   throw new Error("EMAIL_EXISTS");
  // }
  return prisma.contactUs.create({
    data,
  });
}

  static async getContactById(id: string,userId: string) {
    const contact = await prisma.contactUs.findFirst({
      where: { id ,userId},
      // select: {
      //   message: true,
        
      // },
    });

    if (!contact) throw new Error("CONTACT_NOT_FOUND");

    return contact;
  }
   static async getContactByIdadmin(id: string) {
    const contact = await prisma.contactUs.findUnique({
      where: { id },
      // select: {
      //   message: true,
        
      // },
    });

    if (!contact) throw new Error("CONTACT_NOT_FOUND");

    return contact;
  }

  static async getContactsByUserId(userId: string) {
    return prisma.contactUs.findMany({
      where: { userId },
     
      orderBy: { createdAt: "desc" },
    });
  }
static getProblemCategories() {
  return Object.values(contactUsCategories).map((value) => ({
    value,
    label: ContactService.getCategoryLabel(value),
  }));
}

private static getCategoryLabel(category: contactUsCategories) {
  const labels = {
    PAYMENT_AND_REFUND: "Payment & Refund",
    DELIVERY_AND_RIDER: "Delivery & Rider",
    ACCOUNT_AND_VERIFICATION: "Account & Verification",
    TECHNICAL_ISSUES: "Technical Issues",
    SAFETY_FRAUD_AND_POLICY: "Safety, Fraud & Policy",
  };

  return labels[category];
}

static async getAllContacts() {
  return prisma.contactUs.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          messages: true,
        },
      },
    },
  });
}

  
}