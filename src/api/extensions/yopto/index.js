import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
import axios from 'axios';
import EmailCheck from 'email-check'
import jwt from 'jwt-simple'
import NodeMailer from 'nodemailer'

module.exports = ({ config }) => {
  const api = Router()

  /**
   * GET send token to authorize email
   */
  api.get('/reviews/product', (req, res) => {
    apiStatus(res, 'Just Testing it out 2.', 200);
  })

  return api
}
