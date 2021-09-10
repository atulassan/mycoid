import {  MycoidMessage, MycoidChat } from '../entities';
import { getRepository, In } from 'typeorm';
import {
  universalGetOnetoOneConversation,
  universalUserAndCustomerList,
  universalUpdateMessageSeenStatus,
  
} from './index';
import _ from 'lodash';

export async function sendMessage(io, socket) {
  const userDetails = socket.decoded;
  let userId = userDetails.userType.toLowerCase() + 'Id';
  console.log('oneToOneChat',`oneToOneChat-${userDetails.userType}-${userDetails[userId]}`)
  await socket.on(`oneToOneChat-${userDetails.userType}-${userDetails[userId]}`, async request => {
    console.log('requestrequest',request)
    await getRepository(MycoidChat).save({
      senderUserType: userDetails.userType,
      senderId:userDetails[userId],
      message: request.message,
      receiverUserType: request.userType,
      receiverId: request.userId,
    });
    await universalGetOnetoOneConversation(io, request,userDetails);
    //await universalUserAndCustomerList(io, request, socket);
  //  await universalUserAndCustomerList(io, request, request.id);
  });
}

export async function updateMessageSeenStatus(io, socket) {
  const userId = socket.decoded.id;
  await socket.on('updateMessageSeenStatus', async request => {
    for (let list of request.list) {
      await universalUpdateMessageSeenStatus(list.id);
    }
   // await universalUserAndCustomerList(io, request, userId);
  });
}

export async function getOneToOneConversation(io, socket) {
  const userDetails = socket.decoded;
  let userId = userDetails.userType.toLowerCase() + 'Id';
  socket.on(`getOneTOneConversation-${userDetails.userType}-${userDetails[userId]}`, async request => {
    console.log('message',request)
    await universalGetOnetoOneConversation(io, request,userDetails);
  });
}

export async function getUserFriendList(io, socket) {
  const userDetails = socket.decoded;
  console.log('userId==', socket.decoded);
  await socket.on('getUserFriendList', async request => {
    await universalUserAndCustomerList(io, request, userDetails);
  });
}
