//サーバサイド処理
var port=8002
var connectors=[];
var deck=[];
var user_score=[];
var decided_member=0;
var max_play_member=4;
var final_score=[];
var GAME_START=false;
var discard_list=[];
var continue_number=0;
//チャットに参加しているユーザのid一覧
var io = require('socket.io').listen(port);
io.sockets.on('connection', function(socket) {
socket.on('message', function (message) {

    //新しく参加する場合
    if(typeof(message)=="string"){
            //ゲーム続行のメッセージが来た場合
    if(message=="continue"){
    continue_number++;
    }
        if(message=="join"){
            if(GAME_START){
                socket.emit('greeting',{message:"reject",number:0},function(data){});
            }
            //5人目以降は参加を拒否
        else if(connectors.length==4){
            socket.emit('greeting',{message:"no4",number:0},function(data){});
        }
    else{
    connectors.push(socket.id);
    console.log(connectors.length);
    //ゲーム"に1人目として参加
    if(connectors.length==1){ 
    socket.emit('greeting',{message:"wait",number:0},function(data){});
    }
    //二人目が参加する場合、ゲームの準備を行う
    else if(connectors.length==2){
       for(i=0;i<connectors.length;i++){
           //スタート権限を持つユーザとそうじゃないユーザで送信するメッセージを分ける
           if(i==0){
            io.sockets.connected[connectors[i]].emit('greeting', 
            {message:"ready"}, function (data) {
       });
           }
           else{
               io.sockets.connected[connectors[i]].emit('greeting', 
               {message:"wait"}, function (data) {
                });
            }
        }
    }   else{

        //3人目以降の参加者は既にあるチャットに加わる
      io.sockets.connected[connectors[i]].emit('greeting', 
        {message:"join",number:connectors.length}
          ,function (data) {
          });
  }
}
}
            //ゲーム開始の要求が送信された場合
           else if(message=="start"||continue_number==connectors.length){
                //デッキを作成
                continue_number=0;
                decided_member=0;
                GAME_START=true;
                deck=make_deck();
                hand=[];
                //ユーザリストの生成
                if(message=="start"){
                    user_list=[];
                    for(i=1;i<=connectors.length;i++){
                        user_list.push("user"+i);
                    }
                }
                
                final_score=new Array(connectors.length);
                //開始メッセージの送信
                for(i=0;i<connectors.length;i++){
                    for(j=0;j<5;j++){
                        hand.push(deck.pop());
                    }
                    tmp_user_list=user_list.concat();
                    //送信するユーザリストの作成
                    tmp=tmp_user_list[i];
                    tmp_user_list.splice(i,1);
                    tmp_user_list.unshift(tmp);
                    console.log(tmp_user_list);
                    //ポーカーで使用するリスト
                    final_score[i]={user_name:user_list[i],score:0,hand:hand};
                    //開始または二度目のゲームで送信するメッセージを変更
                    if(message=="start"){
                        send_text="start";
                    }
                    else {
                        send_text="restart";
                    }
                    //手札の情報を取り出し
                    io.sockets.connected[connectors[i]].emit('greeting', 
                    {message:send_text,
                    hand:hand,//手札リスト
                    deck:deck,//デッキリスト
                    user_list:tmp_user_list
                }, function (data) {
                     }); 
                     hand=[];
                }
            }else if(message=="finish"){
                j=connectors.indexOf(socket.id);
                for(i=0;i<connectors.length;i++){
                    if(i==j)
                    {io.sockets.connected[connectors[i]].emit('greeting',{message:"finish_myself",
                    },function(data){});
                }else
                      {io.sockets.connected[connectors[i]].emit('greeting',{message:"finish",
                    },function(data){});
                }
             }
                    
                        continue_number=0;
                        connectors=[];
                        decided_member=0;
                        GAME_START=false;
                        discard_list=[];
            
            }
    }
    else if(typeof(message)=="object"){
        //手札の決定
        if(message.message=="decide"){
            decided_member++;
            for(i=0;i<connectors.length;i++){
            if(socket.id==connectors[i]){
                //tmp_number=i+1;
                final_score[i].score=message.score;
                break;
            }
        }
        if(connectors.length==decided_member){
            final_score.sort(score_sort);
            console.log(final_score);
            for(i=0;i<connectors.length;i++){
                io.sockets.connected[connectors[i]].emit('greeting',{message:"game_set",
                result:final_score},function(data){});
            }  
        }
        else{
            socket.emit('greeting',{message:"decide"},function(data){});
        }
        }
        //手札の交換
        else if(message.message=="change"){
            var change_list_number=0;
            var tmp_discard=[];
            change_list= hand_change(message.hand);
            console.log("change_listの中身")
            console.log(change_list);
            //サーバでユーザの手札更新
            j=connectors.indexOf(socket.id);
            for(i=0;i<message.hand.length;i++){
                if(message.hand[i].mark!=-1&&message.hand[i].num!=-1){
                    final_score[j].hand[i]=change_list[change_list_number];
                    discard_list.push(message.hand[i]);
                    tmp_discard.push(message.hand[i]);
                    console.log(message.hand[i]);
                    change_list_number++;
                }
            }
            console.log(tmp_discard[0].num);
            //送信者によってクライアントに送信するメッセージを分ける
            for(i=0;i<connectors.length;i++){
            if(i==j){
                io.sockets.connected[connectors[i]].emit('greeting',
                {message:"change",list:change_list,discard:tmp_discard,user:user_list[j]},function(data){});  
            }
            else{
                io.sockets.connected[connectors[i]].emit('greeting',
                {message:"discard",list:change_list,discard:tmp_discard,user:user_list[j]},function(data){});
            }

        }   
        }
        }
    });
        //通信が切断された
        socket.on('disconnect', function () {
        connectors.forEach((item, index) => {
        if(item === socket.id) {
            connectors.splice(index, 1);
        }
    });
    for(i=0;i<connectors.length;i++){
        io.sockets.connected[connectors[i]].emit('greeting',{message:"close",
        },function(data){});
    }  
            continue_number=0;
            connectors=[];
            decided_member=0;
            GAME_START=false;
            discard_list=[];

  });
});
function score_sort(a,b){
    if(a.score>b.score) return -1;
    if(a.score<b.score) return 1;
    return 0;
}

