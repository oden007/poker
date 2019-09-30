//通信処理用クライアントプログラム
var port=8002;
var socket = io.connect("http://localhost:"+port);
hands=[];
var change_number=0;
var my_user_name="";
var MAX_CHANGE_NUMBER=3;
var game_number=0;
var my_user_name;//自分のユーザ名
var exchange_number=0;
//チャットに参加する為の関数
function join(){
socket.send("join");
document.getElementById("join").disabled=true;
}
//ゲームを開始する関数
function start(){
    socket.send("start");
}
//ゲーム終了を伝える関数
function finish(){
    socket.send("finish");
}
//ゲーム続行を伝える関数
function next_game(){
    socket.send("continue");
    ok.innerHTML="";
    ex.innerHTML="";
}
//手札の交換を伝達する関数
function hand_change(){
    console.log(exchange)
    message_to_server={
        message:"change",
        hand:exchange
    }
    socket.send(message_to_server)
}
//手札決定を伝達する関数
function decide(){
    message_to_server={message:"decide",
    hand:hand,
    score:score
    }
    socket.send(message_to_server)
}
socket.on('greeting', function(data, fn){
//サーバから送信されたメッセージに応じて処理を変更する
if(data.message=="wait"){
    document.getElementById("join").disabled=true;
}
else if(data.message=="reject"){
    alert("現在ゲーム中です");
    document.getElementById("join").disabled=false;
}
else if(data.message=="no4"){
    alert("参加人数超過の為に参加出来ません");
    document.getElementById("join").disabled=false;

}
else if(data.message=="close"){
    alert("通信が切断されましたのでウィンドウを更新します");
    location.reload();
}
else if (data.message=="finish"){
    alert("次のゲームに参加しないユーザがいるためウィンドウを更新します");
    location.reload();
}
else if (data.message=="finish_myself"){
    alert("次のゲームの参加辞退を確認したためウィンドウを更新します");
    location.reload();
}
//二人目のがユーザ参加(これが適応されるのは最初に参加を行ったユーザのみ)
 else if(data.message=="ready"){
    document.getElementById("start").disabled=false;
}
else if(data.message=="start"){
    game_number++;
    change_number=0;
    document.getElementById("join").disabled=true;
    document.getElementById("start").disabled=true;
    //参加人数だけ手札を表示させる
    my_user_name=data.user_list[0];
    document.getElementById("game_result").innerHTML+="あなたは"+my_user_name+"です<br>"+game_number+" 戦目<br>";
    for(j=1;j<data.user_list.length;j++){
        position=100;
        for(i=1;i<6;i++){
            card_id="no"+i;
            document.getElementById(card_id).style="pointer-events:auto";
            player=card_id+data.user_list[j];
            if(j==1)
            document.getElementById("box1").innerHTML+='<img id='+player+' src="card/card_back_bottom.png" width=50 height=80; style="pointer-events:none;">'
            if(j==2)
            document.getElementById("box2").innerHTML+='<img id='+player+' src="card/card_back_right.png" width=80 height=50; style="pointer-events:none;"><br>'
            if(j==3)
            document.getElementById("box4").innerHTML+='<img id='+player+' src="card/card_back_left.png" width=80 height=50; style="pointer-events:none;"><br>'
        }
    }
    ok.innerHTML='<p style="position: relative; top:0%;left:30%" onclick=decide()>決定</p>'
    hand=data.hand;
    deck=data.deck;
    change2();
    check();
}
else if(data.message=="restart"){
    game_number++;
    change_number=0;
    document.getElementById("game_result").innerHTML+=game_number+" 戦目<br>";
    for(i=1;i<6;i++){
        card_id="no"+i;
        document.getElementById(card_id).style="pointer-events:auto";
    }
    for(j=1;j<data.user_list.length;j++){
        position=100;
        for(i=1;i<6;i++){
            card_id="no"+i;
            tmp_id=card_id+data.user_list[j];
            if(j==1)
            document.getElementById(tmp_id).src="card/card_back_bottom.png"
            if(j==2)
            document.getElementById(tmp_id).src="card/card_back_left.png"
            if(j==3)
            document.getElementById(tmp_id).src="card/card_back_right.png"
        }
    }
    ok.innerHTML='<p style="position: relative; top:0%;left:30%" onclick=decide()>決定</p>'
    hand=data.hand;
    deck=data.deck;
    change2();
    check();
    //操作ログの欄の更新
    document.getElementById("pass").innerHTML='<font size="1">操作ログ<br>--------------------<br></font>'
    document.getElementById("dis").style.visibility="hidden";
}
else if(data.message=="change"){
    change_number++;
    console.log(change_number);
    ex.innerHTML='';
    for(i=0,j=0;i<hand.length;i++){
        if(exchange[i].num!=-1&&exchange[i].mark!=-1){
            if(data.list[j]=="shuffle"){
                j++;
            }
            id_num=i+1;
            id="no"+id_num;
            hand[i].num=data.list[j].num;
            hand[i].mark=data.list[j].mark;
            document.getElementById(id).src=image(data.list[j]);
            document.getElementById(id).style="";
            exchange[i].num=exchange[i].mark=-1;
            j++;
        }
        if(j==data.list.length){
        check();
        break;
        }
    }
    //操作ログの追加
        //操作したユーザ名の表示
        document.getElementById("pass").innerHTML+='<font size="1">You discard</font><br>';
        for(i=0;i<data.discard.length;i++){
            if(data.list[i]=="shuffle"){
                document.getElementById("pass").innerHTML+='<font size="1">execute shuffle to make new deck!!</font><br>';
            }
            document.getElementById("pass").innerHTML+='<font size="1">'+check_mark(data.discard[i].mark)+":"+data.discard[i].num+'</font><br>';
        }
        //画像が非表示になっていた場合
        if(document.getElementById("dis").style.visibility=="hidden"){
            document.getElementById("dis").style.visibility="visible";
        }
        //画像の表示
        if(data.list[data.list.length-1]=="shuffle"){
            //document.getElementById("dis").src="card/card_back.png";
            document.getElementById("dis").style.visibility="hidden";
            document.getElementById("pass").innerHTML+='<font size="1">execute shuffle to make new deck!!</font><br>';
        }
        else
        document.getElementById("dis").src=image(data.discard[data.discard.length-1]);
        
    if(change_number==MAX_CHANGE_NUMBER){
        //手札の操作無効
        decide();
        for(i=0;i<hand.length;i++){
            id_num=i+1;
            id="no"+id_num;
            //console.log(id);
            document.getElementById(id).style="pointer-events:none";
        }
        ok.innerHTML='';
        ex.innerHTML='';
    }
    }
    else if(data.message=="discard"){
        document.getElementById("pass").innerHTML+='<font size="1">'+data.user+' discard<br>';
        for(i=0;i<data.list.length;i++){
            if(data.list[i]=="shuffle"){
                document.getElementById("pass").innerHTML+='<font size="1">execute shuffle to make new deck!!</font><br>';
            }
            document.getElementById("pass").innerHTML+='<font size="1">'+check_mark(data.discard[i].mark)+":"+data.discard[i].num+'</font><br>';
        }
        //画像が非表示になっていた場合
        if(document.getElementById("dis").style.visibility=="hidden"){
            document.getElementById("dis").style.visibility="visible";
        }
        //画像の表示
        if(data.list[data.list.length-1]=="shuffle"){
            document.getElementById("dis").style.visibility="hidden";
            document.getElementById("pass").innerHTML+='<font size="1">execute shuffle to make new deck!!</font><br>';
        }
        else
        document.getElementById("dis").src=image(data.discard[data.discard.length-1]);
        //shuffleが配列に入っていた場合
    }
    else if(data.message=="decide"){
        //手札の操作無効
        for(i=0;i<hand.length;i++){
            id_num=i+1;
            id="no"+id_num;
            document.getElementById(id).style="pointer-events:none";
        }
        ok.innerHTML='';
        ex.innerHTML='';
    }
    else if(data.message=="game_set"){
        change_number=0;
        for(i=0;i<data.result.length;i++){
        if(my_user_name==data.result[i].user_name)
        target=document.getElementById("no1");
        else
        target=document.getElementById("no1"+data.result[i].user_name);
        parent=target.parentNode;
        n=i+1;
        //手札の表示
        for(j=1;j<=hand.length;j++){
            if(my_user_name!=data.result[i].user_name){
                if(parent.id=="box2"||parent.id=="box4"){
                    document.getElementById("no"+j+data.result[i].user_name).src=
                    image_side(data.result[i].hand[j-1]);
                }else
                document.getElementById("no"+j+data.result[i].user_name).src=image(data.result[i].hand[j-1]);
            }

        }
        document.getElementById("game_result").innerHTML+="No."+n+"."+data.result[i].user_name
        +" : "+hand_result(data.result[i].score)+"<br>";
    }
        ok.innerHTML='<p style="position: relative; top:0%;left:30%" onclick=next_game()>続ける</p>';
        ex.innerHTML='<p style="position: relative; top:0%;left:30%" onclick=finish()>やめる</p>';
    }
}) 