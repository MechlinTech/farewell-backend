import { contactUsCategories } from "@prisma/client";

export const CONTACT_CATEGORIES = [
  { type: contactUsCategories.PAYMENT_AND_REFUND },
  { type: contactUsCategories.DELIVERY_AND_RIDER },
  { type: contactUsCategories.ACCOUNT_AND_VERIFICATION },
  { type: contactUsCategories.TECHNICAL_ISSUES },
  { type: contactUsCategories.SAFETY_FRAUD_AND_POLICY },
];