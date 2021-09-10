import React, { useEffect, useState, useRef } from 'react';
import LeftSidebar from '../shared/Modules/LeftSidebar';
// import { getData } from "../../services/main-service";
import { timeAgo } from "../../utils"
import { send, connectSocket, receive } from '../../actions'
import { connect } from 'react-redux';
//var io = require('socket.io-client')

// import Header1 from './Header1';
// import $ from "jquery";

function Mittellungen(props: any) {


	//const [chatHistory, setChatHistory] = useState<any | []>([])
	const [currentUser, setCurrentUser] = useState({ type: "BRANCHUSER", userId: '' })
	const [selectedUser, setSelectedUser] = useState({ userType: '', userId: '', message: '' })
	const [message, setMessage] = useState('');
	const { dispatch } = props;
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => {
		messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" }) // Object is possibly 'null' (for refToElement.current)
	}
	useEffect(() => {

		dispatch(connectSocket())
		async function callApi() {
			const query = new URLSearchParams(props.location.search);

			let userId = query.get('branchuser_id');

			//	await setCurrentUser({ type: "BRANCHUSER", userId: query.get('branchuser_id') || '' });
			if (props.user.userType == 'CUSTOMER') {

				userId = props.user.customerId;
				await setCurrentUser({ type: "CUSTOMER", userId: userId || '' });
				console.log('query', props)
			}
			else if (props.user?.userType == 'BRANCHUSER') {

				userId = props.user.branchuserId;
				await setCurrentUser({ type: "BRANCHUSER", userId: userId || '' });
			}
			else {
				userId = props.user.userId;
				await setCurrentUser({ type: "USER", userId: userId || '' });
			}

			// getData(`/chat/user/` + type + '/' + userId)
			// 	.then((res: any) => {
			// 		console.log('response is :', res);
			// 		setChatHistory(res.data.response.data);
			// 	})
			// 	.catch((err: any) => {
			// 		console.log('this error from customer api', err);
			// 	});
			console.log('currentUser', currentUser)
			console.log('enventName', `userAndCustomerList-${props.user.userType}-${userId}`)

			dispatch(send('getUserFriendList', { userType: props.user.userType, userId: userId, message: 'Hi' }))
			dispatch(receive(`userAndCustomerList-${props.user.userType}-${userId}`));
			scrollToBottom;
		}
		callApi();

		//console.log('dis', props)


		//dispatch(receive("chat"));

		//const socket = io('http://localhost:5000/api/v1');
		//   const socket = io.io('http://localhost:5000', {
		//     query: { token: 'sfsdfsdf' },
		//   });
		// const socket = io.connect(process.env.SOCKET_HOST, {
		// 	path: '/socket.io',
		// 	forceNew: true,
		//   });
		// console.log('socket',socket) 
		// socket.on("connect", () => {
		// 	console.log('socket.id',socket.id); // ojIckSD2jqNzOqIrAGzL
		//   });

		//   socket.on('connect', function(){
		//     console.log('client connected')
		//   });
		//   socket.on('event', function(data:any){
		//     console.log('ddd',data)
		//   });
		//   socket.on('disconnect', function(){
		//     console.log('client Disconnected')
		//   });
		//	dispatch(send('getUserFriendList',''))


		//	dispatch(send('getOneTOneConversation', { userType: props.user.userType, userId: currentUser.userId, message: 'Hi' }))
	}, [])

	// var aDay = 24 * 60 * 60 * 1000;
	// console.log('aaa', timeAgo(new Date(Date.now() - aDay * 60)));
	// console.log('bbb', timeAgo(new Date(Date.now() + aDay * 2)));
	// console.log('customers are', chatHistory);


	// useEffect(() => {
	//   return(
	//     var menu_h = $('.top-header').height();
	//      $(".menu-category-bar").addClass('active');
	//      $('.menu-category-bar').css({ "top": menu_h });
	//      $('.basket-title-container').css({ "top": menu_h });
	//   );
	// }, [])
	const sendChat = async () => {
		if (selectedUser.userType) {
			console.log('messagemessage', message, selectedUser);
			dispatch(send(`oneToOneChat-${currentUser.type}-${currentUser.userId}`, { userType: selectedUser.userType, userId: selectedUser.userId, message: message }))
			await setMessage('');
		}
		return;

		//e.preventDefault();
	}



	const chatlist = () => {
		let tmp = ''
		if (props.chatReducer.chat && Array.isArray(props.chatReducer.chat.message))
			return props.chatReducer.chat.message.map((chat: any) => {
				if (tmp != chat.createdDatetime) {
					tmp = chat.createdDatetime;
					return (
						<div>
							<li>
								<div className="chat-date">{timeAgo(chat.createdDatetime)}</div>
							</li>

							<li className={(chat.senderUserType == currentUser.type ? "replies " : "sent")}>
								<div className={"chat-image " + (chat.senderUserType == currentUser.type ? "right " : "left")}><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
								<p>{chat.message}</p>
							</li>
						</div>
					)
				}
				return (
					<li className={(chat.senderUserType == currentUser.type ? "replies " : "sent")}>
						<div className={"chat-image " + (chat.senderUserType == currentUser.type ? "right " : "left")}><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
						<p>{chat.message}</p>
					</li>
				)

			});
	}
	const getChat = async (user: any) => {
		await setSelectedUser(user);
		dispatch(send(`getOneTOneConversation-${currentUser.type}-${currentUser.userId}`, { userType: user.userType, userId: user.userId, }))
		dispatch(receive(`getOneTOneConversation-${user.userType}-${user.userId}`));

	}
	if (props.chatReducer.chat && Array.isArray(props.chatReducer.chat.message))
		scrollToBottom();
	console.log('ttttt', `getOneTOneConversation-${selectedUser.userType}-${selectedUser.userId}`)
	dispatch(receive(`getOneTOneConversation-${selectedUser.userType}-${selectedUser.userId}`));
	const loadUserList = (data: any) => {
		return Object.keys(data).map((key: any, index: any) => {
			let user = data[key];
			return Object.keys(user).map((key: any, index: any) => {
				let customer = user[key];
				return (
					<li className={customer == selectedUser ? "open-chat" : ''} onClick={() => getChat(customer)} key={customer.userType + '-' + index}>
						<figure className="avatar ">
							<img src={customer?.image ? customer.image : '/assets/images/man_avatar1.jpg'} className="rounded-circle" alt="man_avatar" />
						</figure>
						<div className="users-list-body">
							<div>
								<h5>{customer.firstName} {customer.lastName}</h5>
								<p>{customer.lastMessage || `message`}</p>
							</div>
							{customer.unreadCount ?
								<div className="users-list-action">
									<div className="new-message-count">{customer.unreadCount}</div>
									<small className="text-primary">03:41 PM</small>
								</div> : ''}
						</div>
					</li>
				)
			});
		});
	}
	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
		if (event.key === 'Enter') {
			sendChat();
		}
	}
	//const {chatReducer}=props;
	return (

		<div>
			{/* <Header1 /> */}
			<LeftSidebar />
			<div className="mainWrapper">
				<div className="row no-gutters">
					<div className="col-xl-9 col-lg-8 col-md-8">
						<div className="mainWrapperBody">
							<div className="chatBase">
								<div className="chat-box-inner page-scroll">
									<div className="messages">
										<ul>
											{chatlist()}


											{/* <li>
												<div className="chat-date">20.07.2020</div>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies ">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li>
											
											<li>
												<div className="chat-date">Heute</div>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies ">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies ">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies ">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies ">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li>
											<li className="sent">
												<div className="chat-image left"><img src="assets/images/admin.jpg" alt="admin" /><span className="chat-time">1.00 PM</span></div>
												<p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
											</li>
											<li>
												<div className="chat-date">Gestern</div>
											</li>
											<li className="replies ">
												<div className="chat-image right"><img src="assets/images/user.jpg" alt="User icon" /><span className="chat-time">1.01 PM</span></div>
												<p>When you're backed against the wall, break the god damn thing down.</p>
											</li> */}
										</ul>
										<div ref={messagesEndRef} />
									</div>
								</div>
								<div className="basket-order-button">
									<div className="message-input">
										<div className="input-group">
											<input onKeyDown={(e) => { onKeyDown(e) }} type="text" value={message} onChange={e => setMessage(e.target.value)} className="form-control" placeholder="Eine Nachricht schreiben" />
											<div className="input-group-append">
												<button className="btn attach" type="button"><i className="lnr lnr-paperclip" /></button>
												<button className="btn btn-success " onClick={() => sendChat()} type="button"><i className="lnr lnr-rocket" /></button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-4 col-md-4">
						<div className="basket-container box-shadow-left">
							<div className="basket-title-container">
								<p className="basket-title">Chat</p>
							</div>
							<div className="basket-container-scroller page-scroll">
								<ul className="chat-contact-box list-group">
									{/* <li>
										<figure className="avatar avatar-state-success">
											<img src="/assets/images/man_avatar1.jpg" className="rounded-circle" alt="man_avatar" />
										</figure>
										<div className="users-list-body">
											<div>
												<h5 className="text-primary">Townsend Seary</h5>
												<p>What's up, how are you?</p>
											</div>
											<div className="users-list-action">
												<div className="new-message-count">3</div>
												<small className="text-primary">03:41 PM</small>
											</div>
										</div>
									</li>

									<li>
										<figure className="avatar avatar-state-warning">
											<img src="/assets/images/man_avatar1.jpg" className="rounded-circle" alt="man_avatar" />
										</figure>
										<div className="users-list-body">
											<div>
												<h5 className="text-primary">Townsend Seary</h5>
												<p>What's up, how are you?</p>
											</div>
											<div className="users-list-action">
												<div className="new-message-count">3</div>
												<small className="text-primary">03:41 PM</small>
											</div>
										</div>
									</li>
									<li className="open-chat">
										<figure className="avatar ">
											<img src="assets/images/man_avatar1.jpg" className="rounded-circle" alt="man_avatar" />
										</figure>
										<div className="users-list-body">
											<div>
												<h5>Townsend Seary</h5>
												<p>What's up, how are you?</p>
											</div>
										</div>
									</li> */}
									{loadUserList(props.chatReducer.chatUserList)}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}


// componentDidMount() {
//     var menu_h = $('.top-header').height();
//     $(".menu-category-bar").addClass('active');
//     $('.menu-category-bar').css({ "top": menu_h });
//     $('.basket-title-container').css({ "top": menu_h });
// } 
// Note:componentDidMount equelent to useUseEffect hook is commended above in functional component
// const mapDispatchToProps = (dispatch:any) => {
// 	return {
// 	  // dispatching plain actions
// 	  SEND: () => dispatch({ type: 'SEND' }),
// 	  //decrement: () => dispatch({ type: 'DECREMENT' }),
// 	  //reset: () => dispatch({ type: 'RESET' })
// 	}
//   }
function mapStateToProps(state: any) {
	console.log('ssssss', state);
	// const { isLoggedIn } = state.auth;
	const { user } = state.auth;
	const { chatReducer } = state;
	return {
		//  isLoggedIn,
		chatReducer,
		user
	};

}
export default connect(mapStateToProps)(Mittellungen)
