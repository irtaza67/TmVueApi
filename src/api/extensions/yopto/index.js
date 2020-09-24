import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
import axios from 'axios';
import jwt from 'jwt-simple'

module.exports = ({ config }) => {
  const api = Router()

  /**
   * GET send token to authorize email
   */
  api.get('/reviews/product', async (req, res) => {
    let err = null;

    try {
      const reqQuery = req.query;
      const apiUrl = config.magento2.api.url;

      if (!reqQuery || !reqQuery.productId) {
        err = 'No product id provided';
        throw err;
      }

      let productId = reqQuery.productId;
      let requestUrl = apiUrl + '/V1/yotpoapis/getproductreviews/' + productId;

      const sampleQuoteResponse = await axios.get(
        requestUrl,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      apiStatus(res, sampleQuoteResponse.data, 200);
    } catch (error) {
      err = error
      apiStatus(res, err, 200);
    }
  })

  api.get('/qa/product', async (req, res) => {
    let err = null;

    try {
      const reqQuery = req.query;
      const apiUrl = config.magento2.api.url;

      if (!reqQuery || !reqQuery.productId) {
        err = 'No product id provided';
        throw err;
      }

      let productId = reqQuery.productId;
      let requestUrl = apiUrl + '/V1/yotpoapis/getquestionsofproduct/' + productId;

      const sampleQuoteResponse = await axios.get(
        requestUrl,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      apiStatus(res, sampleQuoteResponse.data, 200);
    } catch (error) {
      err = error
      apiStatus(res, err, 200);
    }
  })
  return api
}
