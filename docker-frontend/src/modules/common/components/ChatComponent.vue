<template>
<div>
  <VueAdvancedChat
    :current-user-id="$userAuth.sub"
    height="68vh"
    :messages="messages"
    :messages-loaded="messagesLoaded"
    :rooms="[defaultRoom]"
    :rooms-list-opened="false"
    rooms-loaded
    :show-add-room="false"
    :show-audio="false"
    :show-emojis="false"
    :show-files="false"
    :show-reaction-emojis="false"
    :show-search="false"
    single-room
    :text-messages="{
      CONVERSATION_STARTED: 'Conversación iniciada el:',
      ROOMS_EMPTY: 'Salas vacías',
      ROOM_EMPTY: 'Sala vacía',
      NEW_MESSAGES: 'Nuevos mensajes',
      MESSAGE_DELETED: 'Mensaje eliminado',
      MESSAGES_EMPTY: 'Sin mensajes',
      TYPE_MESSAGE: 'Ingrese un mensaje',
      SEARCH: 'Buscador',
      IS_ONLINE: 'Conectado',
      LAST_SEEN: 'Última conexión',
      IS_TYPING: 'Está escribiendo...',
      CANCEL_SELECT_MESSAGE: 'Cancelar selección'
    }"
    :username-options="{
      minUsers: 2,
      currentUser: false
    }"
    @send-message="handleSendMessage"
  />
</div>
</template>

<script setup>
import { ref, computed, defineProps, onBeforeUnmount } from 'vue'

import VueAdvancedChat from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'

import { io } from 'socket.io-client'
import { useAppGlobalProperties } from '../composables'
import { propTypes } from '../types'
import { apiRGP } from '@/config/axios'
import moment from 'moment'

const props = defineProps({
  roomId: propTypes.string
})
const { $userName, $userAuth } = useAppGlobalProperties()
console.warn('[CHAT]', 'roomId: ' + props.roomId, 'user: ' + $userName.value)

let firstTime = true

const messagesLoaded = ref(false)

const defaultRoom = ref({
  roomId: props.roomId,
  roomName: $userName.value,
  avatar: computed(() => require('@/assets/images/foto-perfil.png')),
  users: []
})

const messages = ref([])

const socket = io(process.env.VUE_APP_BASE_URL_API_RGP, { path: '/apifront/chat/live', query: { user_key: process.env.VUE_APP_USER_KEY } })
socket.on('rgp:chat-to-client', (message) => {
  messages.value.push({
    _id: new Date().toISOString(),
    senderId: message.senderId,
    username: message.username,
    content: message.content,
    date: moment(message.date).format('DD/MM/YYYY HH:mm'),
    timestamp: moment(message.date).format('HH:mm')
  })
})

const currentUser = {
  _id: $userAuth.value.sub,
  username: $userName.value,
  status: {
    state: 'online'
  }
}

socket.on('rgp:alert-active-users', (message) => {
  if (!defaultRoom.value.users.find((u) => u._id === message._id)) {
    defaultRoom.value.users.push(message)
  }
})

socket.on('rgp:joined-room', (message) => {
  if (firstTime) {
    defaultRoom.value.users.push(currentUser)
    console.log(message)
    firstTime = false
  }
  socket.emit('rgp:alert-active-user', currentUser)
})

socket.on('rgp:left-room', (message) => {
  const userIndexToDelete = defaultRoom.value.users.findIndex((u) => u._id === message._id)

  defaultRoom.value.users.splice(userIndexToDelete, 1)
})

function handleSendMessage (e) {
  socket.emit('rgp:chat-to-server', {
    roomId: props.roomId,
    username: $userName.value,
    senderId: $userAuth.value.sub,
    content: e.content
  })
}

async function init () {
  let initialMessages = []
  console.log(moment().format('HH:mm'))
  try {
    const { data } = await apiRGP.get(`apifront/chat/messages/${props.roomId}`)
    const mensajesOrdenadosPorFecha = data.sort((a, b) => moment(a.date).unix() - moment(b.date).unix())

    initialMessages = mensajesOrdenadosPorFecha.map((d) => {
      return {
        ...d,
        date: moment(d.date).format('DD/MM/YYYY HH:mm'),
        timestamp: moment(d.date).format('HH:mm')
      }
    })
  } catch (error) {
    console.error(error)
  }

  messagesLoaded.value = true

  socket.emit('rgp:join-room', {
    ...currentUser,
    roomId: props.roomId
  })

  messages.value.push(...initialMessages.map((m) => ({ ...m, _id: m.id })))
}

init()

onBeforeUnmount(() => {
  socket.disconnect()
  console.warn('[CHAT]', 'leave-room')
  socket.emit('rgp:leave-room', {
    roomId: props.roomId,
    _id: $userAuth.value.sub
  })
})
</script>
