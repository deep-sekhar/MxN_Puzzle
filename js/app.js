
let n1 = document.getElementById("options1").value;
let n2 = document.getElementById("options2").value;
let boxarea=document.getElementById("boxarea");
let moves =document.getElementById("moves") ;
let countmoves = 0;
let hrline = document.getElementById("hrline");
let boxes;
let timer = document.getElementById("timer");
let counttimer = 0;
let clock;
let reset= document.getElementById("monitor4");
let tbuttonarea = document.getElementById("buttonarea");
let tbutton = document.getElementById("button");
let glass2 = document.getElementsByClassName("glass2");
let bgm = document.querySelector("body");
let colorno = 4;
let colorno2 = 2;
let matrixtype = n1*n2;
let highestsc = localStorage.getItem(`highestList${matrixtype}`);

if (highestsc==null) {
    highestsc=-1;        
    highest.innerHTML=`NIL`;
}
else{
    let hsec = highestsc%60;
    let hmin = parseInt(highestsc/60);
    highest.innerHTML=`${hmin}m ${hsec}s`;
}
// let highestscObj;
// else{
//     highestscObj=JSON.parse(highestsc);
// }

howto.addEventListener("click",()=>{
    alert(`INSTRUCTIONS:
    1.Click on boxes having the blank box in its row or column
    2.Doing this  will shift the blank box to that  position
    3.Like this shift all the boxes to arrange them  in order
    starting with box numbered 1 on top left
    
    Best of luck!`)
});

function startclock() {
    counttimer = 0;
    clock = setInterval(() => {
        counttimer++;
        let sec = counttimer%60;
        let min = parseInt(counttimer/60);
        timer.innerText=`${min}m ${sec}s`; 
    }, 1000);
}
startclock(); 

let derivedbox = document.getElementsByClassName("derivedbox");
let posx, posy, curx, cury;
boxarea.className=`glass2`;

setup();

function setup()
{
    console.log(colorno2);

    n1 = document.getElementById("options1").value;
    n2 = document.getElementById("options2").value;
    hrline.style.width= `calc(${n2}*100px)`;

    // let x = window.matchMedia("(max-width: 700px)");
    // if (x.matches) { // If media query matches
    //     document.body.style.backgroundColor = "yellow";
    //   } else {
    //     document.body.style.backgroundColor = "pink";
    //   }

    boxarea.style.cssText=` transition: all 1s ease 0s; width:calc(${n2}*70px); height:calc(${n1}*70px);margin-bottom:16px;font-size: 1.8rem;margin-top:20px; z-index: 2;`;

    if (colorno2==1) {
        boxarea.style.boxShadow=`10px 10px 20px 1px rgb(116, 114, 114),-10px -10px 20px 1px rgb(116, 114, 114)`;
    }

    let str ="";
    // console.log(n1);

    // window.boxes = new Array(n1);
    boxes = new Array(n1);

    for (let i = 0; i < n1; i++) {
        boxes[i]=new Array(n2);
        for(let j = 0; j< n2; j++)
        {
            {
                // console.log(i);
                if (i!=n1-1||j!=n2-1) 
                {
                    boxes[i][j]=i*n2+(j+1);
                    // console.log(boxes[i][j]);
                    str+=`<div style="display:flex; align-items:center; justify-content:center; position:absolute; top:calc(${i}*70px); left:calc(${j}*70px); height:65px; width:65px; transition: all 0.5s ease 0s" class="glass${colorno} derivedbox" >${boxes[i][j]}</div>`;
                }
                else
                {
                    str+=`<div class="glass${colorno} derivedbox" style="display:flex; align-items:center; justify-content:center; position:absolute; top:calc(${i}*70px); left:calc(${j}*70px); height:65px; width:65px; transition: all 0.5s ease 0s"> </div>`;
                }
            }
        }
    }
    boxarea.innerHTML=str;
    hrline.style.width= `calc(${n2}*100px)`;

    get_coordinates();
    shuffle();

    clearInterval(clock);
    startclock(); 
    // boxarea.addEventListener("loadeddata",startclock());

    matrixtype = n1*n2;
    highestsc = localStorage.getItem(`highestList${matrixtype}`);

    if (highestsc==null) {
        highestsc=-1;        
        highest.innerHTML=`NIL`;
    }
    else{
        let hsec = highestsc%60;
        let hmin = parseInt(highestsc/60);
        highest.innerHTML=`${hmin}m ${hsec}s`;
    }

    Array.from(derivedbox).forEach(element => {
        get_coordinates();
        // console.log("running click");
        element.addEventListener('click',function (){
            // console.log("hi");
            get_coordinates();
            cury = parseInt(element.offsetTop/70);
            curx = parseInt(element.offsetLeft/70);
            console.log("x is"+curx);
            console.log("y is"+cury);
            console.log("req x is"+posx);
            console.log("req y is"+posy);
            if (curx==posx||cury==posy) 
            {
                // console.log("time to shift");
                swap(posx,posy,curx,cury);
                countmoves++;
                moves.innerText=`${countmoves}`;
            }
            get_coordinates();
            let w = won();
            if (w==1) 
            {
                alert('CONGO! NAILED IT. Reset to play again');
                clearInterval(clock);
                let gottime =  counttimer;
                if (highestsc==-1) 
                {
                    highestsc = gottime;
                }
                else if(gottime<highestsc)
                {
                    highestsc = gottime;
                }
                localStorage.setItem(`highestList${matrixtype}`,highestsc);
                highest.innerHTML=`${highestsc}`;
                let hsec = highestsc%60;
                let hmin = parseInt(highestsc/60);
                highest.innerHTML=`${hmin}m ${hsec}s`;
            }
            });
    });
}


