import { GraphQLError } from 'graphql';

import UserModel from 'models/UserModel';
import { verifyToken } from 'utis/jwt/jwt';

export default async function allUsers(context: any) {
  try {
    let conditions:any = {};
    if (context.authorization) {
      const tokenContent = await verifyToken(context.authorization);
      if (tokenContent) {
        conditions = {
          _id: { $ne: tokenContent.userId },
        };
      }
    }

    return UserModel.find(conditions).lean();
  } catch (e) {
    console.log('allUsers e()', e);
    throw new GraphQLError(`Internal server allUsers e() : ${e}`);
  }
}
