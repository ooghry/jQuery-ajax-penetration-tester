$( document ).ajaxSend(function( event, jqxhr, arg ) {
	new_url=arg.url;
	post_content=[];
	get_content=[];
	if(typeof arg.data=='string'){
		post_content=$.deserialize(arg.data);
	}
	if(new_url.split('?').length>1){
		new_url=new_url.split('?');
		get_content=$.deserialize(new_url[1]);
		new_url=new_url[0];
	}
	for(var key in post_content){
		temp1=jQuery.extend({}, post_content);
		if(typeof temp1[key]=='object'){
			temp1[key]=[temp1[key][0]+"'"];
		}else{
			temp1[key]=temp1[key]+"'";
		}
		xhr_attack(new_url,get_content,temp1);
		if(!is_numeric(post_content[key])){
			temp1[key]="not_assigned";
			xhr_attack(new_url,get_content,temp1);
		}
	}
	for(var key in get_content){
		temp1=jQuery.extend({}, get_content);
		if(typeof temp1[key]=='object'){
			temp1[key]=[temp1[key][0]+"'"];
		}else{
			temp1[key]=temp1[key]+"'";
		}
		xhr_attack(new_url,temp1,post_content);
		if(!is_numeric(get_content[key])){
			temp1[key]="not_assigned";
			xhr_attack(new_url,temp1,post_content);
		}
	}
});
function xhr_attack(url,get,post){
	if(typeof get.length=='number' && get.length==0){
	}else{
		url+='?'+decodeURIComponent($.param(get));
	}
	$.ajax({
		url:url,
		data:post,
		type:'POST',
		global:false
	}).done(function(data){
		if(	data.toLowerCase().indexOf('sqlstate')>=0 || 
			data.toLowerCase().indexOf('fatal error')>=0 || 
			data.toLowerCase().indexOf('exception')>=0 || 
			data.toLowerCase().indexOf(' php ')>=0
		){
			console.warn(url,get,post);
			console.log(data);
		}
	});
}
!function(e){e.deserialize=function(e,i){for(var n=e.split(/&|&/i),t={},i=i||{},o=0;o<n.length;o++){var r=n[o].split("=");if(r[0]=decodeURIComponent(r[0]),!i.except||-1==i.except.indexOf(r[0]))if(/^\w+\[\w+\]$/.test(r[0])){var d=r[0].match(/^(\w+)\[(\w+)\]$/);"undefined"==typeof t[d[1]]&&(t[d[1]]={}),t[d[1]][d[2]]=decodeURIComponent(r[1])}else t[r[0]]=decodeURIComponent(r[1])}return t},e.fn.deserialize=function(i){return e.deserialize(e(this).serialize(),i)}}(jQuery);
function is_numeric(e){var whitespace =" \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";return("number"==typeof e||"string"==typeof e&&-1===whitespace.indexOf(e.slice(-1)))&&""!==e&&!isNaN(e)}