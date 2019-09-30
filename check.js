//手札の強さの判定
score=0;
//ポーカーの手札判定
function card (mark,num){
    this.mark=mark;
    this.num=num;
}
function compareFunc(a, b) {
    return a - b;
}

//捨てたカードをチェックする関数
function check_mark(mark_check){
    if(mark_check==1)
    mark="spade";
    else if(mark_check==2)
    mark="club";
    else if(mark_check==3)
    mark="heart";
    else if(mark_check==4)
    mark="dia";
    return mark;
}

//判別アルゴリズムはワイルドカードは考慮していない
function check(){
number=new Array(14);
card_mark=new Array(5);
flag=new Array(5)
index=new Array(5);
for(i=0;i<hand.length;i++){
    index[i]=hand[i].num
}
index.sort(compareFunc);
for(i=0;i<number.length;i++){
number[i]=0;
}
for(i=0;i<card_mark.length;i++){
    card_mark[i]=0
    }
for(i=0;i<flag.length;i++){
    flag[i]=0
    }
for(i=0;i<hand.length;i++)
//hand内の数字の個数の確認
for(i=0;i<hand.length;i++){
    number[hand[i].num]++
    card_mark[hand[i].mark]++
}
for(i=0;i<number.length;i++){
    if(number[i]==2){
        flag[2]++
    }
    if(number[i]==3){
        flag[3]++
    }
    if(number[i]==4){
        flag[4]++
    }
}
//ストレートフラグ
straight=0
for(i=0;i<index.length-1;i++)
{
    if(index[i]+1!=index[i+1]){
    break;
    }
    if(index[i]+1==index[i+1]&&i==index.length-2)
    straight=1
}
//ロイヤルストレートフラッシュ
if(number[1]==1&&number[10]==1&&number[11]==1&&number[12]==1&&number[13]==1&&card_mark.find(item => item === 5))
{
    result.innerHTML="ロイヤルストレートフラッシュ"
    score=9;
}
//ストレートフラッシュ
else if(straight==1&&number[13]==1)
{
    result.innerHTML="ストレートフラッシュ"
    score=8;
}
//フォーカード
else if(flag[4]==1)
{
    result.innerHTML="フォーカード"
    score=7;
}
//フルハウス
else if(flag[2]==1&&flag[3]==1){
    result.innerHTML="フルハウス"
    score=6;
}
//フラッシュ
else if(card_mark.find(item => item === 5)){
    result.innerHTML="フラッシュ"
    score=5
}
//ストレート
else if(straight==1){
    result.innerHTML="ストレート"
    score=4;
}
//スリーカード
else if(flag[3]==1){
    result.innerHTML="スリーカード"
    score=3;
}
//ツーペア
else if(flag[2]==2){
    result.innerHTML="ツーペア"
    score=2;
}
//ワンペア
else if(flag[2]==1){
    result.innerHTML="ワンペア"
    score=1;
}
else {
    result.innerHTML="ブタ"
    score=0;
}
}
//手札開示用プログラム
function hand_result(hand_score){
    //ロイヤルストレートフラッシュ
if(hand_score==9)
{
    return "ロイヤルストレートフラッシュ"  
}
//ストレートフラッシュ
else if(hand_score==8)
{
    return "ストレートフラッシュ"
}
//フォーカード
else if(hand_score==7)
{
    return "フォーカード"
}
//フルハウス
else if(hand_score==6){
    return "フルハウス"   
}
//フラッシュ
else if(hand_score==5){
    return "フラッシュ"
}
//ストレート
else if(hand_score==4){
    return "ストレート" 
}
//スリーカード
else if(hand_score==3){
    return "スリーカード"  
}
//ツーペア
else if(hand_score==2){
   return "ツーペア"
}
//ワンペア
else if(hand_score==1){
   return "ワンペア"
}
else {
    return "ブタ"
}
}
