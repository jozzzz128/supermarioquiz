'use strict'

/*MUSIC CONFIG*/
const music = {
    background: document.createElement("audio"),
    sound: document.createElement("audio"),
    playMusic: () => {
        localStorage.setItem('bgmusic', true);
        music.background.play();   
    },
    pauseMusic: () => {
        localStorage.setItem('bgmusic', false);
        music.background.pause();   
    },
    tempPauseMusic: () => {
        music.background.pause();
    },
    change: async config => {
        if(config.bgmusic){
            music.background.setAttribute("src",config.url);
            music.background.loop = true;    
            if(music.getFlagState()) music.background.play();
            else music.background.pause();
        }
        else{
            music.sound.currentTime = 0;
            music.sound.pause();
            music.sound.setAttribute("src",config.url);  
            if(config.start) music.sound.currentTime = config.start;
            music.sound.play();

            if(config.end) await util.asyncSetTimeOut(()=>{ 
                music.sound.pause();
            },(config.start) ? (config.end - config.start)*1000 : config.end*1000);
        }
    },
    getFlagState: () => {
        let flag = JSON.parse(localStorage.getItem('bgmusic'));
        if(flag === null){
            localStorage.setItem('bgmusic',true);
            flag = JSON.parse(localStorage.getItem('bgmusic'));
        }
        return flag;
    },
    /*EFFECTS LIST*/
    effects: {
        pipe: () => {
            music.change({
                url: "soundtrack/pipes.mp3"
            });
        },
        load: () => {
            music.change({
                url: "soundtrack/painting.mp3",
                start: 0.5
            });
        },
        jump: () => {
            music.change({
                url: "soundtrack/jump.mp3",
                start: 0.2,
                end: 0.75
            });
        },
        itemBlock: () => {
            music.change({
                url: "soundtrack/item-block.mp3",
                start: 0.3
            });
        },
        powerUp: () => {
            music.change({
                url: "soundtrack/PowerUp.mp3",
                end: 1.4
            });
        },
        gameover: () => {
            music.change({
                url: "soundtrack/gameover.mp3"
            });
        },
        clear: () => {
            music.change({
                url: "soundtrack/stage_clear.mp3"
            });
        },
    },
};

