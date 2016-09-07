<?php include "header2.php" ?>
<div class="container" style="margin-top:30px;">
	<div class="features_items">
		<ol class="breadcrumb">
			<li>Home</li>
			<li>Contact us</li>
			<li class="active">Get in touch</li>
		</ol>
	</div>

</div>

<div class="get_touch_wrapper">
	<h2>Get in touch</h2>
	<div id="map" class="get_touch">
	<!-- <div style="width:100%;height:55%;background:#000;opacity:0.5;position:absolute;z-index:888;"></div>
	<div style="width:65%;height:27%;background:#000;opacity:0.5;position:absolute;top:55%;z-index:888;"></div>
	<div style="width:16%;height:27%;background:#000;opacity:0.5;position:absolute;top:55%;right:0;z-index:888;"></div>
	<div style="width:100%;height:18%;background:#000;opacity:0.5;position:absolute;top:82%;z-index:888;"></div> -->
		<!-- <canvas id="demo"></canvas> -->
		<!-- <img src="images/background-5.png"> -->	
		<div class="get_touch_inner_1 row contact_us">
			<div class="col-sm-4 col-md-4 contact_us_container" >
				<div  class="contact_us_inner_round"></div>
				<div class="contact_us_outer_round" >
					<img  src="images/icon-13-1.png">
				</div>
				<p>9 Devonshire Square London EC2M 4YF Great Britain  </p>
			</div>
			<div class="col-sm-4 col-md-4 contact_us_container" >
				<div class="contact_us_inner_round" ></div>
				<div class="contact_us_outer_round" >
					<img src="images/icon-14.png">
				</div>
				<p>From within the UK: 020 3586 1407</p>
				<p>From outside the UK: +44 20 3586 1407</p>
			</div>
			<div class="col-sm-4 col-md-4 contact_us_container">
				<div class="contact_us_inner_round" ></div>
				<div class="contact_us_outer_round" >
					<img src="images/icon-15.png">
				</div>
				<p>uk@lan-bridge.com</p>
			</div>
		</div>
		<div class="get_touch_inner_2 row contact_us">
			<div class="col-sm-4 col-md-4 contact_us_container" >
				<div  class="contact_us_inner_round"></div>
				<div class="contact_us_outer_round" >
					<img  src="images/icon-16.png">
				</div>
				<p><a target="_blank" href="skype:?call">Lan-bridge_UK</a></p>
			</div>
			<div class="col-sm-4 col-md-4 contact_us_container" >
				<div class="contact_us_inner_round" ></div>
				<div class="contact_us_outer_round" >
					<img src="images/icon-17.png">
				</div>
				<p>2355690977</p>
				<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2355690977&site=qq&menu=yes">
					<img id="qq_icon" src="images/icon-19.png">	
				</a>
				
			</div>
			<div  class="col-sm-4 col-md-4 contact_us_container contact_us_container_map"></div>
			<div  class="col-sm-4 col-md-4">
				<div class="contact_us_inner_round" ></div>
				<div class="contact_us_outer_round" >
					<img src="images/icon-18.png">
				</div>
			</div>
		</div>
	</div>
</div>
<div class="offices_locations">
	<p>We also have <span>9</span> offices in China-click <a href="chinese-offices.php">here</a> to see their locations</p>
</div>
<div class="next_container">
	<div class="row mod-next">
		<h2 class="title-large">Where next?</h2>
		<div class="col-md-8 col-md-offset-3">
			<div class="next_inner_container">
				<div>
					<span class="next-item">Get a quote</span>
				</div>
				<div>
					<span class="next-item">Contact us</span>
				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function(){
		$("#qq_icon").bind("click",function(){
		});
		// var demo=$(".leaflet-tile-container.leaflet-zoom-animated");
		// var appendNode="";
		// appendNode+="<canvas class='leaflet-tile leaflet-tile-loaded'"
		// +"height='200' width='200' style='left:0px;top:0px;background:#c03;'>";
		
		// console.log(appendNode);
		// demo.append(appendNode);
		// console.log(demo.length);
	});
</script>
<script src='https://api.mapbox.com/mapbox.js/v2.2.3/mapbox.js'></script>
<link href='https://api.mapbox.com/mapbox.js/v2.2.3/mapbox.css' rel='stylesheet' />
<script>
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxhbjE5OTM1NSIsImEiOiJjaWk1ZG84ZTMwMWlzdG9rZnF6OW14OGdhIn0.ctNICEo_76zb-1E-qZtciA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-0.0895, 51.5192], // starting position
    zoom: 14.5 // starting zoom
});

// // Add zoom and rotation controls to the map.
// map.addControl(new mapboxgl.Navigation());

// L.mapbox.accessToken = 'pk.eyJ1IjoiYWxhbjE5OTM1NSIsImEiOiJjaWk1ZG84ZTMwMWlzdG9rZnF6OW14OGdhIn0.ctNICEo_76zb-1E-qZtciA';
// var map = L.mapbox.map('map', 'mapbox.streets')
//     .setView([42.3619, -71.0606], 15);

// Since it's using the HTML5 Canvas API, it is not
// compatible with IE8 and below. See full documentation:
// https://www.mapbox.com/mapbox.js/api/v2.2.3/l-tilelayer-canvas/
var canvasTiles = L.tileLayer.canvas();

canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
	var ctx = canvas.getContext('2d');
      // ctx.fillText(tilePoint.toString(), 50, 50);
      // ctx.globalAlpha = 0.6;
      // ctx.fillStyle = '#000';
      // ctx.fillRect(15, 15, 200, 200);
};

canvasTiles.addTo(map);
</script>
<?php include "footer.php" ?>