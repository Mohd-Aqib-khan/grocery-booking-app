import { Sequelize, DataTypes, Model, Optional, CreationOptional, ModelStatic } from 'sequelize';

interface OrderItemAttributes {
    id: number;
    orderId: number;
    groceryId: number;
    quantity: number;
    price: number;
    isActive: boolean;
    createdAt: CreationOptional<Date>;
    updatedAt: Date;
    createdBy: number | null;
    updatedBy: number | null;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
    public id!: number;
    public orderId!: number;
    public groceryId!: number;
    public quantity!: number;
    public price!: number;
    public isActive!: boolean;
    public createdAt!: CreationOptional<Date>;
    public updatedAt!: Date;
    public createdBy!: number | null;
    public updatedBy!: number | null;

    // Associations
    static associate(models: { Order: ModelStatic<Model<{}, {}>>; Grocery: ModelStatic<Model<{}, {}>>; User: ModelStatic<Model<{}, {}>> }) {
        OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
        OrderItem.belongsTo(models.Grocery, { foreignKey: 'groceryId', as: 'grocery' });
        OrderItem.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
        OrderItem.belongsTo(models.User, { foreignKey: 'updatedBy', as: 'updater' });
    }
}

export default (sequelize: Sequelize) => {
    OrderItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders', // Refers to the `orders` table
                    key: 'id',
                },
            },
            groceryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'groceries', // Refers to the `groceries` table
                    key: 'id',
                },
                field: 'grocery_id',
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1, // Ensures that quantity is greater than 0
                },
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                field: 'is_active',
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                field: 'created_at',
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                field: 'updated_at',  
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Refers to the `users` table
                    key: 'id',
                },
                field: 'created_by',
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Refers to the `users` table
                    key: 'id',
                },
                field: 'updated_by',
            },
        },
        {
            sequelize,
            tableName: 'order_items',
            timestamps: false, // Disable Sequelize's automatic timestamp fields
            validate: {
                quantityPositive(this: OrderItem) {
                    if (this.quantity <= 0) {
                        throw new Error('Quantity must be greater than 0');
                    }
                },
            },
        }
    );

    return OrderItem;
};
