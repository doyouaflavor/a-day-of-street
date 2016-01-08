function Toolkit(scene){
    var tools = {};
    var $this = scene;
    var $interval = scene.interval;
    
    tools.doClickStart = function(){
        $this.state = 'question';
        $this.resizing();
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
        
        $this.prepareStreet();
        $this.resizing();
    }
    
    /**
      Action when enter 'Street'
    */
    tools.prepareStreet = function(){
        $this.updateRegionAndMaster();
        $this.streetInterval = $interval(function(){
            if(Math.random()<0.04){
                $this.allPeopleCount++;
                var y = $this.getRegionPoint.y();
                if(Math.random()<$this.threshold.newPeople){
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
                        if(Math.random()<$this.threshold.leave){
                            var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                            person.do('leave',target);
                        }
                    }
                    
                }
                if(person.state == 'redeye'){
                    person.waitInterval--;
                    if(person.waitInterval == 0){
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                        person.do('leave',target);
                    }
                }
                if( person.state == 'saw' ){
                    
                }
                
                
                if(person.action == 'kill'){
                    var i = $this.street_people.indexOf(person);
                    dying_people.push(i);
                }
                if(person.action == 'stop'){
                    if(person.state == 'walk-deal'){
                        if(person.state == 'walk-deal'){
                            $this.total_score += $this.deal_score;
                        }
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                        person.do('leave',target);
                    }
                    if(Math.random()<$this.threshold.move){
                        person.goto($this.getRegionPoint.x(),$this.getRegionPoint.y());
                        person.do('walk');
                    }
                }
                
                person.move();
            });
            
            
            
            for(var i = dying_people.length - 1; i >= 0;i--){
                index = dying_people[i];
                $this.street_people.splice(index,1);
            }
            
            $this.street_people.sort(function(a,b){return a.position.y - b.position.y});
            
            
        },33);
        
        $this.countDownInterval = $interval(function(){
            $this.currentTime -= 1;
            if($this.currentTime == 0){
                $this.state = 'ending';
                $this.afterStreet();
            }else{
                if($this.currentTime % Math.floor($this.countdown/6) == 0){
                    $this.state = 'question';
                    $this.afterStreet();
                }
            }
            
        },1000);
    }
    
    tools.newGame = function(){
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
        $this.currentTime = $this.countdown;
        $this.street_people = [];
        $this.allPeopleCount = 0;
        $this.role = 0;

        $this.threshold = {
            newPeople : 0.5,
            saw : 0.005,
            redeye : 0.001,
            move: 0.01,
            leave: 0.02,
        }
    }
    
    /**
      
    */
    tools.doClickMaster = function(){
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
                target[0] = (Math.random()<0.5)?0 - $this.getPersonBoxSize().width: $this.region[1][0];
                person.do("leave",target);
            }
            else{
                // call first 'saw' person coming.
                if(person.state == 'saw'){
                    var target = $this.masterPoint.slice();
                    target[1] += $('.street-master img').height();
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
    }
    
    
    /**
    End of toolkits
    */
    return tools;
}