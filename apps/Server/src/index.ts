import http from 'http';
import SocketService from './services/socket';


(async function init() {

    const socketService = new SocketService()
    
    const httpServer = http.createServer();
    //attach http server on socketService
    socketService.io.attach(httpServer);

    
    const PORT = process.env.PORT || 8000;

    httpServer.listen(PORT, ()=> console.log(`Http server started on port: ${PORT}`));
    
})()