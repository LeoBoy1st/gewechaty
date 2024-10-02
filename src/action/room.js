import {GetRoomInfo, InviteMember, DelMember, 
  ChangeRoomName, GetAnnouncement, SetAnnouncement,JoinRoom,
  GetRoomMemberInfo, GetRoomMemberList, CreateRoom, QuitRoom, GetQrcode} from '@/api/room.js'
import {Room} from '@/class/ROOM.js'
import {getAppId} from '@/utils/auth.js'
import {db} from '@/sql/index.js'
// import {getCached} from '@/action/common.js'
const appId = getAppId()

export const getRoomInfo = async (roomId) => {
  let room = null
  room = db.findOneByChatroomId(roomId)
  if(!room){ // 缓存中没有数据则从接口获取
    room = await GetRoomInfo({
      appId,
      chatroomId: roomId,
    })
    if(room){
      db.insertRoom(room)
    }
  }
  
  return new Room(room)
}


export const getRoomLiveInfo = async (roomId) => {
  let room = await GetRoomInfo({
      appId,
      chatroomId: roomId,
    })
  return room
}

export const updateRoomInfo = async (roomId) => {
  let room = null
  room = db.findOneByChatroomId(roomId)
  const roomInfo = await GetRoomInfo({
    appId,
    chatroomId: roomId,
  })

  if(room){ // 存在则更新否则插入
    console.log('更新房间信息', roomInfo)
    db.updateRoom(roomId, roomInfo)
  }else{
    db.insertRoom(roomInfo)
  }
  
  return new Room(roomInfo)
}

export const inviteMember = async (wxids, chatroomId, reason = '') => {
  return InviteMember({
    appId,
    wxids,
    chatroomId,
    reason
  })
}

export const delMember = async (wxids, chatroomId) => {
  return DelMember({
    appId,
    wxids,
    chatroomId
  })
}


export const find = async (query) => {
  let room = null
  if(typeof query ==='string'){
    room = db.findOneByChatroomId(query)
  }else if(typeof query ==='object'){
    if(query.topic){
      room = db.findOneByChatroomName(query.topic)
    }else{
      console.log('不支持的查询内容')
      return null
    }
  }
  return room? new Room(room) : null
}


export const findAll = async (query) => {
  let arr = []
  let rows = []
  if(!query){
    rows = db.findAllRooms()
  }else if(typeof query ==='object'){
    if(query.topic){
      rows = db.findAllByChatroomName(query.topic)
    }else{
      console.log('不支持的查询内容')
      return arr
    }
  }
  rows.map(item => {
    arr.push(new Room(item))
  })
  return arr
}

export const changeRoomName = async (chatroomId, chatroomName) => {
  return ChangeRoomName({
    appId,
    chatroomId,
    chatroomName
  })
}

export const getAnnouncement = async (chatroomId) => {
  return GetAnnouncement({
    appId,
    chatroomId
  })
}

export const setAnnouncement = async (chatroomId, content) => {
  return SetAnnouncement({
    appId,
    chatroomId,
    content
  })
}

export const getRoomMemberInfo = async (chatroomId, wxid) => {
  return GetRoomMemberInfo({
    appId,
    chatroomId,
    memberWxids: [wxid]
  })
}

export const getRoomMemberList = async (chatroomId) => {
  return GetRoomMemberList({
    appId,
    chatroomId
  })
}

export const createRoom = async (contactList, chatroomName) => {
  const {chatroomId} = await CreateRoom({
    appId,
    wxids: contactList.map(item => item._wxid),
  })
  await changeRoomName(chatroomId, chatroomName)
  return await getRoomInfo(chatroomId)
}

export const quitRoom = async (chatroomId) => {
  return QuitRoom({
    appId,
    chatroomId
  })
}

export const getQrcode = async (chatroomId) => {
  return GetQrcode({
    appId,
    chatroomId
  })
}

export const joinRoom = async (url) => {
  return JoinRoom({
    appId,
    url
  })
}