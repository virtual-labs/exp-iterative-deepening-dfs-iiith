const nodeR = 12.5;
const edgeD = 2;
const INF = 1E9;

var canv = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const input = document.getElementById('autor');

var cur = -1;
var last = -1;
var type = true;
var d = [];
var maxb = 1;

var edges = [];
var nodes = [];
var parent = [];
var exist = [];

var visited = [];
var nodeLevels = [];
var visitedLevels = [];
var visited_edge = [];

var isWeigted = false;

var n = 0;
var SN = 0;

document.oncontextmenu = false;
canv.width = canv.offsetWidth;
canv.height = canv.offsetHeight;
ctx.font = "20px Arial";

canv.addEventListener('contextmenu', contextMenu);
function contextMenu(e) {
    //console.log("contextmenu");
    var v = node(e.offsetX, e.offsetY);
    if (v != -1) {
        vclear();
        exist[v] = false;
    }
}

canv.addEventListener('click', clickEvent); 
function clickEvent(e) {
    //console.log("click");
    if (cur != -1) {
        return;
    }
    var
        x = e.offsetX;
        y = e.offsetY;
        v = node(x, y);
    if (v == -1) {
        nodes.push([x, y]);
        edges.push([]);
        exist.push(true);
        if (exist[last] && last != -1 && n-1 != last) {
            if (edges[last].indexOf(n - 1))
            edges[last].push(n - 1);
            edges[n - 1].push(last);
            last = -1;
        }
		n++;
    } else {
		if (v == last) {
			last = -1;
			return;
		}
        if (!exist[last] || last == -1) {
            last = v;
        } else {
            if (edges[last].indexOf(v) == -1) {
                edges[last].push(v);
                edges[v].push(last);
            } else {
                edges[last].splice(edges[last].indexOf(v), 1);
                edges[v].splice(edges[v].indexOf(last), 1);
            }
            last = -1;
        }
    }
    //console.log(nodes, edges, exist);
};

canv.addEventListener('mousedown', mouseDown); 
function mouseDown(e) {
    //console.log("mousedown");
    var v = node(e.offsetX,  e.offsetY);
    if (v != -1) {
        cur = v;
    }
}

canv.addEventListener('mouseup', mouseUp);
function mouseUp(e) {
    //console.log("mouseup");
    cur = -1;
};

canv.addEventListener('mousemove', mouseMove); 
function mouseMove(e) {
    // console.log("mousemove: ", e.offsetX, e.offsetY);
    if (cur != -1) {
        nodes[cur] = [e.offsetX, e.offsetY];
    }
};

// canv.addEventListener('dblclick', function(e) {});

document.addEventListener('keydown', keyDown) 
function keyDown(e) {
    // console.log("keydown ", e.keyCode);
    if (e.keyCode == 66) { // b
        tforce();
    } else if (e.keyCode == 67) { // c
        cclear();
    }
};

function removeEventListeners() {
    canv.removeEventListener('contextmenu', contextMenu);
    canv.removeEventListener('click', clickEvent);
    canv.removeEventListener('mousedown', mouseDown);
    canv.removeEventListener('mouseup', mouseUp);
    canv.removeEventListener('mousemove', mouseMove);
    canv.removeEventListener('keydown', keyDown);
}

function addEventListeners() {
    canv.addEventListener('contextmenu', contextMenu);
    canv.addEventListener('click', clickEvent);
    canv.addEventListener('mousedown', mouseDown);
    canv.addEventListener('mouseup', mouseUp);
    canv.addEventListener('mousemove', mouseMove);
    canv.addEventListener('keydown', keyDown);
}

function tforce() {
    type = !type;
    console.log('force: ', type);
}

function clear() {
    ctx.beginPath();
    ctx.fillStyle = '#f2f2f0';
    ctx.fillRect(0, 0, canv.width, canv.height);
}

