import express from 'express';
import cors from 'cors';

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

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
