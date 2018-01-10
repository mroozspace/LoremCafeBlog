<script>
function search(){

	var blogTitles  = document.getElementsByTagName("h2"),
		input		= document.getElementById("search"),
		blogs 		= document.getElementsByClassName("search-item"),
		filter		= input.value.toUpperCase();

	for(i=0; i<blogTitles.length; i++){

		if ( blogTitles[i].innerHTML.toUpperCase().indexOf(filter)>-1){
			blogs[i].style.display="";
		} else {
			blogs[i].style.display="none";
		}

	}
	console.log("hi");
}
</script>