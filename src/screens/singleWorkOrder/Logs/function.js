export const manipulateData = (data, sortOrder, searchQuery) => {
    const sortedData = [...data].sort((a, b) => {
        const inventoryA = a.inventory;
        const inventoryB = b.inventory;
        if (sortOrder === 'max') {
            return inventoryB - inventoryA;
        } else if (sortOrder === 'min') {
            return inventoryA - inventoryB;
        }
        return 0;
    });
    if (!searchQuery) {
        return sortedData;
    }
    const normalizedQuery = searchQuery.toLowerCase();
    return sortedData.filter((el) => {
        const process = (el.process || '').toString().toLowerCase();
        const part = (el.partName || '').toString().toLowerCase();
        return process.includes(normalizedQuery) || part.includes(normalizedQuery);
    });
};