import {apiStatus} from '../../../lib/util';
import {Router} from 'express';
import axios from 'axios';

module.exports = ({config}) => {
  let api = Router();

  api.post('/fetchquotesystem', async (req, res) => {
    try {
      try {
        const quoteDetails = req.body;

        let url = config.extensions.quotesystem.endpoint + '/rest/V1/vueStoreservices/getquotes';
        console.log('url', url);

        const sampleQuoteResponse = await axios.post(url,
        quoteDetails,
        {
            headers: {
            'Content-type': 'application/json'
            }
        }
        );
        console.log(sampleQuoteResponse);
        apiStatus(res, sampleQuoteResponse.data);
        
      } catch (error) {
        console.error(error);
        apiStatus(
          res,
          {
            message: 'Some Error Occurred while processing fetching quote-data',
            reqBody: req.body,
            error
          },
          500
        );
      }
    } catch (error) {
      console.error(error);
      apiStatus(res, 'That Error Occurred while processing fetching quote-data', 500);
    }
  });
  return api;
};
