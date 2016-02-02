var game = angular.module('game',['ngSanitize']);
game.controller('MainCtrl', ['$scope', '$interval','$window','$sce','$timeout', function ($scope,$interval,$window,$sce,$timeout) {
    $this = this;
    
    $this.debug = false;
    $this.interval = $interval;
    $this.timeout = $timeout;
    $this.$scope = $scope;
    var toolkit = Toolkit($this);
    
    $this.newGame = toolkit.newGame;
    
    $this.newGame();
    
    $scope.optionsStyle = {};
    $this.answerInfoContentStyle = {};
    
    $this.getMasterBoxSize = function(){
        return {width : $('.street-master img').width(), height: $('.street-master img').height()};
    }
    $this.getPersonBoxSize = function(){
        return {width : 172, height: 220};
    }
    
    $this.region = [[0,150],[600,350]];
    
    $this.masterPoint = [($this.region[1][0] - $this.getMasterBoxSize().width)/2,0];
    
    
    $this.getRegionPoint = {
        x : function(){
            var region = $this.region;
            return Math.random() * (region[1][0] - region[0][0] - $this.getPersonBoxSize().width) + region[0][0] ;
        },
        y : function(){
            var region = $this.region;
            return Math.random() * (region[1][1] - region[0][1] - $this.getPersonBoxSize().height) + region[0][1] ;
        },
    }
    
    $this.updateRegionAndMaster = function(){
        
        $this.region = [[0,150],[600,350]];
        if($window.innerWidth>= 960){
            $this.region[0][1] = 600/2;
            $this.region[1][0] = $this.width = 960;
            $this.region[1][1] = $this.height = 600;
            $this.masterPoint = [($this.region[1][0] - $this.getMasterBoxSize().width)/2, $this.height/2-115];
            $('.street-background, .street-stage').width(960);
            $('.street-background, .street-stage').height(600);
        }else{
            $this.region[1][0] = $window.innerWidth;
            $this.region[1][1] = $window.innerHeight - 115 - $this.getPersonBoxSize().height;
            $this.masterPoint = [($this.region[1][0] - $this.getMasterBoxSize().width)/2,0];
            $this.width = $window.innerWidth;
            $this.height = $window.innerHeight - 45;
            $('.street-background, .street-stage').width($window.innerWidth);
            $('.street-background, .street-stage').height($window.innerHeight); 

        }
        
        
        
        
    }

    //按下開始
    $this.doClickStart = toolkit.doClickStart;

    //按下選項
    $this.doClickSelectioins = toolkit.doClickSelectioins;

    // 按下下一步
    $this.doClickNext = toolkit.doClickNext;
    
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
                $this.answerInfoContentStyle = {
                    height: ($(window).height() - 121) + 'px'
                };
                break;
            case "street":
                break;
        }
        
    }
    
    // Do something when click seller
    $this.doClickMaster = toolkit.doClickMaster;
    
    $this.prepareStreet = toolkit.prepareStreet;
    
    $this.afterStreet = toolkit.afterStreet;
    
    $this.masterStyle = function(){
        return {left: $this.masterPoint[0], top: $this.masterPoint[1]};
    }
    
    $this.streetStyle = function(){
        var o = ($this.state == 'street')?'auto':0;
        var pe = ($this.state == 'street')?'auto':'none';
        return {
            opacity : o, 
            'pointer-events': pe ,
            width: $this.width, 
//            height: $this.height
           }
    }
    
    $this.lineLengthStyle = function(){
        var badgeWidth = 63;
        var fullLength = 575; // search db-time-white in css 
//        scene.currentTime / scene.countdown
        var t = $this.countdown - $this.currentTime;
        var a = $this.countdown / $this.data.length;
        var i = Math.floor(t / a);
        var fullLength_2 = fullLength - badgeWidth * ($this.data.length - 1);
        return ( t / $this.countdown * fullLength_2 ) + i * badgeWidth;
        
    }
    
    $this.pauseMenu = {};
    $this.showPauseMenu = toolkit.showPauseMenu;
    $this.pauseMenu.continue = toolkit.pauseMenu.continue;
    $this.pauseMenu.replay = toolkit.pauseMenu.replay;
    $this.pauseMenu.shareFB = toolkit.pauseMenu.shareFB;
    
    $this.showTut = toolkit.showTut;
    
    $this.getInformation = function(){
        $sce.trustAsHtml($this.question.information);
        return $sce.getTrustedHtml($this.question.information);
    }
    
    $this.answerGetClassName = function(){
        return "answer-number" + $this.selected.length;
    }
}]);


function resizing($scope){
    /*
    var wh = $(window).height();
    setTimeout(function(){
            $scope.optionsStyle = {
                height: ($(window).height() - 111) + 'px'
            };
        },100);
    
    if($('.answer-set').length > 0){
        $('.answer-info-content').height(wh - 121);
    }
    if($('.options').length > 0){
        var new_wh = wh - $('.question-content').outerHeight() - 45;
        $('.options')
        $('.options').height(wh - 121);
    }
    */
}

$(document).ready(function(){
  $('.street-master-img').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated').removeClass('tada');
    });
    
});

