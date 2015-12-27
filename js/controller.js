var game = angular.module('game',['ngSanitize']);
game.controller('MainCtrl', ['$scope', function (scope) {  
    this.index = 0;
    this.score = 0;
    this.selected = [];
    this.data = data[this.index];
    this.last_selected_option = null;
    this.state='ready';
    scope.optionsStyle = {};
    scope.answerInfoContentStyle = {};

    gamePrepare();

    //按下開始
    this.start = function(){
        this.state = 'question';
//        $('.game-start').animate({'opacity':0},1500,function(){
//            $('.game-start').hide();
//            $('.question').show().animate({'opacity':1},1500);
//        });
        setTimeout(function(){
            scope.optionsStyle = {
//                height: ($(window).height() - $('.question-content').outerHeight() - 45) + 'px'
                height: ($(window).height() - 111) + 'px'
            };
        },100);
        console.log(this.state);
    }

    //按下
    this.select = function(option){
        this.state = 'answer-information'; 
        this.last_selected_option = option;
        this.selected.push({
            "information":this.data.information,
            "option":option,
        });
        switch(option.addormulti){
                    case "+":
                        this.score+=option.score;
                    break;
                    case "*":
                        this.score*=option.score;
                    break;
        }
        scope.answerInfoContentStyle = {
            height: ($(window).height() - 121) + 'px'
        };
        resizing();
    }

    // 按下
    this.next = function(){
        this.index++;
        if(this.index >= data.length){
            this.state = 'ending';
            endofgame();
        }else{
            this.state = 'question';
            this.data = data[this.index];
        }
        
        scope.optionsStyle = {
            height: ($(window).height() - 111) + 'px'
        };
        resizing();
    }
}]);

function gamePrepare(){
//    $('.question').hide().css('opacity',0);
//    $('.final').hide().css('opacity',0);
}

$(window).onresize(resizing);

function resizing(){
    var w = $(window).height();
    if($('.answer-set').length > 0){
        $('.answer-info-content').height(w - 121);
    }
    if($('.options').length > 0){
        var new_w = w - $('.question-content').outerHeight() - 45;
        $('.options')
        $('.options').height(w - 121);
    }
}