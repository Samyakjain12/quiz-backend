const ResHelper = require(_pathconst.FilesPath.ResHelper);


const getAllQuestions = async (req , res) => {
    try {
        
        const questionBank = await knexSqlDb('questions').select(['id' , 'question' , 'option_a' , 'option_b' , 'option_c' , 'option_d' , 'answer']).where({is_deleted:0});

        return ResHelper.apiResponse(res, true, "Success", 200, questionBank);
    } catch (e) {
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error Occurred", 500, {});
    }
}

const getUserAnswers = async (req , res) => {
    try {
        const {user_id} = req.params;

        const response = await knexSqlDb('users as u')
                        .leftJoin('user_answers as ua' , 'u.user_id' , 'ua.user_id')
                        .leftJoin('questions as q' , 'ua.question_id' , 'q.id')
                        .where({
                            'u.user_id':knexSqlDb.raw(`uuid_to_bin('${user_id}')`) , 
                        }).orderBy('q.id');
        return ResHelper.apiResponse(res, true, "Success", 200, response);
    } catch (e) {
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error Occurred", 500, {});
    }
}

const recordAnswers = async (req , res) => {
    try{
        const answers = req.body;
        const user_id = answers[0].user_id;
        const date = new Date();

        const getAnswers = await knexSqlDb('questions').select(['id' , 'answer']).where({is_deleted:0});

        let score = 0;

        answers.length && answers.map((obj,index) => {
            let ans = getAnswers.find((obj1) => {
                return obj.question_id == obj1.id
            })

            if(ans.answer == obj.user_answer) score = score + 25;

            answers[index]['user_id'] = knexSqlDb.raw(`uuid_to_bin('${user_id}')`);

        })

        const recordUserAnswers = knexSqlDb('user_answers').insert(answers);
        const updateUserDetails = knexSqlDb('users').update({attempted_at:date , attempted:1,score}).where({user_id:knexSqlDb.raw(`uuid_to_bin('${user_id}')`)});

        await Promise.all([recordUserAnswers , updateUserDetails]);
        return ResHelper.apiResponse(res, true, "Success", 200, {});

    }catch(e){
        console.log(e);
        return ResHelper.apiResponse(res, false, "Error Occurred", 500, {});
    }
}

module.exports = {
    getAllQuestions,
    getUserAnswers,
    recordAnswers
}