function vclear() {
    c = undefined;
    e = undefined;
    ep = undefined;
    visit = [];
    weight = [];
    parent = [];
    visited = [];
    visited_edge = [];
    started = false;
    isQuestion = false;
    isObservation = false;
    EndVect = null;
    noEdges = false;
    oneshotAuto = true;
    if (refreshIntervalId != null) clearInterval(refreshIntervalId);
    refreshIntervalId = null;
    document.getElementById("goal_reached_status").innerHTML = "";
    document.getElementById("disablewarning").style.display="none";
    console.log("clear");
}

function cclear() {
    clear();
    nodes = [];
    edges = [];
    edges_weight = [];
    exist = [];
    n = 0;
    maxb = 1;
    vclear();
}

function drawLabel(text, p1x, p1y, p2x, p2y, alignment = 'center', padding = 0 ){
  var dx = p2x - p1x;
  var dy = p2y - p1y;   
  var px, py, pad;


	var angle = Math.atan2(dy,dx);
	if (angle < -Math.PI/2 || angle > Math.PI/2){
		var px = p1x;
		var py = p1y;
		p1x = p2x;
		p1y = p2y;
		p2x = px;
		p2y = py;
		dx *= -1;
		dy *= -1;
		angle -= Math.PI;
	}

  if (alignment=='center'){
    px = p1x;
    py = p1y;
    pad = 1/2;
  } else {
    var left = (alignment=='left');
    px = left ? p1x : p2x;
    py = left ? p1y : p2y;
    pad = padding / Math.sqrt(dx*dx+dy*dy) * (left ? 1 : -1);
  }

  ctx.save();
  ctx.textAlign = alignment;
  ctx.translate(px+dx*pad,py+dy*pad);
  ctx.rotate(Math.atan2(dy,dx));
  ctx.fillText(text,0,0);
  ctx.restore();
}

