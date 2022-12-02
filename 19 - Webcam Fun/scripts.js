const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){
    // prompts the user to use media input which produces a MediaStream which requreted types of media(basically tries to capture the video )
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then((localMediaStream) => {
        console.log(localMediaStream);
        
        // sets the object which serves as the source of the media associated with HTMLMediaElement (and then put into the video element).
        video.srcObject = localMediaStream;
        video.play();
    })

    .catch((err) =>{
        console.log('OH NO!!!', err);
    })
}


// It will capture a frame from the video and put in the canvas
function paintToCanvas(){
   const width = video.videoWidth;        // take the width of the video
   const height = video.videoHeight;      // take the height of the video

   canvas.width = width;                  // width of the canvas == width of the video
   canvas.height = height;                // height of the canvas == height of the video


   return setInterval(() =>{
     ctx.drawImage(video, 0, 0, width, height);
     
     // Take the pixels out
     let pixels = ctx.getImageData(0, 0, width, height);  

     // Mess with them
    //  pixels = redEffect(pixels);
     pixels = rgbSplit(pixels);

     // it will keep the previous frames a bit long which create a ghost like effect.
     ctx.globalAlpha = 0.1;   

     // Put them back
     ctx.putImageData(pixels, 0, 0);
   }, 16);
}


// play the sound of the video on the canvas
function takePhoto(){
    snap.currentTime = 0;               // currentTime will return the current Position of the audio/video playback.
    snap.play();

    
    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');

    // create a anchor link and attach the image data to it.
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');

    // After creating the link, I have inserted image inside the link.
    link.innerHTML = `<img src="${data}" alt="handsome" >`;

    // insertBefore => inserts a child node(link) before an existing node(strip.firstChild).
    strip.insertBefore(link, strip.firstChild);  
}


function redEffect(pixels){
   for(let i=0; i<pixels.data.length; i+=4){
    pixels.data[i + 0] = pixels.data[i + 0] + 100;        // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50;        // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;        // BLUE
   }

   return pixels;
}


function rgbSplit(pixels){
    for(let i=0; i<pixels.data.length; i+=4){
     pixels.data[i - 150] = pixels.data[i + 0] ;        // RED
     pixels.data[i + 100] = pixels.data[i + 1] ;        // GREEN
     pixels.data[i - 150] = pixels.data[i + 2] ;        // BLUE
    }
 
    return pixels;
 }


getVideo();


// when the video starts playing, it will then run paintToCanvas()
video.addEventListener('canplay', paintToCanvas);  