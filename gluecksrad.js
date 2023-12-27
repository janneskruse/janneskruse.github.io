

(async function() {

// get the json and create selection buttons
var json =[]
var vis = [];
var keys = [];
await fetch('./input.json')
    .then((response) => response.json())
    .then(
        (data) => {
            json = data;
            //console.log(json);

            // get every attribute of json
            keys = Object.keys(json);
            //console.log(keys);

            //create button for every attribute
            for (var i = 0; i < keys.length; i++) {
                var button = document.createElement("button");
                button.setAttribute("class", "btn");
                button.innerHTML = keys[i];
                button.setAttribute("id", keys[i]);
                document.getElementById("buttons").appendChild(button);
            }
        }
    )
    .catch(error => console.error('Error:', error));


    // set up for svg and wheel
    var padding = {top:20, right:40, bottom:0, left:0},
            w = 450 - padding.left - padding.right,
            h = 450 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20();//category20c()
            //randomNumbers = getRandomNumbers();
        //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results


    // create output container
    const fragment = document.createDocumentFragment(); //create a document fragment for the code as its lightweight making the code faster
    const responsecont = $('<div>', { class: 'code-cell' });
    fragment.appendChild(responsecont[0]);
    const header = $('<div>', { class: 'code-header' });
    responsecont.append(header);
    $('<p>', { text: "Brew kettle" }).appendTo(header);
    var brew = [];

    // content cell
    const codecontent = $('<div>', { class: 'code-content' });
    responsecont.append(codecontent);
    const preElement = $('<pre>');

    //copy to clipboard functionality for header
    const copyButton = $('<button>', { text: 'Copy to Clipboard' }).appendTo(header);
            
    const codeElement = $('<code>', { class:'code'});
    const listElement = $('<ul>')

    codeElement.append(listElement);
    preElement.append(codeElement);
    codecontent.append(preElement);
    right=document.getElementById("right"); 
    right.append(fragment); //append the code to the response container

    
    header.on('click', 'button', function () {
        const markdownList = brew.map(function(item) {
            return "- " + item;
        }).join("\n");
        navigator.clipboard.writeText(markdownList);
        copyButton.text('Code copied');
        setTimeout(function () {
            copyButton.text('Copy to Clipboard');
        }, 3000);
    });



    //create first wheel
    var data = [];
    data= json[keys[0]]
    var datadict = [];
    for (var i = 0; i < data.length; i++) {
        datadict.push({"label": data[i], "value": i});
    }
    data=datadict;
    var spinner = d3.select("#spinner");
    //console.log(spinner);
    addWheel(data);


    //get the buttons
    var buttons = document.getElementById("buttons").getElementsByClassName("btn");
    buttons = [...buttons];
    buttons[0].classList.add('selected');
    console.log(buttons);


    //buttons for each on click function to create new wheel from data
    buttons.forEach(function (element) {
        //console.log("elem:", element);
        element.addEventListener('click', function () {
            //console.log(element.id)
            // toggle selection
            element.classList.toggle('selected');

            // get all selected buttons
            var selectedButtons = document.getElementsByClassName("selected");
            //console.log(selectedButtons);

            // get all selected buttons ids
            var selectedButtonsIds = [];
            for (var i = 0; i < selectedButtons.length; i++) {
                selectedButtonsIds.push(selectedButtons[i].id);
            }
            console.log("selbuttons:" ,selectedButtonsIds);

            data=[];
            // for every id get data from json and merge it
            for (var i = 0; i < selectedButtonsIds.length; i++) {   
                data = data.concat(json[selectedButtonsIds[i]]);
            }

            console.log(data);
            var datadict = [];
            for (var i = 0; i < data.length; i++) {
                datadict.push({"label": data[i], "value": i});
            }
            data=datadict
            console.log(data);

            // create wheel
            addWheel(data);
        });
    }); 



    
    //function to draw the wheel
    function addWheel(data) {
        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");

            
        arcs.append("path")
            
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });

        // add the text
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .text( function(d, i) {
                return data[i].label;
            });
       
        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});

        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .attr("id", "spincircle")
            .style({"fill":"white","cursor":"pointer"});

        // append image to circle
        container.append("svg:image")
            .attr("xlink:href", "./antoniaspin.png")
            .attr("width", 70)
            .attr("height", 70)
            .attr("x", -38)
            .attr("y", -35)
            .attr("id", "spinimage");

       
        // on spin click request full screen
        spinner.on("click", function() {
            scaleSpinner();
            spin();
        });

    } // end addWheel()



    // This function is called when the wheel is spun
    function spin(){
        // Remove any click handlers from the container
        spinner.on("click", null);
        // If all slices have been seen, log "done" and remove click handlers
        console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if(oldpick.length == data.length){
            console.log("done");
            spinner.on("click", null);
            return;
        }

        // Calculate the degree of each slice
        var  ps = 360/data.length,
                pieslice = Math.round(1440/data.length),
                rng      = Math.floor((Math.random() * 1440) + 360);
            
        // Calculate the rotation of the wheel
        rotation = (Math.round(rng / ps) * ps);

        // Determine which slice was picked
        picked = Math.round(data.length - (rotation % 360)/ps);
        picked = picked >= data.length ? (picked % data.length) : picked;

        // If the slice has already been picked, spin again
        if(oldpick.indexOf(picked) !== -1){
            d3.select(this).call(spin);
            return;
        } else {
            // Otherwise, add the slice to the list of old picks
            oldpick.push(picked);
        }

        // Adjust the rotation and animate the spin
        rotation += 90 - Math.round(ps/2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function(){
                // Mark the picked slice as seen
                d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    .attr("fill", "#111");

                // Log the value of the picked slice
                console.log(picked)
                console.log(data[picked].label)
                listElement.append(
                    $('<li>', { text: data[picked].label }),
                );
                brew.push(data[picked].label);
            
                // Re-enable the spin on click
                spinner.on("click", function() {
                    scaleSpinner()
                    spin();

                });
        });
    }
        



        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }
            return array;
        }






    function scaleSpinner() {
        var spinimage = document.getElementById("spinimage");
        spinimage.style.animation = "scaleAnimation 1s";
        setTimeout(function(){ spinimage.style.animation = "none"; }, 1000); // Reset the animation property
    }



})();



d3.select("#fullscreen").on("click", function() {
    var elem = document.getElementById("miraculix");
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
});


// listen for fullscreen changes
document.addEventListener("fullscreenchange", function() {
    var isFullscreen = document.fullscreenElement != null;
    var elementsToHide = document.querySelectorAll(".hide-in-fullscreen");

    elementsToHide.forEach(function(elem) {
        if (isFullscreen) {
            // hide the element in fullscreen mode
            elem.style.display = "none";
        } else {
            // show the element when not in fullscreen mode
            elem.style.display = "";
        }
    });
});


