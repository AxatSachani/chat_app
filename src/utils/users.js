const users = []

//addUser, removeUser, getUser, getUserInRoom


// add New User
const addUser = ({ id, username, room }) => {
    //clean the data(trim space, caseSensitive)
    username = username.trim()
    room = room.trim()

    //check data is validate or not (given or not given(empty))
    if (!username || !room) {
        if (!username) {
            return {
                error: 'Username is required'
            }
        } else if (!room) {
            return {
                error: 'Room is required'
            }
        }
    }

    //check for user existing 
    const existingUser = users.find((user) => {
        return user.room.toLowerCase() === room.toLowerCase() && user.username.toLowerCase() === username.toLowerCase()
    })

    //validate data username
    if (existingUser) {
        return {
            error: 'Username is in use !'
        }
    }
    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

// Remove User
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

//getUser
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

//getUsersInRoom
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



















// addUser({
//     id: 01,
//     username: 'axat',
//     room: 'one'
// })
// const val = addUser({
//     id: 02,
//     username: 'abc',
//     room: 'one'
// })
// users.push(val)
// const val2 = addUser({
//     id: 03,
//     username: 'xyz',
//     room: 'two'
// })
// users.push(val2)
// const userRoom = getUsersInRoom('One')
// console.log(userRoom);


