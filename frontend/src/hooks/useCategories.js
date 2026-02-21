import { useContext } from "react";
import { CategoryContext } from "../context/CategoryContext.jsx";

const useCategories = () => {
    const context = useContext(CategoryContext);

    if (!CategoryContext)
        throw new Error("useCategories must be used within a CategoryProvider");

    return context;
};

export default useCategories;
