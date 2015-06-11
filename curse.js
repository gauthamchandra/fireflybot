var request = require('request');

var curses = [
	{ curse: '笨天生的一堆肉。', pronounciation: 'BUN tyen-shung duh ee-DWAY-RO', translation: 'Stupid Inbred Stack of Meat' },
	{ curse: '吸牛 piece of crap!', pronounciation: 'Shee-niou piece of crap!', translation: 'Cow sucking piece of crap!' },
	{ curse: '狒狒的屁眼', pronounciation: 'FAY-FAY duh PEE-yen', translation: 'A baboon\'s asshole' },
	{ curse: '真沒耐性的佛祖', pronounciation: 'Jen mei NAI-shing duh FWO-tzoo', translation: 'Extraordinarily Impatient Budda'}
];

function randomCurse() {
	return curses[Math.floor(Math.random() * curses.length)];
}

function send(payload, callback) {
	var path = process.env.INCOMING_WEBHOOK_PATH;

	request({
		uri: path,
		method: 'POST',
		body: JSON.stringify(payload)
	}, function (error, response, body) {
		if (error) {
			return callback(error);
		}

		callback(null, response.statusCode, body);
	});
}

module.exports = function(request, response, next) {
	var userName = request.body.user_name;
	var curse = randomCurse();
	var botPayload = {
		username: 'Mal',
		icon_url: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c17.17.216.216/s50x50/33812_129779800419184_6218916_n.jpg?oh=d15dfb1b9ec70741343ec4f0957d09f5&oe=55F36080&__gda__=1441699895_502cc7590b0b41d6d92f97ec6a40f590',
		text: curse.curse + '(' + curse.translation + ')',
		channel: request.body.channel_id
	};

	send(botPayload, function(error, status, body) {
		if (error) {
			//some error that has nothing to do with us occured so just pass it on
			return next(error);
		} else if (status !== 200) {
			//something happened so inform user
			return next(new Error('Incoming Webhook: ' + status + ' ' + body));
		} else {
			return response.status(200).end();
		}
	});

	// //all bots have the username 'slackbot' so make sure we don't respond to our own messages
	// //and cause an infinite loop.
	// if (userName !== 'slackbot') {
	// 	return response.status(200).json(botPayload);
	// } else {
	// 	return response.status(200).end();
	// }
};