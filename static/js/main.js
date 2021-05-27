'use strict'
var container, body = "";

window.addEventListener("load", async ()=>{
    await requestQuiz();

    body = document.querySelector("body");
    container = body.querySelector("#container");

    //Generate counter
    util.counter.generate(container);

    //Generate start screen
    generateLoadScreen({
        start: true
    });

    //If watermark
    try {
        const cookies = document.querySelector('#container + div + script');
        const watermark = document.querySelector('#container + div');
        if(cookies) cookies.remove();
        if(watermark) watermark.remove();
    } catch (e) {}

});

async function generateLoadScreen(config = {}){
    //Stop BG music
    music.tempPauseMusic();
    //Random Question Get
    const randomQ = util.getRandomQuestion();
    //Update counter
    if(!randomQ) util.counter.update();

    const load = document.createElement("div");
          load.classList.add("load-screen");

    if(config.start){
        load.classList.add("start");
        
        /*ADD EVENT LISTENER TO LOAD SCREEN*/
        util.disableClick(load,() => {
            //Play load screen sound effect
            music.effects.load();
            //Add and remove animation classes
            load.classList.remove("start");
            load.classList.add("close");
            //Generate menu screen
            generateMenuScreen();
            //Remove load screen
            setTimeout(()=>{load.remove();},300);
        });

        load.innerHTML = 
        `<div class="content">
            <h2 class="title">
                <span>super mario quiz</span>
                ${quiz.prefix} ${quiz.title}
            </h2>
            <p>questions: ${qHistory.limit}</p>
            <p class="sign">click to continue...</p>
        </div>`;
    }
    else {
        load.classList.add("question");
        load.innerHTML = 
        `<div class="content">
            <h2 class="title">
                <span>${quiz.title}</span>
            </h2>
            <p class="sign">${randomQ ? `question ${config.question}-${qHistory.limit}` : 'loading...'}</p>
            <div class="life">
                <span class="thumb"></span>
                <span class="icon-cross"></span>
                1
            </div>
        </div>`;
    }
    container.append(load);

    if(config.question && randomQ) setTimeout(() => {
        generateQuestionScreen(randomQ);
        load.remove();
    },3000);
    else if(config.question && quiz.url){ //setTimeout(() => {

        const valueAll = qHistory.questions[qHistory.questions.length-1].ans.value;
        console.log("value:", valueAll);

        if(valueAll == 0 ){
            console.log("entro");
            qHistory.questions.pop();
            let enfermedades = (await axios.get("/enfermedades")).data.map(enfermedad => enfermedad.name);
            genCheckPop(enfermedades, async () => {
                const {data} = await axios.post(quiz.url, qHistory);
                generateQuestionScreen(false, data);
                load.remove();
            });
        }
        else {
            console.log("no entro");
            qHistory.questions.pop();
            qHistory.enfermedades = [];
            const {data} = await axios.post(quiz.url, qHistory);
            generateQuestionScreen(false, data);
            load.remove();
        }
        
    }
    //},3000);
}

function generateMenuScreen(){
    const world = document.createElement("div");
        world.classList.add("world");
        world.classList.add("day");
        world.innerHTML = `
        <div class="menu-screen">
            <h2 class="sign">
                <span>super</span><span>MARIO QUIZ.</span>
            </h2>
            <ul></ul>
        </div>
        <div class="floor"></div>
        <div class="wallpaper">
            <div id="mario" class="right"></div>

            <ul id="blocks1" class="blocks">
                <li class="question"></li>
            </ul>
            <ul id="blocks2" class="blocks">
                <li class="brick"></li>
                <li id="tohit" class="question"></li>
                <li class="brick"></li>
                <li class="question"></li>
                <li class="brick"></li>
            </ul>

            <div class="pipe">
                <div class="cover"></div>
            </div>
            <div class="goomba"></div>
        </div>
        `;
        //Add start button functionality
        const startButton = document.createElement("li");
        startButton.classList.add('start-button');
        startButton.innerHTML = `
        <p>
            <span class="indicator"></span> 
            start quiz
        </p>
        `;
        util.disableClick(startButton, async () => {
            startButton.querySelector("p").classList.add("disable");
            //Remove goomba from screen
            util.animate.goomba.stop(world.querySelector(".wallpaper .goomba"));
            //Animate menu animation secuence
            await util.animationSequence([
                {
                    animation: util.animate.mario.jump,
                    config: {
                        x: 15.5,
                        y: -7.9
                    } 
                },
                {
                    animation: util.animate.mario.walk,
                    config: {
                        x: 22.2,
                        time: 0.2
                    }
                },
                {
                    animation: util.animate.mario.fall,
                    config: {
                        x: 26,
                        time: 0.2
                    }
                },
                {
                    animation: util.animate.mario.walk,
                    config: {
                        x: 45
                    }
                },
                {
                    animation: util.animate.mario.turn,
                },
                {
                    animation: util.animate.mario.jump,
                    config: {
                        y: -6.3
                    } 
                },
                {
                    animation: util.animate.block.hit,
                    config: {
                        mushroom: {
                            x: 78,
                            y: 15
                        },
                        element: document.querySelector('#tohit')
                    }
                },
                {
                    animation: util.animate.mushroom.move,
                    config: {
                        x: -6,
                        delay: 0.5
                    }
                },
                {
                    animation: util.animate.mushroom.fall,
                    config: {
                        x: -13,
                        y: 15,
                        delay: 0.5,
                        time: 0.5
                    }
                },
                {
                    animation: util.animate.mushroom.move,
                    config: {
                        x: -18,
                        delay: 0.5,
                        time: 1
                    }
                },
                {
                    animation: util.animate.mario.walk,
                    config: {
                        x: 30
                    }
                },
                {
                    animation: util.animate.mario.grow
                },
                {
                    animation: util.animate.mario.jump,
                    config: {
                        x: 15.5,
                        y: -7.9,
                        delay: 0.5
                    }
                },
                {
                    animation: util.animate.mario.enterPipe
                },
            ]);
            //Generate loadScreen
            generateLoadScreen({
                question: qHistory.count + 1
            });
        });

    world.querySelector(".menu-screen ul").append(startButton);
    world.querySelector(".floor").append(util.genBgMusicButton());
    util.counter.display();
    container.append(world);
    music.change({
        url: "static/soundtrack/SuperMarioBrosThemeSong.mp3",
        bgmusic: true,
    });

    //Animate enemies
    util.animate.goomba.move(world.querySelector(".wallpaper .goomba"),7.5);
}

