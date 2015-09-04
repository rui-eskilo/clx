//INSERT INTO Annoucement(title, description, owner, category, locate, state) VALUES('Primeiro anuncio','Primeiro anuncio descriçao','Rui','Outros','Lisboa','activo');


module.exports = function(Annoucement, User, Comment, Category, Vote, Rating, Photos){

var ratings = [
    new Rating(1),
    new Rating(2),
    new Rating(3),
    new Rating(4),
    new Rating(5)
];    

 var users = [
    new User('andre', '123','André Mendes', 'asmendes85@sapo.pt', null, 30, 10 ),
    new User('rui', '123456','Rui Machado', 'rui_eskilo@hotmail.com',null, 55, 15 ),
    new User('maria', '1234','Maria João', 'xxxx@xx.com',null, 10, 4 )
 ];

 var categories = [
    new Category(null, 'Vestuário'),
    new Category(null, 'Informática'),
    new Category(null, 'Automóveis'),
    new Category(null, 'Consolas  e Jogos PC'),
    new Category(null, 'Outros') 
 ];

 var annoucements = [
    new Annoucement(null, 'Mesa de centro (Rui)','anuncio 1 descriçao ',users[1].username,categories[4].id,'Cabeço Velho','30€', new Date(), 'activo'),
    new Annoucement(null, 'Vendo carro completamente artilhado','anuncio 2 descriçao ',users[0].username,categories[2].id,'Zambujeira do Mar','100,50e', new Date(), 'activo'),
    new Annoucement(null, 'Vendo SEGA megadrive (Rui)','anuncio 3 descriçao ',users[1].username,categories[3].id,'Idanha-a-Nova','10€', new Date(), 'activo'),
    new Annoucement(null, 'Vendo o bikini da minha prima','anuncio 4 descriçao ',users[0].username,categories[4].id,'Lisboa','100,50e', new Date(), 'activo'),
    new Annoucement(null, 'Rebobinador de disquetes (Rui)','anuncio 5 descriçao ',users[1].username,categories[1].id,'Bragança','30€', new Date(), 'activo'),
    new Annoucement(null, 'coleção de óculos do Pedro Abrunhosa','anuncio 6 descriçao ',users[0].username,categories[0].id,'Beja','100,50e', new Date(), 'activo'),
    new Annoucement(null, 'Jogos PS antigos e usados, mas como novos (Rui)','anuncio 7 descriçao ',users[1].username,categories[3].id,'Belém','30€', new Date(), 'activo'),
    new Annoucement(null, 'Vendo a minha FAMEL a quem der mais! (Rui)','anuncio 8 descriçao ',users[1].username,categories[2].id,'Guarda','100,50e', new Date(), 'activo'),
    new Annoucement(null, 'Consola com PES e cabeça (Rui)','anuncio 9 descriçao ',users[1].username,categories[3].id,'Verdade ou Consequencias','30€', new Date(), 'activo'),
    new Annoucement(null, 'Vendo o cotão (Rui)','anuncio 10 descriçao ',users[1].username,categories[4].id,'Sines','100,50e', new Date(), 'activo'),
    new Annoucement(null, 'Portatil ASUS (Rui)','anuncio 11 descriçao ',users[1].username,categories[1].id,'Tomar','30€', new Date(), 'activo'),
    new Annoucement(null, 'Audi A3 2000 (Rui)','anuncio 12 descriçao longa 11111111111111111111222222222222222222222233333333333333333333333344444444444444444444444444444__END. ',users[1].username,categories[2].id,'Castelo Branco','100,50e', new Date(), 'activo'),
    new Annoucement(null, 'Vendo apontamentos de PI (Rui)','anuncio 13 descriçao ',users[1].username,categories[4].id,'Lisboa','88888 euros negociáveis', new Date(), 'activo'),      
    new Annoucement(null, 'Vendo cartazes do glorioso com fotografia dos que já sairam','anuncio 14 descriçao ',users[0].username,categories[4].id,'Lisboa','000€', new Date(), 'cancelado'), 
    new Annoucement(null, 'Vendo quadros do Picasso','anuncio 15 descriçao ',users[1].username,categories[4].id,'Lisboa','406€', new Date(), 'activo'),
    new Annoucement(null, 'Vendo bilhetes para a supertaça','anuncio 16 descriçao. Carrega BENFICA ',users[0].username,categories[4].id,'Lisboa','11€', new Date(), 'activo')

  ]; 

 var comments = [
    new Comment(null, annoucements[0].annouce_id, users[0].username, 'Comentário 1 +++++', null, new Date() ),
    new Comment(null, annoucements[0].annouce_id, users[1].username, 'comentário 2 --------', null, new Date() ),
    new Comment(null, annoucements[0].annouce_id, users[0].username, 'comentário 3 com Resposta', 'bla bla!', new Date() ),
     
 ];


var photos = [];

Rating.getAllRatings(function(err, dbratings)
{
    console.log("INFO: There are ", dbratings.length, " ratings in the database");
    if(dbratings.length == 0) {
        console.log("Empty list of ratings. Creating rating values...");
        ratings.forEach(function(r) {
            Rating.createNew(r, function() {
                console.log(" -- NEW RATING --> sample value:", r.val);
            });
        });
        }
});



//  ***************   Callback HELL scenery  *********************
User.getAllUsers(function(err, dbusers)
{
    console.log("INFO: There are ", dbusers.length, " users in the database");
    if(dbusers.length == 0) {
        var countUsers = 0;
        console.log("Empty list of users. Creating sample users...");
        users.forEach(function(user) {
            User.createNew(user, function() {
                console.log(" -- NEW USER --> sample user:", user.name);


                if(++countUsers >= users.length){
                    //Now, once the users were created, let's create some categories
                    Category.getAllCategories(function(err, dbcategories)
                    {
                        console.log("INFO: There are ", dbcategories.length, " categories in the database");
                        if(dbcategories.length == 0) {
                            var countCategories = 0;
                            console.log("Empty list of categories. Creating sample categories...");
                            categories.forEach(function(category) {
                                Category.createNew(category, function(err) {
                                    if (err) console.log(err);
                                    console.log(" -- NEW CATEGORY --> ", category.name, " created");


                                    if(++countCategories >= categories.length){
                                        //Now, once the users & categories were created, let's create some annoucements
                                        Annoucement.getAllAnnoucements(function(err, dbannoucements)
                                        {
                                            console.log("INFO: There are ", dbannoucements.length, " annoucements in the database");
                                            if(dbannoucements.length == 0) {
                                                var countAnnoucements = 0;
                                                console.log("Empty list of annoucements. Creating sample annoucements...");
                                                annoucements.forEach(function(annoucement) {
                                                    Annoucement.createNew(annoucement, function() {
                                                        console.log(" -- NEW ANNOUCEMENT --> ", annoucement.title, "   created");


                                                        if(++countAnnoucements >= annoucements.length){
                                                            //Now, once the users & categories & annoucements were created, let's create some comments
                                                            Comment.getAllComments(function(err, dbcomments)
                                                            {

Annoucement.getAllAnnoucements(function(err, dbannoucements){
    console.log("---------------------------INFO: There are ", dbannoucements.length, " annoucements in the database");
});


                                                                console.log("INFO: There are ", dbcomments.length, " comments in the database"); 
                                                                if(dbcomments.length == 0) {
                                                                    console.log("Empty list of comments. Creating sample comments...");
                                                                    comments.forEach(function(comment) {
                                                                        console.log("[info debug] comment.annoucement: ",comment.annoucement);
                                                                        Comment.createNew(comment, function(err) {
                                                                              if (err) console.log(err);
                                                                            console.log(" -> sample Comment for the annoucement ", comment.annoucement, " created. Text: ", comment.comment_text);
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }


                                                    });
                                                });
                                            }
                                        });
                                    }


                                });
                            });
                        }
                    });   
                }


            });
        });
    }
});

/*

Category.getAllCategories(function(err, dbcategories)
{
    console.log("INFO: There are ", dbcategories.length, " categories in the database");
    if(dbcategories.length == 0) {
        console.log("Empty list of categories. Creating sample categories...");
        categories.forEach(function(category) {
            Category.createNew(category, function(err) {
                if (err) console.log(err);
                console.log(" -- NEW CATEGORY --> ", category.name, " created");
            });
        });
    }
});



Annoucement.getAllAnnoucements(function(err, dbannoucements)
{
    console.log("INFO: There are ", dbannoucements.length, " annoucements in the database");
    if(dbannoucements.length == 0) {
        console.log("Empty list of annoucements. Creating sample annoucements...");
        annoucements.forEach(function(annoucement) {
            Annoucement.createNew(annoucement, function() {
                console.log(" -- NEW ANNOUCEMENT --> ", annoucement.title, "   created");
            });
        });
    }
});



Comment.getAllComments(function(err, dbcomments)
{
    console.log("INFO: There are ", dbcomments.length, " comments in the database"); 
    if(dbcomments.length == 0) {
        console.log("Empty list of comments. Creating sample comments...");
        comments.forEach(function(comment) {
            console.log("[info debug] comment.annoucement: ",comment.annoucement);
            Comment.createNew(comment, function(err) {
                  if (err) console.log(err);
                console.log(" -> sample Comment for the annoucement ", comment.annoucement, " created. Text: ", comment.comment_text);
            });
        });
    }
});

*/

}
