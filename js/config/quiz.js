const quiz = {
    prefix: "Grupo 2:",
    title: "Reumatología y traumatología",
    dataBanc: 0.8,
    questions: [
        {
            text: "Según su mecanismo de acción ¿A cuál de estos grupos pertenece el Alopurinol?",
            ans: [
                {
                    res: "Uricosúricos",
                },
                {
                    res: "Urocolíticos"
                },
                {
                    res: "Inhibidores de la uricosíntesis",
                    correct: true
                }
            ]
        }
    ]
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