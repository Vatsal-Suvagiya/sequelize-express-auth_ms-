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
 * @module      :: Service: LoginService
 * @description :: Used to call service for LoginService
 * ----------------------------------------------------------------------------------
 * Modified By        | Modified Date  |    Note
 * ----------------------------------------------------------------------------------
 *                    | dd/MM/yyyy     |
 *___________________________________________________________________________________
 * <p>
 * This file is called for Service: LoginService
 * </p>
 */
const logger = require("../lib/logger-utils");
const func = require("../lib/utility-functions");
//  const mssqloperation = require("./db-operations/mssqloperation");
const moment = require('moment')
const sequelize = require('../../config/connection')
const initModels = require("../models/init-models")
var models = initModels(sequelize);
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op
const { months } = require("moment");
const query = require('../lib/query-utils') 
const jwt = require('jsonwebtoken')
const config = require('config');
const { LOG_CREATE } = require("../lib/constants/process-log-constants");
//  const { v4: uuidv4 } = require("uuid");
//  const axios = require('axios');

module.exports = {
       getTokenData: getTokenData,
       addTokenData: addTokenData,
       getemployeeotp:getemployeeotp,
    saveEmployeeOtp: saveEmployeeOtp,
    putUserLogout : putUserLogout
    //    updateExpireToken:updateExpireToken,
};
function putUserLogout(req) {
    logger.Start(
      func.procLogCons.LOG_USER_LOGOUT,
      func.logCons.FIELD_SERVICE
    );
      return new Promise(async(resolve, reject) => {
            
        let decode = jwt.verify(req.body.token, config.get('jwtPrivateKey'))
        
            await models.user_auth.update({
                logout_datetime : moment(),
                is_active : 0
            },{
                where : {
                    user_code : decode.user_code,
                    is_active : 1,
                    ip_address : decode.device_details.ip_address[0]
                }
            })
          .then((result) => {
            logger.Success(
              func.dbCons.MODEL_USER_AUTH + func.procLogCons.LOG_UPDATE,
              func.logCons.FIELD_SERVICE
            );
            resolve(result);
          })
          .catch((error) => {
            logger.Error(
                func.dbCons.MODEL_USER_AUTH + func.procLogCons.LOG_UPDATE,
                error,
              func.logCons.FIELD_SERVICE
            );
            reject(error);
          });
      });
  }
  
  

function getTokenData(req) {
    logger.Start(func.procLogCons.LOG_LOGIN_POST, func.logCons.FIELD_SERVICE);
  
    return new Promise((resolve, reject) => {
      
        const decode = jwt.verify(req.body.token, config.get('jwtPrivateKey'))

        if(decode.name == "TokenExpiredError")
        {
            logger.Error(
                    func.procLogCons.LOG_TOKENEXPIRE,
                    error,
                    func.logCons.FIELD_SERVICE
                  );
            reject(decode)
        }
        else{
            logger.Success(
                    func.procLogCons.LOG_TOKEN_GET,
                    func.logCons.FIELD_SERVICE,
                  );
            resolve(decode)
        }
       
    });
  }

function addTokenData(req) {
    logger.Start(func.procLogCons.LOG_TOKENGENERATION_POST, func.logCons.FIELD_SERVICE);
  
    return new Promise(async(resolve, reject) => {
        let session = {}
        await models.users.findOne({
            attributes :["user_code","user_category_id","user_display_name"],
            where : {
                user_loginname : req.body.login_name
            },
            include :[{
                        model: models.user_category,
                        as: 'user_category',
                        attributes : ["user_category_key"]
                    }]
        })
        .then(async (result) => {

          logger.Success(
            func.dbCons.MODEL_USERS +func.procLogCons.LOG_FINDONE,
            func.logCons.FIELD_SERVICE,
          )
            if(result!=null) {

                session.user_code = result.user_code
                session.user_category_id = result.user_category_id
                session.user_display_name =result.user_display_name
                session.user_loginname = req.body.login_name
                session.user_category_key = result.user_category.user_category_key

                session.device_details = req.body.device_details
                session.apps_code = req.body.apps_code
                
                
                const token = jwt.sign(session , config.get("jwtPrivateKey"),{expiresIn: '1d'})

                await models.user_auth.create({
                    user_code : session.user_code,
                    expire_time : 86400, 
                    is_active : 1,
                    user_category_id : session.user_category_id,
                    apps_code : session.apps_code,
                    login_datetime : moment(),
                    device_name : session.device_details.name,
                    device_type : session.device_details.device_type,
                    ip_address : session.device_details.ip_address[0],
                    country_name : session.device_details.country_name,
                    computer_name: session.device_details.computer_name,
                    mac_address : session.device_details.mac_address[0],
                    firebase_token : session.device_details.firebase_token

                }).then((user_auth)=>{
                    user_auth.save()
                    logger.Success(
                        func.dbCons.MODEL_USERS +func.procLogCons.LOG_FINDONE,
                        func.logCons.FIELD_SERVICE,
                      )
                    resolve(token);
                }).catch((err)=>{
                    reject(func.responseGenerator(
                        func.logCons.MSG_ERROR,
                        func.dbCons.MODEL_USER_AUTH +func.procLogCons.LOG_CREATE,
                        true,
                        err
                      ))
                })
            }
            else{
                func.responseGenerator(
                    func.logCons.MSG_ERROR,
                    func.dbCons.MODEL_USERS +func.procLogCons.LOG_FINDONE,
                    true,
                    "user not found.."
                  )
            }
        })
        .catch((error) => {

          logger.Error(
            func.dbCons.MODEL_USERS +func.procLogCons.LOG_FINDONE,
            error,
            func.logCons.FIELD_SERVICE
          );
          func.responseGenerator(
            func.logCons.MSG_ERROR,
            func.logCons.LOG_OTP_GET + func.logCons.CODE_SUCCESS,
            true,
            error
          )
          reject(error);
        });
    });
}

