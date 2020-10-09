import {apiStatus} from '../../../lib/util';
import {Router} from 'express';
import axios from 'axios';

module.exports = ({config}) => {
  let api = Router();

  api.get('/testing', async (req, res) => {
    apiStatus(res, 'Just Testing it out 2.', 200);
  });

  api.post('/add', async (req, res) => {
    try {
      try {
        const formDetails = req.body;
        console.log('formDetailsAre', formDetails);
        let availableSampleSizes = [
          'full_size', 'cut_size', 'half_size', 'quarter_size'
        ];
        let sampleSize = formDetails.sample ? formDetails.sample : '';
        let productId = formDetails.id ? formDetails.id : '';
        let cartId = formDetails.cartId ? formDetails.cartId : '';
        let url = config.magento2.api.url + '/V1/orders/save-sample-orders/' + productId + '/' + cartId + '/' + sampleSize;

        if (!availableSampleSizes.includes(sampleSize)) {
          apiStatus(res, 'Invalid sample size provided', 500);
        } else {
          const sampleQuoteResponse = await axios.post(url,
            {},
            {
              headers: {
                'Content-type': 'application/json'
              }
            }
          );
          // console.log(sampleQuoteResponse.data);
          apiStatus(res, sampleQuoteResponse.data);
        }
      } catch (error) {
        console.error(error);
        apiStatus(
          res,
          {
            message: 'This Some Error Occurred while processing sample quote',
            reqBody: req.body,
            error
          },
          500
        );
      }
    } catch (error) {
      console.error(error);
      apiStatus(res, 'That Some Error Occurred while sample quote', 500);
    }
  });

  api.get('/sample-options/:productId', async (req, res) => {
    // http://m2.tile.com/rest/V1/products/get-sample-options/2622
    let productId = req.params.productId

    try {
      let sampleOptionsURL = config.magento2.api.url + '/V1/products/get-sample-options/' + productId;
      const sampleOptionsResponse = await axios.get(sampleOptionsURL, {
        headers: {
          'Content-type': 'application/json'
        }
      });
      apiStatus(res, sampleOptionsResponse.data, 200);
    } catch (error) {
      if (error.response && error.response.status && error.response.status === 404) {
        apiStatus(res, (error.response.data && error.response.data.message) ? error.response.data.message : 'Requested product not found', 500);
      } else if (error.response && error.response.data && error.response.data.message) {
        apiStatus(res, error.response.data.message, 500);
      }
    }
  });
  return api;
};
