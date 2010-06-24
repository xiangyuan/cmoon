//; if (!bmoon) bmoon = {};
; var bmoon = bmoon || {};
bmoon.chat = {
	version: '1.0',
	ape: {},
	groupPubid: null,
	cUserID: '0',
	usersOn: ["0"],
	usersFetched: ["0"],

	init: function(ape) {
		var o = bmoon.chat;

		if (o.inited) return o;
		o.inited = true;

		o.m = $('#chat-msg-text');
		o.btm = $('#chat-msg-submit');
		o.userlist = $('#im-user-list > ul');
		o.msglist = $('#im-msgs');
		
		o.ape = ape;

		return o;
	},

	_nodeUser: function(uname, create) {
		var o = bmoon.chat.init();

		var
		r = $('#im-user-' + uname),
		html = '<li id="im-user-'+uname+'" uname="'+uname+'">'+uname+'</li>';
		
		if (!r.length && create) {
			r = $(html).appendTo(o.userlist);
		}
		return r;
	},

	_nodeMsg: function(uname, create) {
		var o = bmoon.chat.init();
		
		var
		r = $('#im-msg-' + uname),
		html = [
			'<div id="im-msg-', uname, '">',
			    '<div class="recently"></div>',
			    '<div class="data"></div>',
			'</div>'
		].join('');
		
		if (!r.length && create) {
			r = $(html).appendTo(o.msglist);
			if (o.cUserID != uname) r.hide();
		}
		return r;
	},

	_strAction: function(type, data) {
		var r = {
			'join':
			'通过' + decodeURIComponent(data.ref) +
				'来访本站页面<a target="_blank" href="'+
				decodeURIComponent(data.url)+'">'+
				decodeURIComponent(data.title)+'</a>',
			
			'visit':
			'浏览了页面<a target="_blank" href="'+
				decodeURIComponent(data.url)+'">'+
				decodeURIComponent(data.title)+'</a>',

			'send':
			decodeURIComponent(data.msg),

			'msg':
			'留言说： ' + decodeURIComponent(data.msg),
		};
		return r[type];
	},

	// {from: from, type: type, tm: tm, data: data}
	_strMsg: function(data) {
		var o = bmoon.chat.init();

		return [
			'<div class="item-', data.type, '">',
			    '<span class="item-name">',	decodeURIComponent(data.from),'</span>',
			    '<span class="item-time">',	data.tm,'</span>',
			    '<span class="item-content">', o._strAction(data.type, data.data),
			    '</span>',
			'</div>'
		].join('');
	},

	onready: function(ape, pubid) {
		var o = bmoon.chat.init(ape);

		o.groupPubid = pubid;
		o.bindClick();
	},

	bindClick: function() {
		var o = bmoon.chat.init();

		o.m.bind('keydown', 'ctrl+return', o.msgSend);
		o.btm.click(o.msgSend);
		$('.im-user-list li').click(o.openChat);
	},

	msgSend: function() {
		var o = bmoon.chat.init();
		
		var
		mv = o.m.val(),
		pipe = o.ape.lcsCurrentPipe,
		type = $.inArray(o.cUserID, o.usersOn) != -1 ? 'send': 'msg',
		databox = $('.data', o._nodeMsg(o.cUserID, true)),
		html = o._strMsg({
			from: o.ape.lcsaname,
			type: type,
			tm: Date().match(/\d{1,2}:\d{1,2}:\d{1,2}/)[0],
			data: {msg: mv}
		});

		if (!mv.length) return;
		o.m.val('');

		$(html).appendTo(databox);
		o.msglist[0].scrollTop = o.msglist[0].scrollHeight;

		if (pipe && type == 'send') {
			pipe.request.send('LCS_SEND', {msg: mv});
		} else {
			o.ape.request.send('LCS_MSG', {uname: o.ape.lcsaname, msg: mv});
		}
	},

	openChat: function() {
		var o = bmoon.chat.init();
		
		var
		c = $(this),
		id = c.attr('uname'),
		pubid = c.attr('pubid'),
		userbox = o._nodeUser(o.cUserID, false),
		msgbox = o._nodeMsg(o.cUserID, false);

		userbox.removeClass('cur').click(o.openChat);
		msgbox.hide();
		o.cUserID = id;
		
		c.removeClass('dirty').addClass('cur').unbind('click');
		o._nodeMsg(id, true).show();
		o.msglist[0].scrollTop = o.msglist[0].scrollHeight;

		if ($.inArray(id, o.usersFetched) == -1) {
			o.ape.request.send('LCS_RECENTLY', {uin: id, type: 1});
			o.usersFetched.push(id);
		}

		if (pubid && pubid.length) {
			o.ape.lcsCurrentPipe = o.ape.getPipe(pubid);
		} else if (o.cUserID == '0') {
			o.ape.lcsCurrentPipe = o.ape.getPipe(o.groupPubid);
		} else {
			o.ape.lcsCurrentPipe = null;
		}
	},

	// {defTxg: 1, eoogG: 1}
	dearUsers: function(data) {
		var o = bmoon.chat.init();
		
		$.each(data, function(key, val){
			var c = o._nodeUser(key, true);
			if (key != o.cUserID) c.addClass('dirty');
		});
	},
	
	// {uname: 'defTxg', pubid: 'esfes323sdfssdf32r'}
	userOn: function(data) {
		var o = bmoon.chat.init();

		var c = o._nodeUser(data.uname, true);
		c.removeClass('off').addClass('on');
		c.attr('pubid', data.pubid);
		o.usersOn.push(data.uname);
	},

	userOff: function(data) {
		var o = bmoon.chat.init();

		var c = o._nodeUser(data.uname, false);
		if (c.length) {
			c.removeClass('on').addClass('off').attr('pubid', '');
		}
		o.usersOn.splice($.inArray(data.uname, o.usersOn), 1);
	},

	// {from: from, type: type, tm: tm, data: data}
	onData: function(data) {
		var o = bmoon.chat.init();

		var
		uname = data.from,
		userbox = o._nodeUser(uname, true),
		databox = $('.data', o._nodeMsg(uname, true)),
		html = o._strMsg(data);

		if (o.cUserID != uname) {
			userbox.addClass('dirty');
			// avoid double messages appear
			if ($.inArray(uname, o.usersFetched) == -1) return;
		}
		
		$(html).appendTo(databox);
		if (o.cUserID == uname) {
			o.msglist[0].scrollTop = o.msglist[0].scrollHeight;
		}
	},

	// {from: from, to: to, type: type, tm: tm, data: data}
	onRecently: function(data) {
		var o = bmoon.chat.init();

		var
		uname = data.from == o.ape.lcsaname ? data.to: data.from,
		userbox = o._nodeUser(uname, true),
		recentbox = $('.recently', o._nodeMsg(uname, true)),
		html = o._strMsg(data);
		
		$(html).appendTo(recentbox);
		if (o.cUserID == uname) {
			o.msglist[0].scrollTop = o.msglist[0].scrollHeight;
		}
	}
};
