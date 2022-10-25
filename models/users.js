
const db = require('../helpers/database')
const dbMongo = require('../helpers/mongodb')

exports.getAll = async function getAll(limit = 10, page = 1) {
  const offset = (page - 1) * limit;
  const query = "SELECT * FROM users LIMIT  ? OFFSET  ?;";
  const data = await db.run_query(query, [limit, offset]);
  return data;
}
exports.getSearch = async function getSearch(sfield, q) {

  const query = `SELECT ${sfield} FROM users WHERE ${sfield} LIKE '%${q}%' `;
  const data = await db.run_query(query);
  return data;
}

exports.getByUserId = async function getByUserId(id) {
  let query = "SELECT * FROM users WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

exports.add = async function add(article) {
  let keys = Object.keys(article)
  let values = Object.values(article)
  keys = keys.join(',')
  let parm = ''
  for (i = 0; i < values.length; i++) { parm += '?,' }
  parm = parm.slice(0, -1)
  let query = `INSERT INTO users (${keys}) VALUES (${parm})`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}





//get a single user by the (unique) username
exports.findByUsername = async function getByUsername(username) {
  let query = "SELECT * FROM users WHERE username = ?"
  let values = [username]
  let user = await db.run_query(query, values)
  return user;
}
//get a single user by the (unique) username
exports.findByAdminUsername = async function getByAdminUsername(username) {
  let query = "SELECT * FROM users WHERE username = ? AND role = 'staff'"
  let values = [username]
  let user = await db.run_query(query, values)
  return user;
}

exports.getAllMongo = async function getAllMongo(page, limite, order) {
  let data = await dbMongo.run_query('users', {})
  return data
}

exports.getByIdMongo = async function getByIdMongo(id) {
  let data = await dbMongo.run_query('users', { 'authorID': parseInt(id) })
  return data
}

exports.addMongo = async function addMongo(document) {
  let status = await dbMongo.run_insert('users', document)
  return status
}