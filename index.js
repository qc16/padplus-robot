const { Wechaty, UrlLink } = require('wechaty')
const { ScanStatus } = require('wechaty-puppet')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const QrcodeTerminal  = require('qrcode-terminal')
const schedule = require('node-schedule')
const OSS = require('ali-oss')
const moment = require('moment')
const { decodeAvatar, mint } = require('./lib')
require('dotenv').config();

const thumbnailUrl = 'https://static.chain.pro/chain/praad.gif'

const APPID = process.env.APPID
const REDIRECT_URI = process.env.REDIRECT_URI
const token = process.env.TOKEN
const puppet = new PuppetPadplus({
  token,
})

let avatarList = {}
let mintRecord = {}
const ossclient = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  bucket: process.env.BUCKET
})

const name  = 'robot1'
const lastSpeakTime = {}
const bot = new Wechaty({
  puppet,
  name,
})

schedule.scheduleJob('0 0 0 * * *', async (fireDate) => {
  console.log('start the task...', fireDate)
  mintRecord = {}
  avatarList = {}
})

bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      console.log(qrcode, 'qrcode')
      QrcodeTerminal.generate(qrcode, {
        small: true
      })
    }
  })
  .on('login', async (user) => {
    console.log(`login success, user: ${user}`)
  })
  .on('message', async (msg) => {
    const text = msg.text().trim()
    const room = msg.room()
    const contact = msg.from()
    const roomkey = `${room.id}${contact.id}`

    // const file = await contact.avatar()
    // const name = file.name
    // await file.toFile(name, true)
    // console.log(`Contact: ${contact.name()} with avatar file: ${name}`)
    console.log(`msg : ${msg}`)
    try {
      if (room) {
        // mint
        if (!mintRecord[roomkey]) {
          try {
            if (!avatarList[roomkey]) {
              const avatar = await getAvatar(contact)
              avatarList[roomkey] = avatar
            }
            if (avatarList[roomkey]) {
              const { data: { result } } = await decodeAvatar(avatarList[roomkey])
              console.log(result, 'decode avatar--')
              if (result) {
                await mint(result)
                mintRecord[roomkey] = true
              } else {
                avatarList[roomkey] = ''
              }
            }
          } catch (error) {
            console.log(error)
          }
        }
        
        if (text === '钱包') {
          const redirectUri = encodeURIComponent(`${REDIRECT_URI}/#/`)
          const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
    
          const linkPayload = new UrlLink({
            description: '快速转账、收款、抵押',
            thumbnailUrl,
            title: '点击进入钱包（请收藏）',
            url
          })
          console.log(`${room.id}wallet`, 'room key')
          if (checkTime(`${room.id}wallet`)) await room.say(linkPayload)
        }
      
        if (text === '抽奖') {
          const redirectUri = encodeURIComponent(`${REDIRECT_URI}/#/activity/lucky-wheel`)
          const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
          const title = '点击进入抽奖'
          const description = 'PRM大奖等你拿'
          const linkPayload = new UrlLink({
            description,
            thumbnailUrl,
            title,
            url
          })
          if (checkTime(`${room.id}lottery`)) await room.say(linkPayload)
        }
      }
    } catch (error) {
      console.log(error)
    }
  })
  .on('logout', (user, reason) => {
    console.log(`logout user: ${user}, reason : ${reason}`)
  })
  .start()
  .catch(console.error)

function checkTime(key) {
  const timestamp = lastSpeakTime[key]
	if (timestamp) {
		const timeElapsed = Date.now() / 1000 - timestamp
		console.log(timeElapsed, '发送消息时间间隔')
		if (timeElapsed < 30) {
      return false
    }
    lastSpeakTime[key] = Date.now() / 1000
    return true
	}
  lastSpeakTime[key] = Date.now() / 1000
  return true
}

async function getAvatar(contact) {
  // const avatarFile = await contact.avatar()
  // const buffer = await avatarFile.toBuffer()
  // const name = getSuggestName()
  // const result = await ossclient.put(name, buffer)
  // const avatarPath = 'https://static.chain.pro/' + name
  // console.log(result, avatarPath, 'user avatar')
  // return avatarPath
  const file = await contact.avatar()
  const headimgurl = file.remoteUrl && file.remoteUrl.replace(/\d+$/, 0)
  console.log(headimgurl, 'file----')
  return headimgurl
}

function getSuggestName () {
  let remotefile = 'wx_image/'
  let daystring = moment().format('l')
  remotefile = remotefile + daystring + '/'
  let name = new Date().getTime() + '.jpg'
  name = remotefile + name
  return name
}