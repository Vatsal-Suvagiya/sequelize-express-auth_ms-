
const express = require('express')
const router = express.Router()
const  urlCons  = require('../lib/constants/url-constants')
// const { loginUser } = require('../controllers/loginUserController')
const TokenController =require('../controllers/TokenController')
const {validate} = require ('../middlewares/validate')
const validations = require('../middlewares/validationMiddleware')


router.post(urlCons.URL_GET_TOKEN,validations.getTokenData, validate,TokenController.getTokenData)
router.post(urlCons.URL_ADD_TOKEN,validations.addTokenData, validate,TokenController.addTokenData)
router.post(urlCons.URL_USER_LOGOUT,validations.putUserLogout, validate,TokenController.putUserLogout)

// "POST /auth/Token/expire/deactive/v1": "TokenController.updateExpireToken",

router.post(urlCons.URL_GET_OTP,validations.getemployeeotp, validate,TokenController.getemployeeotp)
router.post(urlCons.URL_SAVE_OTP,validations.saveEmployeeOtp, validate,TokenController.saveEmployeeOtp)
// router.post(urlCons.URL_ADD_TOKEN, TokenController.addTokenData)


// router.post(urlCons.URL_V1_LOGIN, loginUser)


module.exports = router

// "POST /auth/Token/getTokenData/v1": "TokenController.getTokenData",
//   "POST /auth/Token/addTokenData/v1": "TokenController.addTokenData",
//   "POST /auth/otp/list/v1": "TokenController.getemployeeotp",
//   "POST /auth/otp/save/v1": "TokenController.saveEmployeeOtp",
//   "POST /auth/Token/expire/deactive/v1": "TokenController.updateExpireToken",
