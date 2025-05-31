import { Request, Response } from "express";
import { Category } from "../models/Category";

export async function retreiveCategoryItems(req: Request, res: Response) {
    try {
        const category = req.params.category;
        const categoryItem = await Category.findOne({ name: category });

        res.status(200).send({ items:  categoryItem?.items || [] });
    } catch (error) {
        console.error("Error retrieving category items:", error);
        res.status(500).send({ error: "Internal server error" });
    }
};