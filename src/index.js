import express from 'express';
import cors from 'cors';
import canonize from './canonize';

var fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    hello: 'JS World',
  });
});

// sum of 2 numbers
app.get('/task2A', (req, res) => {

	var a = req.query.a || 0;
	var b = req.query.b || 0;
  
	const sum = +a + +b;

	res.send( String(sum) );

});

// Перевести полное `Имя Отчество Фамилия` в `Фамилия И. О.`

app.get('/task2B', (req, res) => {

	var str = req.query.fullname;

	console.log(str);

	str = str.trim().toLowerCase();

	// заменяем пробелы на 1 пробел
	str = str.replace(/\s+/g, ' ');

	var parts = str.split(' ');

	parts = parts.reverse();

	var res_str = '';

	var err = false;

	if( !str || parts.length > 3 || parts.length < 1){
		err = true;
	}

	if( str.match(/[0-9`~!@#№$%^&*()_=+\\|\[\]{};:,.<>\/?]/) ){

		err = true;

	}

	// отлавливаем неверный формат запроса
	if( err ){

		res_str = 'Invalid fullname';

	} else {

		var lastname = parts[0] || ''; // фамилия
		var name_two = parts[1] || ''; // отчество
		var name = parts[2] || ''; // имя

		if( parts.length == 2){
			name = parts[1];
			name_two = '';
		}

		var res_arr = [ capitalizeFirstLetter(lastname) ];

		if(name !== ''){
			res_arr.push( name.substring(0, 1).toUpperCase() + '.' );
		}

		if(name_two !== ''){
			res_arr.push( name_two.substring(0, 1).toUpperCase() + '.' );
		}

		res_str = res_arr.join(' ');

	}	

	/*res.json({
	    lastname,
	    name,
	    name_two,

	});*/

	res.send( res_str );

});


app.get('/task2C', (req, res) => {

	console.log( req.query.username );
  
	const username = canonize( req.query.username );
	/*res.json({
		url: req.query.url,
		username,
	});*/
	res.send( username );

});

// ___________________________________ 3A ______________________________________

const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = null;

fetch(pcUrl)
  .then(async (result) => {
    pc = await result.json();
    console.log('get json');
  })
  .catch(err => {
    console.log('Чтото пошло не так:', err);
  });

app.get('/task3A', (req, res) => {

	if( pc !== null ){
		res.status(200).json(pc);
	}else{
		send404(res);
	}
		

});


app.get('/task3A/volumes', (req, res) => {

	const hdd = pc['hdd'];

	if( hdd !== undefined ){

		const volumes = {};

		hdd.forEach( (hdd_item) => {

			//console.log(hdd_item);

			volumes[ hdd_item.volume ] = volumes[ hdd_item.volume ] !== undefined ? 
																		(volumes[ hdd_item.volume ]  + hdd_item.size) :
																		hdd_item.size;


		});

		Object.keys(volumes).forEach( (key) => {
	      volumes[key] += 'B';
	    })

		console.log(volumes);

		res.status(200).json( volumes );

	}else{
		send404(res);
	}
	
});

/*app.get('/task3A/:level1', (req, res) => {

	const param = req.params.level1;

	if( pc.hasOwnProperty(param) ){
		res.status(200).json(pc[param]);	
	}else{
		send404(res);
	}
	
});

app.get('/task3A/:level1/:level2', (req, res) => {

	const param_1 = req.params.level1;
	const param_2 = req.params.level2;

	const level_1 = pc.hasOwnProperty(param_1) ? pc[param_1] : undefined;

	if( level_1 !== undefined && level_1.hasOwnProperty(param_2) ){
		res.status(200).json(level_1[param_2]);	
	}
	else{
		send404(res);
	}
	
});*/

app.get('/task3A/:level1', (req, res) => {

	const params = Object.values(req.params);

	renderObjectByRoute( params, req, res );
	
});

app.get('/task3A/:level1/:level2', (req, res) => {

	const params = Object.values(req.params);

	renderObjectByRoute( params, req, res );
	
});

app.get('/task3A/:level1/:level2/:level3', (req, res) => {

	const params = Object.values(req.params);

	renderObjectByRoute( params, req, res );
	
});

function renderObjectByRoute(params, req, res){

	const all_params = params;
	const depth = all_params.length;

	console.log(all_params);

	var obj = pc;

	var counter = 0;

	all_params.forEach( (param) => {

		//console.log(param);
		//console.log(obj);
	     
		if( typeof obj === 'object' && obj.hasOwnProperty(param) ){

			if( Array.isArray(obj) && isNaN(param)  && obj.indexOf(param) == -1 ){
				return false;
			}	
				
			obj = obj[param];
			counter++;
			
		}

	});

	if( counter == depth ){
		res.status(200).json(obj);	
	}
	else{
		send404(res);
	}

}

/*app.get('/task3A/:level1/:level2/:level3', (req, res) => {

	const level_1 = pc[req.params.level1];
	const level_2 = pc.hasOwnProperty(level_1) ? level_1[req.params.level2] : undefined;
	const level_3 = pc.hasOwnProperty(level_2)  ? level_2[req.params.level3] : undefined;

	if( pc.hasOwnProperty(level_3) ){
		res.status(200).json(level_3);	
	}
	else{
		send404(res);
	}
	
});*/



app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function send404(res){

	res.status(404).send('Not Found');

}
