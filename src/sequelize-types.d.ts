import { Model, ModelStatic } from 'sequelize';

export type AssociateFunction = (models: Record<string, ModelStatic<Model>>) => void;

export type ExtendedModelStatic = ModelStatic<Model> & {
    associate?: AssociateFunction;
};
