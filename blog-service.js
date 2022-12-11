/*********************************************************************************
 *  WEB322 – Assignment 05
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
 *  assignment has been copied manually or electronically from any other source (including web sites) or
 *  distributed to other students.
 *
 *  Name: NONTHACHAI PLODTHONG Student ID: 152487211 Date: 21/11/2022
 *
 *  Online (Heroku) Link:https://gentle-waters-38058.herokuapp.com/blog
 *
 ********************************************************************************/
const Sequelize = require('sequelize');
var sequelize = new Sequelize('d9m5ufs2a94li4', 'zembpltnvjqcnq', '5c99aa54c90e6d1b6a8f80c0eaa030e78a5c053c6b73e881f1b21b068aee746d', {
    host: 'ec2-23-23-182-238.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {rejectUnauthorized: false}
    },
    query: {raw: true}
});


var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
})

var Category = sequelize.define('Category', {
    category: Sequelize.STRING
})
//mongodb+srv://nplodthong:<password>@senecaweb.p3gloqw.mongodb.net/?retryWrites=true&w=majority
Post.belongsTo(Category, {as: 'category'});
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(resolve('Sync Success'))
            .catch(reject('unable to sync the database'))
    });
};


module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll().then(data => {
            resolve(data);
        }).catch(err => {
            reject("no results returned");
        });
    });
}

module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then(data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPostsByMinDate = function (minDateStr) {

    const {gte} = Sequelize.Op;

    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(data => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then(data => {
            resolve(data[0]);
        }).catch((err) => {
            reject("no results returned");
        });
    });
}

module.exports.addPost = function (postData) {
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false;

        for (var prop in postData) {
            if (postData[prop] === '')
                postData[prop] = null;
        }

        postData.postDate = new Date();

        Post.create(postData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create post");
        });

    });
}

module.exports.deletePostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: {
                id: id
            }
        }).then(data => {
            resolve();
        }).catch(() => {
            reject("unable to delete post");
        });
    });
}

module.exports.getPublishedPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then(data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data => {
            resolve(data);
        }).catch(err => {
            reject("no results returned")
        });
    });
}

module.exports.addCategory = function (categoryData) {
    return new Promise((resolve, reject) => {

        for (var prop in categoryData) {
            if (categoryData[prop] === '')
                categoryData[prop] = null;
        }

        Category.create(categoryData).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to create category");
        });

    });
}

module.exports.deleteCategoryById = function (id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then(data => {
            resolve();
        }).catch(() => {
            reject("unable to delete category");
        });
    });
}

;