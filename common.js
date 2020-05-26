//Новая функция добавление подкатегории
function testo(){
	this.form.submit();
}

//Новая функция добавление категории
function reviev(product_id,seller_id, active){
	
	var postData = {product_id: product_id, seller_id: seller_id, active: active};

	$.ajax({
		type: 'POST',
		url: "/rewiev",
		data: postData,
		success: function(data){
			$('#coments').html(data);
		}
	}); 
}
