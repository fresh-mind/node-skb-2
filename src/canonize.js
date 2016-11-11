export default function canonize(url){ 

	/*const domains = 'telegram|vk|vkontakte|twitter|fb|facebook|github';

	var re = new RegExp('^@?(https?:)?(\/\/)?(www\.)?((' + domains+ ')(\.[a-z]{0,5}))?(\/)?([a-z0-9.]*)', 'i');*/

	var re = new RegExp('^@?(https?:)?(\/\/)?(www\.)?(([a-z0-9-]+)(\.[a-z0-9-]{0,12})\/)?(\/)?(@?[a-z0-9_.]*)');

	var username = url.match(re)[8];

	if(username.substr(0,1) !== '@'){
		username = '@' + username;
	}

	return username;
}