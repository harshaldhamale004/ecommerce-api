import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { ProductEntity } from "../entities/Product.js";
import { CategoryEntity } from "../entities/Category.js";
import { AppError } from "../utils/AppError.js";

const repo = () => AppDataSource.getRepository(ProductEntity);
const categoryRepo = () => AppDataSource.getRepository(CategoryEntity);

// POST /api/products
export const create = async (req: Request, res: Response) => {
  const { name, description, price, stock, categoryId } = req.body;

  if (!name || price == null || !categoryId) {
    throw new AppError("name, price and categoryId are required", 400);
  }
  const category = await categoryRepo().findOneBy({ id: Number(categoryId) });
  if (!category) throw new AppError("Category not found", 404);

  const product = await repo().save({
    name,
    description,
    price,
    stock: stock ?? 0,
    categoryId: Number(categoryId),
  });
  res.status(201).json({ success: true, data: product });
};

// GET /api/products?search=&categoryId=&minPrice=&maxPrice=&page=&limit=
export const getAll = async (req: Request, res: Response) => {
  const { search, categoryId, minPrice, maxPrice } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 100);

  const qb = repo()
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.category", "category")
    .where("product.isActive = :active", { active: true });

  if (search) qb.andWhere("product.name LIKE :search", { search: `%${search}%` });
  if (categoryId) qb.andWhere("product.categoryId = :categoryId", { categoryId: Number(categoryId) });
  if (minPrice) qb.andWhere("product.price >= :minPrice", { minPrice: Number(minPrice) });
  if (maxPrice) qb.andWhere("product.price <= :maxPrice", { maxPrice: Number(maxPrice) });

  const [items, total] = await qb
    .orderBy("product.id", "ASC") // MSSQL requires ORDER BY for pagination
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  res.json({
    success: true,
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

// GET /api/products/:id
export const getById = async (req: Request, res: Response) => {
  const product = await repo().findOne({
    where: { id: Number(req.params.id) },
    relations: { category: true },
  });
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, data: product });
};

// PUT /api/products/:id
export const update = async (req: Request, res: Response) => {
  const product = await repo().findOneBy({ id: Number(req.params.id) });
  if (!product) throw new AppError("Product not found", 404);

  const { name, description, price, stock, categoryId, isActive } = req.body;
  repo().merge(product, { name, description, price, stock, categoryId, isActive });
  res.json({ success: true, data: await repo().save(product) });
};

// PATCH /api/products/:id/stock
export const updateStock = async (req: Request, res: Response) => {
  const { stock } = req.body;
  if (typeof stock !== "number" || stock < 0) {
    throw new AppError("stock must be a number >= 0", 400);
  }
  const product = await repo().findOneBy({ id: Number(req.params.id) });
  if (!product) throw new AppError("Product not found", 404);

  product.stock = stock;
  res.json({ success: true, data: await repo().save(product) });
};

// DELETE /api/products/:id  (soft delete)
export const remove = async (req: Request, res: Response) => {
  const product = await repo().findOneBy({ id: Number(req.params.id) });
  if (!product) throw new AppError("Product not found", 404);

  product.isActive = false;
  await repo().save(product);
  res.status(204).send();
};