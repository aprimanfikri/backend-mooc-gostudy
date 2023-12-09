const { CoreApi, Snap } = require('midtrans-client');

const midtransConfig = {
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
};

const coreApi = new CoreApi(midtransConfig);
const snap = new Snap(midtransConfig);

module.exports = { coreApi, snap };
