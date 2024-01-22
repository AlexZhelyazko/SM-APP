import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import multer from "multer";
import fs from "fs";
import path from "path";

export const getStories = (req, res) => {
  const storyUserId = req.query.userId;
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      storyUserId === "undefined"
        ? `SELECT s.*, u.id AS storyUserId, name, profilePic FROM stories AS s JOIN users AS u ON (u.id = s.storyUserId) WHERE s.storyUserId = ? ORDER BY s.createdAt DESC`
        : `SELECT s.*, u.id AS storyUserId, name, profilePic
        FROM stories AS s
        JOIN users AS u ON (u.id = s.storyUserId)
        LEFT JOIN relationships AS r ON (s.storyUserId = r.followedUserId)
        WHERE r.followerUserId = ? OR s.storyUserId = ?
        `;

    const values =
      storyUserId !== "undefined"
        ? [storyUserId, storyUserId]
        : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "INSERT INTO stories (`storyUserId`, `mediaSrc`, `createdAt`) VALUES (?, ?, ?)";
    const values = [
      userInfo.id,
      req.body.mediaSrc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created");
    });
  });
};

export const deleteStory = (req, res) => {
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "DELETE FROM stories WHERE `storyId`=? AND `storyUserId`=? ";
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Story has been deleted");
      return res.status(403).json("You can delete only your story");
    });
  });
};
