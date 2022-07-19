const { books, users } = require("../../models");

// Add new product
exports.addBooks = async (req, res) => {
  try {    
    const data = {
      title: req.body.title,
      publicationdate: req.body.date,
      pages: req.body.pages,
      isbn: req.body.isbn,
      author: req.body.author,
      price: req.body.price,
      description: req.body.desc,
      promobook: req.body.promobook,
      bookattachment: req.files['bookattachment'][0].filename,
      thumbnail: req.files['thumbnail'][0].filename,
      idUser: req.user.id,
    };
    let newBook = await books.create(data);
    let bookData = await books.findOne({
      where: {
        id: newBook.id,
      },
      include: [
        {
          model: users,
          as: 'users',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        }
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });
    
    bookData = JSON.parse(JSON.stringify(bookData));

    res.send({
      status: 'success...',
      data: {
        ...bookData,
        bookattachment: process.env.PATH_FILE + bookData.bookattachment,
        thumbnail: process.env.PATH_FILE + bookData.thumbnail
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};


exports.getAllBooks = async (req, res) => {
  try {
    let data = await books.findAll({
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = data.map((item) => {
      item.bookattachment = process.env.PATH_FILE + item.bookattachment
      item.thumbnail = process.env.PATH_FILE + item.thumbnail

      return item
    })

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await books.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: 'users',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      bookattachment: process.env.PATH_FILE + data.bookattachment,
      thumbnail: process.env.PATH_FILE + data.thumbnail,
    };

    res.send({
      status: 'success...',
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};