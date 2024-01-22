import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const getSuggestions = (req, res) => {
  const q =
    "SELECT u.* FROM users AS u WHERE u.id NOT IN (SELECT r.followedUserId FROM relationships AS r WHERE r.followerUserId = ?) ORDER BY RAND() LIMIT 2;";
  db.query(q, [req.query.followerUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following succes.");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accesToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretKeyWithoutENV", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow.");
    });
  });
};
