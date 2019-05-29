var langFile = (exports.langFile = null);

var _memoise = [];

/**
 * Manages loading the file for usage
 *
 * @description Created the function
 * @author brunoteixeirasilva (druddr.com)
 * @version 1.0
 *
 * @param {string} fileRef The file which will be loaded
 */
exports.loadLanguageFile = function(fileRef) {
	if (_memoise["loadLanguageFile"] !== fileRef || !langFile) {
		langFile = exports.langFile = require(fileRef);

		//Sets method already resolved to the given param
		_memoise["loadLanguageFile"] = fileRef;
	}

	return langFile;
};

/**
 * Exposes the passed key (with our w/o params) as a text message; if
 * passed on a valid key found on any of the available language files at /i18n
 *
 * @author brunoteixeirasilva (druddr.com)
 * @version 1.0
 *
 * @param {string} key the key of the text message to be listed out from an i18n file
 * @param {Object} params object where props are the key-value pair at the text message;
 * E.g. { userName: 'John' } will look for a prop written as "${userName}"
 */
exports.translate = function(key, params = null) {
	let result;

	//File was not loaded yet
	if (!langFile)
		throw Error(
			"Language file wasn't loaded. Have you invoked loadLanguageFile(fileRef)?"
		);

	result = !langFile ? null : langFile[key];

	if (!result)
		throw Error(
			`Language item with key => "${key}" was not found in lang (i18n) file`
		);

	if (params)
		Object.keys(params).forEach(param => {
			result =
				result.indexOf(param) > -1
					? result.replace("${" + param + "}", `${params[param]}`)
					: result;
		});

	return result;
};

/**
 * [try-catch-wrapped] Exposes the passed key (with our w/o params) as a text message; if
 * passed on an invalid key, not-found on the active language file at /i18n, will return false
 *
 * @author brunoteixeirasilva
 * @version 1.0
 *
 * @param {string} key the key of the text message to be listed out from an i18n file
 * @param {Object} params object where props are the key-value pair at the text message;
 * 							E.g. { userName: 'John' } will look for a prop written as "${userName}"
 * @param {Boolean} exposeException Will expose (rethrow an error) if =>true, encapsulate if =>false
 */
exports.tryTranslate = function(key, params = null, exposeException = false) {
	let result = false;

	try {
		result = translate(key, params);
	} catch (ex) {
		//Error was set to be exposed
		//Rethrows the error
		if (!!exposeException) throw ex;
	}

	//In the case the error shouldn't be exposed
	//Or successfully found
	//Will return the resultant extent
	return result;
};
