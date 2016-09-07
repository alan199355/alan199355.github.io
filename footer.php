
<div class="footer">
	<div>
		<div id="goTop" style="display:none;position:fixed;"></div>    
	</div>
	<div class="container" id="footer_container">
		<div class="col-sm-2 footer-box" >
			<h2 class="title-medium">Service</h2>
			<p><a href="translation.php">Translation</a></p>
			<p><a href="interpretation.php">Interpretation</a></p>
			<!-- <p><a href="Branding-and-design.php">Branding and Design</a></p> -->
			<p><a href="value-added-services.php">Value added services</a></p>
		</div>
		<div class="col-sm-2 footer-box" >
			<h2 class="title-medium">About us</h2>
			<p><a href="about.php">About Lan-bridge</a></p>
			<p><a href="meet-the-team.php">Meet the team</a></p>
			<p><a href="blog-list.php">Blog</a></p>
			<p><a href="transverbum-partners.php">Transverbum Membership</a></p>
		</div>
		<div class="col-sm-2 footer-box" >
			<h2 class="title-medium">Contact us</h2>
			<p><a href="get-in-touch.php">Get in touch</a></p>
			<p><a href="chinese-offices.php">Chinese offices</a></p>
			<p><a href="working.php">Working with Lan-bridge</a></p>
			
		</div>
		<div class="col-sm-6 footer-box-address">
			<p>9 Devonshire Square, London, EC2M 4YF, UK</p>
			<p>Call us: 0044 (0) 20 3586 1407</p>			
			<div class="newsletter-form">
				<form class="form-inline">
					<div class="form-group">
						<input placeholder="Sign up to our newsletter" type="text" class="form-control"/>
					</div>
					<button type="submit" class="btn btn-default">submit</button>
				</form>
			</div>
			
			<div class="row mod-sns">
				<span class="col-xs-6">
					<img src="images/u133.png"/>
				</span>
				<span class="col-xs-6">
					<img src="images/u135.png"/>
				</span>
				<p><a target="view_window" href="privacy-policy.php">Privacy Policy & Terms of use</a></p>
			</div>
		</div>
		<div style="display:none;" class="col-sm-4 footer-box">
			<div class="row foot-mods">
				<div class="foot-mods-item">
					<div><span>Written translation</span></div>
				</div>
				<div class="foot-mods-item">
					<div><span>Spoken interpretation</span></div>
				</div>
				<div class="foot-mods-item">
					<div><span>Branding & design</span></div>
				</div>
				<div class="foot-mods-item">
					<div><span>Consulting and business services</span></div>
				</div>
			</div>
		</div>
		<div class="col-xs-12">
			<p>©  Lan-bridge Communications Ltd Registered in England and Wales, No. 08296284</p>
		</div>
	</div>
</div>
<script type="text/javascript">
	$("document").ready(function(){
		$(".nav li a").bind("mouseenter",function(){
			var chil=$(this).children("i");
			if(chil.length==1){
				chil.removeClass("fa-chevron-down").addClass("fa-chevron-up");	
			}						
		});
		$(".nav li a").bind("mouseleave",function(){
			var chil=$(this).children("i");
			if(chil.length==1){
				chil.removeClass("fa-chevron-up").addClass("fa-chevron-down");	
			}						
		});
		$("#goTop").bind("click",function(){
			$("html,body").animate({scrollTop:"0px"},800);
		});
	});
	$(window).scroll(function(){
	var scroll_top=document.body.scrollTop || document.documentElement.scrollTop;
	// console.log(scroll_top);
	if(scroll_top>100){
		$("#goTop").css("display","");
	}else{
		$("#goTop").css("display","none");
	}
	
});
</script>
	<script type="text/javascript" src="public/javascript/bootstrap.js"></script>
	<!--[if lte IE 6]>
  	<script type="text/javascript" src="public/javascript/bootstrap-ie.js"></script>
  	<![endif]-->
</body>

</html>