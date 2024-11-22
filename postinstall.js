/*
 * --------------------------------------------------------
 *    Web kept on crashing and having issues cause of react native maps.
 *    Found this on stack overflow and github, and it did actually solve the problem.
 *    I think it essentially loads an empty module for web usage to avoid the issue.
 *    I am not sure if this is still needed after I decided to use OpenLayers to solve
 *    Maps for web, although I havent found any cons by just leaving it here for now.
 * 
 * 		https://stackoverflow.com/questions/76629674/unable-to-resolve-utilities-platform-error-with-metro-bundler
 *
 *    Just another reminder, this is not my code.
 *    Sorry for any inconvenience.
 * --------------------------------------------------------
 */
const chalk = require("chalk");
const { readFile, writeFile, copyFile } = require("fs").promises;

console.log(chalk.green("here"));

function log(...args) {
	console.log(chalk.yellow("[react-native-maps]"), ...args);
}

reactNativeMaps = async function () {
	log(
		"📦 Creating web compatibility of react-native-maps using an empty module loaded on web builds"
	);
	const modulePath = "node_modules/react-native-maps";
	await writeFile(
		`${modulePath}/lib/index.web.js`,
		"module.exports = {}",
		"utf-8"
	);
	await copyFile(
		`${modulePath}/lib/index.d.ts`,
		`${modulePath}/lib/index.web.d.ts`
	);
	const pkg = JSON.parse(await readFile(`${modulePath}/package.json`));
	pkg["react-native"] = "lib/index.js";
	pkg["main"] = "lib/index.web.js";
	await writeFile(
		`${modulePath}/package.json`,
		JSON.stringify(pkg, null, 2),
		"utf-8"
	);
	log("✅ script ran successfully");
};

reactNativeMaps();
