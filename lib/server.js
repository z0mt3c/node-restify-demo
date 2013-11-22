/*
 * Copyright (c) 2013 Timo Behrmann. All rights reserved.
 */

var restify = require('restify');
var restifyValidation = require('node-restify-validation');
var restifySwagger = require('node-restify-swagger');

var server = module.exports.server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restifyValidation.validationPlugin({ errorsAsArray: false }));

restifySwagger.configure(server, {
    info: {
        contact: 'email@domain.tld',
        description: 'Description text',
        license: 'MIT',
        licenseUrl: 'http://opensource.org/licenses/MIT',
        termsOfServiceUrl: 'http://opensource.org/licenses/MIT',
        title: 'Node Restify Swagger Demo'
    },
    apiDescriptions: {
        'get':'GET-Api Resourcen',
        'post':'POST-Api Resourcen'
    }
});

/**
 * Test Controller
 */
server.get({url: '/get/:name',
    swagger: {
        summary: 'My hello call description',
        notes: 'My hello call notes',
        nickname: 'sayHelloCall'
    },
    validation: {
        name: { isRequired: true, isIn: ['foo', 'bar'], scope: 'path', description: 'Your unreal name' },
        status: { isRequired: true, isIn: ['foo', 'bar'], scope: 'query', description: 'Are you foo or bar?' },
        email: { isRequired: false, isEmail: true, scope: 'query', description: 'Your real email address' },
        age: { isRequired: true, isInt: true, scope: 'query', description: 'Your age' },
        accept: { isRequired: true, isIn: ['true', 'false'], scope: 'query', swaggerType: 'boolean', description: 'Are you foo or bar?' },
        password: { isRequired: true, description: 'New password' },
        passwordRepeat: { equalTo: 'password', description: 'Repeated password'}
    }}, function (req, res, next) {
    res.send(req.params);
});


server.post({url: '/post/:name',
    swagger: {
        summary: 'My hello call description',
        notes: 'My hello call notes',
        nickname: 'sayHelloCall'
    },
    validation: {
        name: { isRequired: true, isIn: ['foo', 'bar'], scope: 'path', description: 'Your unreal name' },
        status: { isRequired: true, isIn: ['foo', 'bar'], scope: 'body', description: 'Are you foo or bar?' },
        date: { isRequired: true, isDate: true, swaggerType: 'date' },
        email: { isRequired: false, isEmail: true, scope: 'body', description: 'Your real email address' },
        age: { isRequired: true, isInt: true, scope: 'body', description: 'Your age' },
        'password.new': { isRequired: true, description: 'New password', scope: 'body' },
        'password.repeat': { equalTo: 'password.new', description: 'Repeated password', scope: 'body' }
    }}, function (req, res, next) {
    res.send(req.params);
});

/**
 * Serve static swagger resources
 **/
server.get(/^\/docs\/?.*/, restify.serveStatic({directory: './swagger-ui'}));
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