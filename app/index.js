const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// Create Express Server
const app = express();

// Configuration
const PORT = 3002;
const HOST = "0.0.0.0";
const HOST_SERVICE_URL = process.env.HOST_SERVICE_URL || 'http://192.168.70.12:8080';
const API_KEY = process.env.API_KEY || '';
const username = process.env.EM_USERNAME || '';
const password = process.env.EM_PASSWORD || '';

// Logging
app.use(morgan('dev'));

const onProxyReq = async (proxyReq, req, res) => {
   const k = req.headers.secretkey ? req.headers.secretkey : req.query.secretKey;
   // console.log({k});
    if (k && API_KEY === k) {
       console.log('ACCESS GRANTED')
    } else {
       console.log('unauthorized', req.headers.secretkey, API_KEY);
        res.sendStatus(403);
    }
}
const proxy = createProxyMiddleware({
    target: HOST_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/emp`]: '',
    },
   onProxyReq: onProxyReq,
});
app.use('/emp', proxy);

// Start Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});