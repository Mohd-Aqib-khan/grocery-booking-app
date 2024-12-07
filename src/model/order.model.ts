interface OrderItem {
    groceryId: number;
    quantity: number;
}

interface OrderRequest {
    userId: number;
    items: OrderItem[];
}