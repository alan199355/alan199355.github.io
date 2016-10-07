/* jshint eqnull:true,jquery:true,strict: true */
/**
 * @file core.js 核心业务js，共分为page、message、form、event、business组件
 *
 * page组件封装一些第三方插件或页面效果，目标是形成中间件形式供business调用，例如弹出层modal
 * message组件封装一些页面经常用到的loading效果、操作提示等，供business调用
 * form组件封装一些form相关的操作，例如ajaxSubmit、ajaxPost以及表单验证等，供business调用
 * event组件封装事件的注册等操作
 * business实现具体业务和效果
 *
 * 基于jquery 1.11.2
 */
$(function() {
	"use strict";
	/**
	 * page组件
	 * @constructor
	 */
	var page = function(option) {
		var that = {},
			defaults;
		defaults = {};
		option = $.extend(option, defaults);
		that.option = option;

		var openModal = function() {

		};
		that.openModal = openModal;


		var closeModal = function() {

		};
		that.closeModal = closeModal;

		/**
		 * @public formatString 替换文本，模版处理用，模版变量使用{ABC}花括号格式
		 * @param {string}string 要替换的html等字符串
		 * @param {object}replace 要替换的字符串对象
		 * @returns {string} 替换后的字符串
		 */
		var formatString = function(string, replace) {
			var reg;
			reg = new RegExp('\\{([^\\{\\]]*?)\\}', 'igm');
			return string.replace(reg, function(node, key) {
				return replace[key];
			});
		};

		that.formatString = formatString;
		return that;
	};


	//form组件，表单相关的操作封装在这里，包括post、submit请求、表单验证等
	var form = function() {
		var that = {},
			validateRule,
			validateMessage,
			validateDefault;

		validateRule = {
			'username': {
				string: true
			},
			'password': {
				required: true,
				minlength: 6
			},
			'ag-password': {
				required: true,
				minlength: 6
			},
			'qq': 'required qq',
			'agree': 'required',
			'name': {
				chinese: true,
				maxlength: 4,
				required: true
			},
			'email': 'email required',
			'amount': {
				required: true,
				max: 10000,
				digits: true
			},
			'old-password': 'required',
			'new-password': {
				required: true,
				minlength: 6
			},
			'code': {
				required: true,
				digits: true,
				rangelength: [6, 6]
			},
			'bank-account': {
				required: true,
				digits: true
			},
			'ag-bank-account': {
				required: true,
				equalTo: '#account'
			},
			'content': {
				required: true
			},
			//快刷申请
			'shop': {
				required: true
			},
			'use': {
				required: true
			},
			'feedback': {
				required: true
			}
		};
		validateMessage = {
			'password': {
				required: '请填写密码',
				minlength: '密码长度最小6位'
			},
			'ag-password': {
				required: '请再次输入密码',
				equalTo: '两次输入的密码不符',
				minlength: '密码长度最小6位'
			},
			'qq': {
				required: '请填写QQ号码'
			},
			'agree': {
				required: '请阅读并同意该协议'
			},
			'name': {
				chinese: '请填写正确的真实姓名',
				maxlength: '请填写正确的真实姓名',
				required: '请填写真实姓名'
			},
			'email': {
				email: '请填写正确的邮箱地址',
				required: '请填写常用邮箱地址'
			},
			'amount': {
				required: '请填写充值金额',
				digits: '只能输入整数',
				max: $.validator.format('单笔最高{0}元')
			},
			'old-password': {
				required: '请填写旧密码'
			},
			'new-password': {
				required: '请填写密码',
				minlength: '密码长度最小6位'
			},
			'code': {
				required: '请输入验证邮件中的6位验证码',
				rangelength: '验证码为6位数字'
			},
			'bank-account': {
				required: '请填写银行卡号',
				digits: '请输入正确的银行卡号'
			},
			'ag-bank-account': {
				required: '请再次输入银行卡号',
				equalTo: '两次输入的银行卡号不符'
			},
			'content': {
				required: '请输入内容'
			},
			//快刷申请
			'shop': {
				required: '请选择一项'
			},
			'user': {
				required: '请选择一项'
			},
			'feedback': {
				required: '请填写一些看法和建议'
			}
		};
		validateDefault = {
			errorClass: 'msg-box',
			errorElement: 'div',
			errorPlacement: function(error, element) {
				element.parent().parent().find('.msg-box').remove();
				error.insertAfter(element.parent());
			},
			highlight: function(element) {
				$(element).parents('.form-group').addClass('has-error');
			},
			unhighlight: function(element) {
				$(element).parents('.form-group').removeClass('has-error');
				$(element).parents('.form-group').addClass('has-success');
			}
		};
		var initValidate = (function() {
			$.validator.addMethod('string', function(value, element) {
				return this.optional(element) || (/^[\u0391-\uFFE5\w]+$/.test(value.trim()) && /[^\uff00-\uffff]|[^\u0391-\uFFE5\w]+$/.test(value.trim()));
			}, '只能输入中英文、数字和下划线');
			$.validator.addMethod('chinese', function(value, element) {
				var tel = /^[\u4e00-\u9fa5]+$/;
				return this.optional(element) || tel.test(value);
			}, '请输入汉字');
			$.validator.addMethod('qq', function(value, element) {
				var tel = /^[1-9]\d{4,12}$/;
				return this.optional(element) || (tel.test(value));
			}, '请填写正确的QQ号码');
			$.validator.setDefaults(validateDefault);

			$('form').validate({
				rules: validateRule,
				messages: validateMessage
			});
		}());


		/**
		 * 发送GA事件统计
		 * @param {string} type 事件类型
		 * @param {string} title 事件标题
		 * @param {string} label 事件标签
		 */
		var _gaEvent = function(type, title, label) {
			ga('send', 'event', type, title, label);
		};

		/**
		 * 表单ajax提交
		 * @param {object} $el 表单元素
		 * @param {object} event 包括type、title 事件类型和内容，提示和统计需要
		 * @option {object|function} callback 回调  对象包括success、error事件方法
		 * ，也可以直接传方法，会在data.State === 1 时执行
		 */
		var submit = function($el, event, callback) {
			var _event,
				_message,
				submitOption,
				response;
			_event = event == null ? {
				'type': '未命名事件类型',
				'title': '未命名内容'
			} : event;
			_message = message();
			_message.option.loadingType = 'spinner';
			callback = callback == null ? {} : callback;
			submitOption = {
				dataType: 'json',
				resetForm: false,
				beforeSubmit: function() {
					_message.openLoading();
				},
				success: function(data) {
					response = _message.formatMessage(data);
					_gaEvent(_event.type, _event.title, response);
					if (callback != null) {
						if (data.State === 1) {

							if (typeof callback === 'function') {
								callback(data);
							} else if (typeof callback.success === 'function') {
								callback.success(data);
							}
							_message.closeLoading();
							_message.addNotice(true, _event.title + '操作成功');
						} else {
							if (typeof callback.error === 'function') {
								callback.error(data);
							}
							_message.closeLoading();
							_message.addNotice(false, _event.title + '操作失败：' + response);
						}
					}
				}
			};
			if ($el.valid()) {
				$el.ajaxSubmit(submitOption);
			}
		};
		that.submit = submit;

		/**
		 * public ajaxPost 进行post操作，封装了ga统计、loading效果等
		 * @param  {string} url post地址
		 * @param {object} params  post的数据对象
		 * @param {object} event 事件对象，包括type,title，用于统计和信息通知提示
		 * @param {function|object}callback 回调，传入function时会在接口返回data.State === 1 时执行，
		 *       传入object,包括success,error两个事件，分别在State === 1 和 State !== 1 执行
		 *       回调会回传接口返回的data对象
		 */
		var ajaxPost = function(url, params, event, callback) {
			var _event,
				_message,
				response;
			_event = event == null ? {
				'type': '未命名事件类型',
				'title': '未命名内容'
			} : event;
			_message = message();
			_message.option.loadingType = 'spinner';
			callback = callback == null ? {} : callback;
			_message.openLoading();
			$.post(url, params, function(data) {
				response = _message.formatMessage(data);
				_gaEvent(_event.type, _event.title, response);
				if (data.State === 1) {
					if (typeof callback === 'function') {
						callback(data);
					} else if (typeof callback.success === 'function') {
						callback.success(data);
					}
					_message.closeLoading();
					_message.addNotice(true, _event.title + '操作成功');
				} else {
					if (typeof callback.error === 'function') {
						callback.error(data);
					}
					_message.closeLoading();
					_message.addNotice(false, _event.title + '操作失败：' + response);
				}
			}, 'json');
		};
		that.ajaxPost = ajaxPost;

		return that;
	};

	/**
	 * message组件 操作一些网站通知相关的操作，例如右上角通知notice，alert框体，spinner等
	 * @constructor
	 */
	var message = function(option) {
		var that = {},
			defaults;
		defaults = {
			messageType: 'notice',
			//成功时的通知class名
			noticeSuccess: 'bg_lb',
			//失败时的通知class名
			noticeFailure: 'bg_lo',
			//alert容器
			alertContainer: '#alert-box',
			//alert html内容
			alertHTML: [
				'<div class="alert alert-{type} alert-dismissable" role="alert">',
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
				'<h4>{title}</h4>{content}',
				'</div>'
			].join(''),
			loadingType: 'spinner',
			loadingButton: 'button[type="submit"]'
		};
		option = $.extend(option, defaults);
		that.option = option;

		/**
		 * private loadingSpinner 开启或关闭loading spinner图标
		 * @type {{open: Function, close: Function}}
		 * @private
		 */
		var _loadingSpinner = {
			open: function() {
				layer.load('提交中...');
			},
			close: function() {
				layer.closeAll();
			}
		};

		/**
		 * private loadingButton 将表单按钮切换到loading状态
		 * @type {{open: Function 开启loading状态, close: Function 还原按钮}}
		 * @private
		 */
		var _loadingButton = {
			open: function() {
				$(option.loadingButton).button('loading');
			},
			close: function() {
				$(option.loadingButton).button('reset');
			}
		};

		/**
		 * public openLoading 开启loading图标
		 */
		var openLoading = function() {
			if (option.loadingType === 'button') {
				_loadingButton.open();
			} else {
				_loadingSpinner.open();
			}
		};
		that.openLoading = openLoading;


		/**
		 * public closeLoading 关闭loading图标
		 */
		var closeLoading = function() {
			if (option.loadingType === 'button') {
				_loadingButton.close();
			} else {
				_loadingSpinner.close();
			}

		};
		that.closeLoading = closeLoading;

		/**
		 * public addNotice 添加一个网站右上角通知信息
		 * @param isSuccess 成功还是失败
		 * @param text  通知内容
		 */
		var addNotice = function(isSuccess, text) {
			$.gritter.add({
				title: isSuccess ? '成功' : '失败',
				text: text,
				sticky: false,
				class_name: isSuccess ? option.noticeSuccess : option.noticeFailure
			});
		};
		that.addNotice = addNotice;

		/**
		 * public addAlert 添加一个警告框
		 * @param {object} $e JQuey DOM对象，传入alert的父元素
		 * @param {string} title 标题
		 * @param {string} content 内容
		 * @param {string} type alert类型 info/success/danger/primary
		 */
		var addAlert = function($e, title, content, type) {
			var container,
				html,
				replace,
				alertPage;
			container = $e.find(option.alertContainer);
			html = option.alertHTML;
			replace = {
				type: type,
				title: title,
				content: content
			};
			alertPage = page();
			html = alertPage.formatString(html, replace);
			container.html(html);
		};

		that.addAlert = addAlert;

		/**
		 * 对接口返回的JSON对象进行一些错误状态的处理，返回处理后的Message文本
		 * 不返回整个对象是为了方便直接输出错误信息
		 * @param {object}data
		 * @returns {string}
		 */
		var formatMessage = function(data) {
			var message;
			message = {
				'0': '发生了未知的错误',
				'1': '成功',
				'-3': '会话非法，请重新登录',
				'-4': '登录已超时，请重新登录',
				'-5': '你没有对应的权限'
			};
			data.Message = typeof(message[data.State]) === 'undefined' ? data.Message : message[data.State];
			return data.Message;
		};

		that.formatMessage = formatMessage;

		return that;
	};

	/**
	 * 事件操作组件
	 */
	var event = function() {
		var that = {};

		/**
		 * public bindEvent 绑定事件，这里进行一层封装方便以后的扩展和更换绑定方法
		 *        这里统一事件绑定到document，方便支持ajax load的元素
		 * @param {string} event 事件类型 例如 'click','submit'
		 * @param {string} element 事件触发选择器
		 * @param {function} callback 回调事件，会回调事件触发的JQuery DOM对象 和 事件对象
		 */
		var bindEvent = function(event, element, callback) {
			//加入off，防止重复绑定
			$(document).off(event, element).on(event, element, function(e) {
				if ($(element).is('a,form')) {
					e.preventDefault();
				}
				callback($(this), e);
			});
		};
		that.bindEvent = bindEvent;

		return that;
	};

	/**
	 * 业务组件，所有具体页面效果、业务操作逻辑都在这里实现
	 */
	var business = (function() {
		var businessForm,
			businessEvent,
			businessMessage,
			businessPage;

		businessForm = form();
		businessEvent = event();
		businessMessage = message();
		businessPage = page();

		//扩展sco.modal的default参数，重写onloaded事件，为的是初始化插件效果，让load过来的modal拥有一致的效果
		$.extend($.fn.scojs_modal.defaults, {
			onloaded: function() {
				_initPlugin();
			}
		});

		var _initPlugin = function() {
			var client;
			//JQuery.placeholder.js
			$('input,textarea').placeholder();
			//JQuery.datatable.js
			$('.data-table').dataTable({
				info: false
			});
			//Jquery.select2.js
			$('.select2').select2();
			//Bootstrap.sco.js
			$('[data-toggle="tooltip"]').tooltip({
				container: 'body'
			});
			//zeroclipboard.js
			//先销毁事件，防止重复绑定
			ZeroClipboard.destroy();
			client = new ZeroClipboard($('.text-to-copy'));
			client.off('aftercopy').on('aftercopy', function(e) {
				businessMessage.addNotice(true, $(e.target).attr('data-after-copy'));
			});
			//jquery.countdown.js
			$('[data-method="count-down"]').each(function() {
				$(this).countdown({
					date: new Date(),
					offset: +$(this).attr('data-time') * 1000,
					render: function(data) {
						$(this.el).html([
							'<div>',
							this.leadingZeros(data.days, 1),
							' <span>天</span></div><div>',
							this.leadingZeros(data.hours, 2),
							' <span>小时</span></div><div>',
							this.leadingZeros(data.min, 2),
							' <span>分</span></div><div>',
							this.leadingZeros(data.sec, 2),
							' <span>秒</span>',
							'</div>'
						].join(''));
					}
				});
			});

		};

		/**
		 * @private initStarRate 初始化星级评分插件
		 * @param {object}$el 要初始化的input JQuery DOM对象
		 */
		var _initStarRate = function($el) {
			var option;
			option = {
				min: 0,
				max: 5,
				step: 1,
				size: 'md',
				showClear: false,
				//评分选项
				starCaptions: {
					1: '差评',
					2: '差评',
					3: '中评',
					4: '好评',
					5: '好评'
				},
				starCaptionClasses: function(val) {
					if (val === 0) {
						return 'label label-default';
					} else if (val < 3) {
						return 'label label-danger';
					} else {
						return 'label label-success';
					}
				}
			};
			$el.rating(option);
			// 修复IE8 评分栏不显示的问题
			if (navigator.userAgent.indexOf('MSIE 8.0') > 0) {
				var head = document.getElementsByTagName('head')[0],
					style = document.createElement('style');
				style.type = 'text/css';
				style.styleSheet.cssText = ':before,:after{content:none !important';
				head.appendChild(style);
				setTimeout(function() {
					head.removeChild(style);
				}, 0);
			}
		};

		//初始化主导航效果
		//@todo 不使用class作为选择器
		var initNavMain = (function() {
			var parentWidth,
				width;
			$('.nav-main li').each(function() {
				if ($(this).attr('id') === 'sel-item') {
					$(this).append('<span class="current"></span>');
				}
			});
			parentWidth = $('.nav-main li .current').parent().width();
			width = $('.nav-main li .current').width();
			$('.nav-main li .current').css('left', parentWidth / 2 - width / 2);
		}());

		//初始化头部菜单
		var initTopMenu = (function() {

			$('[data-method="drop-down"]').hover(function() {
				$(this).toggleClass('hover');
				$(this).children('ul').toggle();
			});

			//获取菜单数据
			//先判断是否存在头部菜单元素，以免没有头部菜单的首页，登录前页面等执行这个方法
			if ($('[data-method="drop-down"]').length !== 0) {
				$.get('/main/get_member_info', function(data) {
					if (data.State === -4) {
						window.location = '/member/login';
					} else {
						$('#top-point').text(data.point);
						$('#top-amount').text(data.amount);
						$('#top-credit').text(data.credit);
					}
				}, 'json');
			}
		}());

		//初始化tab导航效果
		//@todo 不使用class来做事件注册、改用data-*，尽量解耦
		var initNavTab = (function() {
			$('.nav-tab li').each(function(i) {
				$(this).click(function() {
					$('.nav-tab >li.sel').removeClass('sel');
					$(this).addClass('sel');
					$('.tab-main-content >ul >li').hide();
					$('.tab-main-content >ul >li').eq(i).show();
				});
			});
		}());

		//初始化borderTab导航效果
		//@todo 不使用class来做事件注册、改用data-*，尽量解耦
		var initNavTabBorder = (function() {
			$('.nav-tab-border li').each(function(i) {
				$(this).click(function() {
					$('.nav-tab-border li').removeClass('active');
					$(this).addClass('active');
					$('.list-rank li').hide();
					$('.list-rank').find('li').eq(i).show();
				});
			});
		}());

		/**
		 * @private initEmailTime 初始化邮件发送计时效果
		 * @param {object} $button  发送邮件的按钮DOM对象
		 * @param {object} $timer 记录时间用的DOM对象
		 */
		var _initEmailTime = function($button, $timer) {
			var wait;
			wait = $timer.text();
			return (function() {
				if (wait === '0') {
					$button.text('重新发送验证码');
					return $timer.text(60);
				} else {
					$button.text('已发送邮件(' + wait + ')');
					wait--;
					$timer.text(wait);
					setTimeout(function() {
							_initEmailTime($button, $timer);
						},
						1000);
				}
			}());
		};

		//用户登录
		var userLogin = (function() {
			var clientId,
				event,
				option;
			businessEvent.bindEvent('submit', '#login-form', function($el) {
				//获取ga的跟踪id，传给接口，统计用
				ga(function(tracker) {
					clientId = tracker.get('clientId');
					$('input[name="client-id"]').val(clientId);
				});
				event = {
					type: '用户',
					title: '登录'
				};
				option = {
					success: function() {
						window.location = '/main';
					},
					error: function(data) {
						if (data.Message === '账户未激活') {
							window.location = '/member/register_active';
						}
					}
				};
				businessForm.submit($el, event, option);
			});
		}());

		var userRegister = (function() {
			var event;
			businessEvent.bindEvent('submit', '#register-form', function($el) {
				event = {
					type: '用户',
					title: '注册账号'
				};
				businessForm.submit($el, event, function() {
					window.location = '/member/register_active';
				});
			});
		}());

		var resetPassword = (function() {
			var event;
			businessEvent.bindEvent('submit', '#retrieve-form', function($el) {
				event = {
					type: '用户',
					title: '重置密码'
				};
				businessForm.submit($el, event, function() {
					window.location = '/member/reset_password_ok';
				});
			});
		}());

		var userActive = (function() {
			var event,
				email;
			businessEvent.bindEvent('submit', '#active-form', function($el) {
				event = {
					type: '用户',
					title: '完善资料'
				};
				email = $('input[name="email"]').val();
				businessForm.submit($el, event, function() {
					window.location = '/member/register_email?email=' + email;
				});
			});
		}());

		var updatePassword = (function() {
			var event;
			businessEvent.bindEvent('submit', '#update_password_form', function($el) {
				event = {
					type: '用户',
					title: '修改密码'
				};
				businessForm.submit($el, event, function() {
					$el.clearForm();
				});
			});
		}());

		var updateMember = (function() {
			var event;
			businessEvent.bindEvent('submit', '#update-member-form', function($el) {
				event = {
					'type': '用户',
					'title': '修改资料'
				};
				businessForm.submit($el, event, function() {
					$('.form-box').load('/main/member_info .form-box > form');
				});
			});
		}());

		var addFeedback = (function() {
			var event;
			businessEvent.bindEvent('submit', '#feedback-form', function($el) {
				event = {
					'type': '帮助中心',
					'title': '发表反馈'
				};
				businessForm.submit($el, event, function() {
					$el.clearForm();
				});
			});
		}());

		var addBlackList = (function() {
			var event;
			businessEvent.bindEvent('submit', '#insert-black-list-form', function($el) {
				event = {
					type: '用户',
					title: '添加黑名单'
				};
				businessForm.submit($el, event, function() {
					$("#blacklist-table").load("/main/black_list #blacklist-table > table", function() {
						$("input[type='text']").val('');
					});
				});
			});
		}());

		var deleteBlackList = (function() {
			var event,
				gid;
			businessEvent.bindEvent('click', '#blacklist-table .del-record', function($el) {
				event = {
					type: '用户',
					title: '删除黑名单'
				};
				gid = $el.attr('data-key');
				businessForm.ajaxPost('/main/del_black_list', {
					id: gid
				}, event, function() {
					$el.parent().parent().hide('normal');
				});
			});
		}());

		var changeService = (function() {
			var event,
				service;
			businessEvent.bindEvent('submit', '#change-service-form', function($el) {
				event = {
					type: '用户',
					title: '更改专属客服'
				};
				service = $el.find(':selected').val();
				businessForm.submit($el, event, function() {
					$('.server-info span').text(service);
					$.scojs_modal().close();
				});
			});

		}());

		var rechargeSubmit = (function() {
			var event;
			businessEvent.bindEvent('submit', '#taobao-recharge-form', function($el) {
				event = {
					type: '淘宝充值',
					title: '提交充值'
				};
				businessForm.submit($el, event, function() {
					_loadRechargeSuccess();
				});
			});
		}());

		//@todo 不使用class作为选择器
		var _loadRechargeSuccess = function() {
			var source,
				replace,
				html;
			source = $('#step-ok').html();
			$.get('/main/get_member_info', function(data) {
				replace = {
					Money: data.amount
				};
				html = businessPage.formatString(source, replace);
				$('.taobaolink-step-con').html(html);
			}, 'json');
		};

		var _loadWithdrawSuccess = function($el) {
			var html;
			html = $('#withdraw-ok').html();
			$el.html(html);
		};

		var withdrawTaobaoConfirm = (function() {
			var source,
				account,
				item,
				amount,
				html;
			businessEvent.bindEvent('click', '[data-method="taobao-withdraw-confirm"]', function() {
				source = $('#taobao-step-2').html();
				account = $("#tb-account").find("option:selected").val();
				item = $("input[name='url']").val();
				amount = parseFloat($("#taobao-money").val() === '' ? 0 : $("#taobao-money").val());
				html = businessPage.formatString(source, {
					account: account,
					amount: amount,
					item: item
				});
				$('#taobao-withdraw-container').html(html);

			});
		}());

		var withdrawTaobaoSubmit = (function() {
			var event,
				$container;
			businessEvent.bindEvent('submit', '#withdraw-taobao-form', function($el) {
				event = {
					type: '提现',
					title: '淘宝提现'
				};
				businessForm.submit($el, event, function() {
					$('#withdraw-table').load('/fund/withdraw #withdraw-table > table', '', function() {
						$container = $('#taobao-withdraw-container');
						_loadWithdrawSuccess($container);
					});
				});
			});


		}());

		var addGuarantee = (function() {
			var event;
			businessEvent.bindEvent('submit', '#set-guarantee-form', function($el) {
				event = {
					type: '用户',
					title: '加入商保'
				};
				businessForm.submit($el, event, function() {
					$('.col-xs-10').load('/main/guarantee .col-xs-10 > div');
				});
			});
		}());

		var exitGuarantee = (function() {
			var event;
			businessEvent.bindEvent('submit', '#exit-guarantee-form', function($el) {
				event = {
					type: '用户',
					title: '退出商保'
				};
				businessForm.submit($el, event, function() {
					$('.col-xs-10').load('/main/guarantee .col-xs-10 > div');
				});
			});
		}());

		var complainUploadFile = (function() {
			var id,
				name,
				type,
				length,
				box,
				imgName,
				source;
			businessEvent.bindEvent('change', '[data-method="complain-upload"]', function($el) {
				$('#alert-box').html('');
				id = $el.attr('id');
				name = $el.attr('name');
				type = $el.attr('data-type');
				length = $el.parent().parent().find('.file-icon').size();
				box = $el.parent().parent().find('.file-icon-box');
				imgName = (type === '0' ? 'pt_img_url-' : 'tb_img_url-') + (length + '');
				if (length >= 5) {
					businessMessage.addAlert($('.modal'), '上传失败', '最多上传5张图片', 'danger');
				} else {
					$.ajaxFileUpload({
						url: '/complain/upload_img/' + name,
						secureuri: false,
						dataType: 'json',
						fileElementId: id,
						success: function(result) {
							if (result.State) {
								source = [
									'<span>',
									'<a href="{src}" target="_blank" class="thumbnail"><img alt="上传的图片" src="{src}"></a>',
									'<input type="hidden" name="{name}" value="{src}">',
									'</span>'
								].join('');
								source = businessPage.formatString(source, {
									src: result.Data,
									name: imgName
								});
								box.append(source);
							} else {
								businessPage.addAlert($('.modal'), '上传失败!', businessMessage.formatMessage(result), 'danger');
							}
						}
					});
				}
			});
		}());

		var _loadBuyBlackListSuccess = function() {
			var number,
				source,
				html;
			number = $('input[name="number"]').val();
			source = $('#blacklist-step-3').html();
			html = businessPage.formatString(source, {
				number: number
			});
			$('#buy-content').html(html);
			_switchBuyStep(2);
		};
		var sellPointConfirm = (function() {
			var number,
				price,
				amount,
				source,
				html;
			businessEvent.bindEvent('click', '[data-method="sell-point-confirm"]', function() {
				number = $('input[name="number"]').val();
				price = $('input[name="price"]').val();
				amount = window.Math.round(number * price * 100) / 100;
				source = document.getElementById('sell-fbd-step-2').innerHTML;
				html = businessPage.formatString(source, {
					number: number,
					amount: amount
				});
				$('#buy-content').html(html);
				_switchBuyStep(1);
			});
		}());

		var _loadSellPointSuccess = function() {
			var number,
				amount,
				source,
				html;
			number = $('input[name="number"]').val();
			amount = $('input[name="amount"]').val();
			source = $('#sell-fbd-step-3').html();
			html = businessPage.formatString(source, {
				number: number,
				amount: amount
			});
			$('#buy-content').html(html);
			_switchBuyStep(2);
		};

		var filterTaskList = (function() {
			businessEvent.bindEvent('click', '.filter-task a', function($el) {
				$el.parent().parent().find('.now-sel').removeClass('now-sel');
				$el.addClass('now-sel');

				_getTaskList($el);
			});
		}());
		var _getTaskList = function($el) {
			var parent,
				val,
				price,
				time,
				sort,
				parameter;
			//li元素
			parent = $el.parent();
			val = $el.attr('data-val');
			//ul元素 写入当前切换的值，只在父元素中找input是为了精确定位到所选择的条件，不影响到其他条件
			parent.parent().find('input[type="hidden"]').val(val);

			//记录值后，再拿出所有的值，拼接url进行任务内容的get
			price = $('input[name="price"]').val();
			time = $('input[name="time"]').val();
			sort = $('input[name="sort"]').val();
			businessMessage.openLoading();
			parameter = 'price=' + price + '&time=' + time + '&sort=' + sort;
			$('#task-panel').load('/task #task-panel > div', parameter, function() {
				businessMessage.closeLoading();
			});
		};

		var initSendEmail = (function() {
			var $timer,
				href;
			businessEvent.bindEvent('click', 'a[data-method="email-send"]', function($el) {
				$timer = $('#timer');
				href = $el.attr('href');
				if (parseInt($timer.text(), 10) < 60) {
					businessMessage.addNotice(false, '请不要频繁操作!');
				} else {
					_initEmailTime($el, $timer);
					$.get(href, '', function(data) {
						if (data.State < 1) {
							businessMessage.addNotice(false, businessMessage.formatMessage(data));
						}
					}, 'json');
				}
			});
		}());

		var deleteTbaccount = (function() {
			var event,
				gid,
				confirm;
			businessEvent.bindEvent('click', 'a[data-method="delete-tbaccount"]', function($el) {
				event = {
					type: '用户',
					title: '删除淘宝账号'
				};
				gid = $el.attr('data-key');
				confirm = $.scojs_confirm({
					title: '删除淘宝账号',
					content: '确定要删除该淘宝账号吗？',
					action: function() {
						businessForm.ajaxPost('/main/del_tbaccount', {
							gid: gid
						}, event, function() {
							$el.parent().parent().hide('normal');
						});
					}
				});
				confirm.show();
			});
		}());

		var bindTbaccount = (function() {
			var event;
			businessEvent.bindEvent('submit', '#bind-tbaccount-form', function($el) {
				event = {
					type: '用户',
					title: '添加淘宝账号'
				};
				businessForm.submit($el, event, function() {
					$('#tbaccount-table').load('/main/tbaccount #tbaccount-table > table', function() {
						$('input[type="text"]').val('');
					});
				});
			});
		}());

		var bindTbaccountWizard = (function() {
			var event,
				postData;
			event = {
				type: '用户',
				title: '添加淘宝账号'
			};
			businessEvent.bindEvent('click', '[data-method="wizard-add-tbaccount"]', function($el) {
				postData = {
					//因为modal是复制页面上的内容重新显示出来的，所以必须在modal里边拿值，否则会出现获取不到元素的情况
					name: $('.modal').find('input[name="name"]').val(),
					type: 2
				};
				businessForm.ajaxPost('/main/bind_tbaccount', postData, event, function() {
					$el.button('complete');
				});
			});
		}());

		var withdrawAlipayConfirm = (function() {
			var gid,
				account,
				amount,
				poundage,
				source,
				replace,
				html;
			businessEvent.bindEvent('click', '.alipay-submit', function() {
				gid = $('#alipay').find('option:selected').val();
				account = $('#alipay').find('option:selected').text();
				amount = $('#alipay-amount').val();
				poundage = $('#poundage').text();
				source = $('#alipay-step-2').html();
				replace = {
					gid: gid,
					account: account,
					amount: amount,
					real: amount - poundage,
					poundage: poundage
				};
				html = businessPage.formatString(source, replace);
				$('#alipay-withdraw-container').html(html);
			});
		}());

		var withdrawAlipaySubmit = (function() {
			var event,
				$container;
			event = {
				type: '提现',
				title: '支付宝提现'
			};
			businessEvent.bindEvent('submit', '#alipay-withdraw-form', function($el) {
				$container = $('#alipay-withdraw-container');
				businessForm.submit($el, event, function() {
					$('#withdraw-table').load('/fund/withdraw #withdraw-table > table', '', function() {
						_loadWithdrawSuccess($container);
					});
				});
			});
		}());

		/**
		 * @private sumArray DOM数组text求和
		 * @param {array} arr 要求和的数组DOM元素
		 * @returns {number} total 求和结果
		 *
		 */
		var _sumArray = function(arr) {
			var sum,
				length,
				total = 0;
			sum = function(i) {
				return (function(i) {
					total += +$(arr[i]).text();
				}(i));
			};
			length = arr.length;
			for (var i = 0; i <= length; i++) {
				sum(i);
			}
			return total;
		};

		var _initTaskCount = function() {
			var taskAmount,
				taskPoint,
				totalAmount,
				totalPoint;
			taskAmount = $('body').find('[data-method="task-amount"]');
			taskPoint = $('body').find('[data-method="task-point"]');
			totalAmount = _sumArray(taskAmount);
			totalPoint = _sumArray(taskPoint);

			$('[data-method="total-amount"]').text(totalAmount.toFixed(2));
			$('[data-method="total-point"]').text(totalPoint.toFixed(2));
		};

		var acceptTask = (function() {
			var event,
				gid,
				task,
				parent,
				option;
			businessEvent.bindEvent('submit', '#task-accept-form', function($el) {
				event = {
					type: '任务',
					title: '接手任务'
				};
				gid = $('input[name="gid"]').val();
				task = $('[data-gid="' + gid + '"]');
				parent = $('input[name="tbaccount"]:checked').parent().parent();

				option = {
					success: function() {
						$.scojs_modal().close();
						task.hide('normal');
					},
					error: function(data) {
						parent.find('.text-danger').html(businessMessage.formatMessage(data));
					}
				};
				businessForm.submit($el, event, option);
			});

		}());

		/**
		 * @private amountToPoint 金额转换发布点，发布任务添加宝贝用
		 * @param {number} amount  金额
		 * @returns {number} 发布点数
		 *
		 */
		var _amountToPoint = function(amount) {
			var amountRange,
				length;
			amount = +amount.toFixed(2);
			amountRange = [
				[(-Infinity), 40],
				[40, 80],
				[80, 120],
				[120, 200],
				[200, 500],
				[500, 1000],
				[1000, Infinity]
			];
			length = amountRange.length;
			while (length--) {
				if (amount > amountRange[length][0] && amount <= amountRange[length][1]) {
					return length + 1;
				}
			}
		};

		var _totalPoint = function(n) {
			var old,
				number;
			old = parseFloat($('#total-point').text());
			number = parseFloat(n);
			old = old + number;
			old = old < 0 ? 0 : old;
			$('#total-point').text(old.toFixed(2));
		};

		var _totalAmount = function(n) {
			var old,
				number;
			old = parseFloat($('#total-amount').text());
			number = parseFloat(n);
			old = old + number;
			old = old < 0 ? 0 : old;
			$('#total-amount').text(old.toFixed(2));
		};

		var _initItemPrice = function() {
			var point,
				amount;
			//通过宝贝价格计算发布点
			businessEvent.bindEvent('change', 'input[data-method="item-price"]', function($el) {
				amount = parseFloat($el.val());
				point = _amountToPoint(amount);
				$('#item-point').text(point);
				$('#pro-dot').val(point);
			});
		};

		var _initTaskTime = function() {
			var length,
				width,
				total,
				parentWidth;
			businessEvent.bindEvent('click', '[data-method="change-task-time"] span', function($el) {
				length = $el.attr('data-value');
				width = Math.ceil($('.axis-container').width() / 7);
				total = length * width;
				$('.axis-now').css('width', total);
				$('#range_time').val(length);
				_widthToPoint(total);
			});
			businessEvent.bindEvent('click', '[data-method="add-task-time"]', function() {
				parentWidth = $('.axis-container').width();
				width = $('.axis-now').width();
				total = width + Math.ceil(parentWidth / 7);
				if (total > parentWidth) {
					total = parentWidth;
				}
				$('#range_time').val(total * (7 / parentWidth));
				if (width != parentWidth) {
					$('.axis-now').css('width', total);
				}
				_widthToPoint(total);
			});
		};

		var _widthToPoint = function(widthNow) {
			var $el,
				old,
				widthTotal,
				point,
				lengthRange,
				unitLength;
			$el = $('.add-dot-span');
			old = $('#axis-number').val();
			//发布任务时间轴的总长度
			widthTotal = $('[data-method="task-time-axis"]').width();
			//立即收货－七天收货的发布点数
			lengthRange = [0, 1, 2, 3, 3.5, 4, 4.5, 5];
			unitLength = widthTotal / 7;
			point = lengthRange[widthNow / unitLength];
			$el.text(point);
			$('#axis-number').val(point);
			point = point - old;
			_totalPoint(point);
		};

		var _initToggle = function() {
			var $relativeElement;
			businessEvent.bindEvent('click', '[data-method-toggle]', function($el) {
				$relativeElement = $('#' + $el.attr('data-method-toggle'));
				//去掉隐藏的输入框的值，触发change事件，为了重新计算总发布点数
				$relativeElement.find('input,textarea').val('');
				$relativeElement.find('input,textarea').trigger('change');
				$relativeElement.toggle();
			});
		};

		var _initFeaturePoint = function() {
			var point,
				$pointContainer,
				oldPoint;
			businessEvent.bindEvent('click', 'input[data-method-point]', function($el) {
				//单选框控件的话，先把旧的选项发布点数缓存到父元素form-group，方便计算发布点加减
				if ($el.is('input[type="radio"]')) {
					$pointContainer = $el.parent().parent();
				} else {
					$pointContainer = $el;
				}
				oldPoint = $pointContainer.attr('data-point') || 0;
				point = $el.attr('data-method-point');
				if ($el.is(':checked')) {
					_totalPoint(-oldPoint);
					_totalPoint(point);
					$pointContainer.attr('data-point', point);
				} else {
					_totalPoint(-point);
				}
			});
		};

		var _initExtraPoint = function() {
			var value,
				$old,
				newValue;
			businessEvent.bindEvent('change', 'input[name="point"]', function($el) {
				value = $el.val();
				$old = $('input[name="md-dot"]');
				newValue = value - $old.val();
				$old.val(value);
				_totalPoint(newValue);
			});
		};

		var initAddBlacklist = (function() {
			var $el;
			$('#reason').change(function() {
				$el = $('#remark-input');
				if ($(this).val() === '0') {
					$el.show();
				} else {
					$el.hide();
				}
			});
		}());

		//@todo 重构这里
		var initPageList = (function() {
			$(document).on('click', '.withdraw-pages a', function(e) {
				e.preventDefault();
				var page = $(this).attr('data-page');
				businessMessage.openLoading();
				var parameter = 'page=' + page;
				$('#withdraw-table').load('/fund/withdraw #withdraw-table > table', parameter, function() {
					businessMessage.closeLoading();
				});
			});
			/* 提现列表翻页，跳转指定页面 */
			$(document).on('submit', '.withdraw-pages form', function() {
				var page = $('input[name="page"]').val();
				businessMessage.openLoading();
				var parameter = 'page=' + page;
				$('#withdraw-table').load('/fund/withdraw #withdraw-table > table', parameter, function() {
					businessMessage.closeLoading();
				});
				return false;
			});
			$(document).on('click', '#task-pages a', function(e) {
				e.preventDefault();
				var price = $('input[name="price"]').val();
				var time = $('input[name="time"]').val();
				var sort = $('input[name="sort"]').val();
				var page = $(this).attr('data-page');
				businessMessage.openLoading();
				var parameter = 'price=' + price + '&time=' + time + '&sort=' + sort + '&page=' + page;
				$('#task-panel').load('/task #task-panel > div', parameter, function() {
					businessMessage.closeLoading();
					$(window).scrollTop(0);
				});
			});
			/* 任务大厅翻页，跳转指定页面 */
			$(document).on('submit', '.task-pages form', function() {
				var price = $('input[name="price"]').val();
				var time = $('input[name="time"]').val();
				var sort = $('input[name="sort"]').val();
				var page = $('input[name="page"]').val();
				businessMessage.openLoading();
				var parameter = 'price=' + price + '&time=' + time + '&sort=' + sort + 'page=' + page;
				$('.content-container').load('/task .content-container > table', parameter, function() {
					businessMessage.closeLoading();
				});
				return false;
			});
		}());

		var initBuyPoint = (function() {
			var el,
				top,
				left,
				td,
				point,
				amount,
				item;
			$('.point-price-table tbody tr').mouseover(function() {
				$('.point-price-table tbody tr').find('a.buy').css('visibility', 'hidden');
				el = $(this);
				top = el.position().top;
				left = el.position().left;
				td = el.find('td.td-last').html();
				point = el.find('td').eq(2).html();
				amount = el.find('td').eq(3).html();
				item = el.find('td.td-last a').attr('data-item');
				$('#sel-box').css('z-index', 10);
				$('#sel-box').css('top', top);
				$('#sel-box').css('left', left);
				$('#sel-box').html(td);
				$('#sel-box').find('a.buy').attr('data-item', item);
				$('#sel-box').find('a.buy').attr('data-point', point);
				$('#sel-box').find('a.buy').attr('data-amount', amount);
				$('#sel-box').find('a.buy').css('visibility', 'visible');
				$('#sel-box').show();
			});
		}());

		var buyPointConfirm = (function() {
			var itemGid,
				point,
				amount,
				source;
			businessEvent.bindEvent('click', '[data-method="buy-point-confirm"]', function($el) {
				point = $el.attr('data-point');
				amount = $el.attr('data-amount');
				itemGid = $el.attr("data-item");
				source = $('#fbd-step-2').html();
				_switchBuyStep(1);
				source = businessPage.formatString(source, {
					point: point,
					amount: amount,
					gid: itemGid
				});
				$('#buy-content').html(source);
				_initStarRate($('#evaluate-star'));
			});
		}());

		var buyUnitPointConfirm = (function() {
			var point,
				amount,
				itemGid,
				source;
			businessEvent.bindEvent('click', '[data-method="buy-unit-point-confirm"]', function($el) {
				point = $('input[name="number"]').val();
				amount = (point * $('input[name="unit_price"]').val()).toFixed(2);
				itemGid = $el.attr('data-item');
				source = $('#fbd-step-2').html();
				_switchBuyStep(1);
				source = businessPage.formatString(source, {
					point: point,
					amount: amount,
					gid: itemGid
				});
				$('#buy-content').html(source);
				_initStarRate($('#evaluate-star'));
			});
		}());

		var cancelComplain = (function() {
			var gid,
				type,
				event;
			businessEvent.bindEvent('click', '[data-method="cancel-complain"]', function($el) {
				gid = $el.attr('data-gid');
				type = $el.attr('data-type');
				event = {
					type: '投诉管理',
					title: type === -1 ? '撤销投诉' : '不同意撤销'
				};
				businessForm.ajaxPost('complain/operation', {
					gid: gid,
					type: type
				}, event, function() {
					window.location = '/complain';
				});
			});
		}());

		var loadComplain = (function() {
			var url,
				height,
				element;
			businessEvent.bindEvent('click', 'a[data-method="complain-detail"]', function($el) {
				url = $el.attr('href');
				element = '.complain-detail-container';
				businessMessage.openLoading();
				$(element).load(url, function() {
					businessMessage.closeLoading();
					height = $(element).height() + 300;
					$(element).parent().animate({
						height: height
					});
					$(element).animate({
						left: 0
					});
					businessEvent.bindEvent('click', '#returnList', function() {
						$(element).animate({
							left: 1500
						});
					});
				});
			});
		}());

		var appealComplainUpload = (function() {
			var source,
				id,
				name,
				length,
				box,
				imgName;
			source = [
				'<span>',
				'<a href="{src}" target="_blank" class="thumbnail"><img alt="上传的图片" src="{src}"></a>',
				'<input type="hidden" name="{imgName}" value="{src}">',
				'</span>'
			].join('');
			businessEvent.bindEvent('change', '[data-method="appeal-complain-upload"]', function($el) {
				id = $el.attr('id');
				name = $el.attr('name');
				length = $el.parent().parent().parent().find('.file-icon').size();
				box = $el.parent().parent().parent().find('.file-icon-box');
				imgName = 'img-' + (length + '');
				if (length >= 5) {
					businessPage.addAlert($('.modal'), '上传失败', '最多上传5张图片', 'danger');
				} else {
					$.ajaxFileUpload({
						url: '/complain/upload_img/' + name,
						secureuri: false,
						dataType: 'json',
						fileElementId: id,
						success: function(result) {
							if (result.State) {
								source = businessPage.formatString(source, {
									src: result.Data,
									imgName: imgName
								});
								box.append(source);
							} else {
								businessPage.addAlert($('.modal'), '上传失败', businessMessage.formatMessage(result), 'danger');
							}
						}
					});
				}
			});
		}());

		var _loadBuyPointSuccess = function(data) {
			var source,
				html;
			_switchBuyStep(2);
			source = $('#fbd-step-3').html();
			html = businessPage.formatString(source, {
				balance: data.point
			});
			$('#buy-content').html(html);
		};

		//@todo 重构这里
		var initBuyVIP = (function() {
			var value,
				gid,
				unitPrice,
				deduct,
				spare;
			$('input[name="viptime"]').change(function() {
				value = $(this).val();
				if (value === '') {
					$('input[name="else"]').removeAttr('disabled');
					$('input[name="else"]').focus();
					$('input[name="number"]').val(0);
					$('input[name="deduct-money"]').val(0);
					$('input[name="spare-money"]').val(0);
				} else {
					$('input[name="else"]').attr('disabled', 'disabled');
					$('input[name="else"]').val('');
					gid = $(this).attr('data-item');

					value = parseInt($(this).val(), 10);
					unitPrice = $('input[name="else"]').attr('data-amount');
					deduct = $(this).attr('data-amount');
					spare = unitPrice * value - deduct;
					$('.deduct-money').html(deduct);
					$('.spare-money').html(spare);

					$('input[name="number"]').val(value);
					$('input[name="deduct-money"]').val(deduct);
					$('input[name="spare-money"]').val(spare);
					$('input[name="gid"]').val(gid);
				}
			});
			$('input[name="else"]').change(function() {
				var value,
					deduct,
					gid,
					spare;
				value = $(this).val() === '' ? 0 : parseInt($(this).val(), 10);
				deduct = $(this).attr('data-amount') * value;
				gid = $('input[name="else"]').attr('data-item');
				spare = 0;

				$('.deduct-money').html(deduct);
				$('.spare-money').html(spare);
				$('input[name="number"]').val(value);
				$('input[name="deduct-money"]').val(deduct);
				$('input[name="spare-money"]').val(spare);
				$('input[name="gid"]').val(gid);
			});
		}());

		var buyVIPConfirm = (function() {
			var number,
				amount,
				gid,
				source,
				replace,
				html;
			businessEvent.bindEvent('click', '[data-method="buy-vip-confirm"]', function() {
				number = $('input[name="number"]').val();
				amount = $('input[name="deduct-money"]').val();
				gid = $('input[name="gid"]').val();
				source = $('#vip-step-2').html();
				replace = {
					number: number,
					amount: amount,
					gid: gid
				};
				html = businessPage.formatString(source, replace);
				$('#buy-content').html(html);
				_switchBuyStep(1);
				_initStarRate($('#evaluate-star'));
			});
		}());

		/**
		 * @private loadBuyVIPSuccess 加载购买发布点成功页面
		 * @param {string} time vip到期时间
		 */
		var _loadBuyVIPSuccess = function(time) {
			var source,
				html;
			source = $('#vip-step-3').html();
			html = businessPage.formatString(source, {
				time: time
			});
			$('#buy-content').html(html);
			_switchBuyStep(2);
		};

		var appealComplain = (function() {
			var event = {
				type: '投诉管理',
				title: '申诉提交'
			};
			businessEvent.bindEvent('submit', '#appeal-form', function($el) {
				businessForm.submit($el, event, function() {
					window.location = '/complain/is_complain';
				});
			});
		}());

		var complainTask = (function() {
			var event,
				href,
				params;
			event = {
				type: '投诉管理',
				title: '投诉任务'
			};
			businessEvent.bindEvent('submit', '#complain-form', function($el) {
				href = window.location.href;
				businessForm.submit($el, event, function() {
					params = 'state=' + $('#filter-task-state li.active').attr('data-state');
					$('#task-container').load(href + ' #task-container > div', params, function() {
						_initTaskCount();
						$.scojs_modal().close();
					});
				});
			});
		}());

		var _initAddItemModal = function() {
			var option,
				length,
				modal,
				$select;
			businessEvent.bindEvent('click', '[data-method="add-item-modal"]', function($el) {
				option = '<option value="3" data-text="店内搜索">店内搜索</option>';
				length = $('.item').size();
				if (length < 5) {
					modal = $.scojs_modal({
						title: '添加宝贝',
						remote: $el.attr('href'),
						target: 'add-pro-form',
						onloaded: function() {
							$select = $('select[name="pro-address-sl"]');
							//如果已经添加了其他宝贝，就显示店内搜索选项
							if (length > 0) {
								$select.append(option);
							}
						}
					});
					modal.show();
				} else {
					businessMessage.addNotice(false, '宝贝已达上限');
				}
			});
		};

		//@todo 重构这里，太过繁琐
		var addItem = (function() {
			var event,
				modal,
				source,
				tbAccount,
				itemImg,
				price,
				point,
				address,
				addressText,
				searchType,
				keyword,
				searchRemark = '',
				reference,
				compare,
				postData,
				replace,
				id,
				html;
			event = {
				type: '任务',
				title: '添加宝贝'
			};
			businessEvent.bindEvent('click', '[data-method="add-item"]', function($el) {
				modal = $el.closest('.modal');
				source = $('#temp-1').html();
				tbAccount = $('#shopkeeper option:selected').text();
				itemImg = $('#pro-address').val();
				price = parseFloat($('#pro-price').val());
				point = parseFloat($('#pro-dot').val());
				address = $('#pro-address').val();
				addressText = $('#pro-address-sl').find('option:selected').attr('data-text');
				searchType = $('#pro-address-sl').val();
				//来路类型、来路关键词、来路备注
				switch (searchType) {
					//淘宝搜索
					case '2':
						point += 0.5;
						keyword = $('#taobao-search').find('input[name="pro-key"]').val();
						searchRemark = [
							$('#pro-sort').val(),
							'第' + $('#pro-page').val() + '页',
							'第' + $('#pro-position').val() + '位'
						].join('-');
						break;
						//店内搜索，没有来路备注
					case '3':
						keyword = $('#shop-search').find('input[name="pro-key"]').val();
						break;
					default:
						keyword = '';
				}
				//货比三家
				if ($('input[name="compare"]').is(':checked')) {
					compare = '货比三家';
					point += 0.5;
				} else {
					compare = '';
				}
				postData = {
					tbaccount: tbAccount,
					goods: itemImg
				};
				businessForm.ajaxPost('/task/get_goodsimg', postData, event, function(data) {
					id = $('.item').size();
					replace = {
						id: id + 1,
						itemImg: data.Data,
						amount: price,
						point: point,
						address: address,
						addressText: addressText,
						keyword: keyword,
						searchRemark: searchRemark,
						reference: reference,
						compare: compare,
						searchType: searchType
					};
					html = businessPage.formatString(source, replace);
					$('.item-container').append(html);

					//调整添加按钮位置
					$('.btn-add-item').css('left', '410px');

					//不设置来路的话 隐藏来路信息
					if ($('#pro-address-sl').val() === '1') {
						$('.sel-adr-' + (id + 1)).hide();
					}
					//不是淘宝搜索的，隐藏货比三家信息
					if ($('#pro-address-sl').val() !== '2') {
						$('#compare-' + (id + 1)).hide();
					}
					modal.trigger('close');
					_totalAmount(price);
					_totalPoint(point);
					_initDeleteItem();
				});
			});
		}());

		var _deleteItem = function(el, id) {
			var parent,
				amount,
				point,
				itemSize;
			parent = $(el).parent();
			amount = parseFloat(parent.find('input[name="amount-' + id + '"]').val());
			point = parseFloat(parent.find('input[name="dot-' + id + '"]').val());

			_totalAmount(-amount);
			_totalPoint(-point);

			parent.remove();

			itemSize = $('.item').size();
			if (itemSize === 0) {
				$('.btn-add-item').css('left', '0');
			} else {
				$('.btn-add-item').css('left', '410px');
			}
		};

		var _initDeleteItem = function() {
			var length,
				deleteItem;
			deleteItem = function(i) {
				return (function(i) {
					businessEvent.bindEvent('click', '#del-item-' + i, function() {
						_deleteItem('#del-item-' + i, i);
					});
				}(i));
			};
			length = $('.item').length;
			for (var i = 0; i <= length; i++) {
				deleteItem(i);
			}
		};

		var _initSchedule = function() {
			businessEvent.bindEvent('click', 'input[name="is-schedule"]', function($el) {
				if ($el.is(':checked')) {
					$('input[name="schedule"]').removeAttr('disabled');
				} else {
					$('input[name="schedule"]').attr('disabled', 'disabled');
				}
			});
		};

		var _releaseTask = function() {
			var event;
			businessEvent.bindEvent('submit', '#form-release', function($el) {
				event = {
					type: '任务',
					title: '发布任务'
				};
				businessForm.submit($el, event, function() {
					window.location.href = '/task/released';
				});
			});
		};

		//@todo 不用class做hook
		var _initSearch = function() {
			businessEvent.bindEvent('change', '[data-method="search"]', function($el) {
				var value = $el.val();
				if (value === '2') {
					//显示淘宝搜索
					$('.tao-search').show();
					$('.shop-search').hide();
				} else if (value === '3') {
					//显示店内搜索
					$('.tao-search').hide();
					$('.shop-search').show();
				} else {
					$('.tao-search').hide();
					$('.shop-search').hide();
				}
			});
		};

		//发布任务页面的效果较多，初始化操作统一在这里注册
		var initReleaseTask = (function() {
			_initToggle();
			_initTaskTime();
			_initAddItemModal();
			_initDeleteItem();
			_initFeaturePoint();
			_initItemPrice();
			_initTaskTime();
			_initSearch();
			_initSchedule();
			_initExtraPoint();
			_releaseTask();
		}());

		var releaseWarehouse = (function() {
			var event,
				gid;
			businessEvent.bindEvent('click', '[data-method="release-warehouse"]', function($el) {
				event = {
					type: '任务仓库',
					title: '发布任务'
				};
				gid = $el.attr('data-gid');
				businessForm.ajaxPost('/task/release_warehouse', {
					gid: gid
				}, event);
			});
		}());

		var releaseSaveWarehouse = (function() {
			var event,
				$form;
			businessEvent.bindEvent('click', '#task-release-save', function($el) {
				event = {
					type: '任务仓库',
					title: '保存并发布任务'
				};
				$('input[name="mode"]').val(2);
				$form = $el.parent().parent().parent();
				businessForm.submit($form, event, function() {
					$('#task-container').load('/task/warehouse #task-container > div', function() {
						$.scojs_modal().close();
					});
				});
			});
		}());

		var saveWarehouse = (function() {
			var event,
				$form;
			businessEvent.bindEvent('click', '#task-save-only', function($el) {
				event = {
					type: '任务仓库',
					title: '保存仓库'
				};
				$('input[name="mode"]').val(1);
				$form = $el.parent().parent().parent();
				businessForm.submit($form, event, function() {
					$('#task-container').load('/task/warehouse #task-container > div', function() {
						$.scojs_modal().close();
					});
				});
			});
		}());

		var deleteWarehouse = (function() {
			var event,
				task,
				key;
			businessEvent.bindEvent('click', '[data-method="delete-warehouse"]', function($el) {
				event = {
					type: '任务仓库',
					title: '删除任务仓库'
				};
				task = $el.parents('.task-box');
				key = $el.attr('data-key');
				businessForm.ajaxPost('/task/del_warehouse', {
					key: key
				}, event, function() {
					task.hide('normal');
				});
			});
		}());

		var loadTaskPay = (function() {
			var task,
				gid,
				itemGid,
				modal;
			businessEvent.bindEvent('click', '[data-method="task-pay"]', function($el) {
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				modal = $.scojs_modal({
					title: '任务付款',
					remote: $el.attr('href'),
					onloaded: function() {
						$('#task-pay-form').find('input[name="gid"]').val(gid);
						$('#task-pay-form').find('input[name="item-gid"]').val(itemGid);
					}
				});

				modal.show();
			});
		}());

		var taskPay = (function() {
			var event,
				href,
				params;
			event = {
				type: '任务',
				title: '付款'
			};
			businessEvent.bindEvent('submit', '#task-pay-form', function($el) {
				businessForm.submit($el, event, function() {
					href = window.location.href;
					params = 'state=' + $('#filter-task-state li.active').attr('data-state') + '&page=' + $('.now-page').attr('data-page');
					$(".task-container").load(href + " .task-container > div", params, function() {
						$.scojs_modal().close();
						_initPlugin();
						_initTaskCount();
					});
				});
			});
		}());

		var editTaskState = (function() {
			var event,
				task,
				gid,
				itemGid,
				href,
				postData,
				params;
			businessEvent.bindEvent('click', '[data-method="edit-task-state"]', function($el) {
				event = {
					type: '任务',
					title: '更改任务状态'
				};
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				href = window.location.href;
				postData = {
					gid: gid,
					itemgid: itemGid
				};
				businessForm.ajaxPost('/task/edit_task_state', postData, event, function() {
					params = 'state=' + $('#filter-task-state li.active').attr('data-state') + '&page=' + $('.now-page').attr('data-page');
					$('#task-container').load(href + ' #task-container > div', params, function() {
						_initPlugin();
						_initTaskCount();
					});
				});
			});
		}());

		var passAudit = (function() {
			var event,
				task,
				gid,
				itemGid,
				href,
				params;
			businessEvent.bindEvent('click', '[data-method="pass-audit"]', function($el) {
				event = {
					type: '任务',
					title: '通过审核'
				};
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				href = window.location.href;
				businessForm.ajaxPost('/task/pass_audit', {
					gid: gid,
					itemgid: itemGid
				}, event, function() {
					params = 'state=' + $('#filter-task-state li.active').attr('data-state') + '&page=' + $('.now-page').attr('data-page');
					$('#task-container').load(href + ' #task-container > div', params, function() {
						_initPlugin();
						_initTaskCount();
					});
				});
			});
		}());

		var notPassAudit = (function() {
			var event,
				task,
				gid,
				itemGid,
				href,
				params;
			businessEvent.bindEvent('click', '[data-method="not-pass-audit"]', function($el) {
				event = {
					type: '任务',
					title: '不通过审核'
				};
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				href = window.location.href;
				businessForm.ajaxPost('/task/not_pass_audit', {
					gid: gid,
					itemgid: itemGid
				}, event, function() {
					params = 'state=' + $('#filter-task-state li.active').attr('data-state') + '&page=' + $('.now-page').attr('data-page');
					$('#task-container').load(href + ' #task-container > div', params, function() {
						_initPlugin();
						_initTaskCount();
					});
				});
			});
		}());

		var closeTask = (function() {
			var event,
				task,
				gid,
				itemGid,
				confirm;
			event = {
				type: '任务',
				title: '关闭任务'
			};
			businessEvent.bindEvent('click', '[data-method="close-task"]', function($el) {
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				confirm = $.scojs_confirm({
					title: "关闭任务",
					content: "确定关闭这个任务吗？",
					action: function() {
						businessForm.ajaxPost('/task/close_task', {
							gid: gid,
							itemgid: itemGid
						}, event, function() {
							task.hide('normal');
						});
					}
				});
				confirm.show();
			});
		}());

		var finishTask = (function() {
			var event,
				task,
				gid,
				itemGid,
				confirm;
			businessEvent.bindEvent('click', '[data-method="finish-task"]', function($el) {
				event = {
					type: '任务',
					title: '完成任务'
				};
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				confirm = $.scojs_confirm({
					title: '关闭任务',
					content: '确定完成该任务吗？任务对应的存款和发布点将会转给接手方,请确定对方已在淘宝收货好评。',
					action: function() {
						businessForm.ajaxPost('/task/finish_task', {
							gid: gid,
							itemgid: itemGid
						}, event, function() {
							task.hide('normal');
						});
					}
				});
				confirm.show();
			});
		}());

		var quitTask = (function() {
			var event,
				task,
				gid,
				itemGid,
				confirm;
			businessEvent.bindEvent('click', '[data-method="quit-task"]', function($el) {
				event = {
					type: '任务',
					title: '退出任务'
				};
				task = $el.parents('.task-box');
				gid = task.attr('data-gid');
				itemGid = task.attr('data-item');
				confirm = $.scojs_confirm({
					title: '关闭任务',
					content: '确定退出该任务吗？',
					action: function() {
						businessForm.ajaxPost('/task/quit_task', {
							gid: gid,
							itemgid: itemGid
						}, event, function() {
							task.hide('normal');
						});
					}
				});
				confirm.show();
			});
		}());

		var checkItem = (function() {
			var event,
				item,
				number,
				key,
				postData;
			businessEvent.bindEvent('click', '[data-method="check-item"]', function($el) {
				event = {
					type: '任务',
					title: '地址检测'
				};
				item = $el.parent().parent().find('input[name="item"]').val();
				number = $el.attr('data-number');
				key = $el.attr('data-key');
				postData = {
					item: item,
					number: number,
					key: key
				};
				businessForm.ajaxPost('/task/check_item', postData, event, function() {
					$el.val('检测成功');
				});
			});
		}());

		//任务状态条件查询
		var filterTask = (function() {
			var href,
				params;
			businessEvent.bindEvent('click', '.filter-task-state li', function($el) {
				$('.filter-task-state li.active').removeClass('active');
				$('.filter-task-state li.last').css('border-left', '0px none');
				if ($el.hasClass('first')) {
					$el.css('border-left', '0px none');
					$el.addClass('active');
				} else if ($el.hasClass('last')) {
					$el.css('border-right', '0px none');
					$el.css('border-left', '1px solid #dcdcdc');
					$el.addClass('active');
				} else {
					$el.addClass('active');
				}
				params = 'state=' + $el.attr('data-state');
				href = window.location.href;
				businessMessage.openLoading();
				$('#task-container').load(href + ' #task-container > div', params, function() {
					_initPlugin();
					_initTaskCount();
					businessMessage.closeLoading();
				});
			});
		}());

		var initTaskPage = (function() {
			var url,
				params;
			businessEvent.bindEvent('click', '[data-method="task-page"] a', function($el) {
				url = $el.attr('href');
				//获取任务状态筛选的条件，防止出现翻页后条件失效的问题
				params = 'state=' + $('#filter-task-state li.active').attr('data-state');
				$('#task-container').load(url + ' #task-container > div', params, function() {
					$(window).scrollTop(0);
					_initPlugin();
					_initTaskCount();
					businessMessage.closeLoading();
				});
			});
		}());

		var addBankModal = (function() {
			var html,
				modal;
			businessEvent.bindEvent('click', '#add-bank', function() {
				html = $('#window-add-bank-box').html();
				modal = $.scojs_modal({
					title: '添加银行卡',
					content: html,
					size: 'modal-lg'
				});
				modal.show();
			});
		}());

		var initAlipayPoundage = (function() {
			var gid,
				amount;
			businessEvent.bindEvent('change', '#alipay-amount', function() {
				gid = $('#alipay').find('option:selected').attr('bank-id');
				amount = $('#alipay-amount').val();
				$.get('/fund/get_poundage', {
					gid: gid,
					amount: amount
				}, function(data) {
					if (data.State === 1) {
						$('#poundage').text(data.Data.toFixed(2));
					}
				}, 'json');
			});
		}());

		var addAlipayAccount = (function() {
			var event;
			event = {
				type: '提现',
				title: '添加支付宝账户'
			};
			businessEvent.bindEvent('submit', '#add-alipay-form', function($el) {
				businessForm.submit($el, event, function() {
					$('#alipay-withdraw-container').load('/fund/withdraw  #alipay-withdraw-container > div', '', function() {
						$.scojs_modal().close();
					});
				});
			});
		}());

		var addBankAccount = (function() {
			var event;
			businessEvent.bindEvent('submit', '#add-bank-form', function($el) {
				event = {
					type: '提现',
					title: '添加银行卡'
				};
				businessForm.submit($el, event, function() {
					$('#buy-content').load('/fund/withdraw #buy-content > div', '', function() {
						$.scojs_modal().close();
					});
				});
			});
		}());

		var withdrawBankConfirm = (function() {
			var bankId,
				accountGid,
				bankNumber,
				amount,
				source,
				replace,
				html;
			businessEvent.bindEvent('click', '[data-method="bank-withdraw-confirm"]', function() {
				bankId = $('#bank').find('option:selected').attr('bank-id');
				accountGid = $('#bank').find('option:selected').val();
				bankNumber = $('#bank').find('option:selected').text();
				amount = parseFloat($('input[name="amount"]').val());
				source = $('#step-2').html();
				businessMessage.openLoading();
				$.get('/fund/get_poundage', {
					gid: bankId,
					amount: amount
				}, function(data) {
					replace = {
						amount: amount,
						account: accountGid,
						real: amount - data.Data,
						poundage: data.Data,
						bankNumber: bankNumber
					};
					html = businessPage.formatString(source, replace);
					$('#bank-withdraw-container').html(html);
					businessMessage.closeLoading();
				}, 'json');
			});
		}());

		var withdrawBankSubmit = (function() {
			var event,
				$container;
			businessEvent.bindEvent('submit', '#bank-withdraw-form', function($el) {
				event = {
					type: '提现',
					title: '网银提现'
				};
				businessForm.submit($el, event, function() {
					$('#withdraw-table').load('/fund/withdraw #withdraw-table > table', '', function() {
						$container = $('#bank-withdraw-container');
						_loadWithdrawSuccess($container);
					});
				});

			});
		}());

		var _switchBuyStep = function(step) {
			$('.buy-step span.now').removeClass('now');
			$('.buy-step span.step-item').eq(step).addClass('now');
		};

		var buyBlackListSubmit = (function() {
			var event;
			businessEvent.bindEvent('submit', '#buy-black-list-form', function($el) {
				event = {
					type: '平台商店',
					title: '购买黑名单'
				};
				businessForm.submit($el, event, function() {
					_loadBuyBlackListSuccess();
				});
			});
		}());

		var sellPointSubmit = (function() {
			var event;
			//拿出number的值只是为了统计用
			businessEvent.bindEvent('submit', '#sell-point-form', function($el) {
				event = {
					'type': '平台商店',
					'title': '出售发布点'
				};
				businessForm.submit($el, event, function() {
					_loadSellPointSuccess();
				});
			});
		}());

		var buyPointSubmit = (function() {
			var event,
				evaluation;

			businessEvent.bindEvent('submit', '#buy-point-form', function($el) {
				event = {
					type: '平台商店',
					title: '购买发布点'
				};

				//评价三颗星以上的为好评
				evaluation = $('input[name="evaluate-star"]').val() > 3 ? 1 : -1;
				$('input[name="evaluation"]').val(evaluation);

				businessForm.submit($el, event, function() {
					$.get('/main/get_member_info', function(data) {
						_loadBuyPointSuccess(data);
					}, 'json');
				});
			});
		}());

		var buyVIPSubmit = (function() {
			var event,
				number,
				evaluation;
			businessEvent.bindEvent('submit', '#buy-vip-form', function($el) {
				event = {
					type: '平台商店',
					title: '购买VIP'
				};
				//评价三颗星以上的为好评
				number = $('input[type="number"]').val();
				evaluation = number > 3 ? 1 : -1;
				$('input[name="evaluation"]').val(evaluation);

				businessForm.submit($el, event, function(data) {
					_loadBuyVIPSuccess(data.vipTime);
				});
			});
		}());

		var addAddress = (function() {
			var event;
			event = {
				type: '平台商店',
				title: '添加发货地址'
			};
			businessEvent.bindEvent('submit', '#add-address-form', function($el) {
				businessForm.submit($el, event, function() {
					$('.inner').load('/shop/get_address', '', function() {

					});
				});
			});
		}());

		var buyExpressConfirm = (function() {
			var $parent,
				sendAddress,
				receiveAddress,
				type,
				amount,
				source,
				replace,
				container;
			businessEvent.bindEvent('click', '[data-method="buy-express-confirm"]', function($el) {
				$parent = $el.parent().parent().parent();
				sendAddress = $parent.find('select').val();
				receiveAddress = $parent.find('input').val();
				type = $el.attr('data-type');
				amount = $el.attr('data-amount');
				source = $('#express-step-2').html();
				replace = {
					type: type,
					sendAddress: sendAddress,
					receiveAddress: receiveAddress,
					amount: amount
				};
				container = $parent.parent();
				source = businessPage.formatString(source, replace);
				$(container).html(source);
				_switchBuyStep(1);
			});
		}());

		var _loadBuyExpressSuccess = function($el) {
			var source;
			source = $('#express-step-3').html();
			$el.html(source);
			_switchBuyStep(2);
		};

		var buyExpressSubmit = (function() {
			var event,
				type;
			businessEvent.bindEvent('submit', '#buy-express-form', function($el) {
				type = $el.find('input[name="type"]');
				event = {
					type: '平台商店',
					title: '购买' + type.val()
				};

				//因为共用一个表单，需要手动设置物流类型
				if (type.val() === '渝通物流') {
					type.val(0);
				} else {
					type.val(1);
				}
				businessForm.submit($el, event, function() {
					_loadBuyExpressSuccess($el.parent());
				});
			});
		}());

		var deleteAddress = (function() {
			var event,
				id;
			event = {
				type: '平台商店',
				title: '删除发货地址'
			};
			businessEvent.bindEvent('click', '[data-method="delete-address"]', function($el) {
				id = $el.attr('data-id');
				businessForm.ajaxPost('/shop/del_address', {
					gid: id
				}, event, function() {
					$el.parent().parent().hide('normal');
				});
			});
		}());

		//@todo 重构这里
		var initBuyBlackList = (function() {
			$('input[name="number"]').change(function() {
				var value = $(this).val();
				var price = $('input[name=price]').val();
				var amount = value * price;
				$('.deduct-money').html(amount);
				$('input[name="deduct-money"]').val(amount); //应付价格
			});
		}());

		var buyBlackListConfirm = (function() {
			var number,
				amount,
				source;
			businessEvent.bindEvent('click', '[data-method="buy-black-list"]', function() {
				number = $('input[name="number"]').val();
				amount = $('input[name="deduct-money"]').val();
				source = $('#blacklist-step-2').html();
				source = businessPage.formatString(source, {
					number: number,
					amount: amount
				});
				$('#buy-content').html(source);
				_switchBuyStep(1);
			});
		}());

		/**
		 * @private loadWizard 初始化教程wizard向导
		 * @param {string}wizardUrl wizard的remote地址
		 * @param {string}wizardId wizard内容的选择器，例如'#wizard-buyer'
		 */
		var _loadWizard = function(wizardUrl, wizardId) {
			var wizard,
				container;
			if ($('body').find('#wizard-container').length === 0) {
				container = '<div id="wizard-container"></div>';
				$('body').prepend(container);
			}
			$('#wizard-container').load(wizardUrl, '', function() {
				wizard = $(wizardId).wizard({
					backdrop: 'static',
					contentWidth: 780
				});
				wizard.on('incrementCard', function() {
					$('.wizard-body').scrollTop(0);
				});
				wizard.on('submit', function() {
					wizard.submitSuccess();
					$('.wizard-next').click(function() {
						wizard.close();
					});
				});
				wizard.show();
			});
		};

		var loadComplainTaskModal = (function() {
			var taskId,
				gid,
				memberId,
				source,
				modal;
			businessEvent.bindEvent('click', '[data-method="complain-task-modal"]', function($el) {
				taskId = $el.attr('data-task-id');
				gid = $el.attr('data-task-gid');
				memberId = $el.attr('data-member-id');
				source = $('#temp-complain').html();
				source = businessPage.formatString(source, {
					memberId: memberId,
					taskId: taskId,
					gid: gid
				});
				modal = $.scojs_modal({
					title: '投诉任务',
					content: source,
					size: 'modal-lg'
				});
				modal.show();
			});
		}());

		var loadEditWarehouse = (function() {
			var key,
				modal;
			businessEvent.bindEvent('click', '[data-method="edit-warehouse"]', function($el) {
				key = $el.attr('data-key');
				modal = $.scojs_modal({
					title: '任务仓库编辑',
					remote: '/task/get_warehouse?key=' + key,
					size: 'modal-lg',
					onloaded: function() {
						_initDeleteItem();
						_initPlugin();
					}
				});
				modal.show();
			});
		}());

		var initDatePicker = (function() {
			businessEvent.bindEvent('click', 'input[data-method="datepicker"]', function($el, e) {
				laydate({
					format: 'YYYY-MM-DD',
					event: e
				});
			});
			businessEvent.bindEvent('click', 'input[data-method="datepicker-now"]', function($el, e) {
				laydate({
					istime: true,
					min: laydate.now(),
					event: e
				});
			});
		}());

		var kuaishuaApply = (function() {
			var event,
				use;
			businessEvent.bindEvent('submit', '#kuaishua-apply-form', function($el) {
				event = {
					type: '用户',
					title: '申请快刷'
				};
				use = $('input[name="use"]:checked').map(function() {
					return this.value;
				}).get();
				$('input[name="title"]').val(JSON.stringify(use));
				businessForm.submit($el, event);
			});
		}());

		var initWizard = (function() {
			businessEvent.bindEvent('click', 'a[data-method="buyer-wizard"]', function() {
				_loadWizard('/wizard_buyer', '#test-wizard');
			});
		}());

		//需要立即执行也需要按需调用的放在这里统一执行
		var initPage = (function() {
			_initPlugin();
			_initTaskCount();
		}());

	}());
});