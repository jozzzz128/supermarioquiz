const express = require('express');
const app = express();
const cors = require('cors');
const enfer = require('./static/js/config/enfermedades.json');

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Static directories
app.use('/static',express.static(__dirname +'/static'));

//Render html
app.get('/', (req, res) => {
    res.sendFile('views/index.html', {root: __dirname })
});

app.get('/enfermedades', (req, res) => {
    res.sendFile('static/js/config/enfermedades.json', {root: __dirname })
});

//Results
app.post('/formanswers', async (req, res) => {
    const {questions, enfermedades} = req.body;
    const processedQuestions = questions.map(question => question.ans.value);
    const sendArray = `[[${processedQuestions}],[${enfermedades}]]`;
    console.log(sendArray);

    //Process symptoms
    console.log("\n\nProcesando sintomas...");
    var spawn = require("child_process").spawn;
    var process = spawn('python3', ["./code/main2.py", sendArray ]);
    console.log("Calculando...");

    process.stdout.on('data', function (data) {
        console.log("Calculado, enviando respuesta...");
        
        console.log("Respuesta enviada, mostrando resultados:");
        console.log(data.toString());

        const respuesta = JSON.parse(data.toString());
        const enferProcess = util.bubbleResults(respuesta, enfer.map(enferme => enferme.name));
        console.log("enferprocess: ",enferProcess);

        let message = `De acuerdo a nuestro diagnostico es probable que tengas alguna de estas enfermedades:\n\n`;

        for (let i = 0; i < enferProcess.diseases.length; i++){
            if(enfermedades.length == 0 && i == 3) break;
            const element = enferProcess.diseases[i];
            if(enferProcess.results[i] != -1 && i != enferProcess.diseases.length-1) message += `${element}, `;
            else if(enferProcess.results[i] != -1) message += `${element}`;
        }
        message += '\n\nte recomendamos que investigues un poco y acudas al medico';

        res.status(200).json({
            approveMessage: message
        });
    });

});

//Start server
app.listen(3000, () => {
    console.log("Server started on 3000 Bv...");
});

const util = {
    bubbleResults: (inputArr, resultsArr) => {
        let len = inputArr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (inputArr[j] < inputArr[j + 1]) {
                    let tmp = inputArr[j];
                    inputArr[j] = inputArr[j + 1];
                    inputArr[j + 1] = tmp;

                    //Order second array
                    let tmp2 = resultsArr[j];
                    resultsArr[j] = resultsArr[j + 1];
                    resultsArr[j + 1] = tmp2;
                }
            }
        }
        return {
            results: inputArr,
            diseases: resultsArr
        };
    }
};