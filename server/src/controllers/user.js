const { user, profile} = require('../../models')

exports.getUsers = async(req, res) => {
    try {
        const users = await user.findAll({
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
                },
                attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
                },
            });
        
            res.send({
                status: "success",
                data: {
                users,
                },
        });
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'server error'
        })
    }
}