function get_coordinates()
{
    derivedbox = document.getElementsByClassName("derivedbox");
    // derivedarray = Array.from(derivedbox);
    for (let i = 0; i < n1; i++) {
        for(let j = 0; j< n2; j++)
        {
                boxes[i][j]=derivedbox[i*n2+(j)].innerText;
                // console.log("box no is" +boxes[i][j]); 
                // console.log("box numer is"+i*n2+(j+1));
                if (boxes[i][j].length==0) 
                {
                    // console.log("got it");
                    posx=j;
                    posy=i;   
                }
        }
    }
}





function swap(x1,y1,x2,y2) 
{
    if (y1==y2) 
    {
        if (x1<x2) {
            // let temp = x1;
            // x1=x2;
            // x2=temp;
            // console.log("x1--"+x1+"x2---"+x2);
            for(let i=x1;i<x2;i++)
            {
                let temp1 =  (derivedbox[y1*n2+i].innerText);
                let temp2 = (derivedbox[y1*n2+i+1].innerText);
                // console.log("---"+temp1+"--"+temp2);
                derivedbox[y1*n2+i].innerText=`${temp2}`;
                derivedbox[y1*n2+i+1].innerText=`${temp1}`;
            }    
        }
        else
        {
            for(let i=x1;i>x2;i--)
            {
                let temp1 =  (derivedbox[y1*n2+i].innerText);
                let temp2 = (derivedbox[y1*n2+i-1].innerText);
                // console.log("---"+temp1+"--"+temp2);
                derivedbox[y1*n2+i].innerText=`${temp2}`;
                derivedbox[y1*n2+i-1].innerText=`${temp1}`;
            }    

        }
    }
    else if (x1==x2) 
    {
        if (y1<y2) {
            // let temp = x1;
            // x1=x2;
            // x2=temp;
            // console.log("x1--"+x1+"x2---"+x2);
            for(let i=y1;i<y2;i++)
            {
                let temp1 =  (derivedbox[i*n2+x1].innerText);
                let temp2 = (derivedbox[(i+1)*n2+x1].innerText);
                // console.log("---"+temp1+"--"+temp2);
                derivedbox[i*n2+x1].innerText=`${temp2}`;
                derivedbox[(i+1)*n2+x1].innerText=`${temp1}`;
            }    
        }
        else
        {
            for(let i=y1;i>y2;i--)
            {
                let temp1 =  (derivedbox[i*n2+x1].innerText);
                let temp2 = (derivedbox[(i-1)*n2+x1].innerText);
                // console.log("---"+temp1+"--"+temp2);
                derivedbox[i*n2+x1].innerText=`${temp2}`;
                derivedbox[(i-1)*n2+x1].innerText=`${temp1}`;
            }    

        }
    }
    
}

function shuffle() 
{
    let r1,r2 ;
    for(let i = 0 ;i<1000;i++)
    {
        r1= Math.random()*(n1)+0;
        r2= Math.random()*(n2)+0;
        let num1 = parseInt(r1);
        let num2 = parseInt(r2);
        // console.log("--"+num1+"--"+num2);
        swap(posx,posy,num1,num2);
        get_coordinates();
    } 
    let w = won();
    if (w==1) 
    {
        shuffle();
    }
    // r1= Math.random()*(n1)+0;
    // r2= Math.random()*(n2)+0;
    // let num1 = parseInt(r1);
    // let num2 = parseInt(r2); 
    // console.log("--"+num1+"--"+num2);  
    // console.log("--"+posy+"--"+posx);  
    // console.log("shuffle called");
    
}

