function user() {
	var vali = false;
	var lock = false;

	this.check = function(str) {

		var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
		if (reg.test(str) == false) {
			return false;
		} else {
			return true;
		}
	}

	this.isChinese = function(str) {
		var re = /[^\u4e00-\u9fa5]$/;
		if (re.test(str)) return false;
		return true;
	}

	this.send = function() {

		var user_name = $.trim($("#name").val());
		var user_qq = $.trim($("#qq").val());
		var user_code = $.trim($("#check_code").val());
		var lock = true;

		$("#name_err").html('');
		$("#qq_err").html('');
		$("#check_code_err").html('');

		if ($.trim(user_name) == '') {
			lock = false;
			$("#name_err").html('请输入真实姓名');
		} else if (this.isChinese(user_name) == false) {
			lock = false;
			$("#name_err").html('用户名只能是中文');
		} else if (user_name.length < 2 || user_name.length > 20) {
			lock = false;
			$("#name_err").html('中文长度2-20个字之间');
		}


		if ($.trim(user_qq) == '') {
			lock = false;
			$("#qq_err").html('请输入QQ号');
		} else if (isNaN(user_qq)) {
			lock = false;
			$("#qq_err").html('QQ号只能是数字');
		}

		if ($.trim(user_code) == '') {
			lock = false;
			$("#check_code_err").html('请输入邮件验证码');
		}


		if (lock) {
			$("#btn-ok").html("提交中....");
			$("#btn-ok").attr("disabled", true);
			var PostUrl = '/app/index/?m=member&a=memberEdit';
			var UrlVar = "&user_name=" + user_name + "&user_qq=" + user_qq + "&user_code=" + user_code;
			lock = false;


			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					$("#btn-ok").removeAttr("disabled");
					$("#btn-ok").html("保存");
					$("#send_err").html("保存失败，请稍后再试！");
				},
				success: function(response) {
					$("#btn-ok").removeAttr("disabled");
					$("#btn-ok").html("保存");
					response = eval('(' + response + ')');

					if (response.State != "1") {
						$("#send_err").html(response.Message);
					} else if (response.State == "1") {
						$("#send_err").html("保存成功");
					}

				}
			});
		}
	}

	this.sendCodeForPwd = function() {
		$("#check_code_err").html("发送中....");
		$("#member-send-mail").attr("disabled", true);
		$("#check_code").val('');

		lock = false;
		var PostUrl = '/app/index/?m=member&a=sendCodeForPwd';
		var UrlVar = "";

		$.ajax({
			url: PostUrl,
			data: UrlVar,
			type: 'POST',
			async: true,
			timeout: 60000,
			error: function() {
				$("#member-send-mail").removeAttr("disabled");
				$("#check_code_err").html("发送失败，请稍后再试！");
			},
			success: function(response) {
				$("#member-send-mail").removeAttr("disabled");
				response = JSON.parse(response);

				if (response.State >= 1) {
					$("#check_code_err").html('发送成功');
				} else if (response.State != "1") {
					$("#check_code_err").html(response.Message);
				}
			}
		});
	}

	this.sendCodeForPerson = function() {
		$("#check_code_err").html("发送中....");
		$("#member-send-mail").attr("disabled", true);
		$("#check_code").val('');

		var PostUrl = '/app/index/?m=member&a=sendCodeForPerson';
		var UrlVar = "";

		$.ajax({
			url: PostUrl,
			data: UrlVar,
			type: 'POST',
			async: true,
			timeout: 60000,
			error: function() {
				$("#member-send-mail").removeAttr("disabled");
				$("#check_code_err").html("发送失败，请稍后再试！");
			},
			success: function(response) {
				$("#member-send-mail").removeAttr("disabled");
				response = JSON.parse(response);

				if (response.State >= 1) {
					$("#check_code_err").html('发送成功');
				} else if (response.State != "1") {
					$("#check_code_err").html(response.Message);
				}
			}
		});
	}

	this.edit = function() {

		var user_old_pwd = $.trim($("#old-password").val());
		var user_new_pwd = $.trim($("#new-password").val());
		var user_ag_pwd = $.trim($("#ag-password").val());
		var user_code = $.trim($("#code").val());
		var lock = true;

		$("#old_pwd_err").html('');
		$("#new_pwd_err").html('');
		$("#ag_pwd_err").html('');


		if ($.trim(user_old_pwd) == '') {
			lock = false;
			$("#old_pwd_err").html('请输入旧密码');
		}

		if ($.trim(user_new_pwd) == '') {
			lock = false;
			$("#new_pwd_err").html('请输入新密码');
		}

		if ($.trim(user_ag_pwd) == '') {
			lock = false;
			$("#ag_pwd_err").html('请输入确认密码');
		}

		if ($.trim(user_ag_pwd) != user_new_pwd) {
			lock = false;
			$("#new_pwd_err").html('请输入新密码与确认密码不一致');
		}

		if ($.trim(user_code) == "") {
			lock = false;
			$("#check_code_err").html('请输入邮件验证码');
		}

		if (lock) {
			$("#btn-ok").html("提交中....");
			var PostUrl = '/app/index/?m=member&a=memberEditPwd';
			var UrlVar = "&user_old_pwd=" + user_old_pwd + "&user_new_pwd=" + user_new_pwd + "&user_ag_pwd=" + user_ag_pwd + "&user_code=" + user_code;


			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					$("#btn-ok").html("保存");
					$("#send_err").html("提交超时，请稍后再试！");
				},
				success: function(response, s1, s2) {

					$("#btn-ok").html("保存");

					try {
						response = JSON.parse(response);
						if (response.State >= 1) {
							$("#send_err").html("保存成功");
							//重置以下为空
							$("#old-password").val('');
							$("#new-password").val('');
							$("#ag-password").val('');
							$("#code").val('');
						} else {
							$("#send_err").html(response.Message);
						}
					} catch (e) {
						$("#send_err").html("err");
					}

				}
			});
		}
	}

	this.joinGuarantee = function() {

		$("#send_err").html("提交中....");
		$("#btn-ok").attr("disabled", true);
		var PostUrl = '/app/index/?m=member&a=joinGuarantee';
		var UrlVar = "limit=1";

		$.ajax({
			url: PostUrl,
			data: UrlVar,
			type: 'POST',
			async: true,
			timeout: 60000,
			error: function() {

				$("#btn-ok").removeAttr("disabled");
				$("btn-ok").html("加入商保");
				$("#send_err").html("提交失败，请稍后再试！");
			},
			success: function(response) {

				$("#btn-ok").html("加入商保");
				$("#btn-ok").removeAttr("disabled");
				response = JSON.parse(response);

				if (response.State >= 1) {
					$("#send_err").html("加入成功");
					window.location.href = window.location.href;
				} else {
					$("#send_err").html(response.Message);
				}

			}
		});
	}

	this.exitGuarantee = function() {

		lock = true;
		$("#send_err").html("");

		if (lock) {
			$("#btn-ok").html("提交中....");
			$("#btn-ok").attr("disabled", true);
			var PostUrl = '/app/index/?m=member&a=exitGuarantee';
			var UrlVar = "";
			lock = false;

			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					lock = true
					$("btn-ok").html("退出商保");
					$("#btn-ok").removeAttr("disabled");
					$("#send_err").html("提交失败，请稍后再试！");
				},
				success: function(response) {
					$("#btn-ok").removeAttr("disabled");
					lock = true;
					$("#btn-ok").html("退出商保");
					response = eval('(' + response + ')');

					if (response.State != "1") {
						$("#send_err").html(response.Data);
					} else if (response.State == "1") {
						$("#send_err").html("退出成功");
						window.location.href = window.location.href;
					}
				}
			});
		}
	}

	//bind淘宝号
	this.delBindTbAction = function(gid) {

		lock = true;

		if (lock) {
			$("#del" + gid).text("删除中...");
			$("#del" + gid).css("color", "#E1070B");

			var PostUrl = '/app/index/?m=seller&a=delBindTaoBaoAction';
			var UrlVar = "&gid=" + gid;
			lock = false;

			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					lock = true
					$("#del" + gid).html("提交超时，请稍后再试！");
				},
				success: function(response) {
					lock = true;
					response = eval('(' + response + ')');

					if (response.State != "1") {
						$("#del" + gid).html(response.Message);
					} else if (response.State == "1") {
						$("#row_" + gid).remove();

					}
				}
			});

		}

	}

	//bind淘宝号
	this.bindTbAction = function() {

		var _tb_name = $("#tb_id").val();
		var _type_value = $('input:radio[name=type]:checked').val();

		lock = true;

		if ($.trim(_tb_name) == '') {
			lock = false;
			$("#user_err").html('请输入淘宝账号');
		}

		if (lock) {
			$("#btn-ok").html("提交中....");
			var PostUrl = '/app/index/?m=seller&a=bindTaoBaoAction';
			var UrlVar = "&tb_name=" + _tb_name + "&type_value=" + _type_value;
			lock = false;

			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					lock = true
					$("#btn-ok").html("立即绑定");
					$("#send_err").html("提交超时，请稍后再试！");
				},
				success: function(response) {

					lock = true;
					$("#btn-ok").html("立即绑定");
					response = eval('(' + response + ')');

					if (response.State != "1") {
						$("#send_err").html(response.Message);

					} else if (response.State == "1") {
						$("#send_err").html("绑定成功");
						window.location.href = window.location.href;

					}
				}
			});
		}
	}

	//显示发布点
	this.showPoint = function(v) {
		//计算发布点
		var dot = this.changePoint(v);
		//如果价钱在是一个有效值
		if (dot != false) {
			//消耗发布点标签显示
			$(".pro-dottxt").html(dot);
			//xx元，XX发布点标签上显示
			$("#pro-dot").val(dot);
			$(".modal").find("input[name='pro-price']").val(v);
		}
	}

	//根据价钱计算点数
	this.changePoint = function(v) {
		if ($.trim(v) != '' && !isNaN(v)) {
			var value = parseFloat(v);
			var dot = 0;

			if (value >= 0) {
				//0-40之间是1个点
				if (value <= 40) {
					dot = 1;
				} else if (value <= 80) {
					dot = 2;
				} else if (value <= 120) {
					dot = 3;
				} else if (value <= 200) {
					dot = 4;
				} else if (value <= 500) {
					dot = 5;
				} else if (value <= 1000) {
					dot = 6;
				} else if (value > 1000) {
					dot = 7;
				}
				return dot;
			} else {
				return false;
			}
		} else {

			return false;
		}
	}

	var _post_pro = [];
	var _post_json = [];

	//返回已添加的宝贝数量
	this.proNum = function() {
		return _post_pro.length;
	}

	//添加宝贝检测
	this.addPro = function() {
		$(".modal").find("#demo_err").html('');
		$(".modal").find("#key_err").html('');
		$(".modal").find("#pro_price_err").html("");
		$(".modal").find("#pro_address_err").html("")


		var flag = false;

		//当前新加宝贝所消耗发布点
		var _pro_dottxt = $("#pro-dottxt").html();


		//宝贝连接
		var _add_pro = $(".modal").find("input[name='addr']").val();

		if ($.trim(_add_pro) == "") {
			flag = true;
			//$(".modal").find("#pro_address_err").html("请添加宝贝连接");
			myWidget.alert("请添加宝贝连接");
		}

		//选择掌柜号检测
		var _shopkeeper = $("#shopkeeper").val();
		if ($.trim(_shopkeeper) == '') {
			flag = true;
			$(".modal").find("#pro_address_err").html("请先选择掌柜号");
		}

		//价钱检测
		var _pro_price = $(".modal").find("input[name='pro-price']").val();
		if ($.trim(_pro_price) == '') {
			flag = true;
			$(".modal").find("#pro_price_err").html("请添加宝贝价格");
		} else if ($.trim(_pro_price) != '') {
			if (isNaN(_pro_price)) {
				flag = true;
				$(".modal").find("#pro_price_err").html("宝贝价格必须为数字");
			} else if (parseFloat(_pro_price) <= 0) {
				flag = true;
				$(".modal").find("#pro_price_err").html("宝贝价格大于0");
			}
		}

		//是否货比三家值
		var _compare = $(".modal").find("input[name='compare3']").prop("checked");

		//来路备注(值为中文)
		var _router_demo = $(".modal").find("#pro-sort").val();

		//来路设置
		var _router_set = $(".modal").find("#pro-address-sl").val();
		//关键字
		var _key = $(".modal").find("input[name='pro-key']").val();
		//第几页
		var _no_page = $(".modal").find("input[name='pro-page']").val();
		//第几位
		var _page_seat = $(".modal").find("input[name='pro-position']").val();

		if (_router_set == "2") {
			//关键字判断
			if ($.trim(_key) == '') {
				flag = true;
				$(".modal").find("#key_err").html("请输入关键字");
			}

			if ($.trim(_no_page) == '') {
				flag = true;
				$(".modal").find("#demo_err").html("请输入宝贝在第几页");
			} else if (isNaN(_no_page)) {
				flag = true;
				$(".modal").find("#demo_err").html("页数必须是个数字");
			} else if (parseFloat(_no_page) <= 0) {
				flag = true;
				$(".modal").find("#demo_err").html("页数必须是大于");
			}

			//位判断
			if ($.trim(_page_seat) == '') {
				flag = true;
				$(".modal").find("#demo_err").html("请输入宝贝在第几位");
			} else if (isNaN(_page_seat)) {
				flag = true;
				$(".modal").find("#demo_err").html("位数必须是个数字");
			} else if (parseFloat(_page_seat) <= 0) {
				flag = true;
				$(".modal").find("#demo_err").html("位数必须是大于0");
			}
		}

		//以上条件检测成功
		if (flag == false) {
			$(".modal").find("#btn-ok").attr("disabled", "disabled");

			$(".modal").find("#btn-ok").html("提交中....");

			var PostUrl = '/app/index/?m=seller&a=taskAddPro';
			var UrlVar = "&add_pro=" + encodeURIComponent(_add_pro) + "&shopkeeper=" + encodeURIComponent(_shopkeeper);
			lock = true;

			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					$(".modal").find("#btn-ok").removeAttr("disabled");
					$(".modal").find("#send_err").html("添加超时！");
				},
				success: function(response) {
					$(".modal").find("#btn-ok").removeAttr("disabled");
					$(".modal").find("#btn-ok").html("添加宝贝");
					response = eval('(' + response + ')');

					if (response.State != "1") {
						$(".modal").find("#send_err").html(response.Message);
					} else if (response.State == "1") {
						$(".modal").find("#send_err").html("添加成功");
						//插入一段HTML到宝贝区域
						var _pro_pic_url = response.Data;

						//html_id做为每个新加淘宝标签唯一id
						var tmp_id = new Date().getTime();

						//创建本次产品json
						var _pro = myUser.CreatePro(tmp_id, _pro_pic_url, _pro_price, _pro_dottxt, _add_pro, _router_set, _compare, _key, _router_demo, _no_page, _page_seat);

						//添加到全局数组
						myUser.addArray(_pro);

						//显示产品HTML在页面上
						myUser.showProHtml(_pro);

						//积分扣减与显示产品所消耗的价钱
						myUser.showScore(_pro);

						//关闭新加宝贝弹窗口
						myUser.closePop();

						//切换帐号被禁止
						myUser.disabledAccount(true);
						//重设置宝贝表单
						myUser.reset();

					}

				}
			});
		}
	}

	//显示本次扣减的积分与资金
	this.showScore = function(_pro) {
		myUser.addScore(parseFloat(_pro.point));

		//货比三家是否选择中
		if (_pro.compare) {
			myUser.addScore(0.50);
		}

		//来路如果选择了淘宝搜索
		if (_pro.router_set == "2") {　　　
			myUser.addScore(0.50);
		}

		//流动资金累加
		myUser.releaseMoney(_pro.price);
	}

	//功能：把已添加的宝贝添加到页面显示
	//参数：//参数：_pro:单个产品JSON
	this.showProHtml = function(_pro) {
		var html = this.getProHTML();

		html = html.replace(/{id}/g, _pro.id);
		//宝贝图片url
		html = html.replace(/{img}/g, _pro.pic_url);
		//价钱
		html = html.replace(/{price}/g, _pro.price);
		//显示消耗的发布点
		html = html.replace(/{point}/g, _pro.point);

		//如果有来路
		if (_pro.router_set == '2') {
			//来路类型
			html = html.replace(/{router_set}/g, _pro.router_set);
			//关键字
			html = html.replace(/{key}/g, _pro.key);
			html = html.replace(/{roter}/g, _pro.router_demo + "&nbsp;第" + _pro.no_page + "页&nbsp;第" + _pro.page_seat + "位&nbsp;" + _pro.compare_value);
			html = html.replace(/{none}/g, "block");

		} else {
			html = html.replace(/{none}/g, "none");
		}

		this.addBtnPos(1);



		$("#activeAddPro").html(html + $("#activeAddPro").html());
	}

	this.addBtnPos = function(num) {

		if (num > 0) {
			$(".btn-add-item").css("left", 410);
		} else {
			$(".btn-add-item").css("left", 0);
		}
	}

	//功能：创建单个产品json
	//参数
	//tmp_id,临时id
	//_pro_pic_url:产品图片
	//_pro_price:产品价钱
	//_pro_dottxt:产品价钱所消耗点数
	//_add_pro:产品网址
	//_router_set:来路设置（1-2值）
	//_compare:是否选择货比三家(true,false)
	//_router_demo:来路备注（下拉框中文值）
	//_no_page:第几页
	//_page_seat:第几位
	//返回值：产品对象
	this.CreatePro = function(tmp_id, _pro_pic_url, _pro_price, _pro_dottxt, _add_pro, _router_set, _compare, _key, _router_demo, _no_page, _page_seat) {
			//创建本次添加产品的对象
			var _pro = {};

			_pro.id = tmp_id;
			//宝贝图片url
			_pro.pic_url = _pro_pic_url;
			//价钱
			_pro.price = this.toDec(_pro_price);

			//价钱消耗点数
			_pro.point = this.toDec(_pro_dottxt);
			//宝贝网址
			_pro.url = _add_pro;
			//来路设置(不设置：1,淘宝搜索:2)
			_pro.router_set = _router_set;
			//货比三家(中文)
			_pro.compare = _compare;
			//货比三家(值)
			_pro.compare_value = _compare ? "货比三家" : "";
			//第几页
			_pro.no_page = _no_page;
			//第几位
			_pro.page_seat = _page_seat;
			//默认排序
			_pro.router_demo = _router_demo;
			//关键字
			_pro.key = _key;
			//关键字，来路备注（中文值）,第几页，第几位，是否货比三家
			_pro.router_value = _router_set == "2" ? _key + ',' + _router_demo + ',' + _no_page + ',' + _page_seat + ',' + _pro.compare_value : '';
			//alert(JSON.stringify(_pro));
			return _pro;
		}
		//把产品对象添加到全局数组
	this.addArray = function(_pro) {
		_post_pro.push(_pro);
	}

	//流行资金统计
	this.releaseMoney = function(s) {
		//当前要统计的价格
		s = this.toDec(s);

		//右下角资金
		var _nowValue = $("#total-amount").html();
		var _nowValue = this.toDec(_nowValue);

		var _dec = 100000000;
		_nowValue = ((_nowValue * _dec + parseFloat(s) * _dec) / _dec).toFixed(2);

		$("#total-amount").html(_nowValue);
	}

	//转小数
	this.toDec = function(s) {
		s = new Number(s);
		return s.toFixed(2);
	}

	//重设置宝贝表单
	this.reset = function() {
		//reset
		//价格重置
		$(".modal").find("input[name='pro-price']").val('');
		//地址重置
		$(".modal").find("input[name='addr']").val('');
		//来路选项
		$(".tao-search").hide();
		//来路下拉框
		$(".modal").find("#pro-address-sl option[value='1'] ").attr("selected", true);
		//来路备注
		//关键字
		$(".modal").find("input[name='pro-key']").val('');
		//第几页
		$(".modal").find("input[name='pro-page']").val('');
		//第几位
		$(".modal").find("input[name='pro-position']").val('');

	}

	//重设主体表单
	this.resetBody = function() {
		//清空保存报恩宝贝的数组
		_post_pro = [];

		//帐号切换重设
		$("#shopkeeper").removeAttr("disabled");
		$("#activeAddPro").html('');

		//重设置收货时间
		myRel.lostPoint(this.animated(0));

		//规定好评内容
		$("#praise-text").val('');
		//规定好评内容复选框
		if ($("input[name='praise-font']").prop("checked")) {
			$("input[name='praise-font']").click();
		}
		//是否带字好评
		$('input:radio[name="praise"][value="1"]').prop('checked', true);
		//需要旺旺聊天
		$("input[name='is_chat']").prop("checked", false);
		//收藏店铺宝贝
		$("input[name='is_collection']").prop("checked", false);
		//分享到淘江湖
		$("input[name='is_share']").prop("checked", false);
		//规定收货地址
		if ($("input[name='set_addr']").prop("checked")) {
			$("input[name='set_addr']").click();
		}
		//地址内容
		$("#address_info").val('');
		//额外奖励发布点
		if ($("input[name='jl']").prop("checked")) {
			$("input[name='jl']").click();
		}
		//发布点内容
		$("#point_value").val('');
		//任务审核
		$('input:radio[name="audit"][value="1"]').prop('checked', true);
		//宝贝浏览
		$('input:radio[name="browse-time"][value="0"]').prop('checked', true);
		//其他选项
		if ($("input[name='is_warehouse']").prop("checked")) {
			$("input[name='is_warehouse']").click();
		}
		//掌柜号信息保护
		if ($("input[name='is_hiding']").prop("checked") == false) {
			$("input[name='is_hiding']").click();
		}
		//商保任务
		if ($("input[name='is_guarantee']").prop("checked")) {
			$("input[name='is_guarantee']").click();
		}
		//定时发布
		if ($("input[name='timing-field']").prop("checked")) {
			$("input[name='timing-field']").click();
		}
		//定时发布时间
		$("#timing-text").val('');

		//发布点与价钱统计重设
		$("#total-point").html("0.00");
		$("#total-amount").html("0.00");
	}

	//删除新增宝贝HTML
	//compare3_s货比三家，如果添加时候选中值非空
	//id:html区id
	//score:当前宝贝价格对应的发布点
	//_router_set_s:是否选择了淘宝搜索做为来路
	this.delPro = function(id) {
		$("#html_" + id).remove();
		var tmpJson = [];

		for (var i = 0; i < _post_pro.length; i++) {
			tmpJson = _post_pro[i];
			if (tmpJson.id == id) {
				_post_pro.splice(i, 1);
				//减去价钱所消耗的点
				this.addScore(-parseFloat(tmpJson.point));
				//减货比三家发布点
				if (tmpJson.compare == true) {
					this.addScore(-0.5);
				}
				//扣减选择了淘宝来路
				if (tmpJson.router_set == '2') {
					this.addScore(-0.5);
				}

				//减掉价格
				this.releaseMoney(-(tmpJson.price));
			}
		}

		//如果宝贝全部清除则允许切换帐号
		if (_post_pro.length == 0) {
			this.disabledAccount(false);

			this.addBtnPos(0);
		}
	}

	this.disabledAccount = function(s) {
		if (s) {
			$("#shopkeeper").attr("disabled", true);
		} else if (s == false) {
			$("#shopkeeper").removeAttr("disabled", false);
		}
	}

	//请求发布任务（单条）
	this.releaseEdit = function(get_id) {

		var PostUrl = '/app/index/?m=seller&a=getWareHouseOneTask';
		var UrlVar = "gid=" + get_id;

		$.ajax({
			url: PostUrl,
			data: UrlVar,
			type: 'POST',
			async: true,
			timeout: 60000,
			error: function() {
				alert("timeout");
			},
			success: function(response) {
				r = eval('(' + response + ')');
				//显示任务详情
				myUser.showRelease(r);
			}
		});
	}

	//显示任务信息
	this.showRelease = function(release_json) {
		var response = release_json;

		$("#shopkeeper option[value='" + r.tbAccount + "']").attr("selected", true);
		$("#select2-shopkeeper-container").html(r.tbAccount);

		//清空保存报恩宝贝的数组
		_post_pro = [];

		//每个宝贝图片
		var _img_arr = eval(r.img);
		//每个宝贝来路备注
		var _router_arr = eval(r.reference);
		//每个宝贝价钱
		var _price_arr = eval(r.goodsprice);
		//每个宝贝来路设置
		var _router_type_arr = eval(r.goodsType);
		//每个宝贝宝贝url
		var _goods_url_arr = eval(r.goods);


		//统计当前任务发布点
		var _tmp_point = 0;
		var _page = '';
		var _seat = '';
		var _router_set = '';
		var _key = '';
		var _compare;
		var _router_demo;


		for (var i = 0; i < _img_arr.length; i++) {
			//得到每个宝贝消耗点并显示消耗的发布点
			_tmp_point = this.changePoint(_price_arr[i]);

			//累加每个宝贝的价
			　　　　
			this.releaseMoney(_price_arr[i]);
			//来路值(1-2)
			_router_set = _router_type_arr[i];

			//如果没有来路
			if (_router_set == '1') {
				_page = '';
				_seat = '';
				_key = '';
				_compare = false;
				_router_demo = '';
			} else if (_router_set == '2') {
				//来路字符串
				var _tmp = _router_arr[i].split(",");
				//得到页数
				_page = _tmp[2];
				//得到位数
				_seat = _tmp[3];
				//关键字
				_key = _tmp[0];
				//来路备注值(如：默认排序)
				_router_demo = _tmp[1];
				//是否选择了货比三家
				_compare = $.trim(_tmp[4]) != '' ? true : false;
			}

			//创建每个宝贝对象
			var _pro = this.CreatePro(i, _img_arr[i], _price_arr[i], _tmp_point, _goods_url_arr[i], _router_set, _compare, _key, _router_demo, _page, _seat);
			//添加到全局
			this.addArray(_pro);
			//显示产品HTML在页面上
			this.showProHtml(_pro);
		}


		//是否带字好评
		$('input:radio[name="praise"][value="' + r.praise + '"]').prop('checked', true);

		//规定好评内容
		if ($.trim(r.praiseContent) != '') {
			//praise-font
			$("#praise-font").trigger('click');

			$("#praise-text").val(r.praiseContent);
		}


		//需要旺旺聊天
		if (r.isChat) {
			$("#is_chat").trigger('click');
		}

		//收藏
		if (r.isCollection) {
			$("#is_collection").trigger('click');
		}

		//分享到淘江湖
		if (r.isShare) {
			$("#is_share").trigger('click');
		}

		//规定收货地址
		if (r.isAssinAddress) {
			$("#set_addr").trigger('click');
			//内容
			$("#address_info").val(r.assinAddress);
		}

		//额外奖励发布点
		if (!isNaN(r.extraPoint) && parseInt(r.extraPoint) > 0) {
			$("#jl").trigger('click');
			$("#point_value").val(r.extraPoint);
		}

		//如果是vip
		if (_is_me_vip == "1") {
			$("#yes_show_vip").show();
			//任务审核
			$('input:radio[name="audit"][value="' + r.audit + '"]').prop('checked', true);
			//宝贝浏览
			$('input:radio[name="browse-time"][value="' + r.browseTime + '"]').prop('checked', true);
			//添加到任务仓库
			$('input[name="is_warehouse"]').click();
			$('input[name="is_warehouse"]').attr("disabled", "disabled");

			//掌柜号信息保护
			if (r.isHiding) {
				$('#is_hiding').click();
			}
		}

		//商保任务
		if (r.isGuarantee) {
			$("#is_guarantee").click();
		}


		//收货时间
		var total = myUser.animated(r.rangeTime);
		myRel.lostPoint(total);

		//当任务有已添加宝贝的时候禁止帐号切换
		//如果想切换帐号必须先把宝贝全部删除完才可以
		if (_img_arr.length > 0) {
			$("#shopkeeper").attr("disabled", "disabled");
		} else {
			$("#shopkeeper").removeAttr("disabled");
		}

	}

	//设置收货时间(html动画部分)
	this.animated = function(length) {
		var width = Math.ceil($("#axis-box").width() / 7);
		var total = length * width;
		$(".axis-now").css("width", total);
		$("#range_time").val(length);

		return total;
	}


	//宝贝显示标签
	this.getProHTML = function() {
		//id:每个标签标识
		//point:所消耗发布点
		//compare:货比三家，如果添加时候选中值
		//_router_set:是否选择了淘宝搜索做为来
		//price:每个宝贝的价钱

		//var html='<div class="pro-con" id="html_{id}"><dl><dt><img width="65" height="65" alt="宝贝图片" src="{img}"></dt><dd><p><span class="pro-money">{price}</span>元 / <span class="pro-dot">{point}</span>发布点</p><div class="sel-adr-1" style="display:{none}"><p>来路：<span class="pro-adr">淘宝搜索</span></p><p>关键词：<span class="pro-key">{key}</span></p><p>{roter}<span class="pro-key"></span></div></dd></dl><span class="del-tcls del-pro-1" onClick="myUser.delPro({id})"></span><!--每个宝贝截图--> </div>';

		var html = '<div class="item" id="html_{id}"><dl><dt><img alt="宝贝图片" src="{img}" height="65" width="65"></dt> <dd><p><span class="text-amount">{price}</span>元 / <span class="text-point">{point}</span>发布点</p><div style="display:{none}" class="sel-adr-1"><p>来路：<span class="text-reference">淘宝搜索</span></p><p>关键词：<span class="text-keyword">{key}</span></p><p  id="compare-1">{roter}<span class="text-keyword"></span></p></div></dd></dl><button class="close" id="del-item-1" type="button"  onClick="myUser.delPro({id})" style="margin-top:20px">×</button></div>';

		return html;

	}

	//发布任务
	this.releaseTask = function(action) {

		var flag = false;
		var str = '';
		var post_str = '';
		var get_str = "";

		//帐号检测(ReleaseTask)
		var _shopkeeper = $("#shopkeeper").val();
		if ($.trim(_shopkeeper) == '') {
			flag = true;
			str = '请先选择一个掌柜号';
		} else if ($.trim(_shopkeeper) != '') {
			post_str = post_str + 'tbAccount=' + encodeURIComponent(_shopkeeper);
		}

		//获得添加的宝贝
		if (_post_pro.length == 0) {
			flag = true;
			str = '请添加宝贝';
		} else if (_post_pro.length > 0) {
			var _tmp_arr = [];
			//宝贝数组：
			var _img_arr = [];
			//宝贝图片URL
			var _img_url_arr = [];
			//宝贝价钱
			var _img_price_arr = [];
			//得到关键字,默认排序,1,3,货比三家
			var _router_arr_value = [];
			//宝贝地址
			var _pro_url = [];
			//宝贝url
			var _img_url = [];
			//来路值
			var _roter = [];

			for (var i = 0; i < _post_pro.length; i++) {
				_tmp_arr = _post_pro[i];
				//得到宝贝图片URL
				_img_url_arr.push(_tmp_arr.pic_url);
				//宝贝价钱
				_img_price_arr.push(_tmp_arr.price);
				//宝贝地址
				_pro_url.push(_tmp_arr.url);
				//如果设置了来源
				_router_arr_value.push(_tmp_arr.router_value);
				//来路设置
				_roter.push(_tmp_arr.router_set);
			}

			//来路设置
			post_str = post_str + '&goodsType=' + encodeURIComponent('["' + _roter.join('","') + '"]');
			//图片网址
			post_str = post_str + '&img=' + encodeURIComponent('["' + _img_url_arr.join('","') + '"]');
			//价钱
			post_str = post_str + '&price=' + encodeURIComponent('[' + _img_price_arr.join(",") + ']');
			//来路备注
			post_str = post_str + '&reference=' + encodeURIComponent('["' + _router_arr_value.join('","') + '"]');
			//宝贝网址
			post_str = post_str + '&goods=' + encodeURIComponent('["' + _pro_url.join('","') + '"]');
		}

		//收货时间
		var _range_time = $("#range_time").val();

		post_str = post_str + '&rangeTime=' + encodeURIComponent(_range_time);


		//是否带字好评
		var _praise = $('input:radio[name="praise"]:checked').val();
		post_str = post_str + '&praise=' + encodeURIComponent(_praise);


		//是否规定好评内容
		var _praise_text = $("input[name='praise-font']").prop("checked");
		//规定好评内容
		var _praise_info = $("#praise-text").val();


		//如果带好评，则加上好评内容
		if (_praise_text && $.trim(_praise_info) == "") {
			flag = true;
			str = '请输入好评内容';
		} else if (_praise_text && $.trim(_praise_info) != "") {
			//规定好评内容
			post_str = post_str + '&praiseContent=' + encodeURIComponent(_praise_info);
		}

		//需要旺旺聊天
		if ($("input[name='is_chat']").prop("checked")) {
			//如果需要 
			post_str = post_str + '&isChat=1';

		}

		//收藏店铺宝贝
		if ($("input[name='is_collection']").prop("checked")) {
			//如果需要 
			post_str = post_str + '&isCollection=1';
		}

		//分享到淘江湖
		if ($("input[name='is_share']").prop("checked")) {
			//如果需要
			post_str = post_str + '&isShare=1';
		}

		//规定收货地址
		var _get_addr_info = $("#address_info").val();
		//如果勾选且没有输入地址则提示
		if ($("input[name='set_addr']").prop("checked") && $.trim(_get_addr_info) == '') {
			flag = true;
			str = '请输入收货地址';
		} else if ($("input[name='set_addr']").prop("checked") && $.trim(_get_addr_info) != '') {
			post_str = post_str + '&isAssinAddress=1&AssinAddress=' + encodeURIComponent(_get_addr_info);
		}

		//额外奖励发布点 
		var _is_addr_value = $.trim($("#point_value").val());
		//如果勾选且没有输入发布点
		if ($("input[name='jl']").prop("checked") && _is_addr_value == '') {
			flag = true;
			str = '请输入额外奖励发布点';
		}
		if ($("input[name='jl']").prop("checked") && (isNaN(_is_addr_value) || parseInt(_is_addr_value) < 0)) {
			flag = true;
			str = '额外奖励发布点必须为数字且大于0';
		} else if ($("input[name='jl']").prop("checked") && _is_addr_value != '' && !isNaN(_is_addr_value) && parseInt(_is_addr_value) > 0) {
			post_str = post_str + '&extraPoint=' + encodeURIComponent(_is_addr_value);
		} else {
			//其它未知情况下当0处理
			post_str = post_str + '&extraPoint=0';
		}

		//商保任务
		var _is_guarantee_value = "";
		//如果选择了商保任务
		if ($("input[name='is_guarantee']").prop("checked")) {
			post_str = post_str + '&isGuarantee=1';
		}

		//VIP功能专区值(_is_me_vip是个全局变量)
		if (_is_me_vip == "1") {
			//是vip
			get_str = get_str + '&vip=1';

			//任务审核
			var _audit_value = $('input:radio[name=audit]:checked').val();
			post_str = post_str + '&audit=' + encodeURIComponent(_audit_value);

			//宝贝浏览
			var _pro_browse_time = $('input:radio[name=browse-time]:checked').val();
			post_str = post_str + '&browseTime=' + encodeURIComponent(_pro_browse_time);

			//是否添加到任务仓库
			var _is_add_to_warehouse = $("input[name='is_warehouse']").prop("checked") ? 1 : 0;
			post_str = post_str + '&isWarehouse=' + encodeURIComponent(_is_add_to_warehouse);


			// 掌柜号信息保护
			var _is_hiding_value = $("input[name='is_hiding']").prop("checked") ? 1 : 0;
			post_str = post_str + '&isHiding=' + encodeURIComponent(_is_hiding_value);

		}

		//定时发布
		var _is_timing_text_value = $.trim($("#timing-text").val());
		if ($("input[name='timing-field']").prop("checked") && _is_timing_text_value == '') {
			flag = true;
			str = '请选择定时发布日期';
		} else if ($("input[name='timing-field']").prop("checked") && _is_timing_text_value != '') {
			//获得定时发布日期
			post_str = post_str + '&IsSchedule=1&Schedule=' + encodeURIComponent(_is_timing_text_value);
		}

		if (flag == true && $.trim(str) != '') {
			myWidget.alert2(str);
		} else {
			//点提交按钮后按钮显示的样子
			this.buttonStyleStart(action);

			//如果有gid则把gid带过去
			get_str = $.trim(_gid) != '' ? (get_str = get_str + "&gid=" + _gid) : '';
			var PostUrl = '/app/index/?m=seller&a=taskAdd&action=' + action + '&t=' + (new Date().getTime()) + get_str;
			var UrlVar = post_str;

			$.ajax({
				url: PostUrl,
				data: UrlVar,
				type: 'POST',
				async: true,
				timeout: 60000,
				error: function() {
					$("#send_err").html("发布失败！");
					//恢复按钮样式
					myUser.buttonStyleEnd();
				},
				success: function(response) {

					var err = '';

					//显示提交按钮样式
					myUser.buttonStyleEnd();

					response = eval('(' + response + ')');

					if (response.State >= 1) {
						err = response.Data;
						//$("#send_err").html(err);
					} else if (response.State < 1) {
						err = response.Message;
						//$("#send_err").html(err);
					}

					//如果是添加状态下那么重设主体表单
					if (_action == 'add') {
						myWidget.alert2(err);
						myUser.resetBody();
					} else {
						myWidget.alert(err);
					}


				}
			});


		}
	}

	this.buttonStyleEnd = function(s) {
		$("#task-release-save").html("保存并发布任务");
		$("#task-release-save").removeAttr("disabled");


		$("#btnOK").html("确认发布");
		$("#btnOK").removeAttr("disabled");


		$("#task-save-only").removeAttr("disabled");
		$("#task-save-only").html("保存仓库");
	}

	this.buttonStyleStart = function(s) {
		$("#btnOK").attr("disabled", "disabled");

		$("#task-release-save").attr("disabled", "disabled");
		$("#task-save-only").attr("disabled", "disabled");

		switch (s) {
			case 'saveRelease':
				$(".modal").find("#task-release-save").html("提交中....");
				break;
			case 'saveOnly':
				$(".modal").find("#task-save-only").html("提交中....");
			default:
				$("#btnOK").html("提交中....");
		}
	}

	//宝贝价格检测(小数判断)
	this.pointTestDec = function(event, obj) {
		var e = window.event || event;
		var keyCode = e.keyCode;
		var _p = $.trim($(".modal").find("input[name='pro-price']").val());

		//如果按了小数点
		if (keyCode == 190) {
			//如果按小数之前内容长度为０则不允许输入
			if (_p.length == 0) {
				return false;
			} else {
				//如果.号已经输入，则不允许再次输入
				if (_p.indexOf('.') != -1) {
					return false;
				}

				//放行
				return true;
			}
		} else {

			//如果按了delete键放行
			if (keyCode == 8) {
				return true;
			} else if (keyCode < 48 || keyCode > 57) //数字以外的字符禁止操作
			{
				return false;
			} else {

				return true;
			}
		}
	}

	//额外奖励发布点框检测(整数判断)
	this.pointTest = function(event) {
		var e = window.event || event;
		var keyCode = e.keyCode;


		if (keyCode == 0) {
			return false;
		} else if (keyCode == 8) {
			return true;
		} else if (keyCode < 48 || keyCode > 57) {
			return false;
		}
		return true;
	}

	var _before_conten_length = 0;
	//好评内容(按键之后的内容长度)
	this.nowContent = function(s) {
			var s = $.trim(s);

			if (s.length > 0 && _before_conten_length == 0) {
				this.addScore(0.2);

			} else if (s.length == 0 && _before_conten_length > 0) {
				this.addScore(-0.2);
			}

			_before_conten_length = s.length;
		}
		//额外发布点实时统计
	var _before_point_value = 0;
	this.nowPoint = function(s) {
			if (!isNaN(s)) {
				//减掉之前发布点
				this.nowPointLess();
				_before_point_value = this.toDec(s);
				this.addScore(s);
			}
		}
		//去掉额外奖励之前正确的发布点
	this.nowPointLess = function() {
		this.addScore(-_before_point_value);

	}

	var _before_addr_length = 0;
	//好评内容(按键之后的内容长度)
	this.nowAddrContent = function(s) {
		var s = $.trim(s);
		if (s.length > 0 && _before_addr_length == 0) {
			this.addScore(0.2);

		} else if (s.length == 0 && _before_addr_length > 0) {
			this.addScore(-0.2);
		}
		_before_addr_length = s.length;
	}

	//对页面所有需要加减分的选项进行累加并在页面显示
	this.addScore = function(s) {
		s = this.toDec(s);

		var _md_dot_value = this.toDec($("#total-point").html());

		if ($.trim(_md_dot_value) == '' || isNaN(_md_dot_value)) {
			_md_dot_value = 0;
		} else {
			_md_dot_value = parseFloat(_md_dot_value);
		}

		var _dec = 100000000;
		_md_dot_value = ((_md_dot_value * _dec) + (s * _dec)) / _dec;

		_md_dot_value = this.toDec(_md_dot_value);

		$("#total-point").html(_md_dot_value);
	}

	this.closePop = function(action) {
		//$("#ro_win").remove();
		_action == 'add' ? modal_add_pro.close() : $("#ro_win").remove();
	}

	//任务仓库按钮和删除禁止
	this.taskListDisable = function(gid) {
		//删除按钮
		$("#del-" + gid).attr("disabled", "disabled");
		//编辑窗口
		$("#edit-" + gid).attr("disabled", "disabled");
		//任务发布窗口
		$("#task-" + gid).attr("disabled", "disabled");
	}

	//任务仓库按钮删除解除禁止
	this.taskListMoveDisable = function(gid) {
		//删除按钮
		$("#del-" + gid).removeAttr("disabled");
		//编辑窗口
		$("#edit-" + gid).removeAttr("disabled");
		//任务发布窗口
		$("#task-" + gid).removeAttr("disabled");
	}

	//删除仓库任务
	this.delTask = function(gid) {
		$("#status_" + _gid).html("删除中，请稍等！");
		var PostUrl = '/app/index/?m=seller&a=delOneTask';
		var UrlVar = "&gid=" + gid;

		$.ajax({
			url: PostUrl,
			data: UrlVar,
			type: 'POST',
			async: true,
			timeout: 60000,
			error: function() {
				myErr.getErr("timeout", "POP");

			},
			success: function(response) {

				var r = eval('(' + response + ')');

				myErr.getErr(response, "POP");

				$("#status_" + _gid).html("");

				if (r.State == "1") {
					$("#rows_" + gid).remove();
				}

			}
		});
	}

	//发布仓库任务
	this.doTask = function(gid) {
		$("#status_" + _gid).html("发布中，请稍等！");
		var PostUrl = '/app/index/?m=seller&a=doOneTask';
		var UrlVar = "&gid=" + gid;

		$.ajax({
			url: PostUrl,
			data: UrlVar,
			type: 'POST',
			async: true,
			timeout: 60000,
			error: function() {
				myErr.getErr("timeout", "POP");
				myUser.taskListMoveDisable(gid);

			},
			success: function(response) {
				var r = eval('(' + response + ')');

				myErr.getErr(response, "POP");

				$("#status_" + _gid).html("");

				myUser.taskListMoveDisable(gid);


			}
		});
	}

	//地址复制,收货地址复制，好评内容复制
	this.copyUrlGo = function() {
		//地址复制
		$(".urlclass").each(function(index, element) {
			var url = $(this).attr("data-url");
			var url_id = $(this).attr("id");

			var clip = new ZeroClipboard.Client();
			clip.setHandCursor(true);
			clip.setText(url);
			clip.addEventListener("mouseUp", function(client) {

				$("#result_" + url_id).hide();
				$("#result_" + url_id).show();
			});

			clip.glue(url_id); // 和上一句位置不可调换
		});

		//收货地址
		$(".addrclass").each(function(index, element) {
			var url = $(this).attr("data-text");
			var url_id = $(this).attr("id");

			var clip = new ZeroClipboard.Client();
			clip.setHandCursor(true);
			clip.setText(url);
			clip.addEventListener("mouseUp", function(client) {
				$("#result_" + url_id).hide();
				$("#result_" + url_id).fadeIn();
			});

			clip.glue(url_id); // 和上一句位置不可调换
		});

		//好评内容
		$(".hpclass").each(function(index, element) {
			var url = $(this).attr("data-text");
			var url_id = $(this).attr("id");

			var clip = new ZeroClipboard.Client();
			clip.setHandCursor(true);
			clip.setText(url);
			clip.addEventListener("mouseUp", function(client) {
				$("#result_" + url_id).hide();
				$("#result_" + url_id).fadeIn();
			});

			clip.glue(url_id); // 和上一句位置不可调换
		});
	}




}

var myUser = new user();