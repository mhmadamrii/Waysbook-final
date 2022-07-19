    const { users, transactions, books, bookspurchased, profile } = require("../../models");
    // Import midtransClient here ...
    const midtransClient = require("midtrans-client");
    const nodemailer = require("nodemailer");

    exports.getAllTransactions = async (req, res) => {
    try {
        const idBuyer = req.user.id;
        let data = await transactions.findAll({
        where: {
            idBuyer,
            status: "success"
        },
        order: [["createdAt", "DESC"]],
        attributes: {
            exclude: ["updatedAt", "idBuyer", "idSeller"],
        },
        include: {
            model: books,
            as: "books",
            through: {
            model: bookspurchased,
            as: 'bridge',
            attributes: {
                exclude: ["idUser"]
            },
            },
        }
        });


        data = JSON.parse(JSON.stringify(data));

        // data = data.map((item) => {
        //   return {
        //     ...item,
        //     books: {
        //       ...item.books,
        //       thumbnail: process.env.PATH_FILE + item.books.thumbnail,
        //       bookattachment: process.env.PATH_FILE + item.books.bookattachment,
        //     },
        //   };
        // });

        res.send({
        status: "success",
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

    exports.getAllTransactionsAdmin = async (req, res) => {
        try {
        let data = await transactions.findAll({
            order: [["createdAt", "DESC"]],
            attributes: {
            exclude: ["updatedAt", "idBuyer", "idSeller"],
            },
            include: [
            {
                model: users,
                as: "buyer",
                attributes: {
                exclude: ["createdAt", "updatedAt", "password", "status"],
                },
            },
            {
                model: users,
                as: "seller",
                attributes: {
                exclude: ["createdAt", "updatedAt", "password", "status"],
                },
            },
            ],
        });
    
        data = JSON.parse(JSON.stringify(data));
    
        res.send({
            status: "success",
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

    exports.addTransaction = async (req, res) => {
        try {
        // Prepare transaction data from body here ...
        let data = req.body;
    
        data = {
            id: parseInt(Math.random().toString().slice(3, 8)),
            idSeller: 1,
            totalpayment: req.body.totalpayment,
            idBuyer: req.user.id,
            status: "pending",
        };
    
        
        // Insert transaction data here ...
        let newData = await transactions.create(data);

        let bookId = req.body.booksId;

            const bookPurchasedData = bookId.map((item) => {
            return { idBook: parseInt(item), idTransaction: newData.id };
            });


            let dataBooks = await bookspurchased.bulkCreate(bookPurchasedData);

        // Get buyer data here ...
        const buyerData = await users.findOne({
            include: {
            model: profile,
            as: "profile",
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
            },
            where: {
            id: newData.idBuyer,
            },
            attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
            },
        });
    
        // Create Snap API instance here ...
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
    
        // Create parameter for Snap API here ...
        let parameter = {
            transaction_details: {
            order_id: newData.id,
            gross_amount: newData.totalpayment,
            },
            credit_card: {
            secure: true,
            },
            customer_details: {
            full_name: buyerData?.name,
            email: buyerData?.email,
            phone: buyerData?.profile?.phone,
            },
        };
    
        // Create trasaction token & redirect_url with snap variable here ...
        const payment = await snap.createTransaction(parameter);
    
        res.send({
            status: "pending",
            message: "Pending transaction payment gateway",
            payment,
            dataBooks
        });
        } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
        }
    };
    
    // Create configurate midtrans client with CoreApi here ...
    const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY
    const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY
    
    const core = new midtransClient.CoreApi();
    
    core.apiConfig.set({
        isProduction: false,
        serverKey: MIDTRANS_SERVER_KEY,
        clientKey: MIDTRANS_CLIENT_KEY
    })
    
    /**
     *  Handle update transaction status after notification
     * from midtrans webhook
     * @param {string} status
     * @param {transactionId} transactionId
     */
    
    // Create function for handle https notification / WebHooks of payment status here ...
    exports.notification = async (req,res) => {
        try {
    
        const statusResponse = await core.transaction.notification(req.body)
    
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status
        const fraudStatus = statusResponse.fraud_status
    
        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
            sendEmail("pending", orderId);
            // TODO set transaction status on your database to 'challenge'
            // and response with 200 OK
            updateTransaction("pending", orderId);
            res.status(200);
            } else if (fraudStatus == "accept") {
            sendEmail("success", orderId);
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            updateTransaction("success", orderId);
            res.status(200);
            }
        } else if (transactionStatus == "settlement") {
            sendEmail("success", orderId);
            // TODO set transaction status on your database to 'success'
            // and response with 200 OK
            updateTransaction("success", orderId);
            res.status(200);
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            sendEmail("failed", orderId);
            // TODO set transaction status on your database to 'failure'
            // and response with 200 OK
            updateTransaction("failed", orderId);
            res.status(200);
        } else if (transactionStatus == "pending") {
            sendEmail("pending", orderId);
            // TODO set transaction status on your database to 'pending' / waiting payment
            // and response with 200 OK
            updateTransaction("pending", orderId);
            res.status(200);
        }
    
        
        } catch (error) {
        console.log(error)
        res.send({
            message: 'Server Error'
        })
        }
    }
    
    // Create function for handle transaction update status here ...
    const updateTransaction = async (status, transactionId) => {
        await transactions.update(
        {
            status,
        },
        {
            where: {
            id: transactionId,
            },
        }
        );
    }; 
    
    // Create function receive two params (status,orderId) for handle send email here ...
    const sendEmail = async (status, transactionId) => {
        // Config service and email account
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_PASSWORD,
        },
        });
    
        // Get transaction data
        let data = await transactions.findOne({
        where: {
            id: transactionId,
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
        },
        include: [
            {
            model: users,
            as: "buyer",
            attributes: {
                exclude: ["createdAt", "updatedAt", "password", "status"],
            },
            },
        ],
        });
    
        data = JSON.parse(JSON.stringify(data));
    
        // Email options content
        const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to: data.buyer.email,
        subject: "Payment status",
        text: "Your payment is <br />" + status,
        html: `<!DOCTYPE html>
                <html lang="en">
                    <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                    <style>
                        h1 {
                        color: brown;
                        }
                    </style>
                    </head>
                    <body>
                    <h2>Product payment :</h2>
                    <ul style="list-style-type:none;">
                        <li>ID Transaction : ${data.id}</li>
                        <li>Total payment: ${data.totalpayment}</li>
                        <li>Status : <b>${status}</b></li>
                    </ul>  
                    </body>
                </html>`,
        };
    
        // Send an email if there is a change in the transaction status
        if (data.status != status) {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err;
            console.log("Email sent: " + info.response);
    
            return res.send({
            status: "Success",
            message: info.response,
            });
        });
        }
    };