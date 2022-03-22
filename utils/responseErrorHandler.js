/**
 *
 * @param {import("express").Response} res
 * @param tryBlock
 */
const responseErrorHandler = (res, tryBlock) => {
	try {
		tryBlock();
	} catch (error) {
		res.status(400).send(error.code);
		console.log('THERE IS AN ERROR');
		switch (error.code) {
			case '(node:2524) UnhandledPromiseRejectionWarning: auth/id-token-expired':
				res.status(401).send(error.code);
				break;
			default:
				res.status(400).send(error.code);
		}
	}
};

module.exports = responseErrorHandler;
