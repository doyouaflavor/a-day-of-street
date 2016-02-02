function newPerson(i,x,y){
    var person = {};
    person.position = {x:0,y:0};
    person.target = {x:0,y:0};
    person.vel = Math.random()*4+3;
    person.action = 'stop';
    // stop, walk, kill
    person.state = 'idle';
    person.waitInterval = 0;
    person.sawInterval = 0;
    person.sawIntervalMax = 90;
    person.sawIntervalMin = 30;
    // idle, saw, walk-deal, redeye, leave
    person.position.x = x;
    person.position.y = y;
    person.target.x = 0;
    person.target.y = 0;
    person.mind = '';
    person.coin = false;
    person.name = 'wang'+i;
    person.animate = '';
    person.sprite = $('.'+person.name);
    
    person.do = function(action,target){
        if(!target){
            target = [0,0];
        }
        
        switch(action){
            case 'stop':
            case 'walk':
            case 'kill':
                person.action = action;
                break;
            case 'walk-deal':    
                person.goto(target[0],target[1]);
                person.state = action;
                break;
            case 'redeye':
                person.state = action;
                person.waitInterval = 30;
                
                break;
            case 'leave':
                person.state = action;
                person.goto(target[0],target[1]);
                break;
            case 'saw':
                person.state = action;
                person.sawInterval = Math.floor(Math.random()*(person.sawIntervalMax-person.sawIntervalMin) + person.sawIntervalMin);
                break;
        }
        
        return person;
    }
    
    person.goto = function(x,y){
        person.target.x = x;
        person.target.y = y;
        person.action = 'walk';
    }
    
    person.move = function(){
        switch(person.action){
            case 'walk':
            case 'walk-deal':
                // count position x
                if((person.target.x - person.position.x) >= 0){
                    var s = 1;
                }else{
                    var s = -1;
                }
                var disx = (person.target.x - person.position.x)*s;
                if(disx <= person.vel){
                    person.position.x = person.target.x;
                }else{
                    person.position.x += person.vel * s;

                }
                // count position y
                if((person.target.y - person.position.y) >= 0){
                    s = 1;
                }else{
                    s = -1;
                }
                var disy = (person.target.y - person.position.y)*s;
                if(disy <= person.vel){
                    person.position.y = person.target.y;
                }else{
                    person.position.y += person.vel * s;
                }

                if((disx == 0) && (disy == 0)){
                    
                    if(person.state == 'leave'){
                        person.do('kill');
                    }else{
                        person.do('stop');
                    }
                    
                }
                break;
            case 'stop':
                
                
                break;
        }
        return person;
    }
    
    person.style = function(){
        return {left: person.position.x, top: person.position.y};
    }
    return person;
}
