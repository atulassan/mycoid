import { MycoidMessage, MycoidChat, MycoidVisitor, MycoidBranchusers } from '../entities';
import { getRepository, In } from 'typeorm';
import { Status } from '../enum';
import { UserType } from '../enum/userType.enum';


export const universalUserAndCustomerList = async function (io, request, userDetails) {
  // if (socket.decode?.userType == 'BRANCHUSER') {

  let userId = userDetails.userType.toLowerCase() + 'Id';
  const checkUserVisitedBranch = await getRepository(MycoidVisitor).find({
    // select: ["visitorId","mycoidCustomer"],
    where: [
      userDetails.userType == UserType.CUSTOMER ? { customerId: userDetails[userId] } : { userId: userDetails[userId] }

    ],

    relations: ['mycoidCustomer', 'mycoidBranchusers'], //,'mycoidBranch'

  });
  // const queryFormation = userDetails.userType == 'CUSTOMER' ?"visitor.customerId=:userId": "visitor.userId=:userId" ;
  // const checkUserVisitedBranch = await getRepository(MycoidVisitor)
  //   .createQueryBuilder('visitor')
  //   .select(["visitor.branchId"
  //     // "mycoidCustomer.customerId", "mycoidCustomer.firstName", "mycoidCustomer.lastName", //"visitor.*",

  //     //"mycoidBranch.branchId", "mycoidBranch.branchName"
  //   ])
  //   .leftJoinAndSelect('visitor.mycoidCustomer', 'mycoidCustomer')
  //   .leftJoinAndMapMany('visitor.mycoidBranchusers',
  //   //MycoidBranchusers,
  //   qb => qb.select(["mycoidBranchuser.branchuserId", "mycoidBranchuser.branchId as branchId", "mycoidBranchuser.firstName", "mycoidBranchuser.lastName"]).from(MycoidBranchusers, 'mycoidBranchuser'),
  //   'mycoidBranchuser','mycoidBranchuser.branchId=visitor.branch_id')
  //   //'mycoidBranchuser','mycoidBranchuser.branchId=visitor.branchId')
  //  // .leftJoin('visitor.mycoidBranch', 'mycoidBranch')
  //   .groupBy('visitor.branchId')
  //   .where(`${queryFormation}`, { userId: userDetails[userId] }).getMany();
  ///relations: ['mycoidCustomer','mycoidBranchusers','mycoidBranch'],
  // console.log('queryFormation',queryFormation)

  //console.log('checkUserVisitedBranch', checkUserVisitedBranch);// checkUserVisitedBranch[0]['mycoidBranchusers'])

  // let results = await getRepository(MycoidChat).createQueryBuilder('chat')
  //   .select("chat.message AS message, chat.senderId, chat.senderUserType")
  //   .addSelect("COUNT(*) AS count")
  //   .where(`chat.receiverUserType=:userType and chat.seen=0 and chat.receiverId=:userId`, { userId: userDetails[userId], userType: userDetails.userType })
  //   .groupBy("chat.senderId, chat.senderUserType")
  //   .orderBy('chat.createdDatetime', 'DESC')
  //   .getRawMany()
  // console.log('resultsresultsresults', results);
  // const checkUserVisitedBranch = await getRepository(MycoidVisitor).find({
  //   where: [
  //     {senderUserType:socket.decode?.userType},
  //     {receiverUserType:socket.decode?.userType},
  //     {senderId:socket.decode[userId]},
  //     {receiverId:socket.decode[userId]}
  //   ],
  //   relations: ['user'],
  // });
  // console.log('checkUserVisitedBranch',checkUserVisitedBranch)
  // }

  let friends = { customer: {}, branchUser: {} };

  if (checkUserVisitedBranch) {
   // await checkUserVisitedBranch.forEach(async (val) => {
    for (let i = 0; i < checkUserVisitedBranch.length; i++) {
      let val=checkUserVisitedBranch[i]
      console.log('valvalval', val.mycoidCustomer)
      if (val.mycoidCustomer) {
        let { customerId, firstName, lastName } = val.mycoidCustomer
        if (userDetails.userType != UserType.CUSTOMER || (userDetails.userType == UserType.CUSTOMER && userDetails[userId] != customerId))
          friends['customer'][customerId] = { customerId, firstName,userId:customerId, lastName, userType: UserType.CUSTOMER };
      }
      if (val.mycoidBranchusers) {
       // await val.mycoidBranchusers.forEach(async (brancUser) => {
        for (let j= 0; j < val.mycoidBranchusers.length; j++) {
         let branchUser=val.mycoidBranchusers[j]
          let { firstName, lastName, branchuserId } = branchUser;
          if (userDetails.userType != UserType.BRANCHUSER || (userDetails.userType != UserType.BRANCHUSER && userDetails[userId] != branchuserId)) {

            const count = await universalCheckMessageSeen(UserType.BRANCHUSER, branchuserId);
            const message = await universalGetlastMessage(UserType.BRANCHUSER, branchuserId);
            friends['branchUser'][branchuserId] = { branchuserId, firstName,userId:branchuserId, lastName, userType: UserType.BRANCHUSER, unreadCount: count, lastMessage: message };
            console.log('countcountcount', count)
            
          }

        }
      
      }

    }
   
  }
  console.log('dddd=', `userAndCustomerList-${userDetails.userType}-${userDetails[userId]}`)
  console.log('friendsfriends', friends);
  return io.emit(`userAndCustomerList-${userDetails.userType}-${userDetails[userId]}`, friends);
};

const universalCheckMessageSeen = async (userType, id) => {
  const getChatHistoryCount = await getRepository(MycoidChat).findAndCount({
    where: {
      senderId: id,
      senderUserType: userType,
      seen: false,
    },
  });
  return getChatHistoryCount[1];
};

const universalGetlastMessage = async (userType, id) => {
  const getChatlastMessage = await getRepository(MycoidChat).findOne({
    where: {
      senderId: id,
      senderUserType: userType,
    },
    order: {
      id: 'DESC',
    },
  });
  return getChatlastMessage
    ? getChatlastMessage.message
    : 'let start the conversation';
};

export const universalGetOnetoOneConversation = async function (io, request,userDetails) {
  let userId = userDetails.userType.toLowerCase() + 'Id';
  const getChatHistory = await getRepository(MycoidChat).find
  ({
    where:[ {  receiverUserType: request.userType,receiverId: request.userId,senderUserType: userDetails.userType,
      senderId:userDetails[userId]},
      {  senderUserType: request.userType,senderId: request.userId,receiverUserType: userDetails.userType,
        receiverId:userDetails[userId]}],
    order: {
      createdDatetime: 'ASC',
    }  });
  io.emit(`getOneTOneConversation-${request.userType}-${request.userId}`, {
    message: getChatHistory.map(value => {
      return value;
    }),
  });
};

export const universalUpdateMessageSeenStatus = async id => {
  // return await getRepository(MycoidMessage).update(id, {
  return;

  // });
};
