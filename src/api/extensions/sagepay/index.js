import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import axios from 'axios';
import { multiStoreConfig } from '../../../lib/util'

module.exports = ({ config, db }) => {
  const Magento2Client = require('magento2-rest-client').Magento2Client;
  const mage2Client = Magento2Client(config.magento2.api);
  const sagePayConfig = config.extensions.sagepay[config.extensions.sagepay.selectedMode];

  // eslint-disable-next-line prefer-arrow-callback
  mage2Client.addMethods('cart', function (restClient) {
    let module = {};
    module.setPaymentInformation = function (customerToken, cartId, body, adminRequest = false) {
      if (adminRequest) {
        return restClient.post('/carts/' + cartId + '/set-payment-information', body);
      } else {
        if (customerToken && cartId) {
          return restClient.post('/carts/mine/set-payment-information', body, customerToken);
        } else {
          return restClient.post('/guest-carts/' + cartId + '/set-payment-information', body);
        }
      }
    }
    module.updateEmail = function (body) {
      return restClient.put('/vueStoreservices/update-quote', body)
    }

    module.checkoutPlaceOrder = function (customerToken, cartId, body, adminRequest = false) {
      if (adminRequest) {
        return restClient.post('/V1/sagepay/pi', body, customerToken);
      } else {
        if (customerToken && cartId) {
          console.log('restClient', config.magento2.api);
          let response = restClient.post('/V1/sagepay/pi', body, customerToken);
          console.log('ressss', response, customerToken, body);
          return response;
        } else {
          return restClient.post('/V1/sagepay-guest/pi', body);
        }
      }
    }

    return module
  })

  let api = Router();

  api.post('/do-payment', async (req, res) => {
    try {
      const { userToken, cartId } = await req.body
      const body = req.body
      const headersConfig = { headers: {'Authorization': 'Bearer ' + userToken} };

      if (userToken && cartId) {
        // 'http://admin.wallsandfloors.co.uk/index.php/rest/V1/sagepay/pi'
        let transactionProcessResponse = await axios.post(sagePayConfig.urls.doPayment.user, body, headersConfig);
        apiStatus(res, transactionProcessResponse.data, 200)
        // return res.status(200).json(transactionProcessResponse.data);
      } else {
        // 'http://admin.wallsandfloors.co.uk/index.php/rest/V1/sagepay-guest/pi'
        let transactionProcessResponse = await axios.post(sagePayConfig.urls.doPayment.guestUser, body)
        apiStatus(res, transactionProcessResponse.data, 200)
        // let apiResult = { code: 200, result: transactionProcessResponse.data };
        // return res.status(200).json(apiResult);
      }
    } catch (error) {
      let errorResponse = {
        'error': error,
        'message': 'Some Error Occurred while processing payment'
      }
      apiStatus(res, errorResponse, 500)
      console.error(error.response.data)
    }
  });

  api.post('/setBillingAddress', async (req, res) => {
    const { token, cartId } = await req.query
    const { address } = req.body
    console.log(address)
    // console.log(req.params)
    // console.log(order)
    try {
      const result = await mage2Client.cart.billingAddress(token, cartId, { address })
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.post('/shippingInformation', async (req, res) => {
    const { token, cartId } = await req.query
    console.log(req.body)
    // console.log(req.params)
    // console.log(order)
    try {
      const result = await mage2Client.cart.shippingInformation(token, cartId, req.body)
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.put('/updateCartEmail', async (req, res) => {
    try {
      const result = await mage2Client.cart.updateEmail(req.body)
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.post('/setPaymentInformation', async (req, res) => {
    const { token, cartId } = await req.query
    const body = req.body
    try {
      const result = await mage2Client.cart.setPaymentInformation(token, cartId, body)
      apiStatus(res, result, 200)
    } catch (error) {
      console.error(error)
      apiStatus(res, error, 500)
    }
  })

  api.get('/orderDetails', async (req, res) => {
    const {orderId} = await req.query;
    try {
      const orderData = await axios.put(
        sagePayConfig.urls.orderData,
        '{"orderId" : "' + orderId + '"}',
        {
          headers: {
            'Content-type': 'application/json'
          }
        }
      );

      let responseData = {
        orderData: orderData.data,
        orderId: orderId
      };
      apiStatus(res, responseData, 200);
    } catch (error) {
      let err = {
        customMsg: 'There is Error',
        error
      };
    }
  });

  return api;
};
