//****
var config = require('./config.json');
var connString = config.db.connString;


var configs = {
    "development": {
        getConnString: function()
        {
            return connString;
        },
        getEnv: function()
        {
        	return "development";
        },
        getNItemsPerPage: function()
        {
            return 5;
        },
        getNbrAnnoucementsAtHomepage: function()
        {
            return 6;
        },

        getNCharDescription: function()
        {
            return 64;
        }
    }
}

var config = configs[process.env.NODE_ENV] || configs["development"];

//console.log("using config", config);


module.exports = config;