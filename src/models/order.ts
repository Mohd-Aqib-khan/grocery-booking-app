import { Sequelize, DataTypes, Model, Optional, CreationOptional, ModelStatic } from 'sequelize';
import { User } from './user'; // Adjust path as needed

interface OrderAttributes {
    id: number;
    userId: number;
    orderDate: CreationOptional<Date>;
    totalPrice: number;
    status: string;
    isActive: boolean;
    createdAt: CreationOptional<Date>;
    updatedAt: Date;
    createdBy: number;
    updatedBy: number | null;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'orderDate' | 'createdAt' | 'updatedAt'> { }

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public userId!: number;
    public orderDate!: CreationOptional<Date>;
    public totalPrice!: number;
    public status!: string;
    public isActive!: boolean;
    public createdAt!: CreationOptional<Date>;
    public updatedAt!: Date;
    public createdBy!: number;
    public updatedBy!: number | null;

    // Associations
    static associate(models: { User: ModelStatic<Model<{}, {}>> }) {
        Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Order.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
        Order.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
    }
}

export default (sequelize: Sequelize) => {
    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Refers to the `users` table
                    key: 'id',
                },
                field: "user_id",
            },
            orderDate: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(20),
                defaultValue: 'Pending', // Default status is 'pending'
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
                allowNull: false,
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
            tableName: 'orders',
            timestamps: false, // Disable Sequelize's automatic timestamp fields
        }
    );

    return Order;
};
