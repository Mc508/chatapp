import ws from "ws";
import jwt from "jsonwebtoken";
import fs from "fs";
import {connection} from "mongoose";
import {on} from "events";
const createWebSocketServer = (server) => {
	const wss = new ws.WebSocketServer({server});

	wss.on("connection", (connection, req) => {
		const notifyAboutOnlinePeople = async () => {
			const onlineUsers = await Promise.all(
				Array.from(wss.clients).map(async (client) => {
					const {userId, username} = client;
					const user = await User.findById(userId);
					const avatatLink = user ? user.avatatLink : null;
					return {userId, username, avatatLink};
				}),
			);

			[...wss.clients].forEach((client) => {
				client.send(
					JSON.stringify({
						online: onlineUsers,
					}),
				);
			});
		};
	});

	connection.isAlive = true;

	connection.timer = setInterval(() => {
		connection.ping;
		connection.deathTimer = setTimeout(() => {
			connection.isAlive = false;
			clearInterval(connection.timer);
			connection.terminate();
			notifyAboutOnlinePeople();
			console.log("dead");
		}, 1000);
	}, 5000);
	connection.on("pong", () => {
		clearTimeout(connection.deathTimer);
	});

	const cookies = req.headers.cookie;
	if (cookies) {
		const tokenString = cookies
			.split(";")
			.find((str) => str.startsWith("authToken="));
		if (tokenString) {
			const token = tokenString.split("=")[1];
			jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
				if (err) {
					console.log(err);
				}
				const {_id, firstName, lastName, email} = userData;
				connection.userId = _id;
				connection.username = `${firstName} ${lastName}`;
			});
		}
	}
	connection.on("message", async (message) => {
		const messageData = JSON.parse(message.toString());
		const {recipient, text} = messageData;
		const msgDoc = await Message.create({
			sender: connection.userId,
			recipient,
			text,
		});
		if (recipient && text) {
			[...wss.clients].forEach((client) => {
				if (client.userId === recipient) {
					client.send(
						JSON.stringify({
							sender: connection.username,
							text,
							id: msgDoc._id,
						}),
					);
				}
			});
		}
		notifyAboutOnlinePeople();
		console.log("Online Users:", onlineUsers);
	});
};

export default createWebSocketServer;
