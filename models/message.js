const db = require('../helpers/database')
const dbMongo = require('../helpers/mongodb')

//list all the message in the database
exports.getAll = async function getAll(page, limit, order) {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM message;"
  let data = await db.run_query(query)
  return data
}
exports.getAllLimit = async function getAllLimit(limit = 10, page = 1) {
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM message LIMIT  ? OFFSET  ?;";
  const data = await db.run_query(query, [limit, offset]);
  return data;
}

exports.getSearch = async function getSearch(sfield, q) {

  const query = `SELECT ${sfield} FROM message WHERE ${sfield} LIKE '%${q}%' `;
  const data = await db.run_query(query);
  return data;
}

//new SQL
//get a single message by its id  
exports.getByUserId = async function getByUserId(id) {
  let query = "SELECT * FROM message WHERE usera = ? OR userb = ? ORDER BY id"
  let values = [id, id]
  let data = await db.run_query(query, values)
  return data
}

//get a single message by its id  
exports.getById = async function getById(id) {
  let query = "SELECT * FROM message WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

exports.deleteById = async function deleteById(id) {
  let query = "Delete FROM message WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}



//create a new message in the database
exports.add = async function add(message) {
  let keys = Object.keys(message)
  let values = Object.values(message)
  keys = keys.join(',')
  let parm = ''
  for (i = 0; i < values.length; i++) { parm += '?,' }
  parm = parm.slice(0, -1)
  let query = `INSERT INTO message (${keys}) VALUES (${parm})`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}

exports.update = async function update(message, id) {

  //console.log("message " , message)
  // console.log("id ",id)
  let keys = Object.keys(message)
  let values = Object.values(message)
  let updateString = ""
  for (i = 0; i < values.length; i++) { updateString += keys[i] + "=" + "'" + values[i] + "'" + "," }
  updateString = updateString.slice(0, -1)
  // console.log("updateString ", updateString)
  let query = `UPDATE message SET ${updateString} WHERE ID=${id} RETURNING *;`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}