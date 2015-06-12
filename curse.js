var _ = require('underscore');
var ffutility = require('./utility');


var curses = [
	{ curse: '笨天生的一堆肉。', pronounciation: 'BUN tyen-shung duh ee-DWAY-RO', translation: 'Stupid Inbred Stack of Meat', explicit: true },
	{ curse: '吸牛 piece of crap!', pronounciation: 'Shee-niou piece of crap!', translation: 'Cow sucking piece of crap!', explicit: false },
	{ curse: '狒狒的屁眼', pronounciation: 'FAY-FAY duh PEE-yen', translation: 'A baboon\'s asshole', explicit: true },
	{ curse: '真沒耐性的佛祖', pronounciation: 'Jen mei NAI-shing duh FWO-tzoo', translation: 'Extraordinarily Impatient Budda', explicit: false},
	{ curse: '熊貓尿', pronounciation: 'Shiong mao niao', translation: 'Panda Piss', explicit: false },
	{ curse: '青蛙操的流氓', pronounciation: 'Ching-wah TSAO duh liou mahng', translation: 'Frog-Humping Son of a Bitch', explicit: true },
	{ curse: '流口水的婊子和猴子的笨兒子', pronounciation: 'Liou coe shway duh biao-tze huh hoe-tze duh ur-tze', translation: 'Stupid Son of a Drooling Whore and a Monkey', explicit: true },
	{ curse: '跟猴子比丟屎', pronounciation: 'Gun HOE-tze bee DIO-se', translation: 'Have a Shit-Throwing Contest with a Monkey', explicit: true }, 
	{ curse: '喝畜生雜交的髒貨', pronounciation: 'Huh choo-shung tza-jiao duh tzang-huo', translation: 'Filthy Fornicators of Livestock', explicit: false },
	{ curse: '羔羊中的孤羊', pronounciation: 'Gao yang jong duh goo yang', translation: 'Motherless Goats of All Motherless Goats', explicit: false },
	{ curse: '我的媽和她的瘋狂的外甥都', pronounciation: 'Wuh duh ma huh tah duh fong kwong duh wai shung', translation: 'Holy Mother of God and All Her Wacky Nephews', explicit: false },
	{ curse: '太空所有的星球塞盡我的屁股', pronounciation: 'Tai-kong suo-yo duh shing-chiou sai-jin wuh duh pee-goo', translation: 'Shove All the Planets in the Universe Up my Ass', explicit: true },
	{ curse: '大象爆炸式的拉肚子', pronounciation: 'Da-shiang bao-tza shr duh lah doo-tze', translation: 'The Explosive Diarrhea of an Elephant', explicit: false },
	{ curse: '神聖的睾丸', pronounciation: 'Shun-SHENG duh gao-WAHN', translation: 'Holy Testicle Tuesday', explicit: false }
];

module.exports = function(request, response, next) {
	var userName = request.body.user_name;
	var isExplicitModeEnabled = false; //for safety's sake, explicit mode is off by default.
	var isPronounciationEnabled = false;

	if (request.body.text) {
		//check if they specified the 'explicit' flag (i.e 'explicit=false')
		var explicitFlagText = request.body.text.match(/explicit=.+?(?=\s)/);
		var pronounciationText = request.body.text.match(/\bpronounce\b/);

		if (explicitFlagText && explicitFlagText.length > 0) {
			//if multiple are specified (i.e duplicate flag setting), just grab the last one
			isExplicitModeEnabled = explicitFlagText[explicitFlagText.length - 1].replace('test=', '') === 'true';
		}	

		if (pronounciationText && pronounciationText.length > 0) {
			isPronounciationEnabled = true;
		}
	}


	var curse = (isExplicitModeEnabled) ? ffutility.getRandomItem(curses) : ffutility.getRandomItem(_.where(curses, { explicit: false }));
	var text = curse.curse;

	if (isPronounciationEnabled) {
		text = curse.curse + ' (pronounced ' + curse.pronounciation + ')';
	}

	text += ' which means: ' + curse.translation;

	var botPayload = {
		text: text,
		channel: request.body.channel_id
	};

	ffutility.sendToSlack(botPayload, next).then(function() {
		response.status(200).end();
	});
};