var game = angular.module('game',['ngSanitize']);
game.controller('MainCtrl', ['$scope', '$interval', function ($scope,$interval) {  
    $this = this;
    $this.index = 0;
    $this.total_score = 0;
    $this.deal_score = 0;
    $this.selected = [];
    $this.data = data[this.index];
    $this.last_selected_option = null;
    $this.state='ready';
    $this.countdown = 99;
    $this.currentTime = $this.countdown;
    $scope.optionsStyle = {};
    $scope.answerInfoContentStyle = {};
    $this.street_people = [];
    
    $this.allPeopleCount = 0;
    

    //按下開始
    this.start = function(){
        $this.state = 'question';
        $this.state = 'street';
        $this.prepareStreet();
        
        $this.resizing();
        
    }

    //按下
    $this.select = function(option){
        $this.state = 'answer-information'; 
        $this.last_selected_option = option;
        $this.selected.push({
            "information":this.data.information,
            "option":option,
        });
        switch(option.addormulti){
                    case "+":
                        $this.deal_score+=option.score;
                    break;
                    case "*":
                        $this.deal_score*=option.score;
                    break;
        }
        $this.resizing();
    }

    // 按下
    $this.next = function(){
        $this.index++;
        if($this.index >= data.length){
            $this.state = 'ending';
            endofgame();
        }else{
            $this.state = 'street';
            $this.data = data[$this.index];
        }
        
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
    
    $this.action = function(){
        var i = 0;
        while(i < $this.street_people.length){
            var person = $this.street_people[i]
            if(person.saw && person.state !== 'walk-deal'){
                person.do("walk-deal");
                break;
            }
            i++;
        }
    }
    
    $this.prepareStreet = function(){
        $this.streetInterval = $interval(function(){
            if(Math.random()<0.03){
                $this.allPeopleCount++;
                $this.street_people.push(newPerson($this.allPeopleCount));
            }
            
            var dying_people = [];
            
//            for(var i =0; i<$this.street_people.length;i++){
            $this.street_people.forEach(function(person){
//                var person = $this.street_people[i];
                if(Math.random()<0.01){
                    person.saw = true;
                }
                
                if(person.state == 'kill'){
                    var i = $this.street_people.indexOf(person);
                    dying_people.push(i);
                    $this.total_score += $this.deal_score;
                    delete(person);
                }
                if(person.state == 'stop'){
                    if(Math.random()<0.01){
                        person.goto(Math.random() * 300,Math.random() * 300);
                        person.do('walk');
                    }
                }
                
                person.move();
            });
            
            $this.street_people.sort(function(a,b){return a.position.y - b.position.y});
//            }
            
            if(dying_people.length>0){
                
              console.log(dying_people);
            }
            
            for(var i = dying_people.length - 1; i >= 0;i--){
                index = dying_people[i];
                $this.street_people.splice(index,1);
            }
            
            
            
        },33);
        
        $this.countDownInterval = $interval(function(){
            $this.currentTime -= 1;
            if($this.currentTime % Math.floor($this.countdown/6) == 0){
                $this.state = 'question';
                $this.prepareQuestion();
            }
        },1000);
    }
    
    $this.prepareQuestion = function(){
        $interval.cancel($this.countDownInterval);
        $interval.cancel($this.streetInterval);
    }
}]);

//$(window).keyup(function(event){
//    var i = 0;
//    while(i < $this.street_people.length){
//        if($this.street_people[i].saw){
//            $this.street_people.do("walk-deal");
//        }
//        i++;
//    }
//});


function resizing($scope){
    var w = $(window).height();
    
    setTimeout(function(){
            $scope.optionsStyle = {
//                height: ($(window).height() - $('.question-content').outerHeight() - 45) + 'px'
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
