import { Sequelize, DataTypes, Model, Optional, Association, ModelStatic } from 'sequelize';

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    role: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public role!: number;
    public isActive!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;

    // Association helpers
    public static associations: {
        roleDetails: Association<User, Model>; // Define association type
    };

    // Define associations
    static associate(models: { Role: ModelStatic<Model<{}, {}>> }) {
        User.belongsTo(models.Role, { foreignKey: 'role', as: 'roleDetails' });
    }
}

export default (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'role', // Table name
                    key: 'id',
                },
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
            tableName: 'users',
            timestamps: false, // Disable Sequelize's automatic timestamps
        }
    );

    return User;
};
