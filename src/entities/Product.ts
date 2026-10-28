import { EntitySchema } from "typeorm";
import { Category } from "./Category.js";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId: number;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductEntity = new EntitySchema<Product>({
  name: "Product",
  tableName: "products",
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String, length: 150 },
    description: { type: String, length: 500, nullable: true },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      // mssql returns decimals as strings, convert to number
      transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
      },
    },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    categoryId: { type: Number }, // the FK column
    createdAt: { type: Date, createDate: true },
    updatedAt: { type: Date, updateDate: true },
  },
  relations: {
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "categoryId" },
    },
  },
});