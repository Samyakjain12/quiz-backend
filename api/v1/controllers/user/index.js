const ResHelper = require(_pathconst.FilesPath.ResHelper);

const addUser = async (req , res) => {
    try {
        const { email, password, mobile , first_name, last_name } = req.body;

        if(!email || !password || !mobile || !first_name || !last_name) return ResHelper.apiResponse(res, true, "First Name , Last Name , Email , Mobile and Password are required", 400, {});

        const checkIfUserExists = await knexSqlDb('users')
                                        .select([knexSqlDb.raw('bin_to_uuid(user_id) as user_id')])
                                        .where((cb) => {
                                            if(email) cb.orWhere({email})
                                            if(mobile) cb.orWhere({mobile})
                                        })
        if(checkIfUserExists && checkIfUserExists.length) return ResHelper.apiResponse(res, true, "User Already Exists with this email/mobile", 400, {});

        const insertPayload = {
            email,
            password,
            mobile,
            first_name,
            last_name,
            attempted:0,
            score:0,
            active:1,
            user_id:knexSqlDb.raw(`uuid_to_bin(uuid())`)
        }

        const insertUser = await knexSqlDb('users').insert(insertPayload);

        const user_id = await knexSqlDb('users')
        .select([knexSqlDb.raw('bin_to_uuid(user_id) as user_id')])
        .where((cb) => {
            if(email) cb.orWhere({email})
            if(mobile) cb.orWhere({mobile})
        })
        return ResHelper.apiResponse(res, true, "Success", 200, {user_id:user_id[0].user_id});
    } catch (e) {
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error Occurred", 500, {});
    }
}

const signIn = async (req ,res) => {
    try {
        const { email, password, mobile } = req.body;

        if(!(email && password) && !(mobile && password) ) return ResHelper.apiResponse(res, true, "Email/Mobile and Password are required", 400, {});

        const checkIfUserExists = await knexSqlDb('users')
                                        .select([knexSqlDb.raw('bin_to_uuid(user_id) as user_id') , 'first_name' , 'last_name'])
                                        .where((cb) => {
                                            if(email) cb.orWhere({email})
                                            if(mobile) cb.orWhere({mobile})
                                        }).andWhere({password})
        if(checkIfUserExists && !checkIfUserExists.length) return ResHelper.apiResponse(res, true, "No user found. Please check the email/mobile and password", 400, {});
        
        return ResHelper.apiResponse(res, true, "Success", 200, checkIfUserExists[0]);
        

    } catch (e) {
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error Occurred", 500, {});
    }
}

const authenticateUser = async (req , res) => {
    try {
        const {user_id} = req.params;

        const checkIfUserExists = await knexSqlDb('users').select(['id' , 'first_name' , 'last_name']).where({user_id:knexSqlDb.raw(`uuid_to_bin('${user_id}')`) , active:1});

        if(checkIfUserExists && !checkIfUserExists) return ResHelper.apiResponse(res, true, "User account not active", 400, {});

        return ResHelper.apiResponse(res, true, "Success", 200, checkIfUserExists[0]);
    } catch (e) {
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error Occurred", 500, {});
    }
}


module.exports = {
    addUser,
    signIn,
    authenticateUser
}