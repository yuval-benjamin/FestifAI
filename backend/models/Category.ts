import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    items: {
        name: string;
        link: string;
    }[]
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    items: [
        {
            name: { type: String, required: true },
            link: { type: String, required: true },
        }
    ]
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
