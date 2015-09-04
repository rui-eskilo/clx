//***

module.exports.getMessages = function(req){
	var txt;

	if((txt = req.flash('error')).length==0)
		return null;

	var message = {};

	message.cssclass = 'alert-danger';
	message.msgtype = 'Erro! ';
	message.msgtext = txt;
	

	return message;
}

module.exports.getPagination = function(npage, nrecperpage, listlength){
	var pagination = {};

	pagination.haspagination = (listlength > nrecperpage);
	pagination.nrecperpage = nrecperpage;
	pagination.page = npage;
	pagination.hasprevpage = (npage > 1);
	pagination.hasnextpage = (npage*nrecperpage < listlength);
	pagination.startidx = (npage-1)*nrecperpage;

	return pagination;
}

module.exports.arrangeString = function(str, nChars){
	if(str.length > nChars)
		return str.slice(0,nChars) + "...";
	else{
		return str.slice(0,nChars);
	}
}
