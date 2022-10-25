const upload_options = {
    multipart: true,
    formidable: {uploadDir: './img'
    }
}
// ./tmp/api/uploads
const koaBody = require('koa-body')(upload_options);
const fileStore = './img';
const mime = require('mime-types');
const { copyFileSync, existsSync, createReadStream } = require('fs');

const Router = require('koa-router')
const prefix = '/api/v1';
const router = Router({prefix: prefix});

router.post('/images', koaBody, async ctx => {
   
  try {
        const {path, name, type} = ctx.request.files.upload;
        const extension = mime.extension(type);

        // add some logging to help with troubleshooting
        console.log('Uploaded file details:')
        console.log(`path: ${path}`);
        console.log(`filename: ${name}`);
        console.log(`type: ${type}`);
        console.log(`extension: ${extension}`);
        const { v4: uuidv4 } = require('uuid');
        const imageName = uuidv4()
        const newPath = `${fileStore}/${imageName}`;
        copyFileSync(path, newPath);
        ctx.status = 201;
        ctx.body = {
		filename: name,
		type: type,
		extension: extension,
          links: {
                path: router.url('get_image', imageName)
            }

        };
    } catch(err) {
        console.log(`error ${err.message}`);
        ctx.throw(500, 'upload error', {message: err.message});
    }
});

router.get('get_image', '/images/:uuid([0-9a-f\\-]{36})', async ctx => {
    const uuid = ctx.params.uuid;
    const path = `${fileStore}/${uuid}`;
    console.log('client requested image with path', path);
    try {

      // find the requested file and return it
        if (existsSync(path)) {
            console.log('image found');
            const src = createReadStream(path);
            ctx.type = 'image/jpeg';
            ctx.body = src;
            ctx.status = 200;
        } else {
            console.log('image not found');
            ctx.status = 404;
        }


      
    } catch (err) {
        console.log(`error ${err.message}`);
        ctx.throw(500, 'image download error', {message: err.message});
    }
});

module.exports = router;