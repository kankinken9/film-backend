const { validateBooking } = require('../controllers/validation');
const Router = require('koa-router')
const auth = require('../controllers/auth');
// const adminauth = require('../controllers/adminauth');
const bodyParser = require('koa-bodyparser')
const model = require('../models/booking')
const likes = require('../models/likes');
const prefix = '/api/v1/booking';
const router = Router({ prefix: prefix });
const request = require('request')

router.get('/', auth, getAll)
router.post('/', bodyParser(), auth, createBooking)  //add auth
router.get('/search', auth, doSearch) //add auth
router.get('/:id([0-9]{1,})', getById) //add auth
router.get('/u/:id([0-9]{1,})', auth, getByUserId) //auth && for own user only
router.put('/:id([0-9]{1,})', bodyParser(), auth, updateBooking) //add auth && update the application state
router.del('/:id([0-9]{1,})', auth, deleteBooking) //add auth

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
      result = await model.getAllLimit(limit, page);
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


async function getAll(ctx) {

  const { page = 1, limit = 100, order = "dateCreated", direction = 'ASC' } = ctx.request.query;
  const result = await model.getAll(page, limit, order, direction);
  if (result.length) {
    const body = result.map(post => {
      // extract the post fields we want to send back (summary details)
      const { id, title, alltext, imageurl, summary, authorid, stated } = post;
      // add links to the post summaries for HATEOAS compliance
      // clients can follow these to find related resources
      const links = {
        likes: `https://${ctx.host}${prefix}/${post.id}/likes`,
        self: `https://${ctx.host}${prefix}/${post.id}`

      }
      return { id, title, alltext, imageurl, summary, authorid, links, stated };
    });
    ctx.body = body;

  }
}

// re write the sql
async function getByUserId(ctx) {
  let id = ctx.params.id
  let booking = await model.getByUserId(id)
  if (booking.length) {
    ctx.body = booking
  }
}

async function getById(ctx) {
  let id = ctx.params.id
  let booking = await model.getById(id)
  if (booking.length) {
    ctx.body = booking[0]
  }
}

async function createBooking(ctx) {
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

async function updateBooking(ctx) {
  // TODO edit an existing booking
  const body = ctx.request.body
  let id = ctx.params.id
  // console.log("route-booking " , body)
  // console.log("route-id ",id)
  let result = await model.update(body, id)
  if (result) {
    ctx.status = 201
    ctx.body = `Booking with id ${id} updated`
  }
}

async function deleteBooking(ctx) {
  // TODO delete an existing booking
  let id = ctx.params.id
  let booking = await model.deleteById(id)
  ctx.status = 201
  ctx.body = `Booking with id ${id} deleted`
}

module.exports = router;
