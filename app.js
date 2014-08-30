(function(){
    window.GOL = window.GOL || {};
    //config variable
    var x = 25, y = 25, //Grid Size
        gen = 0, //generations count
        aliveColor = '#7CFC00', //color set of a cell is alive
        frameTime = 500; //time for which generation happens in msecs
    //other vars available for the game
    var canvas = document.getElementById('GOL_CANVAS'),
        context = canvas.getContext('2d'),
        genLbl = document.getElementById('genNum'),
        timer_min = document.getElementById('GOL_TIMER_MIN'),
        timer_sec = document.getElementById('GOL_TIMER_SEC'),
        startGrid = null,
        breakTime = 0,
        startTime = null;
    GOL.isPlaying = false; //stops playing if false
    
    //create a required grid array based on size passed. sets random true/false value if isRandom is true
    function createGrid( rows, cols, isRandom){
        var arr = [];
        for(var i=0; i < rows; i++){
            arr.push([]);
            arr[i].push(new Array(cols));
            for(var j=0; j < cols; j++){
                arr[i][j] = isRandom ? !! Math.round(Math.random()) : false;
            }
        }
        return arr;
    }
    
    //get the count of neighborhood alive cells for a current cell
    function getNeighborCount(current, j, k){
        var count = 0;
        if (current[j+1] && current[j+1][k]){
            count++;
        }
        if (current[j+1] && current[j+1][k+1]){
            count++;
        }
        if (current[j][k+1]){
            count++;
        }
        if (current[j][k-1]){
            count++;
        }
        if (current[j+1] && current[j+1][k-1]){
            count++;
        }
        if (current[j-1] && current[j-1][k]){
            count ++;
        }
        if (current[j-1] && current[j-1][k-1]){
            count ++;
        }
        if (current[j-1] && current[j-1][k+1]){
            count ++;
        }
        return count;
    }
    
    //based on neighbour cell live count, returns the live status of the cell
    function isAlive(current, j, k){
        var neighborCount = getNeighborCount(current, j, k);
		return (current[j][k] && neighborCount == 2) || neighborCount == 3;
	}
	
	//returns true if all cells are dead.
	function isAllDead(current) {
        var clone = [];
        for(var x in current) {
            if(current[x] instanceof Array) {
                clone[x] = current[x].join("||");
            }
        }
        return !eval(clone.join("||"));
	}
	
	//based on grid array data, makes the canvas
	function render(current) {
        var rectWidth = canvas.width/x,
            rectHeight = canvas.height/y,
            rectX = 0,
            rectY = 0;
        
        //Clear the context first
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        
        for (var j=0;j<x;j++){
			for (var k=0; k< y; k++){
                rectX = j * rectWidth;
                rectY = k * rectHeight;
				context.beginPath();
                context.rect(rectX,rectY, rectWidth, rectHeight);
                if(current[j][k]) {
                    context.fillStyle = aliveColor;
                    context.fill();
                }
                //border for each cell
                context.lineWidth = 1;
                context.strokeStyle = '#0E0E0E';
                context.stroke();
			}
		}
	}
	//timer
	function setTimer(time) {
        if(GOL.isPlaying) {
            var diff = (new Date()) - startTime;
            if(time) {
                diff += breakTime;
            }
            breakTime = diff;
            renderTimer(diff);
            setTimeout(function(){
                setTimer();
            }.bind(this),1000);  
        }
	}
    //set timer in mm:ss in DOM
    function renderTimer(time) {
        time = time/1000; //ms to secs
        // get seconds
        var seconds = Math.round(time % 60);
        // remove seconds from the date
        time = Math.floor(time / 60);
        // get minutes
        var minutes = Math.round(time % 60);
        timer_min.innerHTML = minutes;
        timer_sec.innerHTML = seconds;
    }
    
    //runs the game each step
    GOL.run = function(current){ 
        var next = createGrid(x, y, false);
			for (var j=0;j<x;j++){
				for (var k=0; k< y; k++){
					next[j][k] = isAlive(current,j,k); 
				}
			}
            return next;
    };
    
    //initialises the game
    GOL.init = function(){
        startGrid = createGrid(x, y, true);
        gen = 0;
        breakTime = 0;
        genLbl.innerHTML = '00';
        timer_min.innerHTML = '00';
        timer_sec.innerHTML = '00';
        render(startGrid);
    };
    
    //starts the game
    GOL.auto = function(Grid){
        if(GOL.isPlaying) {
            startGrid = Grid || startGrid;
            //var t0 = performance.now();
            startGrid = GOL.run(startGrid);
            render(startGrid);
            //var t1 = performance.now();
            //console.log("Rendering Performance " + (t1 - t0) + " milliseconds.");
            gen++;
            genLbl.innerHTML = gen;
            setTimeout(function(){
                if(isAllDead(startGrid)) {
                    GOL.isPlaying = false;
                }
            }.bind(this), frameTime);
            setTimeout(function(){
                    GOL.auto(startGrid);
            }.bind(this), frameTime);
        }
    };
    //sets the size of grid
    GOL.setGrid = function(size) {
        GOL.isPlaying = false;
        x = size, y = size;
        GOL.init();
    }
    //timer starts
    GOL.startTimer = function() {
        debugger;
        startTime = new Date();
        setTimer(breakTime);
    }
    GOL.init();
})();

//set grid button click
var gridBut = document.getElementById('GOL_GRID_BUT');
gridBut.addEventListener('click', function(){
    var gridTxt = document.getElementById('GOL_GRID_TXT'),
        gridNum = gridTxt.value,
        gridForm = document.getElementById('GOL_GRID_FORM');
    if(isNaN(gridNum)) {
        gridForm.className = "ui inverted form error";
        setTimeout(function(){
            gridForm.className = "ui inverted form";
        },5000);
    } else {
        gridForm.className = "ui inverted form";
        GOL.setGrid(Number(gridNum));
    }
},false);

//play button click
var playBut = document.getElementById('GOL_PLAY');
playBut.addEventListener('click', function(){
    GOL.isPlaying = true;
    GOL.auto();
    GOL.startTimer();
},false);

//stop button click
var stopBut = document.getElementById('GOL_STOP');
stopBut.addEventListener('click', function(){
    GOL.isPlaying = false;
},false);

//reset button click
var resetBut = document.getElementById('GOL_RESET');
resetBut.addEventListener('click', function(){
    GOL.isPlaying = false;
    GOL.init();
},false);