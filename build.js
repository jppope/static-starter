const metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    dateFormatter = require('metalsmith-date-formatter'),
    handlebars = require('handlebars');

// server for development
const serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch');

metalsmith(__dirname)
    .metadata({
        site: {
            name: 'JonPaulUritis.com',
            description: "If god is watching the least we can do is be entertaining",
            version: '0.0.1'
        }
    })
    .source('./src')
    .destination('./public')
    .use(dateFormatter({
        key: 'date',
        format: 'YYYY-MM'
    }))
    .use(collections({
        articles: {
            pattern: 'articles/**/*.md',
            sortBy: 'date',
            reverse: true
        },
    }))
    .use(markdown())
    .use(permalinks({
        relative: false,
        pattern: ':title',
    }))
    .use(layouts({
        engine: 'handlebars',
        directory: './layouts',
        default: 'article.html',
        pattern: ["*/*/*html", "*/*html", "*html"],
        partials: {
            meta: 'partials/meta',
            navbar: 'partials/navbar',
            footer: 'partials/footer'
        }
    }))
    .use(serve({
        port: 8081,
        verbose: true
    }))
    .use(watch({
        paths: {
            "${source}/**/*": true,
            "layouts/**/*": "**/*",
        }
    }))
    .build(function(err) {
        if (err) { console.error(err) } else { console.log('build completed!'); }
    });