import axiosInstance from '../api/axiosInstance';
import { FestivalCategory } from '../App';

export const fetchCategories = async (category: FestivalCategory): Promise<Category> => {
    try {
        const response = await axiosInstance.get(`/category/${category}`);
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