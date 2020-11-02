import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import { TAcceptDenyParams } from '../../../../generated/graphql';
import RequestBlockModel from '../../../../models/RequestBlockModel';
import UserModel from '../../../../models/UserModel';

import ValidationContract from '../../../../utis/validator/validator';

export default function acceptDeclineBlock(
  { acceptDenyParams } : { acceptDenyParams: TAcceptDenyParams}, context: any,
) {
  const tokenContent = verifyToken(context.authorization);
  if (tokenContent) {
    const {
      blockId,
      isAccept,
    } = acceptDenyParams;

    const contract = new ValidationContract();
    contract.isRequired(blockId, 'blockId is required');
    if (!contract.isValid()) {
      return new GraphQLError(contract.errors() || 'Review Signup information');
    }

    const keyToUpdate = isAccept ? 'acceptCount' : 'rejectCount';
    return RequestBlockModel
      .findOneAndUpdate(
        {
          _id: blockId,
          userId: { $ne: tokenContent.userId },
          votedUsers: { $nin: [tokenContent.userId] },
        },
        { $inc: { [keyToUpdate]: 1 }, $push: { votedUsers: tokenContent.userId } },
        { new: true },
      )
      .then(async (block: any) => {
        if (block) {
          const {
            rejectCount,
            acceptCount,
          } = block;
          // find all users length
          const userCount = await UserModel.countDocuments({ _id: { $ne: tokenContent.userId } });
          const deletedTheBlockAndMoveToBlockchain = async () => {
            await RequestBlockModel.findByIdAndDelete(blockId);
            // moveToBlockChain
          };
          if (acceptCount >= 0.51 * userCount) {
            await deletedTheBlockAndMoveToBlockchain();
          } else if (rejectCount >= 0.51 * userCount) {
            await deletedTheBlockAndMoveToBlockchain();
          }
          return block;
        }
        return new GraphQLError('Either you are the owner of the block, or you have already voted for the block');
      })
      .catch((er) => {
        console.log('acceptDeclineBlock failed', er);
        return new GraphQLError('acceptDeclineBlock failed', er);
      });
  }
  return new GraphQLError('Authentication token not present');
}