var restify = require('restify');
var restifyValidation = require('node-restify-validation');
var restifySwagger = require('node-restify-swagger');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restifyValidation.validationPlugin());
restifySwagger.configure(server);

/**
 * Test Controller
 */
server.get({url: '/hello/:name', validation: {
    test: { isRequired: true, isIn: ['test','asdf'], scope: 'query' }
}}, function (req, res, next) {
    res.send(req.params.name);
});

/**
 * Serve static swagger resources
 **/
server.get(/^\/docs\/?.*/, restify.serveStatic({directory: './swagger-ui-1.1.13'}));
server.get('/', function (req, res, next) {
    res.header('Location', '/docs/index.html');
    res.send(302);
    return next(false);
});

restifySwagger.loadRestifyRoutes();

/**
 * Start server
 */
server.listen(8001, function () {
    console.log('%s listening at %s', server.name, server.url);
});