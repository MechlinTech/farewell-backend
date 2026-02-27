import prisma from "../config/prisma.config.js";
import { contactUsCategories } from "@prisma/client";
interface PaginationParams {
  page?: number;
  limit?: number;
}
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

  static async getContactsByUserId(
    userId: string,
    { page = 1, limit = 10 }: PaginationParams
  ) {
    const skip = (page - 1) * limit;

    // fetch contacts + total count together (performance optimized)
    const [contacts, totalCount] = await Promise.all([
      prisma.contactUs.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),

      prisma.contactUs.count({
        where: { userId },
      }),
    ]);

    // pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
  static async getProblemCategories() {
    try {
      const categories = await prisma.contactCategory.findMany();

      return categories;
    } catch {
      throw new Error("Failed to fetch problem categories");
    }
  }

  static async getAllContacts({ page = 1, limit = 10 }: PaginationParams) {
    // Calculate pagination
    const skip = (page - 1) * limit;
    const [contacts, totalCount] = await Promise.all([
      prisma.contactUs.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactUs.count(),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
