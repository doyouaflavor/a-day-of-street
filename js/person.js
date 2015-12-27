function newPerson(i){
    var person = {};
    person.position = {x:0,y:0};
    person.target = {x:0,y:0};
    person.vel = 5;
    person.state = 'stop';
    person.saw = false;
    person.position.x = Math.random()*100;
    person.position.y = Math.random()*100;
    person.target.x = Math.random()*300+300;
    person.target.y = Math.random()*300;
    person.name = 'wang'+i;
    person.sprite = $('.'+person.name);
    
    person.do = function(action){
        person.state = action;
        
        switch(action){
            case 'walk-deal':
                person.goto(500,0);
                break;
        }
        
        return person;
    }
    
    person.goto = function(x,y){
        person.target.x = x;
        person.target.y = y;
    }
    
    person.move = function(){
        switch(person.state){
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
                    
                    if(person.state == 'walk-deal'){
                        var destroy = true;
                        
                    }
                    person.state = 'stop';
                }
                break;
            case 'stop':
                
                
                break;
        }
        if(destroy){
            person.do('kill');
        }
        return person;
    }
    
    person.style = function(){
        return {left: person.position.x, top: person.position.y};
    }
    return person;
}
