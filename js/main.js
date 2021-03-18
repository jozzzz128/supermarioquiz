'use strict'
var container, body = "";

window.addEventListener("load",()=>{
    body = document.querySelector("body");
    container = body.querySelector("#container");

    //Generate counter
    util.counter.generate(container);

    //Generate start screen
    generateLoadScreen({
        start: true
    });

});

function generateLoadScreen(config = {}){
    //Stop BG music
    music.tempPauseMusic();

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
            <p>questions: ${quiz.questions.length}</p>
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
            <p class="sign">question ${config.question}-${quiz.questions.length}</p>
            <div class="life">
                <span class="thumb"></span>
                <span class="icon-cross"></span>
                1
            </div>
        </div>`;
    }
    container.append(load);

    if(config.question) setTimeout(()=>{
        generateQuestionScreen({
            text: quiz.questions[config.question-1].text,
            ans: quiz.questions[config.question-1].ans
        });
        load.remove();
    },3000);
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
                question: 1
            });
        });

    world.querySelector(".menu-screen ul").append(startButton);
    world.querySelector(".floor").append(util.genBgMusicButton());
    util.counter.display();
    container.append(world);
    music.change({
        url: "soundtrack/SuperMarioBrosThemeSong.mp3",
        bgmusic: true,
    });

    //Animate enemies
    util.animate.goomba.move(world.querySelector(".wallpaper .goomba"),7.5);
}

function generateQuestionScreen(config = { text: '', ans: [ {res: '', correct: true} ] }){
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
                ${config.text}
            </h2>
            <ul></ul>
        </div>
        <div class="floor"></div>
        <div class="wallpaper">
            <div id="mario" class="big right"></div>

            <ul id="blocks1" class="blocks">
                <li class="coin"></li>
                <li class="coin"></li>
                <li class="coin"></li>
                <li class="coin"></li>
            </ul>
            <ul id="blocks2" class="blocks">
                <li class="coin"></li>
                <li class="coin"></li>
                <li class="coin"></li>
                <li class="coin"></li>
            </ul>

            <div class="pipe">
                <p class="answer"><span class="indicator"></span>${config.ans[0].res}</p>
                <div class="cover"></div>
            </div>
            <div class="pipe">
                <p class="answer"><span class="indicator"></span>${config.ans[1].res}</p>
                <div class="cover"></div>
            </div>
            <div class="pipe">
                <p class="answer"><span class="indicator"></span>${config.ans[2].res}</p>
                <div class="cover"></div>
            </div>
        </div>
        `;

    world.querySelector(".floor").append(util.genBgMusicButton());
    container.append(world);

    music.change({
        url: "soundtrack/SuperMarioBrosUndergroundTheme.mp3",
        bgmusic: true,
    });

    util.animationSequence([
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
    ]);
}