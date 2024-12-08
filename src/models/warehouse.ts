import { Sequelize, DataTypes, Model, Optional, CreationOptional, ModelStatic } from 'sequelize';
import { User } from './user'; // Adjust path as needed

interface WarehouseAttributes {
    id: number;
    name: string;
    location: string;
    createdAt: CreationOptional<Date>;
    updatedAt: Date;
    createdBy: number | null;
    updatedBy: number | null;
}

interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
    public id!: number;
    public name!: string;
    public location!: string;
    public createdAt!: CreationOptional<Date>;
    public updatedAt!: Date;
    public createdBy!: number | null;
    public updatedBy!: number | null;

    // Associations
    static associate(models: { User: ModelStatic<Model<{}, {}>> }) {
        Warehouse.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
        Warehouse.belongsTo(models.User, { foreignKey: 'updatedBy', as: 'updater' });
    }
}

export default (sequelize: Sequelize) => {
    Warehouse.init(
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
            location: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Refers to the `users` table
                    key: 'id',
                },
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'users', // Refers to the `users` table
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            tableName: 'warehouse',
            timestamps: false, // Disable Sequelize's automatic timestamp fields
        }
    );

    return Warehouse;
};
