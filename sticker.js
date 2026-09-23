const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const ColorPicker = document.getElementById("ColorPicker");
const brushSize = document.getElementById("brushSize");
const eraserbutton = document.getElementById("ERASER");
const clearbutton = document.getElementById("CLEAR");
const stickerbutton = document.getElementById("stickerbutton");
const downloadbutton = document.getElementById("downloadbutton");

let drawing = false;
let erasing = false;

ctx.linecap = "round";
ctx.linejoin = "round";

function getPosition(event){
    const rect =canvas.getBoundingClientRect();
    return{
        x:(event.clientX - rect.left) * (canvas.width / rect.width),
        y:(event.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startdrawing(event){
    drawing = true;
    const position = getPosition(event);
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
}

function draw(event){
    if(!drawing) return;

    const position = getPosition(event);
    ctx.lineWidth = brushSize.value;
    if(erasing){
        ctx.globalCompositeOperation ="destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = ColorPicker.value;
    }
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
}

function stopDrawing(){
    drawing = false;
    ctx.closePath();
}

canvas.addEventListener("pointerdown", startdrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);

eraserbutton.addEventListener("click",() =>{
    erasing = !erasing;

    if (erasing) {
        eraserbutton.textContent ="DRAWING MODE";
    } else {
        eraserbutton.textContent ="ERASER";
    }
});

clearbutton.addEventListener("click",()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
});

stickerbutton.addEventListener("click", () =>{
    const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );
    const data = imageData.data;
    for(let i=0; i < data.length; i += 4){
        if(data[i] > 245 &&
            data[i+1] > 245 &&
            data[i+2] > 245) {
                data[i+3] = 0;
            }

    }
    ctx.putImageData(imageData, 0, 0);
    alert("Your sticker is ready!!!");
})

downloadbutton.addEventListener("click",() => {
    const link = document.createElement("a");
    link.download = "STICKER.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});