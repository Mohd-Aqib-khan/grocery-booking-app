interface Inventory {
    id?: number;
    warehouseId: number;
    stock: number;
}
interface GroceryItem {
    id?: number;
    name: string;
    price: number;
    stock?: number;
    inventories?: Inventory[];
}

export { GroceryItem, Inventory };
