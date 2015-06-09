module.exports = function(request, response, next) {
	var userName = request.body.user_name;
	var botPayload = {
		text: 'Hello ' + userName + '!'
	};

	//all bots have the username 'slackbot' so make sure we don't respond to our own messages
	//and cause an infinite loop.
	if (userName !== 'slackbot') {
		return response.status(200).json(botPayload);
	} else {
		return response.status(200).end();
	}
};