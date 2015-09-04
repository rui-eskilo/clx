//****

var configs = {
    "development": {
        getConnString: function()
        {
            return "postgres://postgres:123@localhost/clx_db";
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