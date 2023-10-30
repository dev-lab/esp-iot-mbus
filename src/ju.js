function time() {
	var r = [], d = new Date();
	function p(v, l, s) {
		v = v.toString();
		r.push(sNc("0", l - ln(v)) + v);
		if(s) r.push(s);
	}
	p(d.getDate(), 2, '.');
	p(d.getMonth() + 1, 2, '.');
	p(d.getFullYear(), 4, ' ');
	p(d.getHours(), 2, ':');
	p(d.getMinutes(), 2, ':');
	p(d.getSeconds(), 2, ':');
	p(d.getMilliseconds(), 3);
	return r.join("");
}

function oa(s) {
	return s ? " " + s : "";
}

function fixRN(s) {
	return s ? s.replace( /\r?\n/g, "\n" ) : s;
}

function http(u, b, f) {
	if(!ln(u) || !f) return false;
	b = fixRN(b);
	var q = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	q.onreadystatechange = function() {
		if(q.readyState == 4) {
			var t = q.responseText, s = q.status;
			f(s == 200 ? t : s + ": " + t, s);
		}
	};
	q.open(b != null ? "POST" : "GET", u, true);
	try {
		q.send(b);
	} catch(e) {
		f(e, -1);
	}
}

function upload(n, b, f) {
	if(!ln(n) || !ln(b) || !f) return false;
	b = fixRN(b);
	var c = 512, p = 0, l = ln(b);
	function w() {
		var q = "/fSave?name=" + uri(n) + "&pos=" + p, d = p + c;
		if(d >= l) q += "&flush=1", d = l;
		return http(q, b.substring(p, d), function(re, s) {
			if(s == 200) {
				p = d;
				p < l ? w() : f(true);
			} else confirm("Error when uploading " + n + ": " + re + ". Try again?") ? w() : f(false);
		});
	};
	w();
}

