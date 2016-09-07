<?php include "header2.php" ?>
<div style="margin-top:30px;" class="container">
<div class="features_items">
		<ol class="breadcrumb">
			<li>Home</li>
			<li>Contact us</li>
			<li class="active">Chinese offices</li>
		</ol>
</div>
	<h1 class="title-large">Chinese offices	</h1>
	<div class="container">
		<ol id="chinese-offices-img-list">
			<li>
				<img class="show_img" src="images/banner-29.png">	
				<img class="hide_img" src="images/banner-29-1.png">
				<div class="hide_img">
					<h2>Beijing</h2>
					<p>Email:bj@lan-bridge.com</p>
					<p>Phone:010-62962566762962989</p>
					<p class="chinese-offices-address">
					Address:room A204,Shangdi Xinxi Road,Haidian District,Beijing Zhonguancun 
					Haus,12</p>
					<p>Zip code:10085</p>
				</div>			
			</li>
			<li>
				<img class="show_img" src="images/banner-30.png">	
				<img class="hide_img" src="images/banner-30-1.png">
				<div class="hide_img">
					<h2>Shanghai</h2>
					<p>Email:sh@lan-bridge.com</p>
					<p>Phone:021-68877803/68877805</p>
					<p class="chinese-offices-address">Address:World Plaza,NO.855 Pudong South Road,Pudong,Shanghai,G/F block 28</p>
					<p>Zip code:200120</p>
				</div>			
			</li>
			<li>
				<img class="show_img" src="images/banner-31.png">	
				<img class="hide_img" src="images/banner-31-1.png">	
				<div class="hide_img">
					<h2>Guangzhou</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
			<li>
				<img class="show_img" src="images/banner-32.png">
				<img class="hide_img" src="images/banner-32-1.png">
				<div class="hide_img">
					<h2>Chengdu</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
			<li>
				<img class="show_img" src="images/banner-33.png">			
				<img class="hide_img" src="images/banner-33-1.png">
				<div class="hide_img">
					<h2>Chongqing</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
			<li>
				<img class="show_img" src="images/banner-34.png">
				<img class="hide_img" src="images/banner-34-1.png">
				<div class="hide_img">
					<h2>Kunming</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
			<li>
				<img class="show_img" src="images/banner-35.png">
				<img class="hide_img" src="images/banner-35-1.png">
				<div class="hide_img">
					<h2>Zhengzhou</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
			<li>
				<img class="show_img" src="images/banner-36.png">
				<img class="hide_img" src="images/banner-36-1.png">
				<div class="hide_img">
					<h2>Xi'an</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
			<li>
				<img class="show_img" src="images/banner-37.png">
				<img class="hide_img" src="images/banner-37-1.png">
				<div class="hide_img">
					<h2>Wuhan</h2>
					<p>Email:cd@lan-bridge.com</p>
					<p>Phone:028-87675896/87681551</p>
					<p class="chinese-offices-address">27th Floor,Gulou International,Daqiang West Street,Chengdu,Sichuan</p>
					<p>Zip code:610015</p>
				</div>
			</li>
		</ol>
	</div>
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
	$("document").ready(function(){
		$("#chinese-offices-img-list li").mouseenter(function(){
			var img1=$(this).find(".show_img");
			var img2=$(this).find(".hide_img")			
			img1.hide();
			img2.show();			
		});
		$("#chinese-offices-img-list li").mouseleave(function(){
			var img1=$(this).find(".show_img");
			var img2=$(this).find(".hide_img");
			img1.show();
			img2.hide();
		})
	});
</script>
<?php include "footer.php" ?>