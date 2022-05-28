const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $message = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

// Get message and Render it via this Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight

    // Height of messages container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}

$messageFormInput.focus()
//get message (from server side) and render it and give to the all client
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        createAt: moment(message.createAt).format('h:m a'),
        message: message.text,
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//get location (from server side) and render and give to the all client
socket.on('locationMessage', (message) => {
    console.log(message);
    const location = Mustache.render(locationTemplate, {
        username: message.username,
        createAt: moment(message.createAt).format('h:m a'),
        url: message.url
    })
    $message.insertAdjacentHTML('beforeend', location)
    autoscroll()
})

//get userslist and print in sidebar
socket.on('roomData', ({ users, room }) => {
    const userslist = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = userslist
})


//  SENDMESSAGE , get the message value from (client side) send button clickevent and pass to the server side
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable send button
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (err) => {
        //enable send button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (err) {
            return console.log(err);
        }
        console.log('Message delivered..!');
    })
})


//get location on SENDLOCATION button clickevent (client side ) and pass to the server side
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Your device not support navigator geolocation')
    }
    //disable button
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, () => {
            console.log('Location shared..!');
            //enable button
            $sendLocationButton.removeAttribute('disabled')
            $messageFormInput.focus()
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        location.href='/'
        return alert(error)        
    }
})