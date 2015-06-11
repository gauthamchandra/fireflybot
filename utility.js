var request = require('request');

var characters: [
		{ name: 'Mal', imgUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c17.17.216.216/s50x50/33812_129779800419184_6218916_n.jpg?oh=d15dfb1b9ec70741343ec4f0957d09f5&oe=55F36080&__gda__=1441699895_502cc7590b0b41d6d92f97ec6a40f590' },
		{ name: 'Zoe', imgUrl: 'http://images2.fanpop.com/image/polls/363000/363976_1264269882193_50.jpg'},
		{ name: 'Wash', imgUrl: 'http://a.deviantart.net/avatars/o/d/oddact.jpg'},
		{ name: 'Jayne', imgUrl: 'http://www.dystopianmovies.org/wp-content/uploads/jayne-cobb-serenity-adam-baldwin-64x64.jpg'},
		{ name: 'Kaylee', imgUrl: 'https://pbs.twimg.com/profile_images/514138273472864256/xGzl76tW_normal.jpeg'}
	];

function onError(error, status, body) {
	if (error) {
		//some error that has nothing to do with us occured so just pass it on
		return next(error);
	} else if (status !== 200) {
		//something happened so inform user
		return next(new Error('Incoming Webhook: ' + status + ' ' + body));
	} else {
		return response.status(200).end();
	}
}

module.exports = {



	getRandomItem: function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}
	sendToSlack: function send(payload) {
		var path = process.env.INCOMING_WEBHOOK_PATH;

		//if no username is provided, grab a random Firefly character and use that.
		if (!payload.username) {
			var character = getRandomItem(characters);
			payload.username = character.name;
			payload.icon_url = character.imgUrl;
		}

		request({
			uri: path,
			method: 'POST',
			body: JSON.stringify(payload)
		}, function (error, response, body) {
			if (error) {
				return callback(error);
			}

			onError(null, response.statusCode, body);
		});
	}
};