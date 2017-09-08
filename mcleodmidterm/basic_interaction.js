var app = {
	initialize: function() {
		app.getSearchTerm();
        
	},

    getSearchTerm: function() {
        $('#submitSearch').click(function(){
        
            //Clear any previous search results 
            $('.beers').html('');
            $('.food').html('');

            //Get the input box value
            var beerTerm = $('#inputBox').val();
            console.log(beerTerm);

            //run the api call with the beerTerm
            app.getBeerData(beerTerm);
        })
        
    },
    getFood: function() {
        $('#beertable').click(function() {
        
            //Clear any previous search results 
            $('.food').html('');

            //Get the input box value
            var beerTerm = $('#inputBox').val();

            //run the api call with the beerTerm
            app.getFoodData(beerTerm); 
        });
        
    },
        
    getBeerData: function(Term) {
		console.log("Beers");

		var BeerURL = "http://api.brewerydb.com/v2/search?key=";
		var myBeerAPIKey = "adc1e562bb00337ee44e0dcf23cfefcc";
        var SearchParam = "&q="+Term+"&type=beer&withIngredients=Y"
		var BeerReqURL = BeerURL + myBeerAPIKey+SearchParam;

		$.ajax({
			url: BeerReqURL,
			type: 'GET',
			dataType: 'json',
			
            error: function(err){
				console.log(err);
			},
			
            success: function(data){
				console.log("Got the data");
				var theBeers = data.data;
				console.log(theBeers);

				//Clear out the container
				$('.beers').html("");
                
                var htmlString = '<table id = "beertable" style="width:100%">';
                htmlString +=	'<tr><th>Name</th><th>Style</th><th>Description</th><th>Label</th><tr>';
				
                
                for (var i = 0; i < theBeers.length; i++){
                    //set default values for table entry
                    var beername = "Not Available";
                    var beerstylename = "Not Available";
                    var beerdesc = "Not Available";
                    var label = "beercloseup.jpg";
                    
                    
                    //check if values in json return
                    if(theBeers[i].name){
                        beername = theBeers[i].name}
                    
                    if (theBeers[i].style && theBeers[i].style.name){
                        beerstylename = theBeers[i].style.name}
                    
                    if(theBeers[i].description){
                        beerdesc = theBeers[i].description}
                    
                    if (theBeers[i].labels){
                        label = theBeers[i].labels.icon}
                    
                    
                    //build the html string
                    htmlString += '<tr class="row"><td>'+ beername +'</td><td>'+ beerstylename + '</td><td>'+ beerdesc +'</td><td><img class = "blabel" src= ' + label +'></td></tr>'}
                
                htmlString += '</table>'
                
                //append the string to the beers div
                $('.beers').append(htmlString);
                
                app.getFood();
			}
            
            
		});
	},
    getFoodData: function(BeerTerm) {
		console.log("Desserts");

		var YumURL = "http://api.yummly.com/v1/api/recipes?";
        var myYummlyAPIID = "_app_id=209f537e";
		var myYummlyAPIKey = "&_app_key=278352a846671c55c698496348b32ffb";
        
        //every recipe has to match the search phrase and satisfy the ingredient, cuisine, course, holiday, time, nutrition, and taste restrictions
        var SearchParam = "&allowedIngredient[]="+ BeerTerm +"&requirePictures=true"
		var YumReqURL = YumURL + myYummlyAPIID + myYummlyAPIKey + SearchParam;

		$.ajax({
			url: YumReqURL,
			type: 'GET',
			dataType: 'json',
			
            error: function(err){
				console.log(err);
			},
			
                
                
            success: function(data){
				console.log("Got the data");
				var theDesserts = data.matches;
				console.log(theDesserts);
                
                $('.food').html("");
                
                var htmlString = '<table id = "foodtable" style="width:100%">';
                htmlString +=	'<tr><th>Name</th><th>Image</th><tr>';
                

				
                
                for (var i = 0; i < theDesserts.length; i++){
                    //set default values for table entry
                    var foodname = "Not Available"; 
                    var foodcourse = "Not Available";
                    var fimage = "fooddefault.jpg";
                    
                    
                    //check if values in json return
                    if (theDesserts.attributes && theDesserts.attributes.course.includes("Desserts")){
                        if(theDesserts.recipeName){
                            foodname = theDesserts.recipeName}
                        
                        if (theBeers[i].labels){
                            fimage = theDesserts[i].smallImageUrls[0]}
                    }
                    
                    //build the html string
                    htmlString += '<tr class="row"><td>'+ foodname +'</td><td><img class = "blabel" src= ' + fimage +'></td></tr>'}
                
                htmlString += '</table>'
                
                //append the string to the beers div
                $('.food').append(htmlString);
                
                
            }
        });
    }

}
    
