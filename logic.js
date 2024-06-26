const displayPss = document.querySelector("[data-input-Password]");
const lengthDisplay = document.querySelector("[data-password-Length]");
const inputSlider = document.querySelector("[data-input-Slider]");
const upperCheck = document.querySelector("[data-Uppercase-check]");
const lowerCheck = document.querySelector("[data-Lowercase-check]");
const numberCheck = document.querySelector("[data-Numbers-check]");
const symbolCheck = document.querySelector("[data-Symbols-check]");
const indicator = document.querySelector("[data-strength-Indicator]");
const generatePss = document.querySelector(".generateButton");
const checkbox = document.querySelectorAll("input[type = 'checkbox'")
const symbols = "!@#$%^&*(){}<>"

const copyBtn = document.querySelector(".copy-btn");
const copyMsg = document.querySelector(".tooltip");

let password = "";
let checkCount = 0;
let passwordLength = 10;
handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
}
inputSlider.addEventListener("input", (sliderValue)=>{
    passwordLength = sliderValue.target.value;    
    handleSlider();
    
});

function generateRndInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
// 0 -> Inclusive 9 -> Exclusive
function generateRandomNum(){
    return generateRndInt(0,9)
}
// Range of Characters
// a-97 z-122 A-65 Z-90
function generateLowerCase(){
    return String.fromCharCode(generateRndInt(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(generateRndInt(65,91));
}
function generateSymbols(){
    let randomIndex = generateRndInt(0,symbols.length);
    return symbols.charAt(randomIndex);
}

function calculateCheckCount(){
    checkCount = 0;
    for (let i = 0; i < checkbox.length; i++) {
        if(checkbox[i].checked) checkCount++;   
    }

    // Special Condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
checkbox.forEach(Element => {
    Element.addEventListener("change",calculateCheckCount)
});

async function copyContent(){
    try {
        await navigator.clipboard.writeText(displayPss.value);
        copyMsg.innerText = "copied"
    } catch (error) {
        copyMsg.innerText = "failed"
    }

    // to make copy span visible
    copyMsg.classList.add('active');
    console.table("Active Class");
    setTimeout(() => {
        copyMsg.classList.remove("active");

    }, 2000);
}

copyBtn.addEventListener("click", ()=>{
    if(displayPss.value){
        copyContent();
    }
})

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp
    }

    let str = "";
    array.forEach((Element) => (str += Element));
    return str;
}

generatePss.addEventListener('click', ()=>{

    // No Checkbox selected 
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    const arrOfFunc = [];

    if(upperCheck.checked)
        arrOfFunc.push(generateUpperCase);
    if(lowerCheck.checked)
        arrOfFunc.push(generateLowerCase);
    if(numberCheck.checked)
        arrOfFunc.push(generateRandomNum);
    if(symbolCheck.checked)
        arrOfFunc.push(generateSymbols);

    // COMPULSORY ADDITION
    for(let i=0; i<arrOfFunc.length; i++){
        password += arrOfFunc[i]();
    }

    //FOR REMAINING PASSWORD  
    for (let i = 0; i <passwordLength-arrOfFunc.length; i++) {
        let randomIndex = generateRndInt(0,arrOfFunc.length);
        password += arrOfFunc[randomIndex]();
    }

    password = shufflePassword(Array.from(password))
    displayPss.value = password;

    calcStrength();
})

function calcStrength(){
    if(passwordLength >= 10){
        if(checkCount >= 3)
            indicator.style.backgroundColor = '#00FF00';

        else if(checkCount == 2){
            if(passwordLength > 15)
                indicator.style.backgroundColor = '#00FF00';
            else
                indicator.style.backgroundColor = '#FFFF00';
        }
        else{
            if(passwordLength > 15)
                indicator.style.backgroundColor = '#FFFF00';
            else
                indicator.style.backgroundColor = '#FF0000';
        }
    }
    else if(passwordLength > 6 && passwordLength < 10){
        if(checkCount == 4)
            indicator.style.backgroundColor = '#00FF00';
        else if(checkCount == 3)
            indicator.style.backgroundColor = '#FFFF00';
        else
            indicator.style.backgroundColor = '#FF0000';
    }
    else{
        indicator.style.backgroundColor = '#FF0000';
    }

}

