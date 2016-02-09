var host = 'http://st.doyouaflavor.tw/';


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
        if($window.outerWidth>= 960){
            $this.region[0][1] = 600/2;
            $this.region[1][0] = $this.width = 960;
            $this.region[1][1] = $this.height = 600;
            $this.masterPoint = [($this.region[1][0] - $this.getMasterBoxSize().width)/2, $this.height/2-115];
            $('.street-background, .street-stage').width(960);
            $('.street-background, .street-stage').height(600);
        }else{
            $this.region[1][0] = $window.screen.width;
            $this.region[1][1] = $window.screen.height - $this.getMasterBoxSize().height;
            $this.masterPoint = [($this.region[1][0])/2,50];
            $this.width = $window.screen.width;
            $this.height = $window.screen.height - 45;
            $('.street-background, .street-stage').width($window.screen.width);
            $('.street-background, .street-stage').height($window.screen.height); 
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
    $this.shareHref = function(){
        var $arr = [];
        $arr.push({
            'name':'caption',
            'attr':'人生百味〈街頭創業家的一天〉'
        });
        $arr.push({
            'name':'picture',
            'attr': host + $this.selected[0].option.img
        });
        $arr.push({
            'name':'link',
            'attr': host
        });
        $arr.push({
            'name':'name',
            'attr': $this.name + '在街頭創業一日見習中成功賺到' + $this.total_score + '元，得到「' + $this.final_title + '」稱號'
        });
        $arr.push({
            'name':'redirect_uri',
            'attr':host
        });
        $arr.push({
            'name':'description',
            'attr': '十字路旁單薄的叫賣身影，你是否已習以為常？不知經過幾個年頭，這樣的身影撐起一個家庭，或至少希望獨立賺取應得溫飽。其中人生百萬種滋味和心路故事，每天只是路過是無法了解的。透過角色扮演的遊戲，希望帶著大家一起走入街頭創業家的日常，了解街頭販售的生活，打破隔閡點亮街頭。'
        });
        var $arr2 = ['https://www.facebook.com/dialog/feed?app_id=1020808967984987&display=popup'];
        for(var i = 0; i<$arr.length; i++){
            $arr2.push($arr[i].name + '=' + encodeURI($arr[i].attr));
        }
        return $arr2.join("&");
        
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

