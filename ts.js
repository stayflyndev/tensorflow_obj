const video = document.getElementById('web-cam')
const live = document.getElementById('live-video')
const demosSection = document.getElementById('demos');
const turnOnCamera = document.getElementById('cam-button')
var model = undefined;

const loadModel = (loadedModel) => {
    model = loadedModel
    demosSection.classList.remove('invisible');
 
}
cocoSsd.load()
.then(loadModel)



//Is the browser Supported?
const isMediaSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

//Enable Stream
const enableStreamCam = (e) => {
    console.log("test")
    if (!model) {return}
     //hide the cam button after being clicked       
    
    e.target.classList.add('removed')

//Webcam Stream setup
const streamCam = stream => {
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam);
}
const constraints = {
    video: true
}

//Activate stream.
navigator.mediaDevices.getUserMedia(constraints)
.then(streamCam);


}


//Activate Camera with camera button
if (isMediaSupported()) {
    turnOnCamera.addEventListener('click', enableStreamCam)
} else {
    console.log("Browser Not supported!")
}





const children = []
    //MODELS
const predictWebcam = () => {

// Pretend model has loaded so we can try out the webcam code.

model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      live.removeChild(children[i]);
    }
    children.splice(0);
    
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        live.appendChild(highlighter);
        live.appendChild(p);
        children.push(highlighter);
        children.push(p);
      }
    }
    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });


}