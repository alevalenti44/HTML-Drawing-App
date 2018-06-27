let canvas;
let ctx;
let brush = {
        x: 0,
        y: 0,
        color: '#000000',
        size: 10,
        down: false,
    },
    strokes = [],
    currentStroke = null;

function redraw() {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    ctx.lineCap = 'round';
    for (let i = 0; i < strokes.length; i++) {
        let s = strokes[i];
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let j = 0; j < s.points.length; j++) {
            let p = s.points[j];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

function init() {
    //makes #dragMe draggable
    $('#dragme').draggabilly({});
    //
    canvas = $('#draw');
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    ctx = canvas[0].getContext('2d');

    function mouseEvent(e) {
        brush.x = e.pageX;
        brush.y = e.pageY;

        currentStroke.points.push({
            x: brush.x,
            y: brush.y,
        });

        redraw();
    }

    canvas
        .mousedown(function(e) {
            console.log('mousedown detected');
            brush.down = true;

            currentStroke = {
                color: brush.color,
                size: brush.size,
                points: [],
            };

            strokes.push(currentStroke);
            mouseEvent(e);
        })
        .mouseup(function(e) {
            brush.down = false;

            mouseEvent(e);
            currentStroke = null;
        })
        .mousemove(function(e) {
            if (brush.down) {
                mouseEvent(e);
            }
        });

    $('#undoButton').click(function() {
        //Since the drawing is a big array with all the stroke we just remove the last stroke in the array and we redraw
        // to save the changes
        console.log('undo button clicked');
        strokes.pop();
        redraw();
    });

    $('#saveButton').click(function() {
        console.log('save button clicked');
        //save feature is created using this ReIMG library https://github.com/alevalenti44/reimg
        let png = ReImg.fromCanvas(document.getElementById('draw')).toPng();
        ReImg.fromCanvas(document.querySelector('canvas')).downloadPng();
    });

    //When the button is clicked the "rectangle" is cleared, in this case the rectangle is the size of our window.
    $('#clearButton').click(function() {
        console.log('clear button clicked');
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        //The strokes array is emptied  vto avoid the old drawing that has been cleared to re-appear on next draw.
        strokes = [];
    });

    //When the color picker value gets changed, modify brush color, default is black.
    //jquery plugin for color wheel is from https://github.com/fujaru/jquery-wheelcolorpicker.
    $('#userColor').on('change', function() {
        console.log('user color has been changed');
        console.log($('#userColor').val());
        currentStroke.color = '#' + this.value;
        brush.color = '#' + this.value;
    });

    //Modify the brush size default is 10
    $('#brushSize').on('change', function() {
        console.log('brush size has been changed');
        brush.size = this.value;
        currentStroke.size = this.value;
    });

    //Last bracket
}

$(init);
