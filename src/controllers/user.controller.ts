import type { Request, Response } from "express";
import { ContactService } from "../services/user.service.js";
 import {contactUsCategories}  from "@prisma/client";

export class ContactController {
  /**
   * Create contact message (logged in user only)
   */
  static async createContact(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const emailId = req.userEmail;

      if (!userId || !emailId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
        return;
      }

      const { name, message, category } = req.body;

      if (!name || !message || !category) {
        res.status(400).json({
          success: false,
          message: "Name, message and category are required",
        });
        return;
      }

      if (!Object.values(contactUsCategories).includes(category)) {
  res.status(400).json({
    success: false,
    message: "Invalid category selected",
  });
  return;
}

      // name validation
      const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
      if (!nameRegex.test(name)) {
        res.status(400).json({
          success: false,
          message: "Invalid name format",
        });
        return;
      }

      const contact = await ContactService.createContact({
        userId,
        emailId,
        name,
          category,
        message,
      });

      res.status(201).json({
        success: true,
        message: "Contact message created successfully",
        data: contact,
      });
    } catch (error: any) {
      console.error("Error creating contact:", error);

      if (error.message === "EMAIL_EXISTS") {
        res.status(409).json({
          success: false,
          message: "Message already submitted with this email",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Failed to create contact message",
      });
    }
  }

  /**
   * Get contact by ID
   */
  static async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const userId = req.userId;
      if (!id || !userId) {
        res.status(400).json({
          success: false,
          message:
            "Contact ID is required / Unauthorized: User not authenticated",
        });
        return;
      }

      const contact = await ContactService.getContactById(id, userId);

      res.status(200).json({
        success: true,
        message: "Message retrieved successfully",
        data: contact,
      });
    } catch (error: any) {
      if (error.message === "CONTACT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Message not found or you do not have access to it",
        });
        return;
      }

      console.error("Error fetching contact:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch contact",
      });
    }
  }
   static async getContactByIdadmin(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
     
      if (!id) {
        res.status(400).json({
          success: false,
          message:
            "Message ID is required" ,
        });
        return;
      }

      const contact = await ContactService.getContactByIdadmin(id);

      res.status(200).json({
        success: true,
        message: "Message retrieved successfully",
        data: contact,
      });
    } catch (error: any) {
      if (error.message === "CONTACT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
        return;
      }

      console.error("Error fetching contact:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch contact",
      });
    }
  }

  /**
   * Get contacts by logged in user
   */
  static async getMyContacts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
        return;
      }

      const contacts = await ContactService.getContactsByUserId(userId);

      res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: contacts,
      });
    } catch (error: any) {
      console.error("Error fetching contacts:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch contacts",
      });
    }
  }
  static async getProblemCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = ContactService.getProblemCategories();

    res.status(200).json({
      success: true,
      message: "Problem categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}
static async getAllContacts(req: Request, res: Response): Promise<void> {
  try {
    const contacts = await ContactService.getAllContacts();

    res.status(200).json({
      success: true,
      message: "All contact messages retrieved",
      data: contacts,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
}
}
