function getHowl(url,loop){
    
    return new Howl({
        urls: [url],
        loop: loop
    })
}

var sound = {
    coin: getHowl('sound/button25.mp3'), //se_maoudamashii_system46.mp3, button25.mp3
    coin_bad: getHowl('sound/cancel2.mp3'),
    bark: getHowl('sound/b_061.mp3'), // button62, b_061.mp3
    saw: getHowl('sound/b_017.mp3'),
    sell: getHowl('sound/lay.mp3'), //42, b_006.mp3
    click: getHowl('sound/bubble-burst1.mp3'), // bubble-burst1,decision3
    click2: getHowl('sound/button70.mp3'), // hito_ge_paku01.mp3,button70.mp3
    alert: getHowl('sound/button36.mp3',true), //36,ta_ta_countdown02.mp3
    tut_next: getHowl('sound/hito_ge_paku01.mp3'), // 25,41,44,70
    gong: getHowl('sound/ata_a11.mp3'), // gong-played1.mp3,ata_a11.mp3
    gongong: getHowl('sound/gong-played1.mp3'), //gong-played2.mp3,gong-played1.mp3
    nya: getHowl('sound/line-girl1-nyaa1.mp3'), 
}


function Toolkit(scene){
    var tools = {};
    var $this = scene;
    var $interval = scene.interval;
    var $scope = scene.$scope;
    var $timeout = scene.timeout;
    var $window = scene.$window;
    
    tools.newGame = function(){
        $this.sound = sound;
        
        $this.afterTut = false;
        $this.tutFlag = false;
        
        $this.tutStep = -1;
        $this.pause = false;
        $this.warning = false;
        $this.width = 0;
        $this.height = 0;
        $this.index = 0;
        $this.total_score = 0;
        $this.deal_score = 10;
        $this.final_title = '';
        $this.selected = [];
        $this.data = data.slice();
        $this.streetClassName = '';
        $this.arrow = false;
        $this.coins = [];
        for(var i = 0; i < $this.data.length ;i++){
            $this.data[i].options = data[i].options.slice();
        }

        $this.question = $this.data[this.index];
        $this.last_selected_option = null;
        $this.state = 'ready';
        $this.countdown = 180;
        $this.currentTime = -1;
        $this.street_people = [];
        $this.role = 0;
        
        // For get final title. 
        
        $this.allPeopleCount = 0;
        $this.countDealedPeople = 0;
        $this.countRedeyeYellPeople = 0;
        $this.countGetOutPeople = 0;
        $this.countMissPeople = 0;
        $this.countGoodMindPeople = 0;
        $this.countBadMindPeople = 0;
        $this.finishedGame = false;

        $this.defaultThreshold = {
            newPeople : 0.04,
            saw : 0.003,
            redeye : 0.001,
            move: 0.01,
            idleToLeave: 0.02,
            sawToLeave: 0.001,
            mindToGood: 0.97,
        }
        
        $this.threshold = {
            newPeople : 0,
            saw : 0,
            redeye : 0,
            move: 0,
            idleToLeave: 0,
            sawToLeave: 0,
        };
        $this.report = [
            {id:1275687024,value:''}, //姓名 0
            {id:248967896,value:''}, //第一題 1
            {id:1976142292,value:''}, //第二題 2
            {id:164500138,value:''}, //第三題 3
            {id:1577046484,value:''}, //第四題 4
            {id:1424987075,value:''}, //第五題 5
            {id:1114063609,value:''}, //第六題 6
            {id:714982201,value:''}, //出現人數 7
            {id:1610838322,value:''}, //成交量 8
            {id:444985876,value:''}, //警察逼逼次數 9
            {id:1449750782,value:''}, //miss量 10
            {id:71287881,value:''}, //趕走數量 11
            {id:1921663805,value:''}, //開心人數 12
            {id:741409202,value:''}, //不開心人數 13
            {id:370171931,value:''}, //總分 14
            {id: 653881628 , value:''}// 稱號 15
        ];
    }
    
    tools.doReport = function(){
        if(window.location.host !=='game.doyouaflavor.tw')return ;
        $this.report[0].value= $this.name;
        $this.report[1].value= ($this.selected[0])?$this.selected[0].option.name:"";
        $this.report[2].value= ($this.selected[1])?$this.selected[1].option.name:""
        $this.report[3].value= ($this.selected[2])?$this.selected[2].option.name:""
        $this.report[4].value= ($this.selected[3])?$this.selected[3].option.name:""
        $this.report[5].value= ($this.selected[4])?$this.selected[4].option.name:""
        $this.report[6].value= ($this.selected[5])?$this.selected[5].option.name:""
        $this.report[7].value= $this.allPeopleCount;
        $this.report[8].value= $this.countDealedPeople;
        $this.report[9].value= $this.countRedeyeYellPeople;
        $this.report[10].value = $this.countGetOutPeople;
        $this.report[11].value = $this.countMissPeople;
        $this.report[12].value = $this.countGoodMindPeople;
        $this.report[13].value = $this.countBadMindPeople;
        $this.report[14].value = $this.total_score;
        $this.report[15].value = $this.final_title;
        
        
        
        var url = 'https://docs.google.com/forms/d/1pGHh6EeLxIp4AfbOfJr0qWNK75-T-dZW7auzidndHcM/formResponse?'
        for(var i = 0;i<$this.report.length;i++){
            url += 'entry.' + $this.report[i].id + '=' + encodeURI($this.report[i].value) + '&';
        }
        url += 'submit=submit';
        console.log(url);
        
        httpGet(url);
    }
    
    tools.doClickStart = function(){
        if($this.name == '' || $this.name == undefined){
            $this.name = '你';
        }
        $this.state = 'question';
        $this.resizing();
        $this.updateRegionAndMaster();
        sound.click.play();
    }
    
    tools.doClickSelectioins = function(option){
        $this.state = 'answer-information';
        $this.last_selected_option = option;
        $this.selected.push({
            "questionInfo":$this.question.name,
            "information":$this.question.information,
            "option":option,
        });
        $this.resizing();
        option.effect($this);
        sound.click2.play();
    }
    
    tools.doClickNext = function(){
        $timeout(function(){
            $window.scrollTo(0,0);
        },100);
        sound.click2.play();
        $this.index++;
        $this.state = 'street';
        $this.question = $this.data[$this.index];
        
        if(!$this.afterTut){
            $this.showTut(0);
            return;
        }
        
        $this.prepareStreet();
        $this.resizing();
    }
    
    /**
      Action when enter 'Street'
    */
    tools.prepareStreet = function(){
        
//        $this.updateRegionAndMaster();
        $this.streetInterval = $interval(function(){
            if($this.click){
                $this.animate = ' tada animated';
                $this.click = false;
            }
            
            if(Math.random()<$this.threshold.newPeople){
                $this.allPeopleCount++;
                var y = $this.getRegionPoint.y();
                if(Math.random()<0.5){
                    var person = newPerson($this.allPeopleCount,-200,y);
                }else{
                    var person = newPerson($this.allPeopleCount,$this.region[1][0]+200,y);
                }
                
                
                var x = $this.getRegionPoint.x();
                person.goto(x,y);
                
                $this.street_people.push(person);
            }
            
            var dying_people = [];
            
            $this.street_people.forEach(function(person){
                
                if(person.state == 'idle'){
                    if(person.position.x > $this.region[0][0] 
                       && person.position.x < ($this.region[1][0] - $this.getPersonBoxSize().width ) 
                       && person.position.y > $this.region[0][1] 
                       && person.position.y < $this.region[1][1]){
                        if(Math.random()<$this.threshold.saw){
                            person.do('saw');
                            sound.saw.play();
                        }
                        if(Math.random()<$this.threshold.redeye){
                            person.do('redeye');
                            sound.saw.play();
                        }
                        if(Math.random()<$this.threshold.idleToLeave){
                            
                            person.do('leave',getLeaveTarget(person,$this));
                        }
                    }
                    
                }
                if(person.state == 'redeye'){
                    person.waitInterval--;
                    if(person.waitInterval == 0){
                        person.do('leave',getLeaveTarget(person,$this));
                    }
                }
                if( person.state == 'saw' ){
                    person.sawInterval--;
                    if(person.sawInterval == 0){
                       $this.countMissPeople++; person.do('leave',getLeaveTarget(person,$this));
                    }
                }
                
                
                if(person.action == 'kill'){
                    var i = $this.street_people.indexOf(person);
                    dying_people.push(i);
                }
                if(person.action == 'stop'){
                    if(person.state == 'leave'){
                        person.do('kill');
                    }
                    if(person.state == 'walk-deal'){
                        $this.coins.push({score: $this.deal_score});
                        $timeout(function(){ $this.coins.pop()},1000);
                        if($this.afterTut){
                            $this.countDealedPeople++;
                        }
                        $this.total_score += $this.deal_score;
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                        person.do('leave',target);
                        if(Math.random()<$this.threshold.mindToGood || !$this.afterTut){
                            person.mind = 'good';
                            sound.coin.play();
                            if($this.afterTut){
                                $this.countGoodMindPeople++;
                            }
                        }else{
                            person.mind = 'bad';
                            sound.coin_bad.play();
                            if($this.afterTut){
                                $this.countBadMindPeople++;
                            }
                        }
                        if(!$this.afterTut && !$this.tutFlag && $this.tutStep == 1){
                            $this.tutFlag = true;
                            $timeout(function(){$this.showTut(2);},1000);
                            return
                        }
                    }
                    
                    if(Math.random()<$this.threshold.move){
                        person.goto($this.getRegionPoint.x(),$this.getRegionPoint.y());
                        person.do('walk');
                    }
                }
                
                person.move();
            });
            
            // Kill the outbonding people.
            if(dying_people.length >= 1 && !$this.afterTut && $this.tutStep == 2){
                $this.showTut(3);
                return 
            }
            for(var i = dying_people.length - 1; i >= 0;i--){
                index = dying_people[i];
                delete($this.street_people[index]);
                $this.street_people.splice(index,1);
                
            }
            
            $this.street_people.sort(function(a,b){return a.position.y - b.position.y});
            
            
        },33);
        
        $this.countDownInterval = $interval(function(){
            if($this.currentTime >= 0){
                $this.currentTime -= 1;
                if($this.currentTime == 0){
                    $this.state = 'ending';
                    $this.final_title = getFinalTitle($this);
                    tools.afterStreet();
                    sound.gongong.play();
                    sound.alert.stop();
                    $this.finishedGame = true;
                    tools.doReport();
                }else{
                    if($this.currentTime % Math.floor($this.countdown/6) == 3){
                        $this.warning = true;
                        sound.alert.play();
                    }
                    if($this.currentTime % Math.floor($this.countdown/6) == 0){
                        $this.state = 'question';
                        sound.gong.play();
                        tools.afterStreet();
                        sound.alert.stop(0);
                    }
                }
            }
            
            
        },1000);
    }
    
    /**
      
    */
    tools.doClickMaster = function(){
        sound.sell.play();
        $this.arrow = false;
        $this.animate = '';
        $this.click = true;
        if(!$this.afterTut && $this.tutStep == 0 && !$this.tutFlag){
            $this.tutFlag = true;
            $timeout(function(){
                tools.showTut(1);
            },1500);
        }
        
        var i = 0;
        // Check if there are any redeyed-person.
        while(i < $this.street_people.length){
            var person = $this.street_people[i];
            if(person.state == 'redeye'){
                var person_clear = true;
                if($this.afterTut){
                    $this.countRedeyeYellPeople++;
                }
                sound.bark.play();
                break;
            }
            i++;
        }
        i = 0;
        // do action for any people
        var redeye_bark = false;
        while(i < $this.street_people.length){
            var person = $this.street_people[i]
            // clear any customers
            if(person_clear && ( person.state == 'saw' || person.state == 'redeye')){
                if(person.state == 'redeye' && !redeye_bark){
                    person.mind = 'bad';
                    person.state = '';
                    person.animate = 'tada animated';
                    person.do('stop');
                    redeye_bark = true;
                    var this_person = person;
                    $timeout(function(){
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                        this_person.do("leave",target);
                        $this.countGetOutPeople++;
                    },1000);
                    i++;
                    continue;
                }
                var target = [0,person.position.y];
                person.mind = 'bad';
                target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                person.do("leave",target);
                if($this.afterTut){
                    $this.countGetOutPeople++;
                }
            }
            else{
                // call first 'saw' person coming.
                if(person.state == 'saw'){
                    var target = $this.masterPoint.slice();
                    target[1] += $('.street-master').height()/2;
                    person.do("walk-deal",target);
                    break;
                }
            }
            i++;            
        }
    }
    
    tools.afterStreet = function(){
        $interval.cancel($this.countDownInterval);
        $interval.cancel($this.streetInterval);
        $this.warning = false;
    }
    
    tools.showPauseMenu = function(){
        if($this.pause){
            $this.streetClassName = '';
            tools.prepareStreet();
        }else{
            $this.streetClassName = 'street-pause';
            tools.afterStreet();
        }
        $this.pause = !$this.pause;
    }
    
    tools.pauseMenu = {};
    tools.pauseMenu.continue = function(){
        $this.pause = false;
    }
    tools.pauseMenu.replay = function(){
        $this.newGame();
    }
    tools.pauseMenu.shareFB = function(){
        
    }
    
    tools.showTut = function(level){
        $this.tutStep++;
        tools.afterStreet();
        switch(level){
            case 0:
                introOption = {
                    steps: [
                      {
                        element: '.street-master',
                        intro: $this.name + "是一名街賣者，正在熙熙攘攘的路上販賣商品!!",
                        position: 'down'
                      },
                      {
                        element: '.street-master',
                        intro: '點擊'+$this.name+'時，就會對附近的人進行叫賣',
                        position: 'down'
                      },
                      {
                        element: '.street-master',
                        intro: '現在點擊看看',
                        position: 'down'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
                    keyboardNavigation : false,
                  }

                setTimeout(function(){
                    intro1 = introJs().setOptions(introOption);
                    intro1.oncomplete(function(){
                        $this.tutFlag = false;
                        $this.prepareStreet();
                        $this.arrow = true;
                        sound.tut_next.play();
                    }).onexit(tools.showAfterTut);
                    intro1.onchange(function(){sound.tut_next.play()});
                    intro1.start();
                },500);
                
                break;
            case 1:
                var person1 = newPerson(1,$this.region[1][0]*0.1,$this.region[1][1]*0.4);
                var person2 = newPerson(2,$this.region[1][0]*0.5,$this.region[1][1]*0.6);
                person1.vel = person2.vel = 7;
                $this.street_people.push(person1);
                $this.street_people.push(person2);


                introOption = {
                    steps: [
                    {
                        element: '.wang1',
                        intro: '這是路人',
                        position: 'down'
                      },
                      {
                        element: '.wang1',
                        intro: '當路人頭上有出現「看見」符號時，點一下'+$this.name+'，路人會走過來跟'+$this.name+'消費。',
                        position: 'down'
                      },
                      {
                        element: '.street-master',
                        intro: '現在點擊看看。',
                        position: 'down'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
                    keyboardNavigation : false,
                  }

                setTimeout(function(){
                    intro1 = introJs().setOptions(introOption);
                    intro1.oncomplete(function(){
                        $this.tutFlag = false;
                        person1.state = 'saw';
                        person1.sawInterval = -1;
                        $this.prepareStreet();
                        $this.arrow = true;
                        sound.tut_next.play();
                    }).onexit(tools.showAfterTut);
                    intro1.onchange(function(){sound.tut_next.play()});
                    intro1.start();
                },500);
                break;
            case 2:
                for(var i = $this.street_people.length - 1; i >= 0;i--){
                    delete($this.street_people[i]);
                    $this.street_people.splice(i,1);
                }
                var person1 = newPerson(1,$this.region[1][0]*0.1,$this.region[1][1]*0.4);
                var person2 = newPerson(2,$this.region[1][0]*0.5,$this.region[1][1]*0.6);
                person1.vel = person2.vel = 7;
                person2.state ='redeye';
                person2.waitInterval = -1;
                $this.street_people.push(person1);
                $this.street_people.push(person2);


                introOption = {
                    steps: [
                      {
                        element: '.wang2',
                        intro: "這個人眼紅了，這時叫賣的話，他會大聲嚷嚷叫警察把想買的人嚇走。",
                        position: 'top'
                      },
                      {
                        element: '.street-master',
                        intro: '現在叫賣看看。',
                        position: 'down'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
                    keyboardNavigation : false,
                  }

                setTimeout(function(){
                    intro1 = introJs().setOptions(introOption);
                    intro1.oncomplete(function(){
                        $this.tutFlag = false;
                        person1.state = 'saw';
                        person1.sawInterval = -1;
                        $this.prepareStreet();
                        $this.arrow = true;
                        sound.tut_next.play();
                    }).onexit(tools.showAfterTut);
                    intro1.onchange(function(){sound.tut_next.play()});
                    intro1.start();
                },500);
                break;
            case 3:
                for(var i = $this.street_people.length - 1; i >= 0;i--){
                    delete($this.street_people[i]);
                    $this.street_people.splice(i,1);
                    $this.warning = true;
                }
                introOption = {
                    steps: [
                      {
                        element: '.street-master',
                        intro: "每隔一段時間會出現選擇，不同選擇會影響你的環境變因。",
                        position: 'down'
                      },
                      {
                        element: detectmob()? '.db-warning':'.bg-space:nth-of-type(2)',
                        intro: '在進入選擇題之前，會出現預告符號。',
                        position: 'down'
                      },
                      {
                        element: '.db-badge',
                        intro: '隨著時間的推演，日光的更迭，你必須努力在黑夜來臨前賺取夠多的錢。',
                        position: 'down'
                      },
                      {
                        element: '.street-master',
                        intro: '現在就來挑戰如何能在一天內賺取最多錢吧!!',
                        position: 'down'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
                    keyboardNavigation : false,
                  }
                setTimeout(function(){
                    intro1 = introJs().setOptions(introOption);
                    intro1.oncomplete(tools.showAfterTut)
                        .onexit(tools.showAfterTut);
                    intro1.onchange(function(){sound.tut_next.play()});
                    intro1.start();
                },500);
                break;
        }
        
    }
    
    tools.showAfterTut = function(){
        for(var i = $this.street_people.length - 1; i >= 0;i--){
            delete($this.street_people[i]);
            $this.street_people.splice(i,1);
        }
        $this.currentTime = $this.countdown;
        $this.threshold = $this.defaultThreshold;
        $this.warning = false;
        $this.afterTut = true;
        $this.prepareStreet();
        sound.tut_next.play();
    }
    
    window.onbeforeunload = function () {
        tools.doReport();
    }
    
    /**
    End of toolkits
    */
    return tools;
}

function getLeaveTarget(person, $this){
    var target = [0,person.position.y];
    target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
    return target;
}

function getFinalTitle($this){
    var countDealedPeople = $this.countDealedPeople;
    var countGetOutPeople = $this.countGetOutPeople;
    var countBadMindPeople = $this.countBadMindPeople;
    var countGoodMindPeople = $this.countGoodMindPeople;
    var total_score = $this.total_score;
    
    var first_name_list = ['','街頭的','隨風而逝的','自由的','可憐的'];
    if(countBadMindPeople >= 20){
        first_name = first_name_list[4];
    }else{
        var first_name = first_name_list[countBadMindPeople % 4];
    }
    var middle_name_list = ['吟遊','噴水','絕地','神秘','做好做滿','天使'];
    var middle_name = middle_name_list[countDealedPeople % 6];
    var last_name_list = ['小販','商人','走路工','逃給','總裁','校長'];
    var score_interval = [1000,1500,2000,2500,99999]
    if( $this.selected[0].option.name == 'A' && 
        $this.selected[1].option.name == 'A' &&
        $this.selected[3].option.name == 'A' &&
        $this.selected[4].option.name == 'A' &&
        $this.selected[5].option.name == 'B'
    ){
        last_name = last_name_list[5];
    }else{
        if(total_score < score_interval[0]){
            var last_name = last_name_list[0];
        }
        for(var i = 1;i <= score_interval.length; i++){
            if(total_score > score_interval[i-1] && total_score <= score_interval[i]){
                var last_name = last_name_list[i];
            }
        }
    }
    return first_name + middle_name + last_name;
}