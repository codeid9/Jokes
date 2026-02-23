import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios.js";

export const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            const { data } = await axiosInstance.get("/categories");
            setCategories(data.data);
        } catch (error) {
            console.error("Categories fetch fail!", error);
            setError("Category fetch fail!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories, loading,error }}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryProvider;
