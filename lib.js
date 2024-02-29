const rp =require('request-promise')

const baseUrl = 'https://block.chain.pro/discovery-ad'

const apiUpdateReward = `${baseUrl}/api/v1/chat/bot/set_question_user_index`
const apiUpdateReason = `${baseUrl}/api/v1/chat/bot/update_reason`
const apiGetMintRecord = `${baseUrl}/api/v1/chat/bot/get_user_index_by_roomid`
const apiGetQuestion = `${baseUrl}/api/v1/chat/bot/question`
const apiShortDomain = `${baseUrl}/api/v1/read_task/short_url`
const apiChainBind = `${baseUrl}/api/v1/mainnet/bind`
const apiUpdateAvatar = `${baseUrl}/api/v1/mainnet/update_avatar`
const apiDecodeAvatar = `${baseUrl}/api/v1/mainnet/decode_avatar`
const apiMint = `${baseUrl}/api/v1/mainnet/mining`

async function getMintHistory (roomid, taskId) {
  return rp({
    method: 'GET',
    url: apiGetMintRecord,
    qs: {
      roomid,
      task_id: taskId
    },
    json: true
  })
}

async function generateShortDomain (url) {
  const longUrl = encodeURIComponent(url)
  return rp({
    method: 'GET',
    url: `${apiShortDomain}?url=${longUrl}`,
    json: true
  })
}

async function chainBindSn (sn, wxid, pid, avatar, nickName) {
  return rp({
    method: 'POST',
    url: apiChainBind,
    body: {
      sn,
      wxid,
	  p_wxid: pid,
      avatar,
      nick_name: nickName
    },
    json: true
  })
}

async function updateAvatar (wxid, avatar) {
  return rp({
    method: 'POST',
    url: apiUpdateAvatar,
    body: {
      wxid,
      avatar
    },
    json: true
  })
}

async function decodeAvatar(avatar) {
  return rp({
    method: 'GET',
    url: apiDecodeAvatar,
    qs: {
      avatar
    },
    json: true
  })
}

async function mint (did) {
  return rp({
    method: 'GET',
    url: apiMint,
    qs: {
      did
    },
    json: true
  })
}

module.exports = {
    decodeAvatar, mint
}