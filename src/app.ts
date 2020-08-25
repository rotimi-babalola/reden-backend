/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import socketIO from 'socket.io';
import { IUser } from './types';

const PORT = 5000;
const app = express();

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

const io = socketIO(server);

const activeUsers = new Set<string>();

// TODO: Fix any types
io.on('connection', (socket: any) => {
  console.log('Made socket connection');

  socket.on('new user', (data: IUser) => {
    const { userName } = data;
    socket.userName = userName;
    activeUsers.add(userName);
    io.emit('new user', [...activeUsers]);
  });

  socket.on('disconnect', () => {
    activeUsers.forEach(userName => {
      if (userName === socket.userName) {
        activeUsers.delete(socket.userName);
      }
    });
    io.emit('user disconnected', socket.userName);
  });

  socket.on('chat message', (data: any) => {
    io.emit('chat message', data);
  });
});
