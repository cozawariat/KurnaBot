var Clapp = require('../modules/clapp-discord');
var china = require('../china');
//var say = require('../../say');
var ESpeak = require('node-espeak');
var shortid = require('shortid');
var _ = require('lodash');
var Fuse = require('fuse.js');
var fs = require('fs');

module.exports = new Clapp.Command({
	name: ".",
	desc: "does foo things",
	fn: (argv, context) => new Promise((resolve, reject) => {

		//var filter = _.filter(china.phrases, function(phrase){
		//	return phrase.toLowerCase().indexOf(argv.args.search) >= 0;
		//});

		var filtered = [],
			phrases = _.map(china.phrases, function(p){
				return { text: p }
			}),
			found = "";

		if ( argv.args.search ) {
			var fuse = new Fuse(phrases, {
				keys: [ 'text' ],
				shouldSort: true,
				tokenize: true,
				matchAllTokens: true,
				threshold: 0.4
			});
			filtered = fuse.search(argv.args.search);
			found = filtered.length ? ( argv.flags.random ? _.head( filtered ).text : _.sample(filtered).text ) : false;
		}
		
		found = filtered.length ? found : _.sample(china.phrases);

		found = found.replace(/[„”\:]/gi,'');

		var tempFilename = './wav/' + shortid.generate() + '.wav';
		ESpeak.initialize();
		ESpeak.onVoice(function(wav, samples, samplerate){
			var wavFile = fs.createWriteStream(tempFilename);
			wavFile.write(wav);
			wavFile.end();
			resolve({
				message: 'Plik został zapisany.',
				context: {
					fileName: tempFilename,
					ctx: context
				}
			});
		})
		ESpeak.speak(found);

	}),
	args: [
		{
			name: 'search',
			desc: 'A test argument',
			type: 'string',
			required: false,
			default: ""
		}
	],
	flags: [
		{
			name: 'random',
			desc: 'A test flag',
			alias: 'r',
			type: 'boolean',
			default: false
		}
	]
});
