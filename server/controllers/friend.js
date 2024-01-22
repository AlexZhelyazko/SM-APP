import { db } from "../connect.js";

export const getAllFollowings = (req, res) => {
  const q =
    "SELECT * FROM users AS u JOIN relationships AS r ON (u.id IN (r.followedUserId)) WHERE r.followerUserId = ?";

  db.query(q, [req.query.followerUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
