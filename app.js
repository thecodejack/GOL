(function(){
    window.GOL = window.GOL || {};
    var x = 25, y = 25, //Grid Size
        gen = 0, bkGroundColor = '#1f2628',
        aliveColor = '#7CFC00';
    var canvas = document.getElementById('GOL_CANVAS')
        context = canvas.getContext('2d'),
        genLbl = document.getElementById('genNum'),
        GOL.isPlaying = false, 
        startGrid = null;
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
    
    function isAlive(current, j, k){
        var neighborCount = getNeighborCount(current, j, k);
		return current[j][k] && neighborCount == 2 || neighborCount == 3;
	}
	
	function render(current) {
        var rectWidth = canvas.width/x,
            rectHeight = canvas.height/y,
            rectX = 0,
            rectY = 0;
        //Clear the context first
        // Store the current transformation matrix
        context.save();
        
        // Use the identity matrix while clearing the canvas
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Restore the transform
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
                context.lineWidth = 3;
                context.strokeStyle = '#0E0E0E';
                context.stroke();
			}
		}
	}
    
    GOL.run = function(current){ //runs the game
        var next = createGrid(x, y, false);
			for (var j=0;j<x;j++){
				for (var k=0; k< y; k++){
					next[j][k] = isAlive(current,j,k); 
				}
			}
            return next;
    };
    GOL.init = function(){ //initialises the game
        startGrid = createGrid(x, y, true);
        gen = 0;
        genLbl.innerHTML = '00';
        render(startGrid);
    };
    GOL.auto = function(Grid){
        startGrid = Grid || startGrid;
        startGrid = GOL.run(startGrid);
        render(startGrid);
        gen++;
        genLbl.innerHTML = gen;
        setTimeout(function(){
            if(GOL.isPlaying) {
                GOL.auto(startGrid);
            }
        }.bind(this), 1000);
    };
    
    GOL.init();
})();

var playBut = document.getElementById('GOL_PLAY');
playBut.addEventListener('click', function(){
    GOL.isPlaying = true;
    GOL.auto();
},false);

var stopBut = document.getElementById('GOL_STOP');
stopBut.addEventListener('click', function(){
    GOL.isPlaying = false;
},false);

var resetBut = document.getElementById('GOL_RESET');
resetBut.addEventListener('click', function(){
    GOL.isPlaying = false;
    GOL.init();
},false);