
<?php
/**
* by www.phpddt.com
*/
header("content-type:text/html;charset=utf-8");
ini_set("magic_quotes_runtime",0);
require 'class.phpmailer.php';
$na=$_POST['name'];
$company=$_POST['company'];
$email=$_POST['email'];
$phone=$_POST['phone'];
$country=$_POST['country'];
$target_language=$_POST['target_language'];
$source_language=$_POST['source_language'];
$deadline=$_POST['deadline'];
$file=$_POST['file'];
$others=$_POST['others'];
$authcode=$_POST['authcode'];
if(isset($authcode)){
	ob_start();
	@session_start();
	if(strtolower($_POST['authcode'])==$_SESSION['authcode']){
			try {	
		$mail = new PHPMailer(true); 
		$mail->IsSMTP();
		$mail->CharSet='UTF-8'; //设置邮件的字符编码，这很重要，不然中文乱码
		$mail->SMTPAuth   = true;                  //开启认证
		$mail->Port       = 25;                    
		$mail->Host       = "smtp.163.com"; 
		$mail->Username   = "18200283200@163.com";    
		$mail->Password   = "alan199355";            
		//$mail->IsSendmail(); //如果没有sendmail组件就注释掉，否则出现“Could  not execute: /var/qmail/bin/sendmail ”的错误提示
		$mail->AddReplyTo("18200283200@163.com","mckee");//回复地址
		$mail->From       = "18200283200@163.com";
		$mail->FromName   = "YeQiang";
		$to = "2271088240@qq.com";
		$mail->AddAddress($to);
		$mail->Subject  = "phpmailer测试标题";
		$mail->Body ="Name:<font color=red>".$na."</font><br/>"
		."Company:<font color=red>".$company."</font><br/>"
		."Email:<font color=red>".$email."</font><br/>"
		."Phone:<font color=red>".$phone."</font><br/>"
		."Country:<font color=red>".$country."</font><br/>"
		."Source language:<font color=red>".$source_language."</font><br/>"
		."Target language:<font color=red>".$target_language."</font><br/>"
		."Deadline:<font color=red>".$deadline."</font><br/>"
		."File:<font color=red>".$file."</font><br/>"
		."Others:<font color=red>".$others."</font><br/>";
		$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; //当邮件不支持html时备用显示，可以省略
		$mail->WordWrap   = 80; // 设置每行字符串的长度
		//$mail->AddAttachment("f:/test.png");  //可以添加附件
		$mail->IsHTML(true); 
		$mail->Send();
		echo "验证码正确";
		echo '邮件已发送';
		} catch (phpmailerException $e) {
			echo "邮件发送失败：".$e->errorMessage();
		}
	}else{
		echo "验证码错误";
		
	}
	
}else{
	echo "fail";
}

?>