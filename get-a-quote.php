
<?php include "header2.php" ?>

<div class="container" style="margin-top:60px;">
	<div class="container get_quote_wrapper">
		<!-- <h2>• GET A QUOTE •  </h2> -->
		<p>The easiest way to request a quote is to fill in our quick quot form and we'll get back to you as soon as we can with an accurate cost estimate.</p>
		<p>Alternatively,if you prefer,you can email us at<i>uk@lan-bridge.com</i>or call on<i>020 3586 1407</i></p>
		<div class="quote_inner">
			<ul class="nav nav-tabs" id="quote_tab">
				<button data-toggle="tab" href="#translation_form" class="btn btn-default focused" id="translation_quote">Translation quote</button>
				<button data-toggle="tab" href="#interpretation_form" class="btn btn-default" id="interpretation_quote" >Interpretation quote</button>
				<button data-toggle="tab" href="#guidance_form" class="btn btn-default" id="guidance_quote">Guidance</button>				
			</ul>
			<div class="tab-content">
				<div id="translation_form" class="tab-pane">
					<div class="translation_quote_content">
						<p>Please fill the form below for a quick estimate and we'll get back to you as soon
						 as possible.If you can't attch the document,please describe the document and its 
						 size in the message box.If you have any other questions or queries,you may alse
						 type them below.We look forward to preparing a quote for you.</p>

					</div>		
					<form method="post" id="" action="" class="require_info quote_form form-horizontal">
						<div class="form-group">
							<label for="translation_source" class="col-sm-3">Source language</label>
							<div class="col-sm-4">
								<select name="translation_source" id="translation_source" class="quote_controls">
									<option value="English">English</option>
									<option value="Chinese">Chinese</option>
									<option value="French">French</option>
									<option value="Russian">Russian</option>
									<option value="Japanese">Japanese</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="translation_target" class="col-sm-3">Target language</label>
							<div class="col-sm-4">
								<select name="translation_target" id="translation_target" class="quote_controls">
									<option value="Chinese">Chinese</option>
									<option value="English">English</option>
									<option value="French">French</option>
									<option value="Russian">Russian</option>
									<option value="Japanese">Japanese</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="translation_deadline" class="col-sm-3">Deadline</label>
							<div class="col-sm-4">
								<input name="translation_deadline" type="datetime-local" id="translation_deadline" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="translation_file" class="col-sm-3">File/word count</label>
							<div class="col-sm-4">
								<input name="translation_file" type="text" id="translation_file" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="translation_others" class="col-sm-3">Others</label>
							<div class="col-sm-4">
								<textarea name="translation_others" id="translation_others" cols="30" rows="10" class="quote_textarea"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="" class="col-sm-3"></label>
							<div class="col-sm-3">
								<button id="translation_next" class="next_form">Next</button>
							</div>
						</div>
					
					</form>
					<form style="display:none;" method="post" action="" id="" class="personal_info quote_form form-horizontal">
						<div class="form-group">
							<label for="translation_name" class="col-sm-3">Name</label>
							<div class="col-sm-4">
								<input name="translation_name" type="text" id="translation_name" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="translation_company" class="col-sm-3">Company</label>
							<div class="col-sm-4">
								<input name="translation_company" type="text" id="translation_company" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="translation_phone" class="col-sm-3">Phone</label>
							<div class="col-sm-4">
								<input name="translation_phone" type="text" id="translation_phone" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="translation_email" class="col-sm-3">Email</label>
							<div class="col-sm-4">
								<input name="translation_email" type="text" id="translation_email" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="translation_country" class="col-sm-3">Country</label>
							<div class="col-sm-4">
								<select name="translation_country" id="translation_country" class="quote_controls">
									<option value="China">China</option>
									<option value="USA">USA</option>
									<option value="England">England</option>
									<option value="France">France</option>
									<option value="Russia">Russia</option>
								</select>
							</div>
						</div>
						<div class="form-group verification_code">
							<img class="col-sm-3" 
							id="tranalation_captcha_img" border="1"  src="./captcha.php?r=<?php echo rand();?>" >
							<div class="col-sm-4">
								<input name="translation_authcode" class="quote_controls" type="text" id="translation_authcode" name="translation_authcode" value=""/>
							</div>				
						</div>
						<div class="form-group">
							<label for="" class="col-sm-3"></label>
							<div class="col-sm-3">
								<button id="translation_submit" class="submit_form">Submit</button>
							</div>
						</div>
					</form>
				</div>
				<div id="interpretation_form" class="tab-pane">
					<div class="interpretation_quote_content">
						<p>Please fill the form below for a quick estimate and we'll get back to you as soon
						 as possible.If you can't attch the document,please describe the document and its 
						 size in the message box.If you have any other questions or queries,you may alse
						 type them below.We look forward to preparing a quote for you.</p>

					</div>		
					<form method="post" action="" class="require_info quote_form form-horizontal">
						<div class="form-group">
							<label for="interpretation_source" class="col-sm-3">Source language</label>
							<div class="col-sm-4">
								<select name="interpretation_source" id="interpretation_source" class="quote_controls">
									<option value="English">English</option>
									<option value="Chinese">Chinese</option>
									<option value="French">French</option>
									<option value="Russian">Russian</option>
									<option value="Japanese">Japanese</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_target" class="col-sm-3">Target language</label>
							<div class="col-sm-4">
								<select name="interpretation_target" id="interpretation_target" class="quote_controls">
									<option value="Chinese">Chinese</option>
									<option value="English">English</option>
									<option value="French">French</option>
									<option value="Russian">Russian</option>
									<option value="Japanese">Japanese</option>
								</select>
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_deadline" class="col-sm-3">Deadline</label>
							<div class="col-sm-4">
								<input name="interpretation_deadline" type="datetime-local" id="interpretation_deadline" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_file" class="col-sm-3">File/word count</label>
							<div class="col-sm-4">
								<input name="interpretation_file" type="text" id="interpretation_file" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_others" class="col-sm-3">Others</label>
							<div class="col-sm-4">
								<textarea name="interpretation_others" id="interpretation_others" cols="30" rows="10" class="quote_textarea"></textarea>
							</div>
						</div>
						<div class="form-group">
							<label for="" class="col-sm-3"></label>
							<div class="col-sm-3">
								<button id="interpretation_next" class="next_form">Next</button>
							</div>
						</div>
					
					</form>
					<form style="display:none;" method="post" action="" class="personal_info quote_form form-horizontal">
						<div class="form-group">
							<label for="interpretation_name" class="col-sm-3">Name</label>
							<div class="col-sm-4">
								<input name="interpretation_name" type="text" id="interpretation_name" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_company" class="col-sm-3">Company</label>
							<div class="col-sm-4">
								<input name="interpretation_company" type="text" id="interpretation_company" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_phone" class="col-sm-3">Phone</label>
							<div class="col-sm-4">
								<input name="interpretation_phone" type="text" id="interpretation_phone" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_email" class="col-sm-3">Email</label>
							<div class="col-sm-4">
								<input name="interpretation_email" type="text" id="interpretation_email" class="quote_controls">
							</div>
						</div>
						<div class="form-group">
							<label for="interpretation_country" class="col-sm-3">Country</label>
							<div class="col-sm-4">
								<select name="interpretation_country" id="interpretation_country" class="quote_controls">
									<option value="China">China</option>
									<option value="USA">USA</option>
									<option value="England">England</option>
									<option value="France">France</option>
									<option value="Russia">Russia</option>
								</select>
							</div>
						</div>
						<div class="form-group verification_code">
							<img class="col-sm-3" 
							id="interpretation_captcha_img" border="1"  src="./captcha.php?r=<?php echo rand();?>" >
							<div class="col-sm-4">
								<input name="interpretation_authcode" class="quote_controls" type="text" id="interpretation_authcode" name="translation_authcode" value=""/>
							</div>				
						</div>
						<div class="form-group">
							<label for="" class="col-sm-3"></label>
							<div class="col-sm-3">
								<button id="interpretation_submit" class="submit_form">Submit</button>
							</div>
						</div>
					</form>
				</div>
				<div class="tab-pane" id="guidance_form">
					<div class="guidance_quote_content">
						<h2>Translation</h2>
						<p>Our prices are based on considerations such as the source and target 
						language, subject matter, specialisation(s), format(s), DTP requirements 
						and the deadline. Unfortunately, this means it is not possible for us to 
						publish fixed translation rates for all languages.</p>
						<p>Most quotes are based on word count in the source language (either by 
						word/character or by 1000 words/characters), but different methods apply 
						for images, CAD drawings and other such documents.</p>
						<h2>Interpretation</h2>
						<p>We calculate interpretation by the half day (4 hours) and per 
						interpreter. For longer projects, we charge by the month. If the event or 
						project requires travel, accommodation and insurance, these should be 
						covered by the client. Equipment for simultaneous interpretation is 
						available for hire by the day. Please talk to us for a quote for your 
						event or project.</p>
						<h2>Currencies and payment</h2>
						<p>We are able to give quotes in Sterling, Chinese yuan/renminbi (RMB), 
						US dollars and Euros, and other in other currencies on request. Payment 
						is within 30 working days of the invoice being raised. In certain 
						circumstances we require payment or part-payment upfront. We currently 
						accept cheque and BACS transfer, and we will be expanding our payment 
						options soon.</p>
						<h2>Terms and conditions</h2>
						<p>Please get in touch with us for a copy of our latest terms and 
						conditions of service.</p>
					</div>
				</div>
			</div>			
		</div>
	</div>
</div>

<script type="text/javascript">
	
</script>
<script type="text/javascript" src="/public/javascript/get-a-quote.js"></script>
<?php include "footer.php" ?>