## 特点

- 文字识别：通过微信接收文字消息并进行识别处理。
- 自定义回复：根据用户发送的消息自动回复，提供方便快捷的交互体验。
- （添加你的项目特色特性）

## 安装

1. 克隆项目到本地：

```bash
git clone https://github.com/qc16/padplus-robot.git
```

2. 安装依赖：

```bash
cd padplus-robot
npm install
```

## 使用

1. 在微信公众平台中创建一个新的公众号或者小程序，并获取相应的AppID和AppSecret。
2. 在项目根目录下创建一个`.env`文件，并设置以下环境变量：

```plaintext
APPID=your_app_id
REDIRECT_URI=your_redirect_uri
TOKEN=your_robot_token
ACCESS_KEY_ID=your_access_key
ACCESS_KEY_SECRET=your_access_secret
```

3. 启动应用：

```bash
npm start
```