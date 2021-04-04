const quiz = {
    prefix: "Grupo 2:",
    title: "Reumatología y traumatología",
    dataBanc: 1,
    randomize: false,
    questions: [
        {
            text: "Según su mecanismo de acción ¿A cuál de estos grupos pertenece el Alopurinol?",
            ans: [
                {
                    res: "Inhibidores de la uricosíntesis",
                    correct: true
                },
                {
                    res: "Uricosúricos",
                },
                {
                    res: "Urocolíticos"
                }
            ]
        },
        {
            text: "Es un fármaco recetado para hiperuricemia o gota, cuyos efectos adversos principales incluyen exantema y hepatotoxicidad…",
            ans: [
                {
                    res: "Piroxicam",
                },
                {
                    res: "Alopurinol",
                    correct: true
                },
                {
                    res: "Ketoprofeno"
                }
            ]
        }
    ]
};

const qHistory = {
    count: 0,
    points: 0,
    limit: Math.floor(quiz.questions.length * quiz.dataBanc),
    questions: []
};

/*FORMAT TEXT INPUT*/
quiz.prefix = util.formatText(quiz.prefix).toUpperCase();
quiz.title = util.formatText(quiz.title).toUpperCase();
quiz.questions = quiz.questions.map(question => {
    return {
        text: util.formatText(question.text),
        ans: question.ans.map(answer => {
            return {
                res: util.formatText(answer.res),
                correct: (answer.correct) ? true : null,
            }
        })
    };
});