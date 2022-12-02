// Getting all the elements

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');


// Build Out Functions

function togglePlay(){   // paused is the property of the video and there is no property for play.
    if(video.paused){    // If the video is paused and then on calling this function will start playing the video.
        video.play();
    }
    else{                // And then while the video is running, if we call this function again then it will pause the video.
        video.pause();
    }
}

function updateButton(){
       let icon = this.paused ? '►': '||';  // we can use 'this' because it is bound by video.
       console.log(icon);
       toggle.innerHTML = icon;
}

function skip(){                   
    video.currentTime += parseFloat(this.dataset.skip);   // this.dataset will give the value of data-* attribute
}

function handleRangeUpdate(){
    video[this.name] = this.value;
}

function handleProgress(){
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){     // e.offsetX  => position where it is clicked, progress.offsetWidth => will give total width of progressBar
   const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
   video.currentTime = scrubTime;
}
// Hook up the event Listener

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range=>range.addEventListener('change', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);