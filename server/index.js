import Express from "express";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import storyRoute from "./routes/stories.js";
import commentsRoute from "./routes/comments.js";
import likesRoute from "./routes/likes.js";
import relationshipsRoute from "./routes/relationships.js";
import friendsRoute from "./routes/friends.js";
import dialogsRoute from "./routes/dialogs.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws"; // Import WebSocketServer from 'ws' library
import bodyParser from "body-parser";
import { db } from "./connect.js";

const app = Express();

// Middlewares
// Разрешить принимать данные в формате JSON
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(Express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../sm-app/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});
app.post("/api/upload-video", upload.single("video"), (req, res) => {
  const videoFile = req.file;
  console.log(videoFile.filename);
  if (!videoFile) {
    return res.status(400).json({ error: "Не удалось загрузить видео" });
  }
  res.status(200).json(videoFile.filename);
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/friends", friendsRoute);
app.use("/api/posts", postRoute);
app.use("/api/stories", storyRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/relationships", relationshipsRoute);
app.use("/api/dialogs", dialogsRoute);

const expressPort = 8800;
const expressServer = http.createServer(app);
expressServer.listen(expressPort, () => {
  console.log(`Express server is running on port ${expressPort}`);
});

const wss = new WebSocketServer(
  {
    port: 8888,
  },
  () => console.log(`WebSocket Server started on 8888`)
);

const wssMessages = new WebSocketServer({ port: 7000 }, () =>
  console.log(`WebSocket Server started on 7000`)
);

const activeConnections = new Map();

wssMessages.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    if (data.type === "register") {
      const userId = data.userId;
      activeConnections.set(userId, ws);
    } else if (data.type === "message") {
      const { senderId, recipientId, text, dialogId } = data;

      try {
        // логика для сохранения сообщения в базе данных
        let newMessage;
        async function someFunction() {
          try {
            newMessage = await saveMessageToDatabase(
              senderId,
              recipientId,
              text
            );
          } catch (error) {
            console.error(error);
          }
        }
        someFunction();
        //const newMessage = saveMessageToDatabase(senderId, recipientId, text);
        //console.log(newMessage.dialogId);
        // Отправить сообщение отправителю

        const senderSocket = activeConnections.get(senderId);
        senderSocket.send(
          JSON.stringify({
            dialogId,
            message_text: text,
            sender_id: senderId,
            receiver_id: recipientId,
            timestamp: new Date().toISOString(),
          })
        );

        // Отправить сообщение получателю
        const recipientSocket = activeConnections.get(recipientId);
        if (recipientSocket) {
          recipientSocket.send(
            JSON.stringify({
              dialogId,
              message_text: text,
              sender_id: senderId,
              receiver_id: recipientId,
              timestamp: new Date.now().toISOString(),
            })
          );
        }
      } catch (error) {
        // Обработка ошибок при сохранении сообщения в базе данных
        console.error("Ошибка при сохранении сообщения в базе данных:", error);
      }
    }
  });
});

function createOrGetDialog(senderId, recipientId) {
  return new Promise((resolve, reject) => {
    const selectQuery =
      "SELECT dialog_id FROM dialogs WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)";
    db.query(
      selectQuery,
      [senderId, recipientId, recipientId, senderId],
      (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length > 0) {
          // Диалог уже существует, возвращаем его идентификатор
          resolve(results[0].dialog_id);
        } else {
          // Диалог не существует, создаем новый и возвращаем его идентификатор
          const insertQuery =
            "INSERT INTO dialogs (user1_id, user2_id) VALUES (?, ?)";
          db.query(insertQuery, [senderId, recipientId], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results.insertId);
            }
          });
        }
      }
    );
  });
}

async function saveMessageToDatabase(senderId, recipientId, text) {
  try {
    const dialogId = await createOrGetDialog(senderId, recipientId);

    const insertMessageQuery =
      "INSERT INTO messages (dialog_id, sender_id, receiver_id, message_text, status) VALUES (?, ?, ?, ?, ?)";
    const insertMessageResult = await new Promise((resolve, reject) => {
      db.query(
        insertMessageQuery,
        [dialogId, senderId, recipientId, text, 0],
        (err, results) => {
          if (err) {
            console.error("Ошибка при вставке сообщения:", err);
            reject(err);
          } else {
            const messageId = results.insertId;
            const updateDialogQuery =
              "UPDATE dialogs SET last_message_id = ? WHERE dialog_id = ?";
            db.query(updateDialogQuery, [messageId, dialogId], (updateErr) => {
              if (updateErr) {
                console.error("Ошибка при обновлении диалога:", updateErr);
                reject(updateErr);
              } else {
                resolve({ text, dialogId, messageId });
              }
            });
          }
        }
      );
    });

    return insertMessageResult;
  } catch (error) {
    throw error;
  }
}

const onlineUsers = new Set();

wss.on("connection", (ws) => {
  console.log("WebSocket connection on PORT 8888 established!");

  ws.on("message", (message) => {
    try {
      const parsedData = JSON.parse(message);
      const { userId } = parsedData;
      switch (parsedData.type) {
        case "user-id":
          onlineUsers.add(userId);
          broadcastOnlineUsers();
          break;
        case "user-logout":
          onlineUsers.delete(userId);
          broadcastOnlineUsers();
          break;
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection on PORT 8888 closed");

    const user = [...onlineUsers].find((id) => id === ws.userId);
    if (user) {
      onlineUsers.delete(user);
      broadcastOnlineUsers();
    }
  });
});

const broadcastOnlineUsers = () => {
  const onlineUsersArray = [...onlineUsers];
  const message = JSON.stringify({
    type: "online-status-update",
    onlineUsers: onlineUsersArray,
  });

  wss.clients.forEach((client) => {
    client.send(message);
  });
};
