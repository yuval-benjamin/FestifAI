import axios from 'axios';
import { FestivalCategory } from '../App';

export const fetchCategories = async (category: FestivalCategory): Promise<Category> => {
    try {
        const response = await axios.get(`http://localhost:3000/category/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

type Category = {
    name: string;
    items: CategoryItem[]
}

export type CategoryItem = {
    name: string
    link: string;
}