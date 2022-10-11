import {
  ormCreateMatchEntry as _createMatchEntry,
  ormListValidMatchEntriesByDifficulty as _listValidMatchEntriesByDifficulty,
} from '../model/match-orm.js'

export async function createMatchEntry(req, res) {
  // retrieve match info from client
  const { username, difficulty, start_time, socket_id } = req.body

  // retrieve socket from client
  const io = req.io

  // add user match entry to database
  const create_response = await _createMatchEntry(
    username,
    difficulty,
    start_time,
    socket_id
  )

  try {
    // list valid entries
    const valid_entries = await _listValidMatchEntriesByDifficulty(
      difficulty,
      start_time,
      socket_id
    )
    console.log('VALID ENTRY:')
    console.log(valid_entries)

    // check for valid entries
    if (valid_entries.length == 0) {
      console.log('There is no matching avaiable now')
      io.emit('matchUnavai')
      return res.status(200).json({ message: 'Not OK! No available match entry at the moment!' })
    }

    // delete entry once match found
    console.log('Found match.')
    const first_valid_entry = { ...valid_entries[0].dataValues }
    valid_entries[0].destroy()

    // get socket id of users
    const user1_socket_id = first_valid_entry['socket_id']
    const user2_socket_id = socket_id
    console.log(user1_socket_id)
    console.log(user2_socket_id)

    // create socket room
    const user1_socket = io.sockets.sockets.get(user1_socket_id)
    const user2_socket = io.sockets.sockets.get(user2_socket_id)
    const room_id = user1_socket_id + user2_socket_id

    // ensure both users socket can be communicated by server socket
    if (!user1_socket || !user2_socket) {
      io.to(user1_socket).to(user2_socket).emit('matchFailure')
      return res.status(200).json({ message: 'Not OK! Server socket cannot communicate to both user sockets.' })
    }

    user1_socket.join(room_id)
    user2_socket.join(room_id)
    console.log('Created room ' + room_id)

    io.sockets.in(room_id).emit('matchSuccess', { room_id })
    return res.status(200).json({ message: 'ok' })

  } catch(err) {
    console.log(err)
    return res.status(500).json({message: err})
  }
}
