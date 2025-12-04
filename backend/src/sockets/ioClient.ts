import config from 'config'
import io from 'socket.io-client'
import SocketMessages from './socket-enums/socket-enums'

const socket = io(`ws://${config.get('io.host')}:${config.get('io.port')}`)

export function emitLikes(vacationId: string, change: 1 | -1, clientId: string, userId: string) {
    socket.emit(SocketMessages.LikesUpdated, { vacationId, change, clientId, userId })
}

export default socket
