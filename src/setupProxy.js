const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api', {
        target: "http://login.aokecloud.cn",
        pathRewrite:{
            "/api/login/verify":"login/verify"
        },
        changeOrigin: true
    }));

};