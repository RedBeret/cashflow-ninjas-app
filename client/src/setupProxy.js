const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    // Proxy endpoints to the Ruby on Rails server on port 3000
    app.use(
        "/api/rails/*",
        createProxyMiddleware({
            target: "http://localhost:3000",
            changeOrigin: true,
            pathRewrite: {
                "^/api/rails": "/api",
            },
        })
    );

    // Proxy endpoints to the Flask server on port 5555
    app.use(
        "/api/flask/*",
        createProxyMiddleware({
            target: "http://localhost:5555",
            changeOrigin: true,
            pathRewrite: {
                "^/api/flask": "/api",
            },
        })
    );

    // Proxy all other requests to the backend server on port 4000
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:4000",
            changeOrigin: true,
        })
    );
};
