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
            var userTerm = $('#inputBox').val();
            console.log('beer term:\n',userTerm);

            //run the api call with the beerTerm
            app.getBeerData(userTerm);
        })
        
    },
    getFoodSearch: function() {
        $('td').click(function() {
            
            var beerdata = this.getAttribute('data-desc');
        
            //Get the input box value - use text razor api to parse beer description and compare it to ingredient list of food
            $.ajax({
                url: "https://api.textrazor.com/",
                type: "POST",
                dataType: 'json',
                headers: {
                    'x-textrazor-key': "0d9c0c5f4809be708351bebc37eb4293ee105eda57471968947c88ea"
                },
                data: { 
                    extractors: "entities,words",
                    text: "'"+beerdata+"'",
                    type: ['/food/ingredient']
                },
    
                error: function (xhr) {
                    console.error(xhr.responseText);
                },
   
                success: function (data) {
                    console.log('textrazor data:\n',data);
                    
                    var foodresponse = data.response;
                    var beerTerms = [];
                    var minconf = _.min(_.pluck(foodresponse.entities,"confidenceScore"));
                    var maxconf = _.max(_.pluck(foodresponse.entities,"confidenceScore"));
                    var minrela = _.min(_.pluck(foodresponse.entities,"relevanceScore"));
                    var maxrela = _.min(_.pluck(foodresponse.entities,"relevanceScore"));
                    for (var i=0; i<foodresponse.entities.length; i++){
                        if (foodresponse.entities){
                            if(foodresponse.entities[i].confidenceScore && foodresponse.entities[i].confidenceScore >=minconf+((maxconf-minconf)/2) && foodresponse.entities[i].relevanceScore && foodresponse.entities[i].relevanceScore > minrela+((maxrela-minrela)/2) ){
                                
                                beerTerms.push(foodresponse.entities[i].entityEnglishId.toLowerCase());
                                
                            }
                        }
                    }
                    
                    

                    //run the yummly api call with the beerTerm
                    beerTerms = _.unique(beerTerms).join("&allowedIngredient[]=");
                    console.log('unique beerTerms:\n',beerTerms);
                    app.getFoodData(beerTerms); 
                }
            });
 
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
				console.log('theBeers:\n',theBeers);

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
                    htmlString += '<tr class="row"><td>'+ beername +'</td><td>'+ beerstylename + '</td><td data-desc="' + beerdesc + '">'+ beerdesc +'</td><td><img class = "blabel" src= ' + label +'></td></tr>'}
                
                htmlString += '</table>'
                
                //append the string to the beers div
                $('.beers').append(htmlString);
                
                app.getFoodSearch();
			}
            
            
		});
	},
    getFoodData: function(BeerTerms) {
		console.log("Food");
        
		var YumURL = "http://api.yummly.com/v1/api/recipes?";
        var myYummlyAPIID = "_app_id=209f537e";
		var myYummlyAPIKey = "&_app_key=278352a846671c55c698496348b32ffb";
        
        //every recipe has to match the search phrase and satisfy the ingredient, cuisine, course, holiday, time, nutrition, and taste restrictions
        var SearchParam = "&allowedIngredient[]="+ BeerTerms +"&requirePictures=true&allowedCourse[]=course^course-Desserts"
		var YumReqURL = YumURL + myYummlyAPIID + myYummlyAPIKey + SearchParam;
        
        console.log('theBeers:\n',YumReqURL);
        
		$.ajax({
			url: YumReqURL,
			type: 'GET',
			dataType: 'json',
			
            error: function(err){
				console.log(err);
			},
			
                
                
            success: function(data){
				console.log("Got the data");
                console.log('Food data:\n',data.matches);
				var theDesserts = data.matches;
				
                
                $('.food').html("");
                
                var htmlString = '<table id = "foodtable" style="width:100%">';
                htmlString +=	'<tr><th>Name</th><th>Course</th><th>Image</th><tr>';
                

				
                
                for (var i = 0; i < theDesserts.length; i++){
                    //set default values for table entry
                    var foodname = "Not Available"; 
                    var foodcourse = "Not Available";
                    var fimage = "fooddefault.jpg";
                    var course = "Not Available";
                    
                    
                    //check if values in json return
                    if (theDesserts[i].attributes && theDesserts[i].attributes.course){
                        course = theDesserts[i].attributes.course
                    }  
                        
                        if(theDesserts[i].recipeName){
                            foodname = theDesserts[i].recipeName}
                        
                        if (theDesserts[i].smallImageUrls){
                            fimage = theDesserts[i].smallImageUrls[0]}
                    
                    //build the html string
                    htmlString += '<tr class="row"><td>'+ foodname +'<td>'+ course +'</td><td><img class = "blabel" src= ' + fimage +'></td></tr>'}
                
                htmlString += '</table>'
                
                //append the string to the beers div
                $('.food').append(htmlString);
                
                
            }
        });
    }

}
    