function won() 
{
    // console.log("runnig won");
    let flag = 1;
    for (let i = 0; i < n1; i++) 
    {
        for(let j = 0; j< n2; j++)
        {
            {
                if (i!=n1-1||j!=n2-1) 
                {
                    if (boxes[i][j]!=i*n2+(j+1)) 
                    {
                        flag=0;
                        return 0;
                    }
                }
            }
        }
    }
    if (flag==1) 
    {
        return 1;  
    }
}


reset.addEventListener("click",()=>{
    // console.log("runnung reset");
    setup();
    // console.log("req x is"+posx);
    // console.log("req y is"+posy);
    let countmoves = 0;
    moves.innerText=`${countmoves}`;
}
);

tbuttonarea.addEventListener("click",darkmodeact
);
tbutton.addEventListener("click",darkmodeact
);

function darkmodeact()
{
    
    let theCSSprop = window.getComputedStyle(tbuttonarea, null).getPropertyValue("background-color");
    // console.log("buttton clicked--"+theCSSprop);

    if (theCSSprop==`rgb(255, 255, 255)`) {
        console.log("hi");
        tbuttonarea.style.backgroundColor=`rgb(138, 247, 0)`;
        tbutton.style.transform=`translateX(26px)`;
        bgm.style.backgroundColor=`rgb(50, 50, 51)`;
        Array.from(glass2).forEach(element => {
            element.style.boxShadow=`10px 10px 20px 1px rgb(116, 114, 114),-10px -10px 20px 1px rgb(116, 114, 114)`;
        });
        options1.style.backgroundColor=`rgb(50, 50, 51)`;
        options2.style.backgroundColor=`rgb(50, 50, 51)`;
        monitor4.style.backgroundColor=`rgb(44, 43, 43)`;
        monitor4.style.color=`white`;
        howto.style.backgroundColor=`rgb(44, 43, 43)`;
        howto.style.color=`white`;
        colorno2=1;
    }
    else
    {
        tbuttonarea.style.backgroundColor=`rgb(255, 255, 255)`;
        tbutton.style.transform=`translateX(0px)`;
        bgm.style.backgroundColor=`rgb(0, 148, 228)`;
        Array.from(glass2).forEach(element => {
            element.style.boxShadow=`15px 15px 20px 1px rgb(54, 106, 251,0.8),-15px -15px 20px 1px rgb(54, 106, 251,0.8)`;
        });
        options1.style.backgroundColor=`rgb(81, 180, 233)`;
        options2.style.backgroundColor=`rgb(81, 180, 233)`;
        monitor4.style.backgroundColor=`white`;
        monitor4.style.color=`rgb(2, 140, 214)`;
        howto.style.backgroundColor=`white`;
        howto.style.color=`rgb(2, 140, 214)`;
        colorno2=2;
    }
}
// =================================================================
// TRASH CODES FOR TESTING PURPOSES

// Array.from(derivedbox).forEach(element => {
//     get_coordinates();
//     console.log("running click");
//     element.addEventListener('click',function (){
//         // console.log("hi");
//         get_coordinates();
//         cury = parseInt(element.offsetTop/70);
//         curx = parseInt(element.offsetLeft/70);
//         console.log("x is"+curx);
//         console.log("y is"+cury);
//         console.log("req x is"+posx);
//         console.log("req y is"+posy);
//         if (curx==posx||cury==posy) 
//         {
//             // console.log("time to shift");
//             swap(posx,posy,curx,cury);
//             countmoves++;
//             moves.innerText=`${countmoves}`;
//         }
//         get_coordinates();
//         let w = won();
//         if (w==1) 
//         {
//             alert('CONGO! NAILED IT. Reset to play again');
//             clearInterval(clock); 
//         }
//         });
// });


// console.log(boxes[0][2]); 
// function onright(row,col) 
// {
//     console.log("yes");
//     for(let j = col+1; j <= n2-1;j++)
//     {
//         if (boxes[row][j]==-1) 
//         {
//             return -1;    
//         }
//     }
//     return 0;
// }


// class box{
//     constructor(i,j){
//         this.x=i;
//         this.j=j;
//     }
// }

// for (let i = 0; i <= n+1; i++) {
//     for(let j = 0; j<= n+1; j++)
//     {
//         if (i==0||i==n-1||j==0||j==n-1) {
//             // box(i,j);
//         }
//         else
//         {
//             console.log(i);
//             // boxes[i][j]=n*(i-1)+j;
//             // console.log(boxes[i][j]);
//             str+=`<div class="glass">${boxes[i][j]}</div>`;
//         }
//     }
// }
