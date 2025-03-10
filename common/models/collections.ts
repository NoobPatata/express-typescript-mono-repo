import { appModels } from '../database/appConnection';
import type { UserSchema } from '../database/schemas/user';
import { modelBaseGenerator } from './base';

export class User extends modelBaseGenerator<UserSchema>() {
    protected static override readonly collection = appModels.userCollection;
}
