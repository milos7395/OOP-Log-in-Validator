class Validator { //Ovde se definiše JavaScript klasa nazvana Validator koja će se koristiti za validaciju formi na web stranici.
	constructor(config) {
		this.elementsConfig = config;
		this.errors = {}; //Ovaj objekat će se koristiti za skladištenje informacija o greškama prilikom validacije formi. Početno je prazan jer još nema registrovanih grešaka.

		this.generateErrorsObject(); // Ova linija koda poziva metod .Ovde se stvara struktura u kojoj će se čuvati potencijalne greške za svako polje forme.
		this.inputListener(); //kad nesto napisemo da dobijemo povratnu informaciju. Kada korisnik nešto unese u polje, ovaj metod će omogućiti praćenje tog događaja i pokretanje validacije.
	}
	generateErrorsObject() {
		for(let field in this.elementsConfig) {
			this.errors[field] = []; // u svakom polju imamo prazan niz gde cemo smestiti greske

		}
	}

	inputListener() {  
		let inputSelector = this.elementsConfig; //u elementsConfig su upisani nazivi ovih polja

		for(let field in inputSelector) { 
			let el = document.querySelector(`input[name="${field}"]`);

			el.addEventListener('input', this.validate.bind(this)); //eventlistener je klik ,skrol...Bind(this) koristimo da bi smo mogli da dobijemo koje je to polje koje smo mi promenili
	}
}

validate(e) {
	let elFields = this.elementsConfig; //uzimamo sva polja

	let field = e.target; //uzimamo trenutno polje. Njega validiramo
	let fieldName = field.getAttribute('name');
	let fieldValue = field.value;

	this.errors[fieldName] = [];

	if(elFields[fieldName].required) { //Ovaj deo koda proverava da li je trenutno polje označeno kao "required" u konfiguraciji polja. Ako jeste, to znači da je unos u polje obavezan
       if (fieldValue === '') { //ako je true onda proveravamo da li je nesto unutar polja
       	this.errors[fieldName].push('Polje je prazno'); 
       }
	}

	if (elFields[fieldName].email) { //proverevamo da li je ovo polje email
		if (!this.validateEmail(fieldValue)) {
            this.errors[fieldName].push('Neispravna email adresa');
		}
	}

	if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
		this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);
	}

	if (elFields[fieldName].matching) {
		let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);
		if (fieldValue !== matchingEl.value) {
			this.errors[fieldName].push('Lozinke se ne poklapaju');
		}

		if (this.errors[fieldName].length === 0) {
			this.errors[fieldName] = [];
			this.errors[elFields[fieldName].matching] = [];
		}
	}

	this.populateErrors(this.errors); //ispisujemo greske
}

populateErrors(errors) { //Ova metoda se koristi za prikazivanje grešaka na stranici.Ova metoda se koristi za proveru da li je uneta vrednost validna email adresa. 
	for(const elem of document.querySelectorAll('ul')) {
		elem.remove();
	}
	for(let key of Object.keys(errors)) {
		let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
		let errorsElement = document.createElement('ul');
		parentElement.appendChild(errorsElement);

		errors[key].forEach(error => {
			let li = document.createElement('li');
			li.innerText = error;

			errorsElement.appendChild(li)
		});
	}
	}

validateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
 	return true;
 }

    return false;
  }
}