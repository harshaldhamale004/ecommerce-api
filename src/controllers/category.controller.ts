import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { CategoryEntity } from "../entities/Category.js";

const repo = () => AppDataSource.getRepository(CategoryEntity);

export const create = async (req: Request, res: Response) => {
  const category = await repo().save(req.body);
  res.status(201).json({ success: true, data: category });
};

export const getAll = async (req: Request, res: Response) => {
  const data = await repo().find();
  res.json({ success: true, data });
};

export const getById = async (req: Request, res: Response) => {
  const category = await repo().findOneBy({ id: Number(req.params.id) });
  if (!category) return res.status(404).json({ success: false, error: "Category not found" });
  res.json({ success: true, data: category });
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const category = await repo().findOneBy({ id });
  if (!category) return res.status(404).json({ success: false, error: "Category not found" });
  repo().merge(category, req.body);
  res.json({ success: true, data: await repo().save(category) });
};

export const remove = async (req: Request, res: Response) => {
  const result = await repo().delete(Number(req.params.id));
  if (result.affected === 0)
    return res.status(404).json({ success: false, error: "Category not found" });
  res.status(204).send();
};