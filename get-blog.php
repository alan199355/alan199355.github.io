<?php
header("content-type:text/html;charset=utf-8");
	$con=mysqli_connect("localhost","root","090152");
	if(!$con){
		die("Could not connect".mysqli_error($con));
	}else{
		echo "success";
	}
	$select_db=mysqli_select_db($con,"wordpress");
	if(!$select_db){
		die("Can not use ".mysqli_error($con));
	}
	mysqli_query($con,"set names 'utf8'");
	$res=mysqli_query($con,"select * from wp_posts where id=12");
	$arr=array();
	while($row = mysqli_fetch_array($res))
  	{
  		echo $row['post_date'] . "<br /> " . $row['post_content'];
  		$arr[]=$row['post_date'];
  		echo "<br />";

  	}
  	$num=mysqli_query($con,"select count(*) from wp_posts");
  	$rows=mysqli_fetch_array($num);
  	echo $rows[0];
  	
  	echo $arr[0];
  	mysqli_close($con);
 //  	
  		$arr=array("ye","qiang");
  		
  		print_r($arr);
?>




<?php
		header("content-type:text/html;charset=utf-8");
		$con=mysqli_connect("localhost","root","090152");
		if(!$con){
			// die("Could not connect".mysqli_error($con));
		}else{
			// echo "success<br />";
		}
		$select_db=mysqli_select_db($con,"wordpress");
		if(!$select_db){
			// die("Can not use ".mysqli_error($con));
		}
		mysqli_query($con,"set names 'utf8'");
		$res=mysqli_query($con,"select * from te80c_content where id=2");
		$arr=array();
		while($row = mysqli_fetch_array($res))
	  	{
	  		// echo $row['title'] . "<br /> " . $row['introtext'];
	  		// $arr[]=$row['created'];
	  		// echo "<br />";

	  	}
	?>
	insert into wp_posts(post_date,post_title,post_content) select created,title,introtext from te80c_content
	update wp_posts set post_author=1 where id>8
	function digui(from,to){
				var appendNode="";				
				appendNode+="<li class='page-item'><span class='pagenav'>"+from+"</span></li>";
				if(from>to){
					return "";
				}else{
					return appendNode+digui(from+1,to);
				}
			}