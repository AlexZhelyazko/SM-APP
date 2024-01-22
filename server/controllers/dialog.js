import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const createDialog = (req, res) => {
  const token = req.cookies.accesToken;
  const { user1_id, user2_id } = req.body;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO dialogs (user1_id, user2_id) VALUES (?, ?)";

    db.query(q, [user1_id, user2_id], (err, result) => {
      if (err) {
        console.error("Ошибка при создании диалога: " + err.message);
        res.status(500).json({ error: "Ошибка при создании диалога" });
      } else {
        const dialogId = result.insertId;
        res
          .status(200)
          .json({ dialog_id: dialogId, message: "Диалог успешно создан" });
      }
    });
  });
};

export const getUsersId = (req, res) => {
  const { dialog_id } = req.query;
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "SELECT user1_id, user2_id FROM dialogs WHERE dialog_id = ?";

    db.query(q, [+dialog_id], (err, result) => {
      if (err) {
        console.error("Ошибка при проверке диалога: " + err.message);
        res.status(500).json({ error: "Ошибка при проверке диалога" });
      } else {
        if (result.length > 0) {
          res.json({
            user1_id: result[0].user1_id,
            user2_id: result[0].user2_id,
          });
        } else {
          res.status(404).json("Диалог не существует");
        }
      }
    });
  });
};

export const getDialogs = async (req, res) => {
  const { user_id } = req.query;
  const token = req.cookies.accesToken;

  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  try {
    const userInfo = await jwt.verify(token, "secretKeyWithoutENV");

    const q = `
      SELECT dialogs.*, users.username AS other_username,users.profilePic, messages.message_text, messages.timestamp AS last_message_time
      FROM dialogs
      LEFT JOIN users ON (dialogs.user1_id = users.id OR dialogs.user2_id = users.id)
      LEFT JOIN (
        SELECT dialog_id, MAX(timestamp) AS max_timestamp
        FROM messages
        GROUP BY dialog_id
      ) AS latest_messages ON dialogs.dialog_id = latest_messages.dialog_id
      LEFT JOIN messages ON latest_messages.dialog_id = messages.dialog_id AND latest_messages.max_timestamp = messages.timestamp
      WHERE (dialogs.user1_id = ? OR dialogs.user2_id = ?)
        AND users.id != ?
    `;

    db.query(q, [+user_id, +user_id, +user_id], (err, result) => {
      if (err) {
        console.error("Ошибка при проверке диалога: " + err.message);
        res.status(500).json({ error: "Ошибка при проверке диалога" });
      } else {
        if (result.length > 0) {
          res.json(result);
        } else {
          // Диалог не существует, возвращаем сообщение или статус по вашему усмотрению
          res.status(404).json("Диалог не существует");
        }
      }
    });
  } catch (error) {
    return res.status(403).json("Token is not valid");
  }
};

export const getMessages = (req, res) => {
  const { dialog_id } = req.query;
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "SELECT * FROM messages WHERE dialog_id = ?";

    db.query(q, [+dialog_id], (err, result) => {
      if (err) {
        console.error("Ошибка при проверке диалога: " + err.message);
        res.status(500).json({ error: "Ошибка при проверке диалога" });
      } else {
        if (result.length >= 0) {
          res.json(result);
        } else {
          res.status(404).json("");
        }
      }
    });
  });
};

export const checkDialog = (req, res) => {
  const { user1_id, user2_id } = req.query;
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT dialog_id FROM dialogs WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?) ";

    db.query(q, [+user1_id, +user2_id, +user2_id, +user1_id], (err, result) => {
      if (err) {
        console.error("Ошибка при проверке диалога: " + err.message);
        res.status(500).json({ error: "Ошибка при проверке диалога" });
      } else {
        if (result.length > 0) {
          // Диалог существует
          const dialogId = result[0].dialog_id;
          res.json({ dialogExists: true, dialogId });
        } else {
          // Диалог не существует
          res.json({ dialogExists: false });
        }
      }
    });
  });
};

export const checkUser = (req, res) => {
  const { user_id, dialog_id } = req.query;
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "SELECT COUNT(*) AS user_exists FROM dialogs WHERE dialog_id=? AND (user1_id=?  OR user2_id=? );";

    db.query(q, [+dialog_id, +user_id, +user_id], (err, result) => {
      if (err) {
        console.error("Ошибка при проверке диалога: " + err.message);
        res.status(500).json({ error: "Ошибка при проверке диалога" });
      } else {
        if (result[0].user_exists > 0) {
          res.json({ userExists: true });
        } else {
          res.json({ userExists: false });
        }
      }
    });
  });
};

export const deleteDialog = (req, res) => {
  const { dialog_id } = req.query;
  const token = req.cookies.accesToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    db.query(
      "UPDATE dialogs SET last_message_id = NULL WHERE dialog_id = ?",
      [+dialog_id],
      (errUpdate, resultUpdate) => {
        if (errUpdate) {
          console.error("Ошибка " + errUpdate.message);
          return res
            .status(500)
            .json({ error: "Ошибка при обновлении last_message_id" });
        }

        db.query(
          "DELETE FROM messages WHERE dialog_id = ?",
          [+dialog_id],
          (errMessages, resultMessages) => {
            if (errMessages) {
              console.error("Ошибка " + errMessages.message);
              return res
                .status(500)
                .json({ error: "Ошибка при удалении сообщений" });
            }

            db.query(
              "DELETE FROM dialogs WHERE dialog_id = ?",
              [+dialog_id],
              (errDialogs, resultDialogs) => {
                if (errDialogs) {
                  console.error("Ошибка " + errDialogs.message);
                  return res
                    .status(500)
                    .json({ error: "Ошибка при удалении диалога" });
                }

                return res
                  .status(200)
                  .json({ message: "Диалог и сообщения успешно удалены" });
              }
            );
          }
        );
      }
    );
  });
};
