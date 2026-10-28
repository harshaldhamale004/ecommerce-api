import { EntitySchema } from "typeorm";

export interface Category{
    id: number;
    name: string;
    description?:string;
    createdAt: Date
}

export const CategoryEntity = new EntitySchema<Category>({
    name:"Category",
    tableName: "categories",
    columns:{
        id: {type: Number, primary:true, generated:true},
        name: { type: String, length: 100, unique: true },
        description: { type: String, length: 255, nullable: true },
        createdAt: { type: Date, createDate: true },
    },
});