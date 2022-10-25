const { validateArticle } = require('../controllers/validation');
const Router = require('koa-router')
const auth = require('../controllers/auth');
// const adminauth = require('../controllers/adminauth');
const bodyParser = require('koa-bodyparser')
const model = require('../models/articles')
const likes = require('../models/likes');
const prefix = '/api/v1/articles';
const router = Router({ prefix: prefix });
const request = require('request')

router.get('/', getAll)
router.post('/', bodyParser(), validateArticle, auth, createArticle)  //add auth
router.get('/:id([0-9]{1,})', getById)
router.put('/:id([0-9]{1,})', bodyParser(), validateArticle, auth, updateArticle) //add auth
router.del('/:id([0-9]{1,})', auth, deleteArticle) //add auth

router.get('/:id([0-9]{1,})/likes', likesCount);
router.post('/:id([0-9]{1,})/likes/lc', likesCheck);
router.post('/:id([0-9]{1,})/likes', auth, likePost);
router.del('/:id([0-9]{1,})/likes', auth, dislikePost);


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


async function getById(ctx) {
  let id = ctx.params.id
  let article = await model.getById(id)
  if (article.length) {
    ctx.body = article[0]
  }
}

async function createArticle(ctx) {
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

async function updateArticle(ctx) {
  // TODO edit an existing article
  const body = ctx.request.body
  let id = ctx.params.id
  // console.log("route-article " , body)
  // console.log("route-id ",id)
  let result = await model.update(body, id)
  if (result) {
    ctx.status = 201
    ctx.body = `Article with id ${id} updated`
  }
}

async function deleteArticle(ctx) {
  // TODO delete an existing article
  let id = ctx.params.id
  let article = await model.deleteById(id)
  ctx.status = 201
  ctx.body = `Article with id ${id} deleted`
}


async function likesCount(ctx) {
  // For you TODO: add error handling and error response code
  const id = ctx.params.id;
  const result = await likes.count(id);
  ctx.body = result ? result : 0;
}

async function likesCheck(ctx) {
  // For you TODO: add error handling and error response code
  const uid = ctx.state.user.id;
  const id = parseInt(ctx.params.id);
  const result = await likes.findLikeCheck(id, uid);
  ctx.body = result.exisiting ? { message: "exit" } : { message: "error" };
}
async function likePost(ctx) {
  // For you TODO: add error handling and error response code
  const uid = ctx.state.user.id;
  const id = parseInt(ctx.params.id);
  const result = await likes.like(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? { message: "liked" } : { message: "error" };
}

async function dislikePost(ctx) {
  // For you TODO: add error handling and error response code
  const uid = ctx.state.user.id;
  const id = parseInt(ctx.params.id);
  const result = await likes.dislike(id, uid);
  console.log(result);
  ctx.body = result.affectedRows ? { message: "disliked" } : { message: "error" };
}

module.exports = router;
