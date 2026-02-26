import prisma from "../config/prisma.config.js";
import { contactUsCategories } from "@prisma/client";

export class ContactService {
  static async createContact(data: {
    userId: string;
    name: string;
    emailId: string;
    message: string;
    category: contactUsCategories;
  }) {
    return prisma.contactUs.create({
      data,
    });
  }

  static async getContactById(id: string, userId: string) {
    const contact = await prisma.contactUs.findFirst({
      where: { id, userId },
    });

    if (!contact) throw new Error("MESSAGE_NOT_FOUND");

    return contact;
  }
  static async getContactByIdadmin(id: string) {
    const contact = await prisma.contactUs.findUnique({
      where: { id },
    });

    if (!contact) throw new Error("MESSAGE_NOT_FOUND");

    return contact;
  }

  static async getContactsByUserId(userId: string) {
    return prisma.contactUs.findMany({
      where: { userId },

      orderBy: { createdAt: "desc" },
    });
  }
  static async getProblemCategories() {
    try {
      const categories = await prisma.contactCategory.findMany();

      return categories;
    } catch {
      throw new Error("Failed to fetch problem categories");
    }
  }

  static async getAllContacts() {
    return prisma.contactUs.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
