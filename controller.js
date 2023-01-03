/*
**********************************************************************************
* SRKAYCG
* __________________
*
* 2017 - SRKAYCG All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains the property of
* SRKAYCG. The intellectual and technical concepts contained herein are
* proprietary to SRKAYCG. Dissemination of this information or reproduction of
* this material is strictly forbidden unless prior written permission is
* obtained from SRKAYCG.
*
**********************************************************************************
*/
/**
* @author      :: Khanpara Priyank, Hardik Patel
* @module      :: Controller: LoginController
* @description :: This is use to get detail of master
* ----------------------------------------------------------------------------------
* Modified By        | Modified Date  |    Note
* ----------------------------------------------------------------------------------
*                    | dd/MM/yyyy               |
*___________________________________________________________________________________
* <p>
* This file is called for Controller: LoginController
* </p>
*/
var func = require('../lib/utility-functions');
const logger = require('../lib/logger-utils');
const TokenService = require('../services/TokenService');

module.exports = {
  getTokenData: getTokenData,
  addTokenData: addTokenData,
//   updateExpireToken:updateExpireToken,
  getemployeeotp:getemployeeotp,
  saveEmployeeOtp:saveEmployeeOtp,
  putUserLogout : putUserLogout
}
async function putUserLogout(req, res) {

  logger.Start(func.procLogCons.LOG_USER_LOGOUT, func.logCons.FIELD_CONTROLLER);
  await TokenService.putUserLogout(req)
    .then((response) => {
      logger.Success(func.procLogCons.LOG_USER_LOGOUT, func.logCons.FIELD_CONTROLLER);
      res.send(
        func.responseGenerator(
          func.logCons.MSG_SUCCESS,
          func.logCons.LOG_USER_LOGOUT + func.logCons.CODE_SUCCESS,
          false,
          response
        )
      );
    })
    .catch((error) => {
      logger.Error(func.procLogCons.LOG_USER_LOGOUT, func.logCons.FIELD_CONTROLLER);
      res.status(404).send(  func.responseGenerator(
        func.logCons.MSG_ERROR,
        func.logCons.LOG_USER_LOGOUT + func.logCons.MSG_ERROR,
        true,
        error
      ));
      
    });
}

async function getTokenData(req, res) {

  logger.Start(func.procLogCons.LOG_GETTOKENDETAILS_POST, func.logCons.FIELD_CONTROLLER);

  await TokenService.getTokenData(req)
    .then((response) => {
      logger.Success(func.procLogCons.LOG_GETTOKENDETAILS_POST, func.logCons.FIELD_CONTROLLER);
      res.send(func.responseGenerator(
        func.logCons.MSG_SUCCESS,
        func.logCons.LOG_TOKENDATA_GET + func.logCons.CODE_SUCCESS,
        false,
        response
      ))
    })
    .catch((error) => {
      logger.Error(func.procLogCons.LOG_GETTOKENDETAILS_POST,error, func.logCons.FIELD_CONTROLLER);
      res.status(404).send(  func.responseGenerator(
        func.logCons.MSG_ERROR,
        func.logCons.LOG_TOKENDATA_GET + func.logCons.MSG_ERROR,
        true,
        error
      ));
    });
}

async function addTokenData(req, res) {

  logger.Start(func.procLogCons.LOG_TOKENGENERATION_POST, func.logCons.FIELD_CONTROLLER);
  await TokenService.addTokenData(req)
    .then((response) => {
      logger.Success(func.procLogCons.LOG_GETTOKENDETAILS_POST, func.logCons.FIELD_CONTROLLER);
      res.send(func.responseGenerator(
        func.logCons.MSG_SUCCESS,
        func.logCons.LOG_OTP_GET + func.logCons.CODE_SUCCESS,
        false,
        response
      ))
    })
    .catch((error) => {
      logger.Error(func.procLogCons.LOG_GETTOKENDETAILS_POST,error,func.logCons.FIELD_CONTROLLER);
      res.status(404).send(error);
    });
}


async function getemployeeotp(req, res) {

  logger.Start(func.procLogCons.LOG_OTPLIST_POST, func.logCons.FIELD_CONTROLLER);
  await TokenService.getemployeeotp(req)
    .then((response) => {
      logger.Success(func.procLogCons.LOG_OTPLIST_POST, func.logCons.FIELD_CONTROLLER);

      res.send(func.responseGenerator(
        func.logCons.MSG_SUCCESS,
        func.logCons.LOG_OTP_GET + func.logCons.CODE_SUCCESS,
        false,
        response
      ));
      // res.send(response)
    })
    .catch((error) => {
      logger.Error(func.procLogCons.LOG_OTPLIST_POST, func.logCons.FIELD_CONTROLLER);
      res.send(
        func.responseGenerator(
          func.logCons.MSG_ERROR,
          func.logCons.LOG_OTP_GET + func.logCons.CODE_SUCCESS,
          true,
          error
        )
      );
      res.status(404).send(error);
    });
}

async function saveEmployeeOtp(req, res) {

    logger.Start(func.procLogCons.LOG_OTPSAVE_POST, func.logCons.FIELD_CONTROLLER);
    await TokenService.saveEmployeeOtp(req)
      .then((response) => {
        logger.Success(func.procLogCons.LOG_OTPSAVE_POST, func.logCons.FIELD_CONTROLLER);
        res.send(
          func.responseGenerator(
            func.logCons.MSG_SUCCESS,
            func.logCons.LOG_OTP_GENERATED + func.logCons.CODE_SUCCESS,
            false,
            response
          )
        );
      })
      .catch((error) => {
        res.send(
          func.responseGenerator(
            func.logCons.MSG_ERROR,
            func.logCons.LOG_OTP_GENERATED + func.logCons.CODE_SUCCESS,
            true,
            error
          )
        );;
      });
  }
