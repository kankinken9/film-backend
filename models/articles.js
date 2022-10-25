const db = require('../helpers/database')
const dbMongo = require('../helpers/mongodb')

//list all the articles in the database
exports.getAll = async function getAll(page, limit, order) {
  // TODO: use page, limit, order to give pagination
  let query = "SELECT * FROM articles;"
  let data = await db.run_query(query)
  return data
}


//get a single article by its id  
exports.getById = async function getById(id) {
  let query = "SELECT * FROM articles WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}

exports.deleteById = async function deleteById(id) {
  let query = "Delete FROM articles WHERE ID = ?"
  let values = [id]
  let data = await db.run_query(query, values)
  return data
}



//create a new article in the database
exports.add = async function add(article) {
  let keys = Object.keys(article)
  let values = Object.values(article)
  keys = keys.join(',')
  let parm = ''
  for (i = 0; i < values.length; i++) { parm += '?,' }
  parm = parm.slice(0, -1)
  let query = `INSERT INTO articles (${keys}) VALUES (${parm})`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}

exports.update = async function update(article, id) {

  //console.log("article " , article)
  // console.log("id ",id)
  let keys = Object.keys(article)
  let values = Object.values(article)
  let updateString = ""
  for (i = 0; i < values.length; i++) { updateString += keys[i] + "=" + "'" + values[i] + "'" + "," }
  updateString = updateString.slice(0, -1)
  // console.log("updateString ", updateString)
  let query = `UPDATE articles SET ${updateString} WHERE ID=${id} RETURNING *;`
  try {
    await db.run_query(query, values)
    return { "status": 201 }
  } catch (error) {
    return error
  }
}