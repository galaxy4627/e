const fetch = require('node-fetch');
const { format } = require('util');

class Logger {
	constructor(webhook) {
		this.webhook = webhook;
	}
	async info(...args) {
		console.info(...args);
		await this.request(['info', format(args)]);
	}
	async request(body) {
		await fetch(this.webhook, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		});
	}
}

module.exports = Logger;