function getemployeeotp(req) {
    logger.Start(
      func.procLogCons.LOG_UPDATEEXPIRETOKEN_POST,
      func.logCons.FIELD_SERVICE
    );
    ;
    return new Promise(async(resolve, reject) => {
      
		// select top 1 user_otp from ControlCenter.otp_manager 
		// where employee_id=@employee_id and (getdate() between start_time and end_time) 
		// order by id desc


        // let where = {
            
        //                     employee_id: req.body.employee_id,
        //                     start_time: {
        //                         [Op.lt]: moment().subtract(0, 'days').toDate()
        //                     },
        //                     end_time: {
        //                         [Op.gte]: moment().subtract(0, 'days').toDate()
        //                     }
        // }
        // let others = {
        //     order : [['id','DESC']]
        // }
        // query.findone_utils("otp_manager",null,where,null,others)
        // .then((result)=>{

        //     if(result==null) resolve("there is no otp")

        //     resolve(result)
        // })
        // .catch((err)=>{
        //     reject(err)
        // })

        func.checkEmployeeOtp(req.body.employee_id)
        .then((result)=>{
                        if(result==null) resolve("there is no otp")

            resolve(result)
        })
        . catch((err)=>{
            reject(err);
        })



    //     await models.otp_manager.findOne({
    //         where: {
    //             employee_id: req.body.employee_id,
    //             start_time: {
    //                 [Op.lt]: moment().subtract(0, 'days').toDate()
    //             },
    //             end_time: {
    //                 [Op.gte]: moment().subtract(0, 'days').toDate()
    //             }
    //             },
    //         order : [['id','DESC']],
    //         raw: true
    //     })
    //     .then((result) => {

    //       logger.Success(
    //         func.procLogCons.LOG_OTPLIST_POST,
    //         func.logCons.FIELD_SERVICE,
    //         // JSON.stringify(result[func.responseCons.FIELD_DATA])
    //       );
    //       if(result==null)  resolve("there is no otp")

    //       resolve(result);
    //     })
    //     .catch((error) => {
    //       logger.Error(
    //         func.procLogCons.LOG_OTPLIST_POST,
    //         error,
    //         func.logCons.FIELD_SERVICE
    //       );
    //       reject(error);
    //     });
    });
  }
  