dc = document;
function hT(v,t,a) {return "<"+ t + oa(a || null) + (v ? ">" + v + "</" + t + ">" : "/>");}
function hO(v,a) {return hT(v, "option", a || null) + "\n";}
function hA(n,v) {return (v != null ? ' ' + n + '="' + v + '"' : '');}
function hB(v) {return hT(v, "b");}
function hTd(v, a) {return hT(v, "td", a);}
function hTr(v, a) {return hT(v, "tr", a) + "\n";}
function hInput(t,i,n,v,a){return hT(null, 'input', hA('type', t) + hA('id', i) + hA('name', n) + hA('value', v) + oa(a || null));}
function hRadio(l,v,i,n,s,c) {return hInput('radio', i, n, v, hA('onclick', c) + hA('checked', (s?"checked":null))) + hT(l, "label", 'for="' + i + '"');}
function hInputH(i,n,v,a) {return hInput("hidden",i,n,v,a);}
function hInputB(i,n,v,a) {return hInput("button",i,n,v,a);}
function hInputC(i,n,v,a) {return hInput("checkbox",i,n,v,a);}
function hInputT(i,n,v,a) {return hInput("text",i,n,v,a);}
function hInputP(i,n,v,a) {return hInput("password",i,n,v,a);}
function hButton(t,l,n,v,a) {return hT(l, 'button', hA('type', t) + hA('value', v) + hA('name', n) + oa(a || null));}
function hButtonS(l,n,v) {return hButton('submit',l,n,v);}
function hFRow(l,c,h) {return hTr(hTd(hB(l)) + hTd(c) + (h?hTd(h):''));}
function ce(c, t) {
	var e = dc.createElement(t || 'div');
	if(c) e.className = c;
	return e;
}
function ge(id) {return dc.getElementById(id);}
function gt(o, tag) {return o.getElementsByTagName(tag);}
function euri(v) {return encodeURIComponent(v);}
function duri(v) {return decodeURIComponent(v);}
function uri(v) {return euri(v).replace(/%20/g,'+');}
function escp(v) {return v.replace(/\\/g,'\\\\').replace(/\"/g,'\\\"');}
function sh(e,v) {e.innerHTML = v;}
function gv(e) {return e.value;}
function sv(e,v) {e.value = v;}
function ric(r) {
	var i = 0;
	return function() {return r.insertCell(i++);};
}

function getFormValue(e) {
	var t = null, i, r = [], l = ln(e);
	if(l) t = e[0].type;
	if(!t) t = e.type;
	if(!t) return null;

	switch(t) {
	case 'radio':
		for(i = 0; i < l; ++i) if(e[i].checked) return gv(e[i]);
		return null;
	case 'select-multiple':
		for(i = 0; i < l; ++i) if(e[i].selected) r.push(gv(e[i]));
		return r.join(',');
	case 'checkbox':
		return e.checked;
	default:
		return gv(e);
	}
}

function getEncodeType(n) {
	return (n == 'l' || n == 'f') ? 2
		: (n == 'p' || n == 'i' || n == 'v' || n == 'u') ? 0 : 1;
}

function getForm(f, m, eq) {
	var r = ['{'], n, a = f.elements, i = 0, e, v, t;
	function p(v) {r.push(v);}
	for(; i < ln(a); ++i) {
		e = a[i];
		if(!e.name) continue;
		v = getFormValue(e);
		if(m) v = m(f, e.name, v);
		if(!v) continue;
		if(n) p(',');
		p('"' + e.name + '"' + eq);
		if(v === true) p(1);
		else if(v === false) p(0);
		else if(typeof v.replace === 'undefined') p(v);
		else {
			t = getEncodeType(e.name);
			p(t > 0 ? '"' + (t > 1 ? euri(v) : escp(v)) + '"' : v);
		}
		n = 1;
	}
	return r.join("") + '}';
}

function getFormJson(f, m) {
	return getForm(f, m, ":");
}

function postForm(f, u, v, vv, r, h, m) {
	if(v && !v(f, vv)) return false;
	var d = getFormJson(f, m);
	http(u, d, function(re, s) {
		if(ln(r)) sh(ge(r), re);
		if(h) h(re, s);
	});
	return false;
}

function js2j(t) {
	return eval("(" + t + ")");
}

function s2S(t) {
	return ln(t) > 3 ? t.slice(0, 1).toUpperCase() + t.slice(1) : t.toUpperCase();
}

function mbus(cmd, handler) {
	http("/send?cmd=" + uri(hexSum(cmd, true)), "", handler);
}

function escH(v) {
	return ("" + v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// tmbus library (https://github.com/dev-lab/tmbus) below
/** tmbus v1.0.0 (c) Taras Greben https://dev-lab.github.io/tmbus/LICENSE */
function ln(e){return e&&e.length||0}function sNc(e,r){return r>0?Array(r+1).join(e):""}function sIn(e,r,t){return r?e.slice(0,r)+t+e.slice(r):t+e}function p10(e,r){if(!r)return e;var t=ln(e);if(!t){var n=parseInt(e);if(e!==n)return isNaN(n)?e:e*Math.pow(10,r)}var i=""+e,a=(t?"-"==t.charAt(0):e<0)?1:0,o=ln(i);return r>0?i+=sNc("0",r):((r+=o-a)<0&&(i=sIn(i,a,sNc("0",-r))),i=sIn(i,r<=0?a:r+a,".")),t?i:Number(i)}function ha2si(e){var r,t,n=ln(e=e.slice()),i=[],a=e[n-1],o=128&a;if(o)for(r=t=0;r<n;++r)(e[r]||t)&&(e[r]=256-e[r]-t,t=1);for(r=n,t=0;r;)e[--r]&&(t=1);if(!t)return 0;do{for(a=t=0,r=n;r;){var u=256*a+e[--r];a=u%10,(e[r]=(u-a)/10)&&(t=1)}i.push(a)}while(t);for(r=ln(i);!i[--r];);return(o?"-":"")+i.slice(0,++r).reverse().join("")}function i2s(e,r){var t=e?e.toString():"0",n=ln(t);return r?(n<r?sNc("0",r-n):"")+t:t}function sum(e,r,t){for(var n=0,i=r||0;i<(t||ln(e));)n+=e[i++];return 255&n}function parseHs(e){for(var r,t=e?e.split(/[\s,]/):[],n=[],i=0;i<ln(t);)ln(r=t[i++])&&(n=n.concat(r.match(/.{1,2}/g)));return n}function hs2i(e){return Number("0x"+e.replace(/^#/,""))}function hs2a(e){for(var r,t=parseHs(e),n=[],i=0;i<ln(t);){if(r=hs2i(t[i++]),isNaN(r)||r<0||r>255)throw'"'+t[i]+'" is not a hex byte, pos '+i;n.push(r)}return n}function b2hs(e){return((e=Number(e))<16?"0":"")+e.toString(16)}function ba2hs(e,r){for(var t=[],n=0;n<ln(e);)t.push(b2hs(e[n++]));return t.join(r||"")}function ba2i(e){var r=ln(e);if(!r||r>4)return r?e:0;for(var t=e[--r],n=3==r?0:128&t?(t&=127,-(1<<8*r+7)):0;r;)t=(t<<8)+e[--r];return t+n}function ba2b(e){for(var r=ln(e),t=0;r;)t=(t<<8)+e[--r];return t}function ba2bcd(e,r){var t,n,i,a=0,o=ln(e),u="",s=0,c=0;function f(e){c&&(e=-e),e<10?u+=e:(s=1,u+="A-C EF".charAt(e-10))}for(;o;)n=(240&(t=e[--o]))>>4,i=15&t,c&&(n=-n,i=-i),a=100*a+10*n+i,f(n),1==ln(u)&&(s=0,13==n?s=1:n>13&&(c=1,a=i=-i,14==n&&(a-=10))),f(i);if(!r&&s)throw u;return s?u:a}function i2c(e){return String.fromCharCode(e)}function ba2s(e){for(var r=[],t=ln(e);t;)r.push(i2c(e[--t]));return r.join("")}function date(e,r,t){return{rawY:e,y:1900+e+(e<100?100:0),m:r,d:t,toString:function(){var e=this,n=i2s(t,2)+"."+i2s(r,2)+"."+e.y;return void 0!==e.hr&&(n+=" "+i2s(e.hr,2)+":"+i2s(e.mi,2)+(void 0!==e.se?":"+i2s(e.se,2):"")),e.s&&(n+=" (summer)"),e.i&&(n+=" (invalid)"),n}}}function i2d(e){return e?date(e>>5&7|e>>9&120,e>>8&15,31&e):null}function i2t(e){var r=ln(e)||0,t=r>5?1:0,n=t?e[--r]:0;if(!(e=r?ba2b(e.slice(t,r)):e))return null;var i=i2d(e>>16);return i.hr=e>>8&31,i.mi=63&e,t&&(i.se=63&n),32768&e&&(i.s=!0),128&e&&(i.i=!0),i}function ba2f(e){var r=ln(e)-1,t=7;if(7==r)t=4;else if(3!=r)return NaN;var n,i=r-1,a=(1<<t)-1,o=(e[i]&a)<<8*i,u=1<<8*i+t,s=1<<14-t,c=(e[i]>>t)+((127&e[r])<<8-t)+1-s,f=e[r]>>7?-1:1;for(n=0;n<i;++n)o+=e[n]<<8*n;return c==s?f*(o?NaN:Number.POSITIVE_INFINITY):(o&&(o=c==1-s?o/(u>>1):(o|u)/u),f*o*Math.pow(2,c))}function hexSum(e,r,t){var n=hs2a(e),i=ln(n);return i>1&&i<256&&r&&(n.push(sum(n)),n.push(22),i<3?n.splice(0,0,16):n.splice(0,0,104,i,i,104)),ba2hs(n,t)}function tmbus(e){for(var r=hs2a(e),t=Array.isArray,n=[0],i="Manufacturer specific",a="Reserved",o="Units for H.C.A.";ln(r)&&255==r[0];)r.splice(0,1);var u,s,c=ln(r),f=c-2,l={len:c},m=0,d=0;if(!c)return l;function p(e){throw(e||"Wrong frame length")+", pos "+d}function v(){return d==c&&p(),u=r[d++]}function h(e,t){var n=d,i=t+d;return i>f&&p("Premature end of data when reading "+e+" (need "+t+", available "+(f-d)+")"),d=i,r.slice(n,d)}function y(e,r,t){var n=h(e,t||4);return r?ba2i(2==r?n.reverse():n):ba2bcd(n,1)}function b(e){sum(r,e,f)!=r[f]&&p("Check sum failed")}if(v(),1==c)return 229==u?l.type="OK":p("Invalid char"),l;if(c<5&&p(),22!=r[c-1]&&p("No Stop"),16==u)return l.type="Short",b(1),l.c=v(),l.a=v(),l;if(104!=u&&p("No Start"),l.type="Data",l.l=v(),r[2]!=u&&p("Invalid length"),r[0]!=r[3]&&p("Invalid format"),u!=c-6&&p("Wrong length"),b(d=4),l.c=v(),l.a=v(),l.ci=v(),s=l.errors=[],114==(250&u))l.fixed=1==(1&u);else{l.type="Error";var g=["Unspecified error","Unimplemented CI-Field","Buffer too long, truncated","Too many records","Premature end of record","More than 10 DIFE's","More than 10 VIFE's",a,"Application too busy for handling readout request","Too many readouts"];if(112==u)return s.push(g[d==f?0:v()<10?u:7]),l;p(g[1])}l.id=y("ID");var w=" meter",C=["Heat"+w,"Cooling"+w," (Volume measured at ","return temperature: outlet)","flow temperature: inlet)","Customer unit","Radio converter ","Access Code "],D=["Other","Oil"+w,"Electricity"+w,"Gas"+w,C[0],"Steam"+w,"Hot water"+w,"Water"+w,"Heat Cost Allocator",a,C[0]+C[2]+C[3],"Compressed air",C[1]+C[2]+C[3],C[1]+C[2]+C[4],C[0]+C[2]+C[4],"Combined Heat / "+C[1],"Bus / System component","Unknown device type","Cold water"+w,"Dual water"+w,"Pressure"+w+" / pressure device","A/D Converter","Warm water"+w,"Calorific value","Smoke detector / smoke alarm device","Room sensor","Gas detector","Consumption"+w,"Sensor","Breaker (electricity)","Valve (gas or water)","Switching device",C[5]+" (display device)",C[5],"Waste water"+w,"Garbage","Carbon dioxide","Environmental"+w,"System device","Communication controller","Unidirectional repeater","Bidirectional repeater",C[6]+"(system side)",C[6]+"(meter side)","Wired Adapter"],I=[0,1,2,3,4,5,6,7,8,9,3,4,5,6,7,8,9],A=[0,1,2,3,10,5,22,7,8,11,12,13,14,15,16,17,27,27,27,27,23,6,18,19,20,21,24,25,26,28,28,28,29,30,31,31,31,32,33,33,34,35,36,37,37,37,37,37,38,39,40,41,38,38,42,43,44],N=["Instantaneous","Maximum","Minimum","During error state"];function E(e){return e<2?[["h,m,s","D,M,Y"][e],0]:e<56?[["Wh","kWh","MWh","kJ","MJ","GJ","W","kW","MW","kJ/h","MJ/h","GJ/h","ml","l","m³","ml/h","l/h","m³/h"][Math.floor((e-2)/3)],(e-2)%3]:e<57?["°C",-3]:e<58?[o,0]:[a,0]}function S(e){return i2c(64+(31&e))}function M(e){return S(e>>10)+S(e>>5)+S(e)}function W(e){return D[e>63?9:e>56?38:A[e]]}function F(e){var r=e.status;return e.fixed?e.cStored=2&r?"At fixed date":"Actual":3!=(3&r)&&(1&r&&s.push("Application Busy"),2&r&&s.push("Application Error")),4&r&&s.push("Power Low"),8&r&&s.push("Permanent Error"),16&r&&s.push("Temporary Error"),1&r}function k(){l.data||(l.data=[]);var e={id:m++};return l.data.push(e),e}function x(e,r){l.deviceCode=e,l.deviceType=r}function T(e){var t=ln(e);for(t=t?e[t-1]:128;d<f&&t>>7;)t=r[d++],e.push(t);return e}var V=["Reserved","Energy","Volume","Mass","On Time","Operating Time","Power","Volume Flow","Volume Flow ext.","Mass flow","Flow Temperature","Return Temperature","Temperature Difference","External Temperature","Pressure","Time Point",o,"Averaging Duration","Actuality Duration","Credit","Debit","Access Number","Medium","Manufacturer","Parameter set id","Model/Version","Hardware version #","Firmware version #","Software version #","Customer location","Customer",C[7]+"User",C[7]+"Operator",C[7]+"System Operator",C[7]+"Developer","Password","Error flags","Error mask","Digital Output","Digital Input","Baudrate","Response delay time","Retry","First cyclic storage #","Last cyclic storate #","Storage block size","Storage interval","Duration since last readout","Start of tariff","Duration of tariff","Period of tariff","Voltage","Current","Dimensionless","Reset counter","Cumulation counter","Control signal","Day of week","Week number","Time point of day change","State of parameter activation","Special supplier information","Duration since last cumulation","Operating time battery","Battery change","Cold/Warm Temperature Limit","Cumul. count max power"],P=["seconds","minutes","hours","days","months","years","Wh","J","m³","kg","W","J/h","m³/h","m³/min","m³/s","kg/h","°C","K","bar","currency unit","binary","baud","bittimes","V","A","MWh","GJ","t","feet³","american gallon","american gallon/min","american gallon/h","MW","GJ/h","°F","revolution / measurement","liter","kWh","kW","K*l"];function J(e,r,t){e.type=V[r[0]];var n=r[1];ln(r)>1&&(5==n&&(n=9,t+=2),9==n?e.unit=P[t]:8==n?(e.type+=" ("+(t?"time & ":"")+"date)",e.f=1==t?i2t:i2d):n>5?e.f=7==n?W:M:(e.unit=P[r[2]],e.e=t+r[1]))}function O(e,r){var i=r>>2&15,a=3&r;64&r&&(i=16+(7&i));var o=r>112?n:[[19,-3,19],[20,-3,19],[[21],[22,7],[23,6],[24]],[[25],[26],[27],[28]],[[29],[30],[31],[32]],[[33],[34],[35],[36,0,20]],[[37],n,[38,0,20],[39,0,20]],[[40,0,21],[41,0,22],[42],n],[[43],[44],[45],n],[46,9],[[46,0,4],[46,0,5],n,n],[47,9],[[48,8],[49,0,1],[49,0,2],[49,0,3]],[50,9],[[50,0,4],[50,0,5],[53],n],n,[[54],[55],[56],[57]],[[58],[59],[60],[61]],[62,5],[63,5],[[64,8]]][i];64==(96&r)?(a=15&r,o=(i=16&r)?[52,-12,24]:[51,-9,23]):t(o[0])&&(o=o[a],a=0),J(e,o,a)}function G(e,r){for(var i=7&r,a=[[[[1,-1,25]]],[[[1,-1,26]]],[[[2,2,8]]],[[[3,2,27]]],[[[n,[2,-1,28]],[[2,-1,29],[2,0,29]]],[[[7,-3,30],[7,0,30]],[[7,0,31],n]]],[[[6,-1,32]]],[[[6,-1,33]]],n,n,n,n,[[10,-3,34],[11,-3,34]],[[12,-3,34],[13,-3,34]],n,[[65,-3,34],[65,-3,16]],[66,-3,10]][r>>3&15],o=2;t(a[0]);i&=15^1<<o,a=r>>o--&1?ln(a)<1?n:a[1]:a[0]);J(e,a,i)}function R(e,r){var t,n=7&r,a="per ",o="multiplied by sek",u=2&n?"out":"in",s=8&r?"upper":"lower",c=4&r?"last":"first",f=1&r?"end":"begin",l="Duration of ",m=" limit exceed";(t=r<2?r?"Too many DIFE's":t:r<8?["Storage number","Unit number","Tariff number","Function","Data class","Data size"][n-2]+" not implemented":r<11?t:r<16?["Too many VIFE's","Illegal VIF-Group","Illegal VIF-Exponent","VIF/DIF mismatch","Unimplemented action"][n-3]:r<21?t:r<25?["No data available (undefined value)","Data overflow","Data underflow","Data error"][n-5]:r<28?"Premature end of record":r<32?t:r<39?a+P[n].slice(0,-1):r<40?a+P[35]:r<44?"increment per "+u+"put pulse on "+u+"put channel #"+(1&r):r<54?a+P[[36,8,9,17,37,26,38,39,23,24][r-44]]:r<55?o:r<57?o+" / "+P[24-(1&r)]:r<61?["start date(/time) of","VIF contains uncorrected unit instead of corrected unit","Accumulation only if positive contributions","Accumulation of abs value only if negative contributions"][n-1]:r<64?V[0]:r<74?n?"# of exceeds of "+s+" limit":s+" limit value":r<80?"Date (/time) of: "+f+" of "+c+" "+s+m:r<96?l+c+" "+s+m+", "+P[3&n]:r<104?l+c+", "+P[3&n]:r<112?2&n?"Date (/time) of "+c+" "+f:t:r<120?(e.e=n-6,t):r<124?"Additive correction constant: 10E"+(n-3)+"*"+e.type+" (offset)":r<125?t:r<126?(e.e=3,t):["future value",i+" data next"][1&n])&&e.typeE.push(t)}function U(e){var a,o=e.vif,u=ln(o),s=0,c=o[s],f=127,l=c&f;if(253==c||251==c?(253==c?O:G)(e,l=o[++s]&f):l<124?function(e,r){var i=r>>3&15,a=7&r,o=[[1,-3,6],[1,1,7],[2,-6,8],[3,-3,9],[[4,9],[5,9]],[6,-3,10],[6,1,11],[7,-6,12],[8,-7,13],[8,-9,14],[9,-3,15],[[10,-3,16],[11,-3,16]],[[12,-3,17],[13,-3,16]],[[14,-3,18],[[15,8],[[16],n]]],[[17,9],[18,9]]];if(15==i)a<3&&(e.type=["Fabrication No","(Enhanced)","Bus Address"][a]);else{for(var u=o[i],s=2;t(u[0]);a&=15^1<<s,u=u[r>>s--&1]);J(e,u,a)}}(e,l):124==l&&(a=r[(d-=u-2)-1],e.type=ba2s(h("VIF type",a)),u=ln(o=e.vif=T([c]))),l==f&&(e.type=i),o[s]>>7){for(l!=f&&++s,e.typeE=[],a=0;s<u&&s<11&&(l=(c=o[s++])&f,a?e.typeE.push(l):(a=l==f,R(e,l)),128&c););ln(e.typeE)||delete e.typeE}}function B(e){U(e);var t,n,i,a,o,u=e.dif,s=ln(u)-1,c=u[0],f=c>>4&3,l=15&c,m=7&c;if(13==l?(t=m=r[d++],m<192?i=ba2s:(m&=15,t>239?t<251&&(i=ba2f):(i=t>223?ba2i:ba2bcd,o=208==(240&t)))):5==m?(--m,i=ba2f):(7==m&&++m,i=8&l?ba2bcd:ba2i),n=l=h("Record #"+e.id,m),i)try{l=i(l)}catch(r){e.error=!0,l=r}if(e.error||(e.f&&(l=e.f(l)),(i=Array.isArray(l))&&(l=ha2si(l)),o&&(l=i?"-"==l.charAt(0)?l.slice(1):"-"+l:-l),e.e&&(l=p10(l,e.e))),e.value=l,e.rawValue=n,e.func=N[f],f=1&(c>>=6),n=l=a=0,2&c){for(;n<s;++n)a+=((c=u[n+1])>>6&1)<<n,l+=(c>>4&3)<<2*n,f+=(15&c)<<4*n+1;e.device=a,e.tariff=l}e.storage=f,delete e.f,delete e.e}return l.fixed?function(){l.accessN=v(),l.status=v();var e=F(l),r=v(),t=v(),n=r>>6|t>>4&12;x(n,D[I[n]]),n>9&&n<15&&e&&(e=2);var i,a=k(),o=k(),u=E(63&r),s=63&t,c=1;a.storage=0,a.func=N[0],a.value=p10(y("Counter 1",e),u[1]),a.unit=u[0],62==s?i=u:(c=0,63!=s&&(i=E(s))),o.storage=c,o.func=N[0],c=y("Counter 2",e),o.value=i?p10(c,i[1]):c,o.unit=i?i[0]:""}():function(){for(l.manId=M(y("ManID",1,2)),l.version=v(),v(),x(u,W(u)),l.accessN=v(),l.status=v(),F(l),d+=2;d<f-1;){var e=r[d],t=47==e?t:k();15==(15&e)?(++d,(e=e>>4&7)<2?(e&&(t.request="Readout again"),t.type=i,t.value=h(t.type,f-d)):e>6&&(t.request="Global readout")):(t.dif=T([]),t.vif=T([]),B(t))}}(),l}function unitConv(e,r){var t,n,i=["J","Wh","W","J/h"],a=["","k","M","G"];function o(e){var r,i=e.unit,a=e.value;if(i&&a&&(r=t[i]))try{e.value=p10(a,r[0]),e.unit=r[1]}catch(e){}if(n)try{n(e)}catch(e){}}function u(e,r){var o,u,s,c,f;if(t={},n=r,e)for(s in e)if(u=e[s],o=i.indexOf(s),f=a.indexOf(u),o>=0&&f>=0)for(c in a)t[a[c]+s]=[3*(c-f),u+s]}return u(e,r),{getUnits:function(){return i.slice()},getPrefixes:function(){return a.slice()},config:u,process:function(e){var r,t;if(e&&(r=e.data))for(t in r)o(r[t]);return e}}}