function drawField() {
    clear();
    for (var i = 0; i < edges.length; ++i) {
        if (exist[i]) {
            for (var j = 0; j < edges[i].length; ++j) {
                if (exist[edges[i][j]] && i < edges[i][j]) {
                    ctx.lineWidth = edgeD;
					/*
                    if (i == c) {
                        ctx.lineWidth = edgeD*2;                   
                    }
                    */
                    ctx.strokeStyle = 'gray';
                    /*
                    if (visiting_edge[0] == i && visiting_edge[1] == edges[i][j]) {
                        ctx.strokeStyle = 'orange';
                    }
                    for (var k = 0; k < visited_edge.length; k++) {
                        if (visited_edge[k][0] == i && visited_edge[k][1] == edges[i][j]) {
                            //console.log(visited_edge);
                            ctx.strokeStyle = 'black';
                            break;
                        }
                    }
                    */
                    ctx.beginPath();
                    ctx.moveTo(nodes[i][0], nodes[i][1]);
                    ctx.lineTo(nodes[edges[i][j]][0], nodes[edges[i][j]][1]);
                    ctx.stroke();

                    ctx.fillStyle = 'gray';
					ctx.font  = '16px sans-serif';
					ctx.textBaseline = 'bottom';
					if (isWeigted) drawLabel(edges_weight[i][j], nodes[i][0], nodes[i][1], nodes[edges[i][j]][0], nodes[edges[i][j]][1]);
					ctx.fill();
                }
            }
        }
    }
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            ctx.fillStyle = '#97d23d';
            for (var k = 0; k < visited.length; k++) {
                if (visited[k] == i) {
                    ctx.fillStyle = 'black';
                    break;
                }
            }
            for (var k = 0; k < visit.length; k++) {
                if (visit[k][0] == i) {
                    ctx.fillStyle = 'orange';
                }
            }
            if (i == last) {
                ctx.fillStyle = 'gray';
            }
			/* 
            if (i == visit[visit.length - 1]) {
                ctx.fillStyle = 'yellow';
            }
            */
            if (i == c && !visited.slice(0, visited.length - 1).includes(c)) {
                ctx.fillStyle = 'orange';
            }
            if (i == EndVect) {
                ctx.fillStyle = 'yellow';
            }
            if(started && nodeLevels[i] > limit) {
                ctx.fillStyle = '#BFBFBF';        
            }
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * (1 + (i == last)), 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#616161';
            for (var k = 0; k < visited.length; k++) {
                if ((visited[k] == i && i != c)) {
                    ctx.fillStyle = 'white';
                    break;
                }
            }
            ctx.fillText(i,nodes[i][0] - nodeR/3 - (nodeR/3*(i >= 10)), nodes[i][1] + nodeR/1.4);

            if (i == c) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = edgeD*2;                    
            } else {
                ctx.strokeStyle = 'gray';
                ctx.lineWidth = edgeD;                    
            }
            ctx.beginPath();
            ctx.arc(nodes[i][0], nodes[i][1], nodeR * 1.5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function initIddfs(node) {
    maxDepth = 0;
    nodeLevels = [];
    visitedLevels = [];

    dfs(node, 0);
}

function dfs(node, currentDepth) {
    nodeLevels[node] = currentDepth;
    visitedLevels.push(node);
    maxDepth = Math.max(maxDepth, currentDepth);
    if (typeof edges[node] != 'undefined') {
        for (const next of edges[node].slice()) {
            if (!visitedLevels.includes(next) && exist[next]) {
                dfs(next, currentDepth + 1);
            }
        }
    }  
    console.log("Max Depth:", maxDepth);
}

function node(x, y) {
    for (var i = 0; i < n; i++) {
        if (exist[i]) {
            var dx = nodes[i][0] - x;
            var dy = nodes[i][1] - y;
            var len = Math.sqrt(dx * dx + dy * dy);
            if (len < nodeR * 3) {
                return i;
            }
        }
    }
    return -1;
}

function bfs(s) {
    var 
        q = [],
        beg = 0;
        used = [];
    for (var i = 0; i < n; ++i) {
        used.push(false);
    }
    q.push(s);
    used[s] = true;
    d[s][s] = 0;
    while (beg != q.length) {
        var v = q[beg];
        beg++;
        for (var j = 0; j < edges[v].length; ++j) {
            var u = edges[v][j];
            if (exist[u] && !used[u]) {
                used[u] = true;
                q.push(u);
                d[s][u] = d[s][v] + 1;
                maxb = Math.max(maxb, d[s][u]);
            }
        }
    }
}

function rib() {
    return Math.min(canv.width, canv.height) / (maxb + 1);
}

function f(v, u) {
    var
        dx = nodes[v][0] - nodes[u][0],
        dy = nodes[v][1] - nodes[u][1],
        len = Math.sqrt(dx * dx + dy * dy);
    return [(dx / len * d[v][u] * rib() - dx) / 30,
            (dy / len * d[v][u] * rib() - dy) / 30];
}

function force() {
    d = [];
    maxb = 0;
    for (var i = 0; i < n; ++i) {
        d.push([]);
        for (var j = 0; j < n; ++j) {
            d[i].push(INF);
        }
        if (exist[i]) {
            bfs(i);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (exist[i]) {
            for (var j = 0; j < n; ++j) {
                if (exist[j] && i != j && d[i][j] != INF && i != cur) {
                    var delta = f(i, j);
                    nodes[i][0] += delta[0];
                    nodes[i][1] += delta[1];
                }
            }
        }
    }
    var 
        mxx = -INF,
        mxy = -INF,
        mnx = INF,
        mny = INF;
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            mxx = Math.max(mxx, nodes[i][0]);
            mxy = Math.max(mxy, nodes[i][1]);
            mnx = Math.min(mnx, nodes[i][0]);
            mny = Math.min(mny, nodes[i][1]);
        }
    }
    for (var i = 0; i < n; ++i) {
        if (i != cur && exist[i]) {
            nodes[i][0] += (canv.width / 2 - (mxx + mnx) / 2) / 30;
            nodes[i][1] += (canv.height / 2 - (mxy + mny) / 2) / 30;
        }
    }
}
