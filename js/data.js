function removeItem(optionsArray, questionIndex, optionName){
    for(var i = 0; i < optionsArray[questionIndex].options.length ;i++){
         if(optionsArray[questionIndex].options[i].name == optionName){
             optionsArray[questionIndex].options.splice(i,1);
            //刪掉第三題的彩券
         }
     }
}

var data = [
            {"name":"Q1",
             "description":"虛擬是美好的，因為我們有得選擇。請選擇你的街頭創業家屬性",
             "options":[
                 {
                     "name":"A",
                     "value":"身障者",
                     "addormulti":"+",
                     "score":30,
                     "img":"img/disable-img.png",
                     "rwd_img":"img/disable-mobile.png",
                     "effect":function(scene){
                         scene.role = 1;
                         scene.threshold.saw = 0.1;
                     },
                 },
                 {
                     "name":"B",
                     "value":"街友",
                     "addormulti":"+",
                     "score":30,
                     "img":"img/homeless.png",
                     "rwd_img":"img/homeless-mobile.png",
                     "effect":function(scene){
                         removeItem(scene.data, 2, "D");
                         scene.role = 2;
                         scene.threshold.saw = 0.06;
                     },
                 },
                 {
                     "name":"C",
                     "value":"老人家",
                     "addormulti":"+",
                     "score":30,
                     "img":"img/elder-img.png",
                     "rwd_img":"img/elder-mobile.png",
                     "effect":function(scene){
                         removeItem(scene.data, 2, "D");
                         scene.role = 3;
                         scene.threshold.saw = 0.08;
                     },
                 }
             ],
             "information":"弱勢狀態時選擇成為街頭者的原因，多來自於經濟、工作形式、以及環境三種考量。<br>▍經濟：經濟考量是弱勢者選擇街賣最普遍的原因。然而，壓力未必只有個人生計。如一位街賣者受訪時所說：「若不需負擔媽媽看護費用，我自己是可以過的」。<br/>▍工作形式：街賣者因為生理上或個性上的問題，無法因應一般公司的工作型態，而街賣擁有的自由度或彈性，就成為他們的選擇。受訪街賣者曾提到無法負荷先前工作上的肢體負荷，所以選擇離開。<br/>▍環境：相對於利益導向的工作環境，街賣環境可能遇到更多的同理者（即使仍有少數環抱歧視心態的民眾），這樣的環境氛圍也是特定個案青睞街賣行業的原因之一。"
            },
        {"name":"Q2",
             "description":"初次在街頭創業，你想加入集團合作還是獨立自強呢？",
             "options":[
                 {
                     "name":"A",
                     "value":"獨立",
                     "addormulti":"+",
                     "score":20,
                     "img":"img/option-2-1.jpg",
                     "effect":function(scene){
                         removeItem(scene.data, 2, "C");//刪掉第三題的日用品
                         removeItem(scene.data, 3, "C");//刪掉第四題的夜市
                     },
                 },
                 {
                     "name":"B",
                     "value":"集團",
                     "addormulti":"+",
                     "score":15,
                     "img":"img/option-2-2.jpg",
                     "effect":function(scene){
                         
                     },
                 }
             ],
            "information":"許多人對於街賣集團有著許多疑問，人生百味團隊實地走訪了台北兩個團體，發現其多為合作社或一般公司形式進行，有些為出外打拚的身障者提供正餐與住宿，有些因交通安全考量提供接送。台北地區目前有六至七個街賣團體，此外更有大誌、華山地瓜媽媽、人生百味等街頭商品。<br/>獨立與團體街賣各有優劣勢，但街頭並不只屬於行人，也屬於暫時住宿者，以及在街頭上討生活的人們。"
            },
    
    {"name":"Q3",
             "description":"身為一個街頭創業家，身上帶些商品也是合情合理的，你會選擇販賣什麼呢？",
             "options":[
                 {
                     "name":"A",
                     "value":"玉蘭花",
                     "addormulti":"+",
                     "score":10,
                     "img":"img/option-3-1.png",
                     "effect":function(scene){
                         scene.deal_score += 25;
                     },
                 },
                 {
                     "name":"B",
                     "value":"口香糖",
                     "addormulti":"+",
                     "score":5,
                     "img":"img/option-3-2.png",
                     "effect":function(scene){
                         scene.deal_score += 10;
                     },
                 },
                 {
                     "name":"C",
                     "value":"衛生用品(牙線、衛生紙)",
                     "addormulti":"+",
                     "score":10,
                     "img":"img/option-3-3.png",
                     "effect":function(scene){
                         scene.deal_score += 50;
                     },
                 },
                 {
                     "name":"D",
                     "value":"彩券",
                     "addormulti":"+",
                     "score":5,
                     "img":"img/option-3-4.png",
                     "effect":function(scene){
                         scene.deal_score += 20;
                     },
                 },
             ],
            "information":"目前市面上的街頭商品，多以玉蘭花、彩券與日用品為主。<br/>由於無法大量批發，以及每月能販售的數量有限，為了維持生計多會將價格訂得高於市價。但也因此產生被消費者認為太貴且品質不清楚，而不願意購買的困境。"
            },{"name":"Q4",
             "description":"身為一個街頭創業家，身上帶些商品也是合情合理的，你會選擇販賣什麼呢？",
             "options":[
                 {
                     "name":"A",
                     "value":"捷運站出口",
                     "addormulti":"*",
                     "score":3,
                     "img":"img/option-4-1.jpg",
                     "effect":function(scene){
                         scene.threshold.newPeople += 0.05;
                         scene.threshold.redeye += 0.05;
                     },
                 },
                 {
                     "name":"B",
                     "value":"馬路上",
                     "addormulti":"*",
                     "score":1,
                     "img":"img/option-4-2.jpg",
                     "effect":function(scene){
                         scene.threshold.newPeople -= 0.05;
                     },
                 },
                 {
                     "name":"C",
                     "value":"夜市",
                     "addormulti":"*",
                     "score":2,
                     "img":"img/option-4-3.jpg",
                     "effect":function(scene){
                         scene.threshold.saw -= 0.05;
                         scene.threshold.redeye -= 0.05;
                     },
                 }
             ],
            "information":"街賣者多為身體行動較不便者，因此選擇地點時機能與人潮同樣重要。廁所、飲水機回家交通的便利性都是十分重要的考量。<br/>另外有分流動或定點兩種賣法，不一定會每日出現在同點。人氣街賣者就像POP-UP SHOP一樣，撞見時會充滿驚喜呢。"
            },
        {"name":"Q5",
             "description":"傍晚人潮正多，你會怎麼宣傳讓自己生意興隆？",
             "options":[
                 {
                     "name":"A",
                     "value":"製作看板",
                     "addormulti":"*",
                     "score":2,
                     "img":"img/option-5-1.jpg",
                     "effect":function(scene){
                         scene.threshold.saw += 0.05;
                     },
                 },
                 {
                     "name":"B",
                     "value":"大聲叫賣",
                     "addormulti":"*",
                     "score":1,
                     "img":"img/option-5-2.jpg",
                     "effect":function(scene){
                         scene.threshold.saw += 0.05;
                         scene.threshold.redeye += 0.05;
                     },
                 },
                 {
                     "name":"C",
                     "value":"安靜等客",
                     "addormulti":"*",
                     "score":3,
                     "img":"img/option-5-3.jpg",
                     "effect":function(scene){
                     },
                 }
             ],
            "information":"許多人常認為，街賣是一份低門檻的工作，所以才會有許多弱勢者從事，但低技術門檻的工作比比階是，超過九成過去有其他工作經驗，且街賣也絕非低門檻的工作，夏天早上悶熱、下午暴雨，冬天賣到四肢冰冷，天氣再熱也不敢喝太多水，因為行動不方便，而廁所距離很遠，吃飯要找無障礙空間，被警察取締，還要面對面向路人推銷忍耐冷潮熱諷，若不是有高度的覺悟與毅力，絕對撐不了幾天就放棄了。"
            },
    {"name":"Q6",
             "description":"競爭好激烈啊！！會放大決請大家發揮愛心以同情購買嗎？",
             "options":[
                 {
                     "name":"A",
                     "value":"是",
                     "addormulti":"*",
                     "score":2,
                     "img":"img/option-6-1.jpg",
                     "effect":function(scene){
                         scene.threshold.saw += 0.05;
                     },
                 },
                 {
                     "name":"B",
                     "value":"否",
                     "addormulti":"*",
                     "score":1,
                     "img":"img/option-6-2.jpg",
                     "effect":function(scene){
                     },
                 }
             ],
            "information":"以同情的基礎的銷售，就好像是一種捐款，必需不斷的向消費者傳達自身「匱乏」的訊息才能得到生活所需的收入，因此買賣雙方其實很難形成真誠的關係，並且一旦讓消費者明顯的感覺到，你生活改善了，很有可能就造成這樣收入的減少甚至是終止。<br/>另一方面，對於是否需要渲染同情，街賣者心中其實也充滿矛盾。除了怕破壞隱性的同情關係之外，也可能是因擔心弄巧成拙影響收入。這類矛盾與壓抑的心態，自然會阻礙街賣者與消費者做更深的互動。"
            }
            
        ];