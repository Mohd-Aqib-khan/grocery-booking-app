import { Sequelize, DataTypes, Model, Optional, ForeignKey, BelongsTo, ModelStatic } from 'sequelize';
import { User } from './user'; // Adjust path based on your project structure

interface GroceryAttributes {
    id: number;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    createdBy: number | null;
    updatedBy: number | null;
}

interface GroceryCreationAttributes extends Optional<GroceryAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> { }

export class Grocery extends Model<GroceryAttributes, GroceryCreationAttributes> implements GroceryAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public isActive!: boolean;
    public createdBy!: number | null;
    public updatedBy!: number | null;

    // Association helpers
    static associate(models: { User: ModelStatic<Model<{}, {}>>; Inventory: ModelStatic<Model<{}, {}>> }) {
        Grocery.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
        Grocery.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
        Grocery.hasMany(models.Inventory, { foreignKey: 'grocery_id', as: 'inventories' });
    }
}

export default (sequelize: Sequelize) => {
    Grocery.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                field: 'created_at'
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                field: 'updated_at'
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                field: 'is_active'
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Table name
                    key: 'id',
                },
                field: 'created_by'
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Table name
                    key: 'id',
                },
                field: 'updated_by'
            },
        },
        {
            sequelize,
            tableName: 'groceries',
            timestamps: false, // Disable Sequelize's automatic timestamp fields
        }
    );

    Grocery.addHook('beforeUpdate', (grocery: Grocery) => {
        grocery.updatedAt = new Date(); // Update `updatedAt` before the update happens
    });

    return Grocery;
};
