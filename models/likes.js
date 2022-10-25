const db = require('../helpers/database');

//add a new like record
exports.like = async function like(id, uid) {
  let query = `INSERT INTO articleslikes (articleID,userID) VALUES (${id},${uid}) ON CONFLICT ON CONSTRAINT  NoDuplicateLike  
DO NOTHING;`
  try {
    await db.run_query(query, [id, uid]);
    return { "status": 201, "affectedRows": 1 }
  } catch (error) {
    return error
  }
}

exports.findLikeCheck = async function findLikeCheck(id, uid) {
  let query = `SELECT * FROM articleslikes WHERE  articleid=${id} AND userid=${uid} `
  try {
    await db.run_query(query, [id, uid]);
    return { "status": 201, "exisitng": 1 }
  } catch (error) {
    return error
  }
}


//remove a like record
exports.dislike = async function dislike(id, uid) {
  let query = "DELETE FROM articleslikes WHERE articleID=? AND userID=?; ";
  try {
    await db.run_query(query, [id, uid]);
    return { "affectedRows": 1 }
  } catch (error) {
    return error
  }

}

//count the likes for an article
exports.count = async function count(id) {
  let query = "SELECT count(1) as likes FROM articleslikes WHERE articleID=?;";
  const result = await db.run_query(query, [id]);
  return result[0].likes;
}

