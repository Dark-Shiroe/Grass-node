require("colors");

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function welcome() {
  process.stdout.write("\x1Bc");
  console.log("Tool được phát triển bởi nhóm tele Airdrop Hunter Siêu Tốc (https://t.me/airdrophuntersieutoc)".yellow);
  console.log();
}

module.exports = { delay, welcome };
