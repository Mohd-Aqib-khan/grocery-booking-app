import { Sequelize, DataTypes, Model, Optional, CreationOptional, ModelStatic } from 'sequelize';

interface InventoryAttributes {
    id: number;
    warehouseId: number;
    groceryId: number;
    stock: number;
    isActive: boolean;
    createdAt: CreationOptional<Date>;
    updatedAt: Date;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    public id!: number;
    public warehouseId!: number;
    public groceryId!: number;
    public stock!: number;
    public isActive!: boolean;
    public createdAt!: CreationOptional<Date>;
    public updatedAt!: Date;

    // Associations
    static associate(models: { Warehouse: ModelStatic<Model<{}, {}>>; Grocery: ModelStatic<Model<{}, {}>> }) {  
        Inventory.belongsTo(models.Warehouse, { foreignKey: 'warehouse_id', as: 'warehouse' });
        Inventory.belongsTo(models.Grocery, { foreignKey: 'grocery_id', as: 'grocery' });
    }
}

export default (sequelize: Sequelize) => {
    Inventory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            warehouseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'warehouse', // Refers to the `warehouse` table
                    key: 'id',
                },
                field: 'warehouse_id',
                onDelete: 'CASCADE', // Ensures related inventory is deleted when the warehouse is deleted
            },
            groceryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'groceries', // Refers to the `groceries` table
                    key: 'id',
                },
                field: 'grocery_id',
                onDelete: 'CASCADE', // Ensures related inventory is deleted when the grocery item is deleted
            },
            stock: {
                type: DataTypes.INTEGER,
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
        },
        {
            sequelize,
            tableName: 'inventory',
            timestamps: false, // Disable Sequelize's automatic timestamp fields
            indexes: [
                {
                    unique: true,
                    fields: ['warehouse_id', 'grocery_id'], // Unique constraint to prevent duplicates for the same item in the same warehouse
                },
            ],
        }
    );

    return Inventory;
};
