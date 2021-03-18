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
        }
    },
};

/*UTILITIES*/
const util = {
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
    counter: {
        generate: container => {
            const counter = document.createElement("ul");
            counter.classList.add("counter-container");
            counter.classList.add("disable");
            counter.innerHTML = `
                <li>Mario 000000</li>
                <li><span class="money"></span><span class="icon-cross"></span>00</li>
                <li>Question 1-${quiz.questions.length}</li>
                <li>Time <span class="icon-infinite"></span></li>  
            `;
            container.append(counter);
        },
        update: () => {

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
                const translateX = config.x/6;
                const translateY = config.y/3;

                //Reverse Jump
                if(config.x && config.x - translate.x < 0){
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
                //Normal Jump
                else if(config.x){
                    util.genAnimation({
                        element: mario,
                        animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        10%{
                            transform: translateX(${translateX}vw) translateY(${translateY*2}vw);
                        }
                        20%{
                            transform: translateX(${translateX*2}vw) translateY(${translateY*3}vw);
                        }
                        40%{
                            transform: translateX(${translateX*3}vw) translateY(${translateY*4}vw);
                        }
                        60%{
                            transform: translateX(${translateX*4}vw) translateY(${translateY*4.5}vw);
                        }
                        80%{
                            transform: translateX(${translateX*5}vw) translateY(${translateY*4.5}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(${config.y}vw);
                        }
                    `,
                        settings: '0.5s linear'
                    });
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
                mario.style.transform = `translateX(${config.x}vw) translateY(0vw)`;

                util.genAnimation({
                    element: mario,
                    animation: `
                        0%{
                            transform: translateX(${translate.x}vw) translateY(${translate.y}vw);
                        }
                        100%{
                            transform: translateX(${config.x}vw) translateY(0vw);
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
                    x: 78,
                    y: 15,
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
        }
    } 
};