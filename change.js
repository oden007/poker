//画像変更
function image(a){
    source=""
    if(a.mark==1)
    source+="spade/card_spade_"
    else if(a.mark==2)
    source+="club/card_club_"
    else if(a.mark==3)
    source+="heart/card_heart_"
    else if(a.mark==4)
    source+="dia/card_diamond_"
    source+=a.num+".png"
    return source;
    }
    function image_side(a){
        source=""
        if(a.mark==1)
        source+="spade/card_spade_"
        if(a.mark==2)
        source+="club/card_club_"
        if(a.mark==3)
        source+="heart/card_heart_"
        if(a.mark==4)
        source+="dia/card_diamond_"
        source+=a.num+"_side.png"
        return source;
        }
//メインUIの生成
function change(button){
    //表示する画像について解析
    i=button.id.replace('no','')
    i--;
    if(button.style.border==""){
    button.style="border:solid 2px #ff9100"
    if(exchange.indexOf(1)==-1)
    ex.innerHTML='<p style="position: relative; top:0%;left:30%" onclick=hand_change()>交換</p>'
    exchange[i].num=hand[i].num;
    exchange[i].mark=hand[i].mark;
}else {
    button.style=""
    exchange[i].num=-1;
    exchange[i].mark=-1;
    exchange_number--;
    if(exchange_number==0)
    ex.innerHTML='<p style="position: relative; top:0%;left:30%"></p>'
}
}

//画像の表示に使用する関数
function change2(){
    //表示する画像について解析
    for(i=0;i<hand.length;i++){
    tmp=image(hand[i])
    j=i+1
    id="no"+j;
    document.getElementById(id).src=tmp;
}
    exchange=[];
    for(i=0;i<hand.length;i++)
    exchange.push(new card(-1,-1));
}
function mark_check(card_mark){
    if(card_mark==1)
    return "spade";
    else if(card_mark==2)
    return "club";
    else if(card_mark==3)
    return "heart";
    else if(card_mark==4)
    return "diamond";

}

