let points = 0; //Кол-во очков игрока
let seconds = 60; //Время (в секундах)

let namelessPlayerCount = 0;//Количество безымянных игроков
const Color = ["red","green","blue"]; //Цвета кубиков
let Removed = new Array(); //Массив "убранных кубиков"
let rb;
let startPause;
let timer;
let pts;
let tableResult;

window.onload = function() {
  const dataRestore = restoreFromLocal();
  tableResult = document.getElementsByClassName("rb-game-status")[0];
  if (dataRestore) {
    tableResult.innerHTML = dataRestore;
  }
 }

function Start()   //Начало Игры
{
   rb = document.getElementsByClassName('rb-body')[0];
   startPause = rb.getElementsByClassName("rb-btn-start")[0];
   timer = rb.getElementsByClassName("rb-input-timer")[0];
   pts = rb.getElementsByClassName("rb-input-pts")[0];
   tableResult = rb.getElementsByClassName("rb-game-status")[0];
  
  if(startPause.innerText=="Старт") // Старт
   {
    startPause.innerText="Пауза";
       let gameField = rb.getElementsByClassName('rb-game-area')[0];
       for(let i = 0; i < 143; i++) //Создаём кубики
       {
        let newBlock = document.createElement('button');
            newBlock.id="block"+(i+1);
	          newBlock.onclick=function(){Click(this.id);};
            newBlock.style.backgroundColor=Color[Math.round(Math.random()*2)];
            newBlock.classList.add('newBox');
        gameField.appendChild(newBlock);
       }
       seconds=60;
       Timer(); // Включаем таймер
   }
   else 
   {
       if(startPause.innerText=="Продолжить") // Продолжить
       {
          startPause.innerText="Пауза";
       }
       else // Пауза
       {
         startPause.innerText="Продолжить";
       }
   }
}

function New_Game()
{
    const boxes = rb.getElementsByClassName("rb-game-area")[0];
    boxes.innerHTML = "";
    seconds = -1;
    timer.innerText = "01:00";
    startPause.innerText = "Старт";
    pts.value = points = 0;
}

function Click(id)//Нажатие на кубик
{
    const blocksColor = rb.getElementsByClassName("rb-game-area")[0].children;
    const blockColor = blocksColor[id];
    const btn = startPause.innerText;
    let counter = timer;
    if(blockColor.style.backgroundColor != "white" && btn !="Продолжить" && seconds >= 0) 
      {
         switch(blockColor.style.backgroundColor) 
	       {
	         case "red":points += 5; break;
	         case "green":points += 10; break;
	         case "blue":points +=15; break;
	         default:break;
	       }
        pts.value=points;

        if(blockColor.innerHTML!= "") 
	        {
	          seconds+=parseInt(blockColor.innerHTML);
            blockColor.innerHTML="";
	          if(blockColor.innerHTML!="0")
	           {
              counter.value = (seconds/60 < 10 ? "0" : "") + String(parseInt(seconds/60))+ ":"+ (seconds%60 < 10 ? "0" : "") + String(seconds%60);
             }
	     
             if(seconds<5&&blockColor.innerHTML.includes("-")==true) //Когда кол-во отнимаемых секунд больше чем оставшееся время
             {
	             counter.value="00:00";
             }	     
	       }
	 
        blockColor.style.backgroundColor="white";
	      Removed.push(id);
      }
}

function Timer()//Таймер 
{
    function tick() 
    {
      let counter = timer;
      if(seconds > 0 && startPause.innerText === "Пауза") // Обратный отсчёт
	      {
	        seconds--;
          counter.value = (seconds/60 < 10 ? "0" : "") + String(parseInt(seconds/60))+ ":"+ (seconds%60 < 10 ? "0" : "") + String(seconds%60);
	      }
	
      if( seconds >= 0 ) 
	      {
          setTimeout(tick, 1000);
        }
	
	    if(seconds === 0) 
	      {
         timer.innerText = "00:00";

      let playerName = prompt("Очки: "+String(parseInt(points))+"\nВведите свое имя:");
      playerName = playerName.substr(0, 5)
      if(playerName.length!=0)
        {
          tableResult.innerHTML+=" <br/> "+playerName+": "+points;
		      New_Game();
        } else {
          tableResult.innerHTML+=" <br/> Player"+ ++NamelessPlayerCount +": "+points;
        }
        let dataSave = tableResult.innerHTML;
        saveToLocal(dataSave);
	      seconds=-1;
        }
	
	    if(seconds %3 === 0 && Removed.length>=2 && startPause.innerText=="Пауза")
	    {
        const blocksColor = rb.getElementsByClassName("rb-game-area")[0].children;
	      for(let i=0;i<Math.round(Math.random()*3);i++)
	        {
	          let ind=Math.round(Math.random()*Removed.length);
            let blockColor = blocksColor["block"+ind];
	          if(blockColor.style.backgroundColor === "white")
	            {
                blockColor.style.backgroundColor=Color[Math.round(Math.random()*4)];
	              blockColor.style.border="2px solid white";
                Removed.splice(ind,1);
	            } 
	        }
	    }
    }
    
    if(seconds >= 0) 
      {
        tick();
      }
}

function saveToLocal(data) {
  localStorage.setItem('rb', data);
}

function restoreFromLocal() {
  return localStorage.getItem('rb');
}