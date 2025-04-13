import { z } from "zod";
import { formatPriceforProduct } from "./utils";

//Schema for inserting products

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?$/.test(formatPriceforProduct(Number(val))),
    "Price must be exactly 2 decimal places"
  );
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must have min 3 characters"),
  slug: z.string().min(3, "Slug must have min 3 characters"),
  category: z.string().min(3, "Category must have min 3 characters"),
  brand: z.string().min(3, "Brand must have min 3 characters"),
  description: z.string().min(3, "Description must have min 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Produxt must have min 1 image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