async function generateQuestionScreen(config, data){
    //Destroy prev level
    const oldWorld = document.querySelector("#container .world");
    if(oldWorld) oldWorld.remove();

    const world = document.createElement("div");
        world.classList.add("world");
        world.classList.add("cave");
        world.innerHTML = `
        <div class="roof">
            <div class="pipe inverted">
                <div class="cover"></div>
            </div>
        </div>
        <div class="menu-screen">
            <h2 class="sign">        
                ${config ? `
                <ul id="blocks1" class="blocks">
                    <li class="coin"></li>
                    <li class="coin"></li>
                </ul>
                <p class="text">${config.text}</p>
                <ul id="blocks2" class="blocks">
                    <li class="coin"></li>
                    <li class="coin"></li>
                </ul>
                ` : '<p class="text"></p>'}
            </h2>
            <ul></ul>
        </div>
        <div class="floor"></div>
        <div class="wallpaper">
            <div id="mario" class="big right"></div>
        </div>
        `;
    
    if(config){
        //Generate bg music button
        world.querySelector(".floor").append(util.genBgMusicButton());
        //Generate answer pipes
        config.ans.forEach((ans,i) => { world.querySelector(".wallpaper").append(util.genAnswerPipe({text: config.text, ans: ans, index: i})) });
        //Redimension answer pipes
        if(config.ans.length > 3){
            world.querySelector(".wallpaper").classList.add("reduced");
        }
    }
    //Generate World level
    container.append(world);

    if(config) music.change({
        url: "static/soundtrack/SuperMarioBrosUndergroundTheme.mp3",
        bgmusic: true,
    });

    const animation = [
        {
            animation: util.animate.mario.appearPipe,
            config: {
                y: -18.3
            }
        },
        {
            animation: util.animate.mario.fall,
            config: {
                x: 0
            }
        }
    ];

    //If result screen
    if(!config){
        animation.push({
            animation: util.animate.mario.walk,
            config: {
                x: 38.5,
                time: 2
            }
        });
    }

    await util.animationSequence(animation);

    //Allow all answers
    if(config) util.answers.enable();
    else{
        const results = util.answers.calcResults(data);
        //Sound Effect
        if(results.approve) music.effects.clear();
        else music.effects.gameover();
        //Show message
        world.querySelector(".menu-screen .sign .text").innerHTML = results.message;
    }
}

//Enfermedades
function genCheckPop(enfermedades, callback){
    const div = document.createElement("div");
    div.id = "pop-check";
    let innerHTMLString = `<div class="checkboxes">`;
    enfermedades.forEach((enfermedad, i) => {
        innerHTMLString += `
            <label for="check-${i}">
                <input value="${i}" id="check-${i}" type="checkbox">
                ${enfermedad}
            </label>
        `;
    });
    innerHTMLString += `
        </div><button id="submit-check">Guardar seleccion</button>
    `;
    div.innerHTML = innerHTMLString;
    let flag = true;
    div.querySelector("#submit-check").addEventListener("click",()=>{
        flag = false;
        const getEnfermedades = div.querySelectorAll('input[type="checkbox"]:checked');
        let valuesStore = [];
        getEnfermedades.forEach(enfer => {
            valuesStore.push(parseFloat(enfer.value));
        });
        console.log(valuesStore);
        qHistory.enfermedades = valuesStore;
        div.remove();
        callback();
    });
    document.querySelector("#container").append(div);
}