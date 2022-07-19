const { profile, users } = require("../../models");

// Fetch profile
exports.getProfile = async (req, res) => {
    try {
        let profileData = await profile.findOne({
            where: {
                idUser: req.user.id
            },
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
                exclude: ['createdAt', 'updatedAt']
            }
        })

        profileData = JSON.parse(JSON.stringify(profileData));

        profileData = {
          ...profileData,
          image: process.env.PATH_FILE + profileData.image,
        };

        res.send({
            status: 'success',
            data: profileData
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// Update category by id
exports.updateProfile = async (req, res) => {
    try {
        const dataProfile = {
            phone: req?.body?.phone,
            gender: req?.body?.gender,
            address: req?.body?.address,
            image: req?.file?.filename,
          };

        await users.update({ name: req?.body?.name }, {
            where: {
                id: req.user.id
            }
        })

        await profile.update( dataProfile, {
            where: {
                idUser: req.user.id
            }
        })

        const profileData = await profile.findOne({
            where: {
              idUser: req.user.id
            },
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

        res.send({
            status: 'success',
            message: `Update profile id: ${id} finished`,
            data: { profileData, image: req?.file?.filename }
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}