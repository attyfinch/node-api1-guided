// import the server and start it!
const server = require('./api/server') // .js in name is optional

server.listen(8000, () => {
    console.log("The server is running and I am the god of this machine")
})