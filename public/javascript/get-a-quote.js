$("document").ready(function(){
		var quote;
		var url=location.search;
		if(url.indexOf("?") != -1){
			quote=url.substring(1);
		}else{
			quote="translation_quote";
		}
		var form=quote.split("_")[0]+"_form";
		console.log(form);
		console.log(quote);
		$("#quote_tab .focused").removeClass("focused");
		$("#"+quote).addClass("focused");
		$("#"+form).addClass("active");

		$("#captcha_img").bind("click",function(){
		this.src="./captcha.php?r="+Math.random();
		});
		$("#interpretation_captcha_img,#tranalation_captcha_img").bind("click",function(){
			this.src="./captcha.php?r="+Math.random();
		});
		$("#quote_tab .btn").click(function(e){
			e.preventDefault();
			$(this).tab('show');
			$(".focused").removeClass("focused");
			$(this).addClass("focused");
		});
		$("#translation_next").bind("click",function(){
			var form=$("#translation_form .require_info").validate();
			if(form.form()){
				$("#translation_form .require_info").animate({
					right:"-100px",
					opacity:"0",
				},"slow",function(){
					$("#translation_form .require_info").css("display","none");
				});
				$("#translation_form .personal_info").show(2500);	
			}
	
			return false;
		});
		$("#translation_submit").bind("click",function(){	
			var form_name=$("#translation_name").val();
			var form_company=$("#translation_company").val();
			var form_email=$("#translation_email").val();
			var form_phone=$("#translation_phone").val();
			var form_country=$("#translation_country").val();
			var form_source_language=$("#translation_source").val();
			var form_target_language=$("#translation_target").val();
			var form_deadline=$("#translation_deadline").val();
			form_deadline=form_deadline.split("T").join(" ");
			var form_file=$("#translation_file").val();
			var form_others=$("#translation_others").val();
			var form_authcode=$("#translation_authcode").val();
			var request={
				"name":form_name,
				"company":form_company,
				"email":form_email,
				"phone":form_phone,
				"country":form_country,
				"target_language":form_target_language,
				"source_language":form_source_language,
				"deadline":form_deadline,
				"file":form_file,
				"others":form_others,
				"authcode":form_authcode
			};
			var form=$("#translation_form .personal_info").validate();
			if(form.form()){
				$.ajax({
					url:"/phpmailer/email.php",
					type:"POST",
					data:request,			
					success:function(data){
						console.log("success");
						var newData= data.replace(/\r\n/g,'');
						console.log(newData);
						if(newData=="authcode error"){
							alert("验证码错误");
						}else if(newData=="email sent"){
							alert("邮件已发送");
							location.reload();
						}				
					},
					error:function(data,xhr,error,exception,XMLHttpRequest){
						console.log(data);

						console.log(error.toString()+"  "+exception);
						console.log(XMLHttpRequest);
					}
				});
			} else {
				console.log("格式错误");
			}
			return false;
		});
		$("#translation_form .require_info").validate({
			rules:{
				translation_target:{
					required:true
				},
				translation_source:{
					required:true
				},
				translation_deadline:{
					required:true
				},
				translation_file:{
					required:true
				},
				translation_others:{
					required:true
				},
			}
		})
		$("#translation_form .personal_info").validate({
			rules:{
				translation_name:{
					required:true				
				},
				translation_company:{
					required:true
				},
				translation_email:{
					required:true,
					email:true
				},
				translation_phone:{
					required:true
				},
				translation_country:{
					required:true
				},
				translation_authcode:{
					required:true
				}
			},
			messages:{
				
			}
		});
		$("#interpretation_next").bind("click",function(){
			var form=$("#interpretation_form .require_info").validate();
			if(form.form()){
				$("#interpretation_form .require_info").animate({
					right:"-100px",
					opacity:"0",
				},"slow",function(){
					$("#interpretation_form .require_info").css("display","none");
				});
				$("#interpretation_form .personal_info").show(2500);	
			}
	
			return false;
		});
		$("#interpretation_submit").bind("click",function(){
			var form_name=$("#interpretation_name").val();
			var form_company=$("#interpretation_company").val();
			var form_email=$("#interpretation_email").val();
			var form_phone=$("#interpretation_phone").val();
			var form_country=$("#interpretation_country").val();
			var form_source_language=$("#interpretation_source").val();
			var form_target_language=$("#interpretation_target").val();
			var form_deadline=$("#interpretation_deadline").val();
			form_deadline=form_deadline.split("T").join(" ");
			var form_file=$("#interpretation_file").val();
			var form_others=$("#interpretation_others").val();
			var form_authcode=$("#interpretation_authcode").val();
			var request={
				"name":form_name,
				"company":form_company,
				"email":form_email,
				"phone":form_phone,
				"country":form_country,
				"target_language":form_target_language,
				"source_language":form_source_language,
				"deadline":form_deadline,
				"file":form_file,
				"others":form_others,
				"authcode":form_authcode
			};
			var form=$("#interpretation_form .personal_info").validate();
			if(form.form()){
				$.ajax({
					url:"/phpmailer/email.php",
					type:"POST",
					data:request,			
					success:function(data){
						console.log("success");
						var newData= data.replace(/\r\n/g,'');
						console.log(newData);
						if(newData=="authcode error"){
							alert("验证码错误");
						}else if(newData=="email sent"){
							alert("邮件已发送");
							location.reload();
						}				
					},
					error:function(data,xhr,error,exception,XMLHttpRequest){
						console.log(data);
						console.log(error.toString()+"  "+exception);
						console.log(XMLHttpRequest);
					}
				});
			} else {
				console.log("格式错误");
			}
			return false;
		});
		
		$("#interpretation_form .require_info").validate({
			rules:{
				interpretation_target:{
					required:true
				},
				interpretation_source:{
					required:true
				},
				interpretation_deadline:{
					required:true
				},
				interpretation_file:{
					required:true
				},
				interpretation_others:{
					required:true
				},
			}
		})
		$("#interpretation_form .personal_info").validate({
			rules:{
				interpretation_name:{
					required:true				
				},
				interpretation_company:{
					required:true
				},
				interpretation_email:{
					required:true,
					email:true
				},
				interpretation_phone:{
					required:true
				},
				interpretation_country:{
					required:true
				},
				interpretation_authcode:{
					required:true
				}
			},
			messages:{
				
			}
		});

	});