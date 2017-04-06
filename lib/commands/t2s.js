var Clapp = require('../modules/clapp-discord');
var say = require('../../say');
var shortid = require('shortid');

module.exports = new Clapp.Command({
	name: "..",
	desc: "does foo things",
	fn: (argv, context) => new Promise((resolve, reject) => {

		var tempFilename = './wav/' + shortid.generate() + '.wav';

		say.export(argv.args.text, 'Alex', 0.5, tempFilename, function (error) {
			if (error) {
				console.log( 'command error: ', error);
				reject(error);
			}
			else {
				resolve({
					message: 'Plik został zapisany.',
					context: {
						fileName: tempFilename,
						ctx: context
					}
				});
			}
		})
	}),
	args: [
		{
			name: 'text',
			desc: 'A test argument',
			type: 'string',
			required: false,
			default: 'Błąd leży w pośpiechu'
		}
	],
	flags: [
		{
			name: 'testflag',
			desc: 'A test flag',
			alias: 't',
			type: 'boolean',
			default: false
		}
	]
});
