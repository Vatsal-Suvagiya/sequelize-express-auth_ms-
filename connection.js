const { Sequelize } = require('sequelize').Sequelize

// sequelize = new Sequelize('sqlite::memory:');

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

  const sequelize = new Sequelize('HCIS_DEV','vatsal.suvagiya','njYn8Y!dcVz9irsI5^pDan7!9DgQMSi',{
    host: '172.25.22.20',
    dialect :'mssql',
    port: 3429,
    logging :true ,
    dialectOptions: {

        driver: "SQL Server Native Client 11.0",
        trustedConnection: "true",
        instanceName:'MSSQLSERVER',
        // useUTC: false
    },
    // useUTC: false
  timezone: '+05:30'
  })
  try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);

  }

  // sequelize.sync({ force: true });

  module.exports = sequelize
