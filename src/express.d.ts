import express from "express";
import { Model, Sequelize } from 'sequelize';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                roleId: string;
                roleName: string;
                
            };
        }
    }

    type AssociateFunction = (models: Record<string, typeof Model>) => void;

    interface ExtendedModel extends Model {
        associate?: AssociateFunction;
    }
}