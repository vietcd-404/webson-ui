const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("updateStatus", ({ maHoaDon, newStatus }) => {
    console.log(`Received updateStatus for order ${maHoaDon}: ${newStatus}`);
    // Thực hiện xử lý tùy thuộc vào logic của bạn
    // Ví dụ: cập nhật cơ sở dữ liệu, broadcast lại sự kiện cho tất cả các kết nối, v.v.
    io.emit("updateStatus", { maHoaDon, newStatus });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
