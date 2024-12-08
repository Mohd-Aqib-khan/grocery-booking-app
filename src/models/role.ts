import { Sequelize, DataTypes, Model } from 'sequelize';

interface RoleAttributes {
    id?: number; // Optional for Sequelize auto-generated fields
    name: string;
}

export default (sequelize: Sequelize) => {
    class Role extends Model<RoleAttributes> implements RoleAttributes {
        id!: number;
        name!: string;

        static associate(models: Record<string, typeof Model>) {
            // Define associations here if needed
            // Example: Role.hasMany(models.User, { foreignKey: 'roleId' });
        }
    }

    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Role',
            tableName: 'role',
            timestamps: false, // Set to false if the table does not have `createdAt` and `updatedAt`
        }
    );

    return Role;
};
