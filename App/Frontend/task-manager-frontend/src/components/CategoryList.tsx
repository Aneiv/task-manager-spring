import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Category {
    id: number;
    name: string;
}

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.get<Category[]>('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Błąd:", err));
    }, []);

    return (
        <ul>
            {categories.map(cat => <li key={cat.id}>{cat.name}</li>)}
        </ul>
    );
};

export default CategoryList;