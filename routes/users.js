const { validateArticle } = require('../controllers/validation');
const auth = require('../controllers/auth');

// const adminauth = require('../controllers/adminauth');
const can = require('../permissions/users');
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const model = require('../models/users')

const prefix = '/api/v1/users'
const router = Router({ prefix: prefix });


router.get('/', auth, getAll) //add auth
router.get('/search', auth, doSearch) //add auth
router.post('/', bodyParser(), createUser)
router.get('/:id([0-9]{1,})', auth, getById) //add auth
router.put('/:id([0-9]{1,})', auth, updateUser) //add auth
router.del('/:id([0-9]{1,})', auth, deleteUser) //add auth

router.post('/login', auth, login); //add auth

async function getAll(ctx, next) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    let users = await model.getAll(20, 1)
    if (users.length) {
      ctx.body = users
    }
  }
}


async function doSearch(ctx, next) {
  const permission = can.readAll(ctx.state.user);
  if (!permission.granted) {
    ctx.status = 403;
  } else {
    let { limit = 20, page = 1, fields = "", q = "" } = ctx.request.query;

    // ensure params are integers
    limit = parseInt(limit);
    page = parseInt(page);

    // validate values to ensure they are sensible
    limit = limit > 100 ? 100 : limit;
    limit = limit < 1 ? 10 : limit;
    page = page < 1 ? 1 : page;
    let result = "";
    // search by single field and field contents 
    //need to validate q input
    if (q != "")
      result = await model.getSearch(fields, q)
    else
      result = await model.getAll(limit, page);
    if (result.length) {
      if (fields !== null) {
        // first ensure the fields are contained in an array
        // need this since a single field in the query is passed as a string
        if (!Array.isArray(fields)) {
          fields = [fields];
        }
        // then filter each row in the array of results
        // by only including the specified fields
        result = result.map(record => {
          partial = {};
          for (field of fields) {
            partial[field] = record[field];
          }

          return partial;
        });
      }
      ctx.body = result;
    }
  }
}
async function getById(ctx) {
  let id = ctx.params.id
  let user = await model.getByUserId(id)
  if (user.length) {
    ctx.body = user[0]
  }
}

async function createUser(ctx) {
  const body = ctx.request.body
  let result = await model.add(body)
  if (result) {
    ctx.status = 201
    ctx.body = result
  } else {
    ctx.status = 201
    ctx.body = "{}"
  }
}

async function login(ctx) {
  // return any details needed by the client
  const { id, username, email, avatarurl, role } = ctx.state.user
  const links = {
    self: `https://${ctx.host}${prefix}/${id}`
  }
  ctx.body = { id, username, email, avatarurl, role, links };
}



async function updateUser(ctx) {
  // TODO edit an existing article
}

async function deleteUser(ctx) {
  // TODO delete an existing article
}

module.exports = router;
