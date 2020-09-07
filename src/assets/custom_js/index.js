/*
* (C) Copyright 2014 Kurento (http://kurento.org/)
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Lesser General Public License
* (LGPL) version 2.1 which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/lgpl-2.1.html
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
*/

/* eslint-disable */

function getopts(args, opts)
{
  var result = opts.default || {};
  args.replace(
      new RegExp("([^?=&]+)(=([^&]*))?", "g"),
      function($0, $1, $2, $3) { result[$1] = $3; });

  return result;
};


var args1 = getopts(location.search,
{
  default:
  {
    ws_uri: 'ws://' + location.hostname + ':8888/kurento',
    ice_servers: undefined
  }
});

var args2 = getopts(location.search,
  {
    default:
    {
      ws_uri: 'ws://' + location.hostname + ':8888/kurento',
      ice_servers: undefined
    }
  });

window.addEventListener('load', function(){
  // console = new Console('console', console);
  console1 = new Console('console1', console);
  console2= new Console('console2', console);
  var videoOutput1 = document.getElementById('videoOutput1');
  var videoOutput2 = document.getElementById('videoOutput2');
  var address1 = document.getElementById('address1');
  var address2 = document.getElementById('address2');
  address1.value = 'rtsp://192.168.10.102:8554/ds-test';
  address2.value = 'rtsp://user1:Wkit3031@192.168.30.12:554/profile2/media.smp';
  var pipeline1;
  var pipeline2;
  var webRtcPeer1;
  var webRtcPeer2;

  startButton1 = document.getElementById('start1');
  // startButton1.addEventListener('click', start1);
  startButton1.addEventListener('click', start1);
  stopButton1 = document.getElementById('stop1');
  stopButton1.addEventListener('click', stop1);

  startButton2 = document.getElementById('start2');
  startButton2.addEventListener('click', start2);
  stopButton2 = document.getElementById('stop2');
  stopButton2.addEventListener('click', stop2);

  function start1() {
  	if(!address1.value){
  	  window.alert("You must set the video source URL first");
  	  return;
  	}
    address1.disabled = true;

    showSpinner(videoOutput1);
    var options1 = {
      remoteVideo : videoOutput1
    };

    webRtcPeer1 = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options1,
      function(error){
        if(error){
          return console1.error(error);
        }
        webRtcPeer1.generateOffer(onOffer1);
        webRtcPeer1.peerConnection.addEventListener('iceconnectionstatechange', function(event){
          if(webRtcPeer1 && webRtcPeer1.peerConnection){
            console1.log("oniceconnectionstatechange -> " + webRtcPeer1.peerConnection.iceConnectionState);
            console1.log('icegatheringstate -> ' + webRtcPeer1.peerConnection.iceGatheringState);
          }
        });
    });
  }

  function start2() {
    if(!address2.value){
  	  window.alert("You must set the video source URL first");
  	  return;
  	}
    address2.disabled = true;

  	showSpinner(videoOutput2);
    var options2 = {
      remoteVideo : videoOutput2
    };

    webRtcPeer2 = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options2,
      function(error){
        if(error){
          return console2.error(error);
        }
        webRtcPeer2.generateOffer(onOffer2);
        webRtcPeer2.peerConnection.addEventListener('iceconnectionstatechange', function(event){
          if(webRtcPeer2 && webRtcPeer2.peerConnection){
            console2.log("oniceconnectionstatechange -> " + webRtcPeer2.peerConnection.iceConnectionState);
            console2.log('icegatheringstate -> ' + webRtcPeer2.peerConnection.iceGatheringState);
          }
        });
    });
  }

  function onOffer1(error, sdpOffer){
    if(error) return onError(error);

  	kurentoClient(args1.ws_uri, function(error, kurentoClient) {
  		if(error) return onError(error);

  		kurentoClient.create("MediaPipeline", function(error, p) {
  			if(error) return onError(error);

  			pipeline1 = p;

  			pipeline1.create("PlayerEndpoint", {uri: address1.value}, function(error, player){
  			  if(error) return onError(error);

  			  pipeline1.create("WebRtcEndpoint", function(error, webRtcEndpoint){
  				if(error) return onError(error);

          setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer1, onError);

  				webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer){
  					if(error) return onError(error);

            webRtcEndpoint.gatherCandidates(onError);

  					webRtcPeer1.processAnswer(sdpAnswer);
  				});

  				player.connect(webRtcEndpoint, function(error){
  					if(error) return onError(error);

  					console1.log("PlayerEndpoint-->WebRtcEndpoint connection established");

  					player.play(function(error){
  					  if(error) return onError(error);

  					  console1.log("Player1 playing ...");
  					});
  				});
  			});
  			});
  		});
  	});
  }

  function onOffer2(error, sdpOffer){
    if(error) return onError(error);

  	kurentoClient(args2.ws_uri, function(error, kurentoClient) {
  		if(error) return onError(error);

  		kurentoClient.create("MediaPipeline", function(error, p) {
  			if(error) return onError(error);

  			pipeline2 = p;

  			pipeline2.create("PlayerEndpoint", {uri: address2.value}, function(error, player){
  			  if(error) return onError(error);

  			  pipeline2.create("WebRtcEndpoint", function(error, webRtcEndpoint){
  				if(error) return onError(error);

          setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer2, onError);

  				webRtcEndpoint.processOffer(sdpOffer, function(error, sdpAnswer){
  					if(error) return onError(error);

            webRtcEndpoint.gatherCandidates(onError);

  					webRtcPeer2.processAnswer(sdpAnswer);
  				});

  				player.connect(webRtcEndpoint, function(error){
  					if(error) return onError(error);

  					console2.log("PlayerEndpoint-->WebRtcEndpoint connection established");

  					player.play(function(error){
  					  if(error) return onError(error);

  					  console2.log("2 playing ...");
  					});
  				});
  			});
  			});
  		});
  	});
  }

  function stop1() {
    address1.disabled = false;
    if (webRtcPeer1) {
      webRtcPeer1.dispose();
      webRtcPeer1 = null;
    }
    if(pipeline1){
      pipeline1.release();
      pipeline1 = null;
    }
    hideSpinner(videoOutput1);
  }

  function stop2() {
    address2.disabled = false;
    if (webRtcPeer2) {
      webRtcPeer2.dispose();
      webRtcPeer2 = null;
    }
    if(pipeline2){
      pipeline2.release();
      pipeline2 = null;
    }
    hideSpinner(videoOutput2);
  }

});

function setIceCandidateCallbacks(webRtcEndpoint, webRtcPeer, onError){
  webRtcPeer.on('icecandidate', function(candidate){
    console.log("Local icecandidate " + JSON.stringify(candidate));

    candidate = kurentoClient.register.complexTypes.IceCandidate(candidate);

    webRtcEndpoint.addIceCandidate(candidate, onError);

  });
  webRtcEndpoint.on('OnIceCandidate', function(event){
    var candidate = event.candidate;

    console.log("Remote icecandidate " + JSON.stringify(candidate));

    webRtcPeer.addIceCandidate(candidate, onError);
  });
}

function onError(error) {
  if(error)
  {
    console.error(error);
    stop();
  }
}

function showSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].poster = 'img/transparent-1px.png';
		arguments[i].style.background = "center transparent url('img/spinner.gif') no-repeat";
	}
}

function hideSpinner() {
	for (var i = 0; i < arguments.length; i++) {
		arguments[i].src = '';
		arguments[i].poster = 'img/webrtc.png';
		arguments[i].style.background = '';
	}
}

/**
 * Lightbox utility (to display media pipeline image in a modal dialog)
 */
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
	event.preventDefault();
	$(this).ekkoLightbox();
});
