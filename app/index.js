const path = require('path');
const fs = require('fs');
const config = require('./utils/config');

/**
 * 初始化并获取配置
 */
async function applyConfig() {
  // 获取工作目录
  const baseDir = path.resolve(__dirname, '../');
  config.init(baseDir);
  const files = fs.readdirSync(`${baseDir}/config`);

  // 加载 config 目录下的配置文件
  for (const file of files) {
    await config.getConfigFromFile(`config/${file}`);
  }
}

const run = async () => {
  await applyConfig();
  const { createApp } = require('./app');
  const app = await createApp();
  const port = config.getItem('port');
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });
};

// 启动应用
run();
