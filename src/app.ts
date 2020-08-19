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

const activeUsers = new Set();

// TODO: Fix any types
io.on('connection', (socket: any) => {
  console.log('Made socket connection');

  socket.on('new user', (data: IUser) => {
    const { userId, userName } = data;
    activeUsers.add({ userId, userName });
    io.emit('new user', [...activeUsers]);
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    io.emit('user disconnected', socket.userId);
  });
});
