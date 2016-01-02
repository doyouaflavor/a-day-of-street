var game = angular.module('game',['ngSanitize']);
game.controller('MainCtrl', ['$scope', '$interval', function ($scope,$interval) {  
    $this = this;
    $this.newGame = function(){
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
        $this.countdown = 60;
        $this.currentTime = $this.countdown;
        $scope.optionsStyle = {};
        $scope.answerInfoContentStyle = {};
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
    $this.newGame();
    
    
    $this.masterGetBoxSize = function(){
        return {width : $('.street-master img').width(), height: $('.street-master img').height()};
    }
    $this.personGetBoxSize = function(){
        return {width : 172, height: 220};
    }
    
    $this.region = [[0,150],[600,350]];
    
    $this.masterPoint = [($this.region[1][0] - $this.masterGetBoxSize().width)/2,0];
    
    
    $this.getRegionPoint = {
        x : function(){
            var region = $this.region;
            return Math.random() * (region[1][0] - region[0][0]) + region[0][0] - $this.personGetBoxSize().width;
        },
        y : function(){
            var region = $this.region;
            return Math.random() * (region[1][1] - region[0][1]) + region[0][1];
        },
    }
    
    $this.updateRegionAndMaster = function(){
        
        $this.region = [[0,150],[600,350]];
        $this.region[1][0] = $(window).width();
        $this.region[1][1] = $(window).height() - 115 - $this.personGetBoxSize().height;
        $this.masterPoint = [($this.region[1][0] - $this.masterGetBoxSize().width)/2,0];
        
        $('.street-background').width($(window).width());
        $('.street-background').height($(window).height());
        
        
    }
    
    
    $this.debug = false;
    

    //按下開始
    this.start = function(){
        $this.state = 'question';
        
        $this.resizing();
        
    }

    //按下
    $this.select = function(option){
        $this.state = 'answer-information'; 
        $this.last_selected_option = option;
        $this.selected.push({
            "questionInfo":$this.question.name,
            "information":$this.question.information,
            "option":option,
        });
        /*
        switch(option.addormulti){
                    case "+":
                        $this.deal_score+=option.score;
                    break;
                    case "*":
                        $this.deal_score*=option.score;
                    break;
        }
        */
        $this.resizing();
        option.effect($this);
    }

    // 按下
    $this.next = function(){
        $this.index++;
        $this.state = 'street';
        $this.question = $this.data[$this.index];
        
        $this.prepareStreet();
        $this.resizing();
    }
    
    $this.resizing = function(){
        switch($this.scene){
            case "ready":
                break;
            case "question":
                $scope.optionsStyle = {
                    height: ($(window).height() - 111) + 'px'
                };
                break;
            case "ending":
                break;
            case "answer-information":
                $scope.answerInfoContentStyle = {
                    height: ($(window).height() - 121) + 'px'
                };
                break;
            case "street":
                break;
        }
        
    }
    
    // Do something when click seller
    $this.action = function(){
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
                target[0] = (Math.random()<0.5)?0 - $this.personGetBoxSize().width: $this.region[1][0];
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
    
    $this.prepareStreet = function(){
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
                       && person.position.x < ($this.region[1][0] - $this.personGetBoxSize().width ) 
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
                        target[0] = (Math.random()<0.5)?0 - $this.personGetBoxSize().width: $this.region[1][0];
                            person.do('leave',target);
                        }
                    }
                    
                }
                if(person.state == 'redeye'){
                    person.waitInterval--;
                    if(person.waitInterval == 0){
                        var target = [0,person.position.y];
                        target[0] = (Math.random()<0.5)?0 - $this.personGetBoxSize().width: $this.region[1][0];
                        person.do('leave',target);
                    }
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
                        target[0] = (Math.random()<0.5)?0 - $this.personGetBoxSize().width: $this.region[1][0];
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
    
    $this.afterStreet = function(){
        $interval.cancel($this.countDownInterval);
        $interval.cancel($this.streetInterval);
    }
    
    $this.masterStyle = function(){
        return {left: $this.masterPoint[0], top: $this.masterPoint[1]};
    }
    
    $this.streetStyle = function(){
        var o = ($this.state == 'street')?'auto':0;
        var pe = ($this.state == 'street')?'auto':'none';
        return {opacity : o, 'pointer-events': pe }
    }
}]);


function resizing($scope){
    var w = $(window).height();
    
    setTimeout(function(){
            $scope.optionsStyle = {
                height: ($(window).height() - 111) + 'px'
            };
        },100);
    
    if($('.answer-set').length > 0){
        $('.answer-info-content').height(w - 121);
    }
    if($('.options').length > 0){
        var new_w = w - $('.question-content').outerHeight() - 45;
        $('.options')
        $('.options').height(w - 121);
    }
}
