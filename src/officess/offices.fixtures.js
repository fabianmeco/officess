module.exports={
    post:{
        office: {
            "identifier": "UTA-322",
            "building": "UTA",
            "floor" : 3,
            "capacity":"3",
            "area": 44,
            "isAdminOffice": false
        },
        officewrong: {
            "building": "UTA",
            "floor" : 3,
            "capacity":"3",
            "area": 44,
            "isAdminOffice": false
        },
        officebad:{
            "identifier": "UTA-323",
            "building": "UTA",
            "floor" : "Este no debe funcionar",
            "capacity":"3",
            "area": 44,
            "isAdminOffice": false
        },
        officegood: {
            "identifier": "UTA-324",
            "building": "UTA",
            "floor" : 3,
            "isAdminOffice": false
        },

    },
    get:{
        office:{
            "identifier": 324,
            "building": "UTA",
        }
    }
}