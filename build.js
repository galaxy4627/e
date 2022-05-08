const { config } = require('dotenv');
config();
const Express = require('express');
const ngrok = require('ngrok');
const Logger = require('./Logger.js');
const { WEBHOOK_URL, NGROK_TOKEN } = process.env;

if (NGROK_TOKEN === undefined) {
	throw new Error(
		'`process.env.NGROK_TOKEN` was undefined. Create a token here: https://ngrok.com/'
	);
}

if (WEBHOOK_URL === undefined) {
	throw new Error(
		'`process.env.WEBHOOK_URL` was undefined. Create a webhook here: https://webhook.site/'
	);
}

function main() {
	const log = new Logger(WEBHOOK_URL);

	const server = Express();

	const port = 44445;

	server.get('/python', function(req, res) {
		console.log('Running');
		var spawn = require("child_process").spawn;   
		var process = spawn('python',['client.py']);
		var output = '';
		process.stdout.on('data', function(data) {
			console.log("Sending Info")
			res.end(data.toString('utf8'));
		});
	
		console.log(output);
	});

	server.listen(port, 'localhost', async () => {
		log.info(`Express listening on port ${port} internally`);

		const url = await ngrok.connect({
			authtoken: NGROK_TOKEN,
			addr: port,
		});

		log.info('Tunnel URL:', url);
	});
}

main();