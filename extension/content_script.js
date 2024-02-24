
//If locked, open the link in a new tab.
document.addEventListener("click", (e) => {
    try {
        let fixed_ele = document.getElementById(lockMarkId);
        if (fixed_ele !== null) {
            //If locked
            if (fixed_ele.style.display == "inline") {
                let counter = 0;
                let element = e.target;
                //whether parent element contains "A" tag
                while (element !== undefined && element !== null && counter <= 1000) {
                    counter++;
                    if (element instanceof HTMLElement) {
                        if (element.tagName == "A") {
                            let url = element.href;
                            if (url !== null && url.match(/(https|http)\:\/\/.*/g)) {
                                //open the link in a new tab.
                                e.stopImmediatePropagation();
                                e.preventDefault();
                                chrome.runtime.sendMessage(
                                    {
                                        action: "openInNewTab",
                                        targeturl: url
                                    }
                                ).catch(() => { });
                            }
                            break;
                        }
                        element = element.parentElement;
                    }
                }
            }
        }
    } catch (ex) {
        console.log(ex);
    }
}, true);

//Double-click to toggle lock status
let doubleClickStep = 0; // 0:up -> 1:down -> 2:up -> 3:down -> 4:up = double click
let pos_x = -100;
let pos_y = -100;
let date0 = new Date();
let lockMarkId = "fixed_locked_mark";

document.addEventListener("mousedown", (event) => {
    if (Math.abs(pos_x - event.pageX) <= 5 && Math.abs(pos_y - event.pageY) <= 5) {
        doubleClickStep++;
    } else {
        doubleClickStep = 1;
    }
    pos_x = event.pageX;
    pos_y = event.pageY;
    if (doubleClickStep == 1) {
        date0 = new Date();
    }
});
document.addEventListener("mouseup", (event) => {
    if (Math.abs(pos_x - event.pageX) <= 5 && Math.abs(pos_y - event.pageY) <= 5) {
        pos_x = event.pageX;
        pos_y = event.pageY;
        doubleClickStep++;
    } else {
        pos_x = -100;
        pos_y = -100;
        doubleClickStep = 0;
    }
    if (doubleClickStep == 4) {
        //double click
        if (new Date() - date0 <= 450) {

            //Is the text selected?
            let isTextSelected = false;

            let s = document.getSelection();//Selection
            let node0 = s.anchorNode;//Start Node
            let node1 = s.focusNode;//End Node

            if (node0 != null && node1 != null && node0 == node1) {//Start Node == End Node
                if (node0.parentElement != null && node1.parentElement != null && node0.parentElement == node1.parentElement) {//Start Element == End Element
                    let x = event.clientX;
                    let y = event.clientY;
                    if (x != null && y != null) {
                        let element = document.elementFromPoint(x, y);
                        if (element == node0.parentElement) {//Start Element == Element under the mouse
                            if (s.toString().trim() != "") {//If selection text is not empty
                                isTextSelected = true;
                            }
                        }
                    }
                }
            }

            //If text is not selected,
            if (!isTextSelected) {
                //change locked mark visible
                let fixed_ele = document.getElementById(lockMarkId);
                fixed_ele.style.display = fixed_ele.style.display == "none" ? "inline" : "none";
            }
        }
        doubleClickStep = 0;
    }
});

//Add a "locked mark" to the web page
let fixeddiv = document.createElement('div');
fixeddiv.id = lockMarkId;
fixeddiv.style.position = "fixed";
fixeddiv.style.zIndex = "calc(infinity)";
fixeddiv.style.right = "0px";
fixeddiv.style.bottom = "0px";
fixeddiv.style.display = "none";

let childcanvas = document.createElement('canvas');
childcanvas.id = "lockMarkcanvas";
childcanvas.width = "100";
childcanvas.height = "100";

fixeddiv.appendChild(childcanvas);
document.body.appendChild(fixeddiv);

//Create a "locked mark"
let canvas = document.getElementById("lockMarkcanvas");
if (canvas.getContext) {
    let ctx = canvas.getContext('2d');

    let center = 50;
    let n = 0.55;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.lineWidth = 8 * n;
    ctx.arc(center, center, 50 * n, 0, Math.PI * 2, true);
    ctx.stroke();

    //Coordinate transformation
    const txy = (x0, y0) => {
        let rad = Math.PI / 4;

        let xd = x0 - center;
        let yd = y0 - center;

        return [
            xd * Math.cos(rad) - yd * Math.sin(rad) + center,
            xd * Math.sin(rad) + yd * Math.cos(rad) + center
        ]
    }

    const ctx_moveTo = (x0, y0) => {
        let xd, yd;
        [xd, yd] = txy(x0, y0);
        ctx.moveTo(xd, yd);
    }

    const ctx_lineTo = (x0, y0) => {
        let xd, yd;
        [xd, yd] = txy(x0, y0);
        ctx.lineTo(xd, yd);
    }

    ctx.beginPath();
    ctx.lineWidth = 1 * n;
    ctx_moveTo(center - 25 * n, center - 30 * n);
    ctx_lineTo(center + 25 * n, center - 30 * n);
    ctx_lineTo(center + 7 * n, center + 2 * n);
    ctx_lineTo(center + 22 * n, center + 20 * n);
    ctx_lineTo(center - 22 * n, center + 20 * n);
    ctx_lineTo(center - 7 * n, center + 2 * n);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 1 * n;
    ctx_moveTo(center - 2 * n, center + 20 * n);
    ctx_lineTo(center + 2 * n, center + 20 * n);
    ctx_lineTo(center + 2 * n, center + 35 * n);
    ctx_lineTo(center - 2 * n, center + 35 * n);
    ctx.fill();
}