export const getPaginationData = (page = 1, limit = 10) => {
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(25, Math.max(1, parseInt(limit))); 
    const skip = (pageNumber - 1) * limitNumber;

    return { pageNumber, limitNumber, skip };
};
