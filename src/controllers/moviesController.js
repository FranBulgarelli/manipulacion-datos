const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
            .catch(err => {
                res.render('error')
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            })
            .catch(err => {
                res.render('error')
            })
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            })
            .catch(err => {
                res.render('error')
            })
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            })
            .catch(err => {
                res.render('error')
            })
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },
    create: function (req, res) {
        // console.log(req.body)
        db.Movie.create(req.body)
        .then(result => {
            res.redirect(`/movies/detail/${result.id}`)
        })
        .catch(err => {
            res.render('error')
        })
    },
    edit: function(req, res) {
        db.Movie.findByPk(+req.params.id)
        .then(Movie => {
            if(Movie) {
            res.render('moviesEdit', {Movie})
            } else {
            res.send('No existe esa pelicula')
            }
        })
        .catch(err => {
            res.render('error')
        })
    },
    update: function (req,res) {
        db.Movie.update(
            req.body,
            {
                where: {id: +req.params.id}
            }
        )
        .then(result => {
            if (result[0] !== 0) {
                res.redirect(`/movies/detail/${+req.params.id}`)
            } else {
                res.send('No habia nada para modificar')
            }
        })
        .catch(err => {
            res.render('error')
        })
    },
    delete: function (req, res) {
        db.Movie.findByPk(+req.params.id)
        .then(Movie => {
            if(Movie) {
            res.render('moviesDelete', {Movie})
            } else {
            res.send('No existe esa pelicula')
            }
        })
        .catch(err => {
            res.render('error')
        })
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where: {id: +req.params.id}
        })
        .then(result => {
            if(result === 1) {
                res.send('La pelicula fue eliminada')
            } else{
                res.send('No existe la pelicula con ese ID')
            }
        })
        .catch(err => {
            res.render('error')
        })
    }

}

module.exports = moviesController;