let langFile = null,
	_memoise = [];

function readJsonFile(fileOrRef) {
	// var fileData = fs.readFileSync(fileRef);
	var fileData = typeof fileOrRef === "object" ? fileOrRef : require(fileRef);

	//General failure
	if (!fileData) {
		throw Error("Couldn't read file '" + fileRef + "'.");
	}

	//Parsing found file
	//Placing at the right variables
	// langFile = fileData = exports.langFile = JSON.parse(fileData);
	langFile = fileData;

	return fileData;
}

/**
 * Manages loading the file for usage
 *
 * @description Created the function
 * @author brunoteixeirasilva (druddr.com)
 * @version 1.0
 *
 * @param {string} fileOrRef The file which will be loaded
 */
export function loadLanguageFile(fileOrRef) {
	if (_memoise["loadLanguageFile"] !== fileOrRef || !langFile) {
		// langFile = exports.langFile = require(fileRef);
		readJsonFile(fileOrRef);

		//Sets method already resolved to the given param
		_memoise["loadLanguageFile"] = fileOrRef;
	}

	return langFile;
}

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
export function translate(key, params = null) {
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
}

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
export function tryTranslate(key, params = null, exposeException = false) {
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
}
