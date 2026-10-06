import dotenv from 'dotenv';
dotenv.config({ path: 'prisma/.env' });
import serverApp from './app'
import config from './config';
const server = async () => {
    serverApp.listen(config.port, () => {
        console.log('Iconic Server is Running', config.port)
    })
}

server();