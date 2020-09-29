import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
import axios from 'axios';

module.exports = ({ config, db }) => {
  let api = Router();

  api.post('/send-search-call', async (req, res) => {
    try {
      try {
        const formDetails = req.body;
        const emailResponse = await axios.put(
          config.magento2.api.url + '/V1/vueStoreservices/contact-us/',
          formDetails,
          {
            headers: {
              'Content-type': 'application/json'
            }
          }
        );
        console.log(emailResponse.data);
        apiStatus(res, emailResponse.data);
      } catch (error) {
        console.error(error);
        apiStatus(
          res,
          'This Some Error Occurred while processing sendingmail',
          500
        );
      }
    } catch (error) {
      console.error(error);
      apiStatus(res, 'That Some Error Occurred while sendingmail', 500);
    }
  });
  return api;
};
