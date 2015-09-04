var config = require(require('path').resolve(__dirname, "../", "config.js"));
var utils = require(require('path').resolve(__dirname, "../", "utils.js"));
var user = require('./../userAuthentication.js').roles;
var multer = require('multer');
var path = require('path');

var dir = path.join('public', 'uploads');
//filesize in bytes, 1024*1024*5 5242880 5MB, 10 ficheiros
var uploading = multer({dest: dir,
                        limits: { fileSize : 5242880, files: 10} });


module.exports = function(app) 
{

    var db = require('./../db');
    var express = require('express');
    var annoucementsRouter = express.Router();
    var nperpage = config.getNItemsPerPage();


    var allCategories;
    var allRatings = [{val:1},{val:2},{val:3},{val:4},{val:5}];   // Informação hardcoded apenas para facilitar o debug da aplicação

    annoucementsRouter.use(function (req, res, next) {
       db.Category.getAllCategories(function(err, allCatgs)
       {
        if(err) return res.status(500).send("OMG! Server Error.");
        this.allCategories = allCatgs;

    });
       next();
   });



    /* GET favorites annoucements of a specific user */
    annoucementsRouter.get('/favorites/:username', function(req, res) 
    {
        var page = req.query.page || 1;

        db.Followup.getAllFollowupByUser(req.param("username") , function(err, allFavorites)
        {
            if(err) req.flash('error','Obter lista de anúncios.');

            db.Annoucement.getAllAnnoucements(function(err, allAnnoucements){

                var allFavorites_map = allFavorites.map(function(f) { return f.annoucementid; });
               
                //var favoriteAds = allAnnoucements.filter(function(a) { return allFavorites_map.includes(a.annouce_id)}); // Array.prototype.includes() Not used, because this is an experimental API. 
                
                var favoriteAds = allAnnoucements.filter(function(a) { return allFavorites_map.indexOf(a.annouce_id) > -1 });


            var model = { title: 'CLX',
                pagination: utils.getPagination(page, nperpage, favoriteAds.length),
                message: utils.getMessages(req),
                username: res.locals.user.username,
                annoucements: favoriteAds,
                list_type : 'myFavorites',
                list_title: 'Os meus Favoritos',
                list_info : favoriteAds.length==0 ? 'Não tem anúncios na sua lista de Favoritos' : '' 
            };
            res.render('annoucement/list', model );
            });
        });
    });



    /* GET annoucements of a specific user */
    annoucementsRouter.get('/user/:username', function(req, res) 
    {
        var page = req.query.page || 1;

        db.Annoucement.getAllAnnoucementsByUsername(req.params.username, function(err, allAnnoucements)
        {
            if(err) req.flash('error','Obter lista de anúncios.');

            var model = { title: 'CLX',
                pagination: utils.getPagination(page, nperpage, allAnnoucements.length),
                message: utils.getMessages(req),
                annoucements: allAnnoucements,
                list_type : 'myAds',
                list_title: 'Os meus anúncios',
                list_info: allAnnoucements.length == 0 ? 'Não tem ainda qualquer anúncio criado' : '' 
            };
            res.render('annoucement/list', model );
        });
    });


    /* GET annoucements of a specific Category */
    annoucementsRouter.get('/category', function(req, res) 
    {
        var page = req.query.page || 1;

        db.Annoucement.getAllAnnoucementsByCategory(req.query.id , function(err, allAnnoucements)
        {
            if(err) req.flash('error','Obter lista de anúncios.');

            var adsByCategory = allAnnoucements.filter(function(a) { return a._state == 'activo'});

            var model = { title: 'CLX',
                pagination: utils.getPagination(page, nperpage, adsByCategory.length),
                message: utils.getMessages(req),
                annoucements: adsByCategory,
                category_name: req.query.name,
                category_id: req.query.id,
                list_type: 'byCategory',
                list_title: 'Anúncios da categoria '+ req.query.name,
                list_info: adsByCategory.length == 0 ? 'Não exitem anúncios desta categoria' : ''
            };
            res.render('annoucement/list', model );
        });
    });


    /* GET annoucements listing with advanced search. */
    annoucementsRouter.get('/list/search', function(req, res) 
    {
        var page = req.query.page || 1;

        db.Annoucement.getAllAnnoucements(function(err, allAnnoucements)
        {
            if(err) req.flash('error','Obter lista de anúncios.');

            var searchResult = allAnnoucements.filter(function(a) { return (a._state == 'activo') && 
                                                                            (a.title.indexOf(req.query.title) > -1) &&
                                                                            (a.locate == req.query.locate) && 
                                                                            (a.category == req.query.category);
                                                                        } );

            var model = { title: 'CLX',
                pagination: utils.getPagination(page, nperpage, searchResult.length),
                message: utils.getMessages(req),
                annoucements: searchResult,
                search_title: req.query.title,
                search_locate: req.query.locate,
                search_category: req.query.category,
                list_type: 'advancedSearch',
                list_title: 'Resultado da Pesquisa avançada',
                list_info: searchResult.length == 0 ? 'Não foram encontrados resultados para a pesquisa efetuada' : ''
            };
            res.render('annoucement/list', model );
        });
    });


    /* GET annoucements listing. */
    annoucementsRouter.get('/list', function(req, res) 
    {
        var page = req.query.page || 1;

        db.Annoucement.getAllAnnoucements(function(err, allAnnoucements)
        {
            if(err) req.flash('error','Obter lista de anúncios.');

            var all_ads = allAnnoucements.filter(function(a) { return a._state == 'activo'});

            var model = { title: 'CLX',
                pagination: utils.getPagination(page, nperpage, all_ads.length),
                message: utils.getMessages(req),
                annoucements: all_ads,
                list_type: 'allAds',
                list_title: 'Todos os anúncios', 
                list_info: all_ads.length == 0 ? 'Lista vazia' : '' 
            };

            res.render('annoucement/list', model );
     
        });
    });


    //GET New annoucement
    annoucementsRouter.get('/new', function(req, res) 
    {
        if(!req.isAuthenticated()){
            res.render('user/access-denied', {action: "Para inserir Anúncio deve estar logado"});
        }
        
       db.Category.getAllCategories(function(err, allCatgs)
       {
        if(err) return res.status(500).send("OMG! Server Error.");
        var model = { title: 'CLX',
            categories: allCatgs,
            message: utils.getMessages(req),
            annoucement: new db.Annoucement };

        //res.render('/annoucement/user/'+res.locals.user.username, model );
        res.render('annoucement/create', model );

    });
       /*
        var model = { title: 'CLX',
        categories: allCategories,
        message: utils.getMessages(req),
        annoucement: new db.Annoucement };

        res.render('annoucement/create', model );
        */
    });


/* POST add annoucement to personal favorites list (follow) */
annoucementsRouter.post('/view/:id/follow', function(req, res) 
{
    var follow = req.body.follow;
    var annoucement_id = req.param("id");

    if (follow == "follow_up"){
        db.Followup.createNew(new db.Followup(res.locals.user.username, annoucement_id, false), function(err){
            if(err) req.flash('error','Não foi possível criar registo de acompanhamento do anúncio.');
            //else{req.flash('info','Registo de acompanhamento do anúncio criado com sucesso.'); }

            res.redirect("/annoucement/view/"+annoucement_id);
        });  
    } else{
        db.Followup.deleteFollowup(res.locals.user.username, annoucement_id, function(err){
            if(err) req.flash('error','Não foi possível eliminar registo de acompanhamento do anúncio.');

            res.redirect("/annoucement/view/"+annoucement_id);
        });
    }
});


/* POST comment. (new comment) */
annoucementsRouter.post('/view/:id/newcomment', function(req, res) 
{

    
    var typeComment_response = req.body.typeComment_response;
    var typeComment_normal = req.body.typeComment_normal;
    //console.log("/////////////////////  -> comment text: "+newCommentText);
    //var comment_id = req.query.comment_id;
  
    if(typeComment_normal){
        var newCommentText = req.body.newCommentText;
        db.Comment.createNew(new db.Comment(null,req.param("id"), res.locals.user.username , newCommentText, null, new Date()), function(err,id){
            if(err) req.flash('error','Não foi possível registar novo comentário.');  

            res.redirect("/annoucement/view/"+req.param("id"));
        });     
    } else if(typeComment_response){
        var comment_id = typeComment_response;
        var aux = "responseText_"+comment_id;
        //var aux2 = "responseText_";
        var responseText = req.body.responseText_;//var responseText = req.body.responseText_;
        console.log("/////////////////////  -> responseText  e aux: "+responseText+" ; "+aux);
        
            db.Comment.setResponse(responseText, comment_id, function(err,id){
            if(err) req.flash('error','Não foi possível registar a resposta a comentário.');  

            res.redirect("/annoucement/view/"+req.param("id"));
        } );
    }
    
});


    /* GET annoucement detail. */
    annoucementsRouter.get('/view/:id', function(req, res) 
    {
        var vote, isFollowing, comments=[], photos=[];

        db.Annoucement.getById(req.params.id, function(err, annoucement)
        {
            if(err) req.flash('error','Não foi possível obter detalhe do anúncio.');
            
            db.Followup.getByUserAndAnnoucement(res.locals.user.username, annoucement.annouce_id, function(err, followup){
                isFollowing = (followup===undefined || followup==null?false:true);
            });

            db.Followup.updateFollowupActivity(res.locals.user.username, annoucement.annouce_id, function(err, id){
                if(err) req.flash('error','Atualizar estado atividade do anúncio.');
            });

            db.Comment.getAllByAnnoucement_id(annoucement.annouce_id, function(err, allComments){
                if(err) req.flash('error','Obter comentários do anúncio.');

                comments = allComments;
                comments.forEach(function(elem){

                    console.log("**************>>>>> comment_response: "+elem.comment_response);
                //elem.creation_date = elem.creation_date.toISOString().replace('T', '\n').substr(0, 19);  //****************
                });

            });

            db.Vote.getByUsername(annoucement.owner, res.locals.user.username, function(err, v){
                if(err) req.flash('error','Obter votações.');
                vote = v;
            });

            console.log('ANTES DAS FOTOS');

            db.Photo.getAllByAnnoucement_id(annoucement.annouce_id, function(err, allPhotos){
                if(err) req.flash('error','Obter fotos.');
                photos = allPhotos;
                console.log('FOTOS EH EH');
                console.log(photos);
            });

            db.Category.getById(annoucement.category, function(err, category)
            {
                if(err) req.flash('error','Obter descritivo da categoria.');

                db.User.getByUsername(annoucement.owner, function(err, user){
                    var model = { title: 'CLX',
                    message: utils.getMessages(req),
                    category: category,
                    ratings: allRatings,
                    voted: vote,
                    isFollowing: isFollowing,
                    annoucement: annoucement,
                    comments: comments,
                    photos: photos,
                    getCommentByIndex: function(arr, idx){console.log("************************ "+arr[idx].id); return function (){ return arr[idx];};}, // closure for current array index of comments
                    user_owner: user};
                    if (model.photos != undefined) {
                        model.photos.forEach(function(i) {
                            console.log(i);});
                    }

                    //console.log(photos);
                    res.render('annoucement/view', model );

                });
            });
            
        });
});


    //POST New annoucement
    annoucementsRouter.post('/new', function createNewannoucement(req, res)
    {
        var title = req.body.title;
        var description = req.body.description;
        var category = req.body.category;
        var locate = req.body.locate;
        var price = req.body.price;
        var annoucement = new db.Annoucement(null, title, description, res.locals.user.username, category, locate, price, null, undefined);

        console.log('FILE ###');
        console.log(req.files);

        if(title == "") {
            req.flash("error", "Não foi possível criar o anúncio.");
            return res.render('annoucement/create', { annoucement: annoucement,
             message: utils.getMessages(req),
             categories: this.allCategories});
        }

        db.Annoucement.createNew(annoucement, function (err, id) {
            if(err) {
                req.flash("error", "Não foi possível criar o Anúncio.");
                return res.render('annoucement/create', { annoucement: annoucement,
                 message: utils.getMessages(req),
                 categories: this.allCategories });
            }

            res.redirect('/annoucement/view/' + id);
        });
    });

    //GET Edit annoucement
    annoucementsRouter.get('/edit/:id', function(req, res) 
    {

        if(!req.isAuthenticated()){
            res.render('user/access-denied', {action: "O utilizador tem de estar autenticado!"});
        }

        db.Annoucement.getById(req.param("id"), function(err, annoucement){
            if(err){
                req.flash("error", "Não foi possível obter o anúncio a alterar.");
                res.redirect('/annoucement/view/' + req.param("id"));
            }

            db.Category.getAllCategories(function(err, allCategories)
            {
                if(err) req.flash("error", "Não foi possível obter a lista de categorias.");

                var model = { title: 'CLX',
                categories: allCategories,
                message: utils.getMessages(req),
                annoucement: annoucement };

                res.render('annoucement/edit', model );
            });
        });
    });

    //POST Edit annoucement
    annoucementsRouter.post('/edit/:id', function editannoucement(req, res)
    {

        db.Annoucement.getById(req.params.id, function(err, annoucement){
            if(req.body.title == "" ) {
                req.flash("warning", "Não é possível alterar o anúncio. Verifique os valores introduzidos.")
                return res.render('annoucement/edit', { annoucement: annoucement,
                    message: utils.getMessages(req),
                    categories: this.allCategories });
            }

            annoucement.title = req.body.title;
            annoucement.description = req.body.description;
            annoucement.category = req.body.category;

            //-------------------------------------------------------
            //TODO: create new comment with changes made

            var newCommentText = "Anúncio alterado."

            db.Comment.createNew(new db.Comment(null,req.params.id, res.locals.user.username , newCommentText, null, new Date()), function(err,id){
                if(err) return res.status(500).send("Erro ao adicionar Comentario");  
            }); 
            //-------------------------------------------------------

            db.Followup.updateAnnoucementActivity(annoucement.annouce_id, function(err, id){});

            db.Annoucement.edit(annoucement, function (err, id) {
                if(err) {
                    req.flash("warning", "Não é possível alterar o anúncio. Verifique os valores introduzidos.")
                    return res.render('annoucement/edit/'+req.param("id"), { id: annoucement.annouce_id,
                        annoucement: annoucement,
                        categories: this.allCategories });
                }

                res.redirect('/annoucement/view/' + id);
            });
        });     
    });

    //FOTOS

    //GET edit fotos annoucement
    annoucementsRouter.get('/photo/:id', function(req, res) 
    {
        if(!req.isAuthenticated()){
            res.render('user/access-denied', {action: "O utilizador tem de estar autenticado!"});
        }

        db.Annoucement.getById(req.params.id, function(err, annoucement){
            if(err){
                req.flash("error", "Não foi possível obter o anúncio a alterar.");
                res.redirect('/annoucement/view/' + req.param("id"));
            }

            db.Category.getAllCategories(function(err, allCategories)
            {
                if(err) req.flash("error", "Não foi possível obter a lista de categorias.");

                db.Photo.getAllByAnnoucement_id(annoucement.annouce_id, function(err, allPhotos){
                    if(err) req.flash('error','Obter fotos.');

                    console.log('ALL FOTOS');
                    console.log(allPhotos);

                    var model = { title: app.locals.title,
                    categories: allCategories,
                    message: utils.getMessages(req),
                    annoucement: annoucement,
                    photos: allPhotos };

                    res.render('annoucement/photo', model );
                });
            });
        });
    });





    //POST PHOTOS
    annoucementsRouter.post('/photo/:id',  uploading.array('cska', 10), function postPhotos(req, res,next){
        //var model = {};
        var model = {title: "",
                categories: [],
                message: "",
                photos : undefined,
                annoucement: ""};
        var oldphotos;

        if(!req.isAuthenticated() || !user.can('access manager')){
            res.render('user/access-denied', {action: "Tem de estar autenticado!"});
        }

        db.Annoucement.getById(req.params.id, function (err, annoucement){
            if(req.body.title == "" ) {
                req.flash("warning", "Não é possível alterar as fotos do anúncio. Verifique os valores introduzidos.")
                return res.redirect("/annoucement/view/"+req.params.id);
            }

            db.Photo.getAllByAnnoucement_id(annoucement.annouce_id, function(err, allPhotos){
                if(err) req.flash('error','Obter fotos.');

                model.title = app.locals.title;
                model.categories = allCategories;
                model.message = utils.getMessages(req);
                model.annoucement = annoucement;
                model.photos = allPhotos;
                oldphotos = allPhotos;



                if (req.body.action == 'upload'){
                    var photolist = req.files.map(function(ele){
                        return ele.filename;
                    }); 
                    var newCommentText = "Fotos adicionadas";


                    if (oldphotos != undefined){
                        oldphotos.forEach(function(photo){
                            photolist.push(photo);
                        });

                        model.photos = photolist;
                        db.Photo.edit(new db.Photo(req.params.id, photolist), function (err,id){
                            if(err) return res.status(500).send("Erro actualizar fotos");  
                            console.log(model);
                            model.photos = photolist;
                            res.render('annoucement/photo', model );
                        });
                    }
                    else {
                        db.Photo.createNew(new db.Photo(req.params.id, photolist), function (err,id){
                            if(err) return res.status(500).send("Erro actualizar fotos");
                            console.log(model);
                            model.photos = photolist;
                            res.render('annoucement/photo', model );
                        });
                    }            
                }//é p apagar fotos
                else {
                    var photolist = req.body.foto;

                    if(typeof(photolist) ==  'string'){
                        oldphotos.pop(photolist);;

                    }else {
                        photolist.forEach(function(photo){
                            oldphotos.pop(photo);
                        })
                    }    

                    db.Photo.edit(new db.Photo(req.params.id, oldphotos), function (err,id){
                        if(err) return res.status(500).send("Erro actualizar fotos");  
                        console.log(model);
                        model.photos = oldphotos;
                        res.render('annoucement/photo', model );
                    });
                }
            });
        });
    });

    


    



    //GET Close annoucement
    annoucementsRouter.get('/close/:id', function(req, res) 
    {

        if(!req.isAuthenticated() || !user.can('access manager')){
            res.render('user/access-denied', {action: "Tem de estar autenticado!"});
        }

        db.Annoucement.getById(req.param("id"), function(err, annoucement){
            var model = { 
                title: 'CLX',
                comment: new db.Comment(),
                message: utils.getMessages(req),
                annoucement: annoucement 
            };
            res.render('annoucement/close', model );
        });
        
    });

    //POST Close annoucement
    annoucementsRouter.post('/close/:id', function(req, res) 
    {

        
        var annoucement = req.body.annoucement;
        db.Followup.updateAnnoucementActivity(req.param("id"), function(err, id){});

        db.Annoucement.changeStateById(req.param("id"), 'cancelado', function (err, id) {
            if(err) {
                req.flash("error", "Não é possível cancelar o anúncio.")
              //  return res.render('annoucement/', { annoucement: annoucement, message: utils.getMessages(req)});
            }

            res.redirect('/annoucement/user/'+res.locals.user.username);
        });

    });



    //GET Activate annoucement
    annoucementsRouter.get('/activate/:id', function(req, res) 
    {

        if(!req.isAuthenticated() || !user.can('access manager')){
            res.render('user/access-denied', {action: "Tem de estar autenticado!"});
        }

        db.Annoucement.getById(req.param("id"), function(err, annoucement){
            var model = { 
                title: 'CLX',
                comment: new db.Comment(),
                message: utils.getMessages(req),
                annoucement: annoucement 
            };
            res.render('annoucement/activate', model );
        });
        
    });

    //POST Activate annoucement
    annoucementsRouter.post('/activate/:id', function(req, res) 
    {

        
        var annoucement = req.body.annoucement;
        db.Followup.updateAnnoucementActivity(req.param("id"), function(err, id){});

        db.Annoucement.changeStateById(req.param("id"), 'activo', function (err, id) {
            if(err) {
                req.flash("error", "Não é possível activar o anúncio.")
              //  return res.render('annoucement/', { annoucement: annoucement, message: utils.getMessages(req)});
            }

            res.redirect('/annoucement/user/'+res.locals.user.username);
        });

    });


    /* GET annoucements listing. */
    annoucementsRouter.get('/', function(req, res) 
    {
        var page = req.query.page || 1;

        db.Annoucement.getAllAnnoucements(function(err, allAnnoucements)
        {
            if(err) req.flash('error','Obter lista de anúncios.');

            var all_ads = allAnnoucements.filter(function(a) { return a._state == 'activo'});

            var model = { title: 'CLX',
            pagination: utils.getPagination(page, nperpage, allAnnoucements.length),
            message: utils.getMessages(req),
            annoucements: all_ads,
            list_type: 'allAds',
            list_title: 'Todos os anúncios', 
            list_info: all_ads.length == 0 ? 'Lista vazia' : '' 
        };
        res.render('annoucement/list', model );
    });
    });

app.use("/annoucement", annoucementsRouter);
}