//------------------------------------------------
//デッキと手札を作成プログラム
function card(mark,num){
    this.mark=mark;
    this.num=num;
}
//カード並び替え関数
function sort_at_random(arrayData) {
    var arr = arrayData.concat();
    var arrLength = arr.length;
    var randomArr = [];
    for(var i = 0; i < arrLength; i++) {
        // 0～countArrの個数 の範囲から、数値をランダムに抽出
        var randomTarget = Math.floor(Math.random() * arr.length);
        // randomArrに数値を格納
        randomArr[i] = arr[randomTarget];
        // 同じ数値を再度使わないように、今回使った数値をcountArrから削除しておく
        arr.splice(randomTarget, 1);
    }
    return randomArr;
}
function make_deck(){
cards=[]
for(i=1;i<5;i++)//mark 1:spade 2:crab 3:heart 4:dia 
for(j=1;j<14;j++)
{
    cards.push(new card(i,j))
}
return sort_at_random(cards)
}
//-----------------------------------------------
//手札交換関数
function hand_change(exchange){
    //console.log(exchange)
    return_card=[];
    for(i=0;i<exchange.length;i++){
    if(exchange[i].mark!=-1&&exchange[i].num!=-1){
        return_card.push(deck.pop());
        if(deck.length==0){
            return_card.push("shuffle");
            //新しいデッキの作成
            deck=sort_at_random(discard_list);
            discard_list=[];
        }
}
    }
    return return_card;
}