/*UTILITIES*/
const util = {
    answerFlag: false,
    randomCounter: 0,
    genRandomString: () => {
        util.randomCounter++;
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, util.randomCounter);
    },
    //Toggle click event
    toggleClick: (element, callback) => {
        element.addEventListener("click", toggleClick);
        function toggleClick(){
            element.removeEventListener("click", toggleClick);
            callback();
        
            setTimeout(()=>{
                element.addEventListener("click", toggleClick);
            },500);
        }
    },
    //Toggle click event
    disableClick: (element, callback) => {
        element.addEventListener("click", disableClick);
        function disableClick(){
            element.removeEventListener("click", disableClick);
            callback();
        }
    },
    openFullscreen: element => {
        //Open element on fullscreen
        if (element.requestFullscreen) {
        element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
        }
    },
    formatText: text => {
        var map = {
            '' : '¡',
            '' : '¿',
            'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
            'e' : 'é|è|ê|ë|É|È|Ê|Ë',
            'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
            'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
            'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
            'c' : 'ç|Ç',
            'n' : 'ñ|Ñ'
        };
        
        for (var pattern in map) {
            text = text.replace(new RegExp(map[pattern], 'g'), pattern);
        };
    
        return text;
    },
    pxToVw: number => {
        return (number*(100 / [document.documentElement.clientWidth]));
    },
    genAnimation: config => {
        const prevAnimation = document.querySelector("head #animation");
        const id = util.genRandomString();
        const animation = `
            @keyframes animation${id}{
                ${config.animation}
            }
        `;
        config.element.style.animation = `animation${id} ${config.settings}`; 

        if(prevAnimation) prevAnimation.innerHTML += animation;
        else {
            const style = document.createElement("style");
            style.id = 'animation';
            style.innerHTML = animation;
            document.querySelector("head").append(style);
        } 
    },
    getTranslateProp: element => {
        var style = window.getComputedStyle(element);
        var matrix = new WebKitCSSMatrix(style.transform);
        return {
            x: util.pxToVw(matrix.m41),
            y: util.pxToVw(matrix.m42)
        };
    },
    animationSequence: async (animationArray, config = {}) => {
        if(config.delay) await util.delay(config.delay);
        for (let i = 0; i < animationArray.length; i++) {
            const anim = animationArray[i];
            if(config.interval) await util.asyncSetTimeOut(()=>{}, config.interval*1000);
            await anim.animation(anim.config);
        }
    },
    asyncSetTimeOut: async (callback = ()=>{}, time = 0) => {
        await new Promise((resolve)=>setTimeout(() => {
            callback();
            resolve();
        }, time)); 
    },
    delay: async time => {
        await util.asyncSetTimeOut(()=>{},time*1000);
    },
    genBgMusicButton:() => {
        //Add Background music controls
        const bgmusic = document.createElement("div");
        if(music.getFlagState()) bgmusic.classList.add('on');
        else bgmusic.classList.add('off');
        bgmusic.id = "bgmusic-control";
        bgmusic.innerHTML = `
            music
            <span class="icon-music-on"></span>
            <span class="icon-music-off"></span>
        `;
        util.toggleClick(bgmusic,()=>{
            if(music.getFlagState()){
                bgmusic.className = "off";
                music.pauseMusic();
            }
            else{
                bgmusic.className = "on";
                music.playMusic();
            }
        });
        return bgmusic;
    },
    genRandomInt: max => {
        return Math.floor(Math.random() * Math.floor(max));
    },
    getRandomQuestion: () => {
        if(qHistory.count == qHistory.limit) return false;
        //If randomize on
        let question;
        if(quiz.randomize){
            const index = util.genRandomInt(quiz.questions.length);
            question = Object.assign({}, quiz.questions[index]);
            question.ans = util.randomiceArray(question.ans).map(ans => ans.res);
        }
        else{
            question = Object.assign({}, quiz.questions[qHistory.count]);
            question.ans = question.ans.map(ans => ans.res);
        }
        return question;
    },
    selectAnswer: config => {
        const index = quiz.questions.findIndex(question => question.text == config.text);
        const selected = quiz.questions.splice(index, 1)[0];
        const correctIndex = selected.ans.map((ans, i) => { if(ans.correct) return i; }).filter(ans => !isNaN(ans))[0];
        selected.ans = selected.ans.filter(ans => ans.res == config.ans)[0];

        qHistory.questions.push(selected);
        qHistory.count++;
        
        if(selected.ans.correct) return true;
        return correctIndex;
    },
    randomiceArray: (array = []) => {
        return array.sort( () => .5 - Math.random() );
    },
    genAnswerPipe: config => {
        const pipe = document.createElement("div");
        pipe.classList.add("pipe");
        pipe.innerHTML = `
            <p class="answer disable"><span class="indicator"></span>${config.ans}</p>
            <div class="piranha"></div>
            <ul class="blocks">
                <li class="hidden"></li>
            </ul>
            <div class="cover"></div>
        `;
        const answer = pipe.querySelector(".answer");
        util.toggleClick(answer, async () => { if(util.answerFlag) {
            //Block all answers
            util.answers.block();
            //Animate answer
            await util.animate.sequence.jumpToPipe(config);
        }});
        return pipe;
    },
    getPipeCoords: pipe => {
        const coords = pipe.getBoundingClientRect();
        return {
            x: util.pxToVw(coords.left) - 6,
            y: -8
        };
    },
    answers: {
        block: () => {
            util.answerFlag = false;
            container.querySelectorAll(".world .wallpaper .pipe").forEach(pipe => { pipe.querySelector("p").classList.add("disable") });
        },
        enable: () => {
            util.answerFlag = true;
            container.querySelectorAll(".world .wallpaper .pipe").forEach(pipe => { pipe.querySelector("p").classList.remove("disable") });
        },
        calcResults: () => {
            const results = {
                correct: 0,
                total: qHistory.limit,
                approve: false,
                message: ''
            };
            const success = (quiz.success) ? quiz.success : 0.6;

            //Calc correct answers
            qHistory.questions.forEach(question => {
                if(question.ans.correct) results.correct++;
            });
            //Calc if approve 
            if((results.correct / results.total) >= success) results.approve = true;
            //Write message
            if(results.approve){
                results.message = (quiz.message && quiz.message.success) ? quiz.message.success + `\n\n${results.correct}/${results.total}` : 
                `thank you mario! \nyour quest is over. \n\nit was a hard quest but you tried your best and succedded, \n\nwe will see you in your next quest!! \n\nscore: ${results.correct}/${results.total}`;
            } else {
                results.message = (quiz.message && quiz.message.failure) ? quiz.message.failure : 
                `thank you mario! \nyour quest is over. \n\nsometimes we fail, but that's no reason to surrender, \n\nwe will see you in your next quest!! \n\nscore: ${results.correct}/${results.total}`;
            }
            
            return results;
        }
    },
    counter: {
        generate: cont => {
            const counter = document.createElement("ul");
            counter.classList.add("counter-container");
            counter.classList.add("disable");
            counter.innerHTML = `
                <li>Mario <span class="points">000000</span></li>
                <li><span class="money"></span><span class="icon-cross"></span>00</li>
                <li>Question <span class="counter">1</span>-${qHistory.limit}</li>
                <li>Time <span class="icon-infinite"></span></li>  
                <li class="fullscreen off">fullscreen <span class="icon-fullscreen-open"></span></li>
            `;
            const fullscreen = counter.querySelector('li.fullscreen');
            util.toggleClick(fullscreen, () => { util.openFullscreen(body); });
            cont.append(counter);
        },
        update: () => {
            //Update Question Counter
            container.querySelector(".counter-container li .counter").innerHTML = (qHistory.count != qHistory.limit) ? qHistory.count + 1 : qHistory.count;
            //Update Points Counter
            let points = qHistory.points.toString();
            let zeros = ''; for (let i = 0; i < (6 - points.length); i++) { zeros += '0'; }
            points = zeros + points;
            container.querySelector(".counter-container li .points").innerHTML = points;
        },
        display: () => {
            const counter = document.querySelector("#container .counter-container");
            if(counter.classList.contains("disable")) counter.classList.remove("disable");
            else counter.classList.add("disable");
        }
    },
    animate: {
        mario: {
            turn: () => {
                const mario = document.querySelector("#mario");
                if(mario.classList.contains("right")){
                    mario.classList.remove("right");
                    mario.classList.add("left");
                }
                else{
                    mario.classList.remove("left");
                    mario.classList.add("right");
                }
            },
            jump: async (config = {delay: 0}) => {
                const mario = document.querySelector("#mario");
                mario.classList.add("jump");
                music.effects.jump();

                const translate = util.getTranslateProp(mario);
                let translateX = config.x/6;
                let translateY = config.y/3;

                //Reverse Jump
                if(config.x && config.x - translate.x < 0 && translate.y != config.y){
                    util.genAnimation({
                        element: mario,
                        animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        10%{
                            transform: translateX(${config.x + translateX*5}vw) translateY(${translateY*2}vw);
                        }
                        20%{
                            transform: translateX(${config.x + translateX*4}vw) translateY(${translateY*3}vw);
                        }
                        40%{
                            transform: translateX(${config.x + translateX*3}vw) translateY(${translateY*4}vw);
                        }
                        60%{
                            transform: translateX(${config.x + translateX*2}vw) translateY(${translateY*4.5}vw);
                        }
                        80%{
                            transform: translateX(${config.x + translateX}vw) translateY(${translateY*4.5}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(${config.y}vw);
                        }
                    `,
                        settings: '0.5s linear'
                    });
                }
                //Same height jump (Normal && reverse)
                if(translate.y == config.y){
                    //39 - 15 => /6 
                    translateX = (config.x - translate.x) / 6;
                    util.genAnimation({
                        element: mario,
                        animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        10%{
                            transform: translateX(${translate.x + translateX*2}vw) translateY(${translateY*3}vw);
                        }
                        30%{
                            transform: translateX(${translate.x + translateX*3}vw) translateY(${translateY*4}vw);
                        }
                        50%{
                            transform: translateX(${translate.x + translateX*4}vw) translateY(${translateY*4.5}vw);
                        }
                        70%{
                            transform: translateX(${translate.x + translateX*5}vw) translateY(${translateY*4.5}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(${config.y}vw);
                        }
                        `,
                        settings: '0.5s linear'
                    });
                }
                //Normal Jump
                else if(config.x){
                    //39 - 15 => /6 
                    translateX = (config.x - translate.x) / 6;
                    util.genAnimation({
                        element: mario,
                        animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        10%{
                            transform: translateX(${translate.x + translateX}vw) translateY(${translateY*2}vw);
                        }
                        20%{
                            transform: translateX(${translate.x + translateX*2}vw) translateY(${translateY*3}vw);
                        }
                        40%{
                            transform: translateX(${translate.x + translateX*3}vw) translateY(${translateY*4}vw);
                        }
                        60%{
                            transform: translateX(${translate.x + translateX*4}vw) translateY(${translateY*4.5}vw);
                        }
                        80%{
                            transform: translateX(${translate.x + translateX*5}vw) translateY(${translateY*4.5}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(${config.y}vw);
                        }`,
                        settings: '0.5s linear'
                    });
                }
                //Up jump with interruption
                else if(config.interruption){
                    util.genAnimation({
                        element: mario,
                        animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y});
                        }
                        80%{
                            transform: translateX(${translate.x}vw) translateY(${translateY*3}vw);
                        }
                        100%{
                            transform: translateX(${translate.x}vw) translateY(${config.y}vw);
                        }
                    `,
                        settings: '0.4s linear'
                    });
                    await util.asyncSetTimeOut(()=>{
                        mario.style.transform = `translateX(${translate.x}vw) translateY(${config.y}vw)`;
                    },400);
                    await util.delay(0.3);
                    await config.interruption.animation(config.interruption.config);
                }
                //Up jump
                else {
                    util.genAnimation({
                        element: mario,
                        animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y});
                        }
                        10%{
                            transform: translateX(${translate.x}vw) translateY(${translateY*2}vw);
                        }
                        20%{
                            transform: translateX(${translate.x}vw) translateY(${translateY*3}vw);
                        }
                        40%{
                            transform: translateX(${translate.x}vw) translateY(${translateY*4}vw);
                        }
                        60%{
                            transform: translateX(${translate.x}vw) translateY(${translateY*4.5}vw);
                        }
                        80%{
                            transform: translateX(${translate.x}vw) translateY(${translateY*4.5}vw);
                        }
                        100%{
                            transform: translateX(${translate.x}vw) translateY(${config.y}vw);
                        }
                    `,
                        settings: '0.5s linear'
                    });
                }

                mario.style.transform = `translateX(${config.x}vw) translateY(${config.y}vw)`;

                await util.asyncSetTimeOut(()=>{ 
                    mario.classList.remove("jump");
                },500);
            },
            walk: async config => {
                const mario = document.querySelector("#mario");
                mario.classList.add("walk");

                const translate = util.getTranslateProp(mario);
                mario.style.transform = `translateX(${config.x}vw) translateY(${translate.y}vw)`;

                util.genAnimation({
                    element: mario,
                    animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(${translate.y}vw);
                        }
                    `,
                    settings: `${(config.time) ? config.time : '0.5'}s linear`
                });

                await util.asyncSetTimeOut(()=>{ 
                    mario.classList.remove("walk");
                    mario.style.animation = "";  
                },(config.time) ? config.time*1000 : 500);
            
            },
            fall: async config => {
                const mario = document.querySelector("#mario");
                mario.classList.add("jump");

                const translate = util.getTranslateProp(mario);
                mario.style.transform = `translateX(${config.x}vw) translateY(${(config.y) ? config.y : 0}vw)`;

                util.genAnimation({
                    element: mario,
                    animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(${(config.y) ? config.y : 0}vw);
                        }
                    `,
                    settings: `${(config.time) ? config.time : '0.5'}s linear`
                });

                await util.asyncSetTimeOut(()=>{ 
                    mario.classList.remove("jump");
                    mario.style.animation = "";  
                },(config.time) ? config.time*1000 : 500);
            
            },
            grow: async () => {
                const mushroom = document.querySelector("#mushroom");
                if(mushroom) mushroom.remove();
                const mario = document.querySelector("#mario");
                mario.classList.add("big");
                mario.classList.add("grow");
                music.effects.powerUp();
                await util.asyncSetTimeOut(()=>{ 
                    mario.classList.remove("grow"); 
                },1000);
            },
            shrink: async () => {
                mario.classList.remove("big");
                mario.classList.add("shrink");
                music.effects.pipe();
                await util.asyncSetTimeOut(()=>{ 
                    mario.classList.remove("shrink"); 
                },1000);
            },
            enterPipe: async (config = {delay: 0}) => {
                await util.delay(config.delay*1000);

                const mario = document.querySelector("#mario");
                const translate = util.getTranslateProp(mario);
                const big = (mario.classList.contains('big') ? true : false);

                mario.style.transform = `translateX(${translate.x}vw) translateY(${translate.y + (big ? 7.5 : 4)}vw)`;

                util.genAnimation({
                    element: mario,
                    animation: `
                    0%{
                        opacity:1;
                        transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                    }
                    100%{
                        opacity:1;
                        transform: translateX(${translate.x}vw) translateY(${translate.y + (big ? 7.5 : 4)}vw);
                    }
                `,
                    settings: '0.5s linear'
                });

                await util.asyncSetTimeOut(()=>{
                    music.effects.pipe();
                },50);

                await util.delay(0.7);
            },
            appearPipe: async (config = {delay: 0}) => {
                await util.delay(config.delay*1000);
                const mario = document.querySelector("#mario");
                mario.style.transform = `translateX(0vw) translateY(${config.y})vw)`;

                util.genAnimation({
                    element: mario,
                    animation: `
                    0%{
                        transform: translateX(0vw) translateY(${config.y-7.7}vw);
                    }
                    100%{
                        transform: translateX(0vw) translateY(${config.y}vw);
                    }
                `,
                    settings: '0.5s linear'
                });

                await util.asyncSetTimeOut(()=>{
                    music.effects.pipe();
                },50);

                await util.delay(0.4);
            }
        },
        goomba: {
            movement: true,
            animation: (enemy, time) => {
                if(enemy.classList.contains("moveLeft")) enemy.classList.remove("moveLeft");
                else enemy.classList.add("moveLeft");
                setTimeout( () => { if(util.animate.goomba.movement) util.animate.goomba.animation(enemy, time); }, (time*1000) );
            },
            move: (enemy, time) => {
                util.animate.goomba.movement = true;
                setTimeout( () => { util.animate.goomba.animation(enemy, time); }, 100);
            },
            stop: enemy => {
                util.animate.goomba.movement = false;
                if(enemy.classList.contains("moveLeft")) enemy.classList.remove("moveLeft");
                enemy.classList.add("escape");
            }
        },
        block: {
            hit: async config => {
                config.element.classList.add("hit");
                util.animate.mushroom.generate({
                    x: config.mushroom.x,
                    y: config.mushroom.y,
                    container: document.querySelector("#container .world .wallpaper")
                });
                await util.asyncSetTimeOut(()=>{
                    music.effects.itemBlock();
                },50);
            }
        },
        mushroom: {
            generate: async config => {
                const mushroom = document.createElement("div");
                mushroom.classList.add("mushroom");
                mushroom.classList.add("appear");
                mushroom.id = "mushroom";
                mushroom.style.left = `${config.x}vw`;
                mushroom.style.bottom = `${config.y}vw`;
                config.container.append(mushroom);
                await util.asyncSetTimeOut(()=>{ 
                    mushroom.classList.remove("appear");
                },500);
            },
            move: async (config = {delay: 0}) => {
                await util.asyncSetTimeOut(async ()=>{
                    const mushroom = document.querySelector("#mushroom");
                    const translate = util.getTranslateProp(mushroom);
                    mushroom.style.transform = `translateX(${config.x}vw) translateY(${translate.y}vw)`;

                    util.genAnimation({
                        element: mushroom,
                        animation: `
                            0%{
                                transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                            }
                            100%{
                                transform: translateX(${config.x}vw) translateY(${translate.y}vw);
                            }
                        `,
                        settings: `${(config.time) ? config.time : '0.5'}s linear`
                    });

                    await util.asyncSetTimeOut(()=>{ 
                        mushroom.style.animation = "";  
                    },(config.time) ? config.time*1000 : 500);
                }, config.delay*1000);
            },
            fall: async (config = {delay:0}) => {
                await util.asyncSetTimeOut(async ()=>{
                    const mushroom = document.querySelector("#mushroom");
                    const translate = util.getTranslateProp(mushroom);
                    mushroom.style.transform = `translateX(${config.x}vw) translateY(${config.y}vw)`;

                    util.genAnimation({
                        element: mushroom,
                        animation: `
                            0%{
                                transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                            }
                            100%{
                                transform: translateX(${config.x}vw) translateY(${config.y}vw);
                            }
                        `,
                        settings: `${(config.time) ? config.time : '0.5'}s linear`
                    });

                    await util.asyncSetTimeOut(()=>{ 
                        mushroom.style.animation = "";  
                    },(config.time) ? config.time*1000 : 500);
                }, config.delay*1000);
            }
        },
        sequence: {
            jumpToPipe: async config => {
                //Jump to pipe animation
                const pipes = container.querySelectorAll(".world .wallpaper .pipe");
                const secuence = [];
                if(config.skip === undefined){
                    for (let i = 0; i <= config.index; i++){
                        const coords = util.getPipeCoords(pipes[i].querySelector('.cover'));
                        secuence.push({
                            animation: util.animate.mario.jump,
                            config: {
                                x: coords.x,
                                y: coords.y
                            }
                        });
                    }
                }
                else if(config.skip > config.index){
                    for (let i = config.skip-1; i >= 0; i--){
                        if(i >= config.index){
                            const coords = util.getPipeCoords(pipes[i].querySelector('.cover'));
                            secuence.push({
                                animation: util.animate.mario.jump,
                                config: {
                                    x: coords.x,
                                    y: coords.y
                                }
                            });
                        }
                    }
                    secuence.push({
                        animation: util.animate.mario.turn
                    });
                }
                //Normal
                else{
                    for (let i = 0; i <= config.index; i++){
                        if(i > config.skip){
                            const coords = util.getPipeCoords(pipes[i].querySelector('.cover'));
                            secuence.push({
                                animation: util.animate.mario.jump,
                                config: {
                                    x: coords.x,
                                    y: coords.y
                                }
                            });
                        }
                    }
                }
                await util.animationSequence(secuence, (config.delay) ? {interval: 0.2, delay: config.delay} : {interval: 0.2});

                //Evaluate answer
                if(config.skip === undefined){
                    //Check answer
                    const correct = util.selectAnswer({
                        text: config.text,
                        ans: config.ans
                    });

                    //Animate answer
                    if(correct === true) await util.animationSequence([
                        {
                            animation: util.animate.mario.enterPipe
                        }
                    ], {delay: 0.2});

                    else await util.animate.sequence.receiveDamage({
                        index: config.index,
                        correct: correct,
                        pipe: pipes[config.index],
                        correctPipe: pipes[correct]
                    });
                    //Load next level
                    await util.delay(0.1);
                    generateLoadScreen({
                        question: qHistory.count + 1
                    });
                } //else console.log(config.skip);
            },
            receiveDamage: async config => {
                const coords = util.getPipeCoords(config.correctPipe.querySelector('.cover'));
                //Animate piranha appear
                config.pipe.querySelector(".piranha").classList.add("show");
                //Animate mario shrink
                await util.animationSequence([
                    {
                        animation: util.animate.mario.shrink
                    }
                ], {delay: 0.7});
                //Animate turn if correct answer is on left
                if(config.correct < config.index) await util.animationSequence([
                    {
                        animation: util.animate.mario.turn
                    }
                ]);
                //Animate jump to correct pipe
                await util.animate.sequence.jumpToPipe({
                    index: config.correct,
                    skip: config.index,
                    delay: 0.2
                });
                //Animate enter to correct pipe
                await util.animationSequence([
                    {
                        animation: util.animate.mario.jump,
                        config: {
                            y: -11.3
                        } 
                    },
                    {
                        animation: util.animate.block.hit,
                        config: {
                            mushroom: {
                                x: coords.x + 9.5,
                                y: 22.9
                            },
                            element: config.correctPipe.querySelector(".blocks li")
                        }
                    },
                    {
                        animation: util.animate.mario.walk,
                        config: {
                            x: coords.x + 3
                        }
                    },
                    {
                        animation: util.animate.mushroom.move,
                        config: {
                            x: 3,
                            delay: 0.5
                        }
                    },
                    {
                        animation: util.animate.mario.jump,
                        config: {
                            y: -23,
                            interruption: {
                                animation: util.animate.mario.grow
                            }
                        } 
                    },
                    {
                        animation: util.animate.mario.fall,
                        config: {
                            x: coords.x + 3,
                            y: coords.y
                        }
                    },
                    {
                        animation: util.animate.mario.turn
                    },
                    {
                        animation: util.animate.mario.walk,
                        config: {
                            x: coords.x,
                            time: 0.2
                        }
                    },
                    {
                        animation: util.animate.mario.enterPipe
                    }
                ], {delay: 0.2});
                console.log(coords.y);
            }
        }
    } 
};