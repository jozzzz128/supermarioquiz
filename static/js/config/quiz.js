let quiz, qHistory;

async function requestQuiz(){
    const selected = document.querySelector('head meta[name="quiz"]').getAttribute("selected");
    const {data} = await axios.get(`/static/js/config/grupos/${selected}-quiz-config.json`);
    quiz = data;
    
    qHistory = {
        count: 0,
        points: 0,
        limit: Math.floor(quiz.questions.length * quiz.dataBanc),
        questions: []
    };
    
    /*FORMAT TEXT INPUT*/
    quiz.prefix = util.formatText(quiz.prefix).toUpperCase();
    quiz.title = util.formatText(quiz.title).toUpperCase();

    //Format answers
    quiz.globalAns = quiz.globalAns.map(answer => {
        return {
            res: util.formatText(answer.res),
            correct: (answer.correct) ? true : null,
            value: (answer.value == undefined || answer.value == null) ? null : answer.value,
        }
    });

    quiz.questions = quiz.questions.map(question => {

        if(quiz.globalAns && !question.ans) return {
            text: util.formatText(question.text),
            ans: quiz.globalAns
        };
        
        else if (quiz.globalAns && question.ans) return {
            text: util.formatText(question.text),
            ans: question.ans.map(answer => {
                return {
                    res: util.formatText(answer.res),
                    correct: (answer.correct) ? true : null,
                    value: (answer.value == undefined || answer.value == null) ? null : answer.value,
                }
            })
        };

        else return {
            text: util.formatText(question.text),
            ans: question.ans.map(answer => {
                return {
                    res: util.formatText(answer.res),
                    correct: (answer.correct) ? true : null,
                    value: (answer.value == undefined || answer.value == null) ? null : answer.value,
                }
            })
        };


    });
}