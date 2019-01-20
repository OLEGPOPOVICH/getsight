Vue.filter('rounding', function (value) {
    return value.toFixed(2);
});
Vue.filter('endingsText', function (value) {
	if( value.slice(-1) == "а") return value.slice(0, -1) + 'у';
	return value;
});

var temp = new Vue({
	el: '#main',
	created() {
		wrThis = this;
		this.readTextFile("http://test/Test_task_front/products.json", function(text){

			let data = JSON.parse(text);
			data.forEach(function(element) {

				let urlImg = element.primaryImageUrl;
				let urlLengthToExpand = urlImg.lastIndexOf('.'); 
				let urlImgWithoutExtension = urlImg.substr(0, urlLengthToExpand);
				let imgExtension =  urlImg.substr(urlLengthToExpand);    
				let newUrlImg = urlImgWithoutExtension + wrThis.stringModifierImg + imgExtension;

				element.primaryImageUrl = newUrlImg;
				element.flagDimension = true;
				element.flagClub = true;
			
				let arrayAssoc = element.assocProducts.split(';');
			
				arrayAssoc.forEach(function (elem, i) {	
					if(arrayAssoc[i].length) {
						if(arrayAssoc.length-2 > i){
							arrayAssoc[i] = elem.replace(/[^A-Za-zА-Яа-яЁё]/g, " ").concat(",");
						} else {
							arrayAssoc[i] = elem.replace(/[^A-Za-zА-Яа-яЁё]/g, " ");
						}
					} else {
						arrayAssoc.splice(arrayAssoc.indexOf(i), 1);
					}
				});
			
				let newAssocProducts = [];
				newAssocProducts.push(Object.assign({}, arrayAssoc));
				element.assocProducts = newAssocProducts;
				wrThis.products.push(element);
			});
		});
	},
    data: {
		products: [],
		stringModifierImg: "_220x220_1"
	},
    methods: {
		priceDimension: function(field){
			
			let elemID = field.parentNode.parentNode.parentNode.id;
			for(let i = 0; i < this.products.length; i++) {
				if( this.products[i].code == elemID) {
					this.products[i].flagDimension = !this.products[i].flagDimension;
					this.products[i].flagClub = !this.products[i].flagClub;
				}
			};
		},
		titleDimension: function(event){
		
			let field = event.target.parentNode;
			if(!field.classList.contains("unit--active")) {
				field.parentNode.querySelector(".unit--active").classList.remove("unit--active");
				field.classList.add("unit--active");
			}

			this.priceDimension(field);
		},
		plus: function (event) {
			let stepperInput = event.target.parentNode.querySelector(".stepper-input");
			let stepperInputValue = event.target.parentNode.querySelector(".stepper-input").value;
				stepperInputValue++;
				stepperInput.value = stepperInputValue++;
		},
		minus: function (event) {
			let stepperInput = event.target.parentNode.querySelector(".stepper-input");
			let stepperInputValue = event.target.parentNode.querySelector(".stepper-input").value;

			if(stepperInputValue > 1) {
				stepperInputValue--;
			}
			stepperInput.value = stepperInputValue;
		},
		readTextFile: function(file, callback) {

			var rawFile = new XMLHttpRequest();
			rawFile.overrideMimeType("application/json");
			rawFile.open("GET", file, true);
			rawFile.onreadystatechange = function() {
				if (rawFile.readyState === 4 && rawFile.status == "200") {
					callback(rawFile.responseText);
				}
			}
			rawFile.send(null);
		}
    }
});