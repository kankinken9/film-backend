const db = require('../helpers/database')
const dbMongo = require('../helpers/mongodb')

//list all the booking in the database
exports.getAll = async function getAll(page, limit, order) {
  // TODO: use page, limit, order to give pagination
  // let query = "SELECT * FROM booking;"
  let query = "SELECT booking.id, description, booking.summary, articlesid, articles.title AS atitle, articles.imageurl, booking.authorid, users.username, booking.stated FROM booking LEFT JOIN users ON booking.authorid = users.id LEFT JOIN articles ON booking.articlesid = articles.id;"
  let data = await db.run_query(query)
  return data
}
exports.getAllLimit = async function getAllLimit(limit = 10, page = 1) {
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM booking LIMIT  ? OFFSET  ?;";
  const data = await db.run_query(query, [limit, offset]);
  return data;
}

exports.getSearch = async function getSearch(sfield, q) {

  const query = `SELECT ${sfield} FROM booking WHERE ${sfield} LIKE '%${q}%' `;
  const data = await db.run_query(query);
  return data;
}

//new SQL
//get a single booking by its id  
exports.getByUserId = async function getByUserId(id) {
  // let query = "SELECT * FROM booking WHERE authorid = ?"
  let query = "SELECT booking.id, description, booking.summary, articlesid, articles.title AS atitle, articles.imageurl, booking.authorid, users.username, booking.stated FROM booking LEFT JOIN users ON booking.authorid = users.id LEFT JOIN articles ON booking.articlesid = articles.id WHERE booking.authorid = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

//get a single booking by its id  
exports.getById = async function getById(id) {
  let query = "SELECT * FROM booking WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

exports.deleteById = async function deleteById(id) {
  let query = "Delete FROM booking WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}



//create a new booking in the database
exports.add = async function add(booking) {
  let keys = Object.keys(booking)
  let values = Object.values(booking)
  keys = keys.join(',')
  let parm = ''
  for (i = 0; i < values.length; i++) { parm += '?,' }
  parm = parm.slice(0, -1)
  let query = `INSERT INTO booking (${keys}) VALUES (${parm})`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}

exports.update = async function update(booking, id) {

  //console.log("booking " , booking)
  // console.log("id ",id)
  let keys = Object.keys(booking)
  let values = Object.values(booking)
  let updateString = ""
  for (i = 0; i < values.length; i++) { updateString += keys[i] + "=" + "'" + values[i] + "'" + "," }
  updateString = updateString.slice(0, -1)
  // console.log("updateString ", updateString)
  let query = `UPDATE booking SET ${updateString} WHERE ID=${id} RETURNING *;`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}