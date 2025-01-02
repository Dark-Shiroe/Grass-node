require("colors");
const inquirer = require("inquirer");
const Bot = require("./src/Bot");
const Config = require("./src/Config");
const { fetchProxies, readLines, selectProxySource } = require("./src/ProxyManager");
const { delay, welcome } = require("./src/utils");

async function main() {
  welcome();
  console.log(`Initializing socket...\n`.yellow);

  await delay(1000);

  const config = new Config();
  const bot = new Bot(config);

  const proxySource = await selectProxySource(inquirer);

  let proxies = [];
  if (proxySource.type === "file") {
    proxies = await readLines(proxySource.source);
  } else if (proxySource.type === "url") {
    proxies = await fetchProxies(proxySource.source);
  } else if (proxySource.type === "none") {
    console.log("No proxy selected. Connect directly.".cyan);
  }

  if (proxySource.type !== "none" && proxies.length === 0) {
    console.error("Proxy not found. Exiting...".red);
    return;
  }

  console.log(proxySource.type !== "none" ? `Find ${proxies.length} proxy`.green : "Enable noproxy mode".green);

  const userIDs = await readLines("data.txt");
  if (userIDs.length === 0) {
    console.error("No user ID found in data.txt. Exiting...".red);
    return;
  }

  console.log(`Find ${userIDs.length} account\n`.green);

  const connectionPromises = userIDs.flatMap((userID) => (proxySource.type !== "none" ? proxies.map((proxy) => bot.connectToProxy(proxy, userID)) : [bot.connectDirectly(userID)]));

  await Promise.all(connectionPromises);
}

main().catch(console.error);
