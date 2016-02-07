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
    
    tools.newGame = function(){
        $this.afterTut = false;
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
        $this.allPeopleCount = 0;
        $this.role = 0;
        
        // For get final title. 
        $this.countDealedPeople = 0;
        $this.countGetOutPeople = 0;
        $this.countGoodMindPeople = 0;
        $this.countBadMindPeople = 0;

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
    }
    
    
    tools.doClickStart = function(){
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
        sound.click2.play();
        $this.index++;
        $this.state = 'street';
        $this.question = $this.data[$this.index];
        
        if(!$this.afterTut){
            $this.showTut(1);
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
                        person.do('leave',getLeaveTarget(person,$this));
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
                        $this.countDealedPeople++;
                        $this.total_score += $this.deal_score;
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                        person.do('leave',target);
                        if(Math.random()<$this.threshold.mindToGood || !$this.afterTut){
                            person.mind = 'good';
                            sound.coin.play();
                            $this.countGoodMindPeople++;
                        }else{
                            person.mind = 'bad';
                            sound.coin_bad.play();
                            $this.countBadMindPeople++;
                        }
                        if(!$this.afterTut){
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
            if(dying_people.length >= 1 && !$this.afterTut){
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
                    $this.afterStreet();
                    sound.gongong.play();
                }else{
                    if($this.currentTime % Math.floor($this.countdown/6) == 3){
                        $this.warning = true;
                        sound.alert.play();
                    }
                    if($this.currentTime % Math.floor($this.countdown/6) == 0){
                        $this.state = 'question';
                        sound.gong.play();
                        $this.afterStreet();
                        sound.alert.fadeOut(0,500);
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
        var i = 0;
        // Check if there are any redeyed-person.
        while(i < $this.street_people.length){
            var person = $this.street_people[i];
            if(person.state == 'redeye'){
                var person_clear = true;
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
                $this.countBadMindPeople++;
                target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                person.do("leave",target);
                $this.countGetOutPeople++;
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
        tools.afterStreet();
        switch(level){
            case 1:
                var person1 = newPerson(1,$this.region[1][0]*0.1,$this.region[1][1]*0.4);
                var person2 = newPerson(2,$this.region[1][0]*0.5,$this.region[1][1]*0.6);
                person1.vel = person2.vel = 7;
                $this.street_people.push(person1);
                $this.street_people.push(person2);


                introOption = {
                    steps: [
                      {
                        element: '.street-master',
                        intro: "你是一名街賣者，正在熙熙攘攘的路上販賣商品!!",
                        position: 'left'
                      },
                      {
                        element: '.wang1',
                        intro: '這是路人，當路人頭上有出現「看見」符號時，點一下你的街賣者，路人會走過來跟你消費。',
                        position: 'right'
                      },
                      {
                        element: '.street-master',
                        intro: '現在點擊看看。',
                        position: 'left'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
                  }

                setTimeout(function(){
                    intro1 = introJs().setOptions(introOption);
                    intro1.oncomplete(function(){
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
                        intro: "這個人眼紅了，這時叫賣的話，他會大聲嚷嚷把想買的人嚇走。",
                        position: 'left'
                      },
                      {
                        element: '.street-master',
                        intro: '現在叫賣看看。',
                        position: 'left'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
                  }

                setTimeout(function(){
                    intro1 = introJs().setOptions(introOption);
                    intro1.oncomplete(function(){
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
                        position: 'left'
                      },
                      {
                        element: '.bg-space:nth-of-type(3)',
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
                        position: 'left'
                      }
                    ],
                    exitOnOverlayClick : false,
                    prevLabel : '上一步',
                    nextLabel : '我知道了',
                    skipLabel: '跳過教學',
                    doneLabel: '我知道了',
                    disableInteraction : true,
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
    var score_interval = [300,700,1000,2000,99999]
    if( $this.selected[0].option.name == 'A' && 
        $this.selected[1].option.name == 'A' &&
        $this.selected[3].option.name == 'A' &&
        $this.selected[4].option.name == 'A' &&
        $this.selected[5].option.name == 'B'
    ){
        last_name = last_name_list[6];
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