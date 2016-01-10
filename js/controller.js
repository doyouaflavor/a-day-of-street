var game = angular.module('game',['ngSanitize']);
game.controller('MainCtrl', ['$scope', '$interval','$window', function ($scope,$interval,$window) {
    $this = this;
    
    $this.debug = false;
    $this.interval = $interval;
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
            return Math.random() * (region[1][0] - region[0][0]) + region[0][0] - $this.getPersonBoxSize().width;
        },
        y : function(){
            var region = $this.region;
            return Math.random() * (region[1][1] - region[0][1]) + region[0][1];
        },
    }
    
    $this.updateRegionAndMaster = function(){
        
        $this.region = [[0,150],[600,350]];
        $this.region[1][0] = $(window).width();
        $this.region[1][1] = $window.innerHeight - 115 - $this.getPersonBoxSize().height;
        $this.masterPoint = [($this.region[1][0] - $this.getMasterBoxSize().width)/2,0];
        
        $('.street-background, .street-stage').width($(window).width());
        $('.street-background, .street-stage').height($window.innerHeight);
        
        
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
        return {opacity : o, 'pointer-events': pe }
    }
    
    $this.pauseMenu = {};
    $this.showPauseMenu = toolkit.showPauseMenu;
    $this.pauseMenu.continue = toolkit.pauseMenu.continue;
    $this.pauseMenu.replay = toolkit.pauseMenu.replay;
    $this.pauseMenu.shareFB = toolkit.pauseMenu.shareFB;
    
    $this.showTut = toolkit.showTut;
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

$(document).ready(function(){
  $('.street-master').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated').removeClass('rubberBand');
    });
});

