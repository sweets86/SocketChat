

const socket = io()



function printGiphy(giphy) {

    let fig = document.createElement('figure')
    let image = document.createElement('img')
    let fc = document.createElement('figcaption')

    image.src = giphy[0].images.downsized.url
    image.alt = giphy[0].title
    fc.textContent = giphy[0].title
    console.log(giphy)

    fig.appendChild(image)
    fig.appendChild(fc)

    let out = document.getElementById('imgBox')
    out.insertAdjacentElement('afterbegin', fig)
}

let hideBody = document.getElementById("hideSection");
hideBody.style.display = "none"


let send = document.getElementById("send")

send.onclick = function () {
    let hideBody = document.getElementById("hideSection");
    hideBody.style.display = "grid"

    let hideLoginSection = document.getElementById("loginSection")
    hideLoginSection.style.display = "none"
    
    const nickName = document.getElementById("userName").value
    const welcomeText = document.getElementById("welcomeText")
    welcomeText.innerHTML = "Välkommen! " + nickName

//Message from server
socket.on('message', message => {
   let newUser =  document.querySelector('h1')
   newUser.innerText = message
    console.log(message);
})
    
    // Login Validation
    if(nickName === ""){
        alert("Skriv nickname för kunna komma in chaten..!")
        location.href = "http://localhost:3000/"
    }else if(nickName === "null"){
        welcomeText.innerHTML = "Välkommen! " + "guest"
    }
}


socket.on('chat message', function (msg) {

    if (msg.type == "text") {
        const chatList = document.getElementById('chatList')
        const newMessage = document.createElement('p') 
        newMessage.innerText = msg.sender + ":    " + msg.content
        chatList.append(newMessage)
    } else if (msg.type == "img") {
        let giphy = msg.content
        printGiphy(giphy)
    }

    console.log(msg)

})

async function sendMessage() {
    const message = document.getElementById("m").value
    const nickName = document.getElementById("userName").value


    if (message[0] == "/") {
        console.log("Gör anrop till api och skicka bildurl")

        const imageUrl = await getApi()
        socket.emit('chat message', { type: "img", content: imageUrl , sender: nickName})
    } else {
        socket.emit('chat message', { type: "text", content: message , sender: nickName })
    }
    if(message === ""){
        Swal.fire({
            icon: 'error',
            title: 'OBS...',
            text: 'Skriv ditt meddelande',
          })
    }
    clearInput()
}



function dropDown() {
    const message = document.getElementById("m").value
    const gifBox = document.getElementById("gifBox")

    if(message === "/"){
        gifBox.style.display = "block"
    }else{
        gifBox.style.display = "none"
    }
}
function setValue(){
    document.getElementById("m").value = "/gif/"
    const gifBox = document.getElementById("gifBox")
    gifBox.style.display = "none"
}

function clearInput() {
    let clear = document.getElementById('m').value = ""
}

let APIKey = "vIhQ9o1NuNd44YbdSoHPl19gmhQ1OfTH"

async function getApi() {
    let url = `http://api.giphy.com/v1/gifs/search?api_key=${APIKey}&limit=1&q=`
    let str = document.getElementById('m').value
    url = url.concat(str)
    console.log(url)

    const response = await fetch(url)
    const content = await response.json()

    return content.data
}