function saveEmployeeOtp(req) {                 //45ms
    logger.Start(
        func.procLogCons.LOG_OTPSAVE_POST,
        func.logCons.FIELD_SERVICE
    );
    return new Promise(async (resolve, reject) => {

        if (req.body[func.dbCons.FIELD_PRIMARY_PHONE_NUMBER]) {
            await models.employee_phone.findOne({
                attributes: ['employee_id'],
                where: {
                    is_primary: 1,
                    phone_number: req.body[func.dbCons.FIELD_PRIMARY_PHONE_NUMBER]
                },
                raw: true
            }).then((result) => {
                logger.Success(
                    func.dbCons.MODEL_EMPLOYEE_PHONE+func.procLogCons.LOG_FINDONE,
                    func.logCons.FIELD_SERVICE
                )
                req.body[func.dbCons.FIELD_EMPLOYEE_ID] = result[func.dbCons.FIELD_EMPLOYEE_ID]

            }).catch((error) => {
                logger.Error(
                    func.dbCons.MODEL_EMPLOYEE_PHONE+func.procLogCons.LOG_FINDONE,
                    error,
                    func.logCons.FIELD_SERVICE
                );
                reject(error);
            })
        }

        await models.configuration_master.findOne({
            attributes: ["value_varchar"],
            where: { configuration_master_key: 'otp_expire_time' },
            // Sequelize.fn('datetime', Sequelize.col('start') %d-%m-%Y %H:%i:%s hh:mm:ss
            // {include : [ sequelize.fn('date_format', sequelize.col('value_varchar'), '%H:%i:%s')]} 
            rew: true
        }).then(async (result) => {
            logger.Success(
                func.dbCons.MODEL_CONFIGURATION_MASTER+func.procLogCons.LOG_FINDONE,
                func.logCons.FIELD_SERVICE
            )

            let arr = result.value_varchar.split(":")
            let date = moment()
                console.log("arr::",arr);
            date = date.set({
                hour: (date.get('hour') + 00), minute: (date.get('minute') +01)
                , second: (date.get('second') +43)
            })           //i have remove 47 second because there is difference in sql side default getdate() and in node js
            
            await models.otp_manager.findOne({
                where: {
                    employee_id: req.body.employee_id,
                    start_time: {
                        [Op.lt]: moment().subtract(0, 'days').toDate()
                    },
                    end_time: {
                        [Op.gte]: moment().subtract(0, 'days').toDate()
                    }
                    },
                order : [['id','DESC']],
                raw: true
            }).then(async(otp) => {
                
                if(otp == null)
                {
                    await models.otp_manager.create({
                        employee_id: req.body.employee_id,
                        user_otp: req.body.user_otp,
                        end_time: date
                    }).then((otp_manager) => {
                            otp_manager.save()
                            resolve(otp_manager);
        
                            logger.Success(
                                func.dbCons.MODEL_OTP_MANAGER + func.procLogCons.LOG_CREATE,
                                func.logCons.FIELD_SERVICE
                            )
                        })
                        .catch((err) => {
                            logger.Error(
                                func.dbCons.MODEL_OTP_MANAGER + func.procLogCons.LOG_CREATE,
                                err,
                                func.logCons.FIELD_SERVICE
                            );
                            reject(err)
                        });
                }
                else{
                    await models.otp_manager.update({
                        user_otp: req.body.user_otp,
                        end_time: date,
                        modified_datetime : date
                    },
                    {
                        where : {
                            id : otp.id
                        }
                    }).then(()=>{
                        resolve("otp changed")

                    })
                }
            })
            
        }).catch((error) => {
            logger.Error(
                func.dbCons.MODEL_CONFIGURATION_MASTER+func.procLogCons.LOG_FINDONE,
                error,
                func.logCons.FIELD_SERVICE
            );
            reject(error);
        })

    });
}




        // await models.employee.findAll({

        //     attributes :['primary_email_id'],
        //     include :[{
        //         model: models.otp_manager,
        //         as: 'otp_managers',
        //     }]
        // }).then((result) => {
        //     logger.Success(
        //         func.procLogCons.LOG_OTPLIST_POST,
        //         func.logCons.FIELD_SERVICE
        //     );
        //     resolve(result);
        // })
        //     .catch((error) => {
        //         logger.Error(
        //             func.procLogCons.LOG_OTPLIST_POST,
        //             error,
        //             func.logCons.FIELD_SERVICE
        //         );
        //         reject(error);
        //     })

        // 1500ms  2000ms

        // if(req.body.primary_phone_number)
        // {
        //     // --	 set @employee_id  = (select employee_id  from EmployeeInfo.employee_phone WITH(NOLOCK) where is_primary=1 and phone_number=@primary_phone_number)
        //     await sequelize.query("select employee_id  from EmployeeInfo.employee_phone WITH(NOLOCK) where is_primary=1 and phone_number= :primary_phone_number",
        //         {   
        //             logging : console.log("inside select query"),
        //             replacements: { primary_phone_number: req.body.primary_phone_number},
        //             type: QueryTypes.SELECT 
        //         }).then((e)=>{
        //                 console.log("eeeeeeeeeeee",e);
        //         })
        // }
        // // --	 declare @otp_expire_time datetime =(select convert(datetime,value_varchar) from ControlCenter.configuration_master WITH(NOLOCK) where configuration_master_key='otp_expire_time')
        // await sequelize.query("select convert(datetime,value_varchar) from ControlCenter.configuration_master where configuration_master_key='otp_expire_time'",
        // {
        //     type: QueryTypes.SELECT 
        // }).then((e)=>{
        //     console.log("eeeeeeeeeee",e);
        // })

        //     let result = await sequelize.query("select e.primary_email_id from HumanResources.employee e LEFT JOIN ControlCenter.otp_manager o ON o.employee_id=e.employee_id",
        //     {type: QueryTypes.SELECT })
        //     // .then((result) => {
        //         if(result){
        //         console.log("--------------------");
        //       logger.Success(
        //         func.procLogCons.LOG_OTPLIST_POST,
        //         func.logCons.FIELD_SERVICE
        //       );
        //       resolve(result);
        //     // })
        // }
        // else{
        //     // .catch((error) => {
        //         console.log("------------+++++-------------");
        //       logger.Error(
        //         func.procLogCons.LOG_OTPLIST_POST,
        //         error,
        //         func.logCons.FIELD_SERVICE
        //       );
        //       reject(error);
        //     // });
        //       }
