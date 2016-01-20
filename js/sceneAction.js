function Toolkit(scene){
    var tools = {};
    var $this = scene;
    var $interval = scene.interval;
    var $scope = scene.$scope;
    
    tools.newGame = function(){
        $this.afterTut = false;
        $this.pause = false;
        $this.warning = false;
        $this.width = 0;
        $this.height = 0;
        $this.index = 0;
        $this.total_score = 0;
        $this.deal_score = 10;
        $this.selected = [];
        $this.data = data.slice();
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
    }
    
    tools.doClickNext = function(){
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
                        }
                        if(Math.random()<$this.threshold.redeye){
                            person.do('redeye');
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
                        $this.total_score += $this.deal_score;
                        if(!$this.afterTut){
                            $this.showTut(2);
                            return
                        }
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                        person.do('leave',target);
                        if(Math.random()<$this.threshold.mindToGood){
                            person.mind = 'good';
                        }else{
                            person.mind = 'bad';
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
                    $this.afterStreet();
                }else{
                    if($this.currentTime % Math.floor($this.countdown/6) == 3){
                        $this.warning = true;
                    }
                    if($this.currentTime % Math.floor($this.countdown/6) == 0){
                        $this.state = 'question';
                        $this.afterStreet();
                    }
                }
            }
            
            
        },1000);
    }
    
    /**
      
    */
    tools.doClickMaster = function(){
        $this.animate = '';
        $this.click = true;
        var i = 0;
        // Check if there are any redeyed-person.
        while(i < $this.street_people.length){
            var person = $this.street_people[i];
            if(person.state == 'redeye'){
                var person_clear = true;
                break;
            }
            i++;
        }
        i = 0;
        // do action for any people
        while(i < $this.street_people.length){
            var person = $this.street_people[i]
            // clear any customers
            if(person_clear && ( person.state == 'saw' || person.state == 'redeye')){    
                var target = [0,person.position.y];
                person.mind = 'bad';
                target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                person.do("leave",target);
            }
            else{
                // call first 'saw' person coming.
                if(person.state == 'saw'){
                    var target = $this.masterPoint.slice();
                    target[1] += $('.street-master img').height()/2;
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
            tools.prepareStreet();
        }else{
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
                var person1 = newPerson(1,$this.region[1][0]*0.1,$this.region[1][1]*0.5);
                var person2 = newPerson(2,$this.region[1][0]*0.5,$this.region[1][1]*0.8);
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
                    }).onexit(tools.showAfterTut);
                    intro1.start();
                },500);
                break;
            case 2:
                for(var i = $this.street_people.length - 1; i >= 0;i--){
                    delete($this.street_people[i]);
                    $this.street_people.splice(i,1);
                }
                var person1 = newPerson(1,$this.region[1][0]*0.1,$this.region[1][1]*0.5);
                var person2 = newPerson(2,$this.region[1][0]*0.5,$this.region[1][1]*0.8);
                person1.vel = person2.vel = 7;
                person2.state ='redeye';
                person2.waitInterval = -1;
                $this.street_people.push(person1);
                $this.street_people.push(person2);


                introOption = {
                    steps: [
                      {
                        element: '.wang2',
                        intro: "這是個人眼紅了，這時叫賣的話，他會大聲嚷嚷把想買的人嚇走。",
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
                        
                    }).onexit(tools.showAfterTut);
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
                        element: '.db-warning',
                        intro: '在進入選擇題之前，會出現警告標誌。',
                        position: 'right'
                      },
                      {
                        element: '.db-timebar',
                        intro: '隨著時間的推演，日光的更迭，你必須努力在黑夜來臨前賺取夠多的錢。',
                        position: 'left'
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