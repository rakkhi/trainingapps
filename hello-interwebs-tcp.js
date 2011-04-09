var tcp = require("tcp");
tcp.createServer(function(socket) {
     socket.addListener('recieve', function(data) {
         socket.send(data);
    })
  }).listen(8001);