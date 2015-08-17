//****

var configs = {
    "development": {
        getConnString: function()
        {
            return "postgres://postgres:rui@localhost/clx_db";
        },
        getEnv: function()
        {
        	return "development";
        },
        getNItemsPerPage: function()
        {
            return 3;
        },
        getNbrAnnoucementsAtHomepage: function()
        {
            return 9;
        }
    }
}

var config = configs[process.env.NODE_ENV] || configs["development"];

//console.log("using config", config);


module.exports = config;