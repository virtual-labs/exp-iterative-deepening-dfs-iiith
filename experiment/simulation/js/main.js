var visit = [];
var edges_weight = [];
var weight = [];
var limit = 0;
var maxDepth = 0;
var d = 0;

var e;
var c;
var started = false;
var noEdges = false;

var nuxtdis = false;
var refreshIntervalId = null;

var isObservation = false;

function ALG_STOP() {
    console.log("ALG_STOP");
    started = false;
    noEdges = false;
    e = undefined;
    c = undefined;
    visit.length = 0;
    document.getElementById("nuxt").disabled = false;
    document.getElementById("startiddfs").disabled = false;
    document.getElementById("disablewarning").style.display="none";
    if(!NoQuestion)
        addEventListeners();
    nuxtdis = false;
    clearInterval(refreshIntervalId);
}

function IDDFS() {
    if(!started) return;
    if(isQuestion) {return;}

    if (noEdges) {
        if (visit.length == 0 && e == SN) {
            limit++;
            if (limit > maxDepth) {
                document.getElementById("goal_reached_status").style.color = "red";
                document.getElementById("goal_reached_status").innerHTML = "Goal not found";
                ALG_STOP();
                return;
            }
            vclear();
            started = true;
            console.log("EN:",  EN);
            visit.unshift([SN, 0]);
            return;
        }

        visited.push(e);
        trav_circle(e, parent[e]);
        c = parent[e];
        e = parent[e];
        if (typeof edges[e] != 'undefined') {
            for (const next of edges[e].slice()) {
                if (!visited.includes(next) && exist[next] && parent[next] == e) {
                    noEdges = false;
                }
            }
        }
        return;
    }

    const top_node = visit.shift();
    console.log(top_node);
    e = top_node[0];
    d = top_node[1];
    c = e;

    if (!noEdges) visited.push(e);
    trav_circle(parent[e], e);

    if (e == EN) {
        document.getElementById("goal_reached_status").style.color = "green";
        document.getElementById("goal_reached_status").innerHTML = "Goal found";
        ALG_STOP();
        return;
    }

    if (!NoQuestion && visit.length != 0) {
        var rand = Math.random();
        console.log(rand);
        if (rand < chance) {
            isQuestion = true;
            question();
        }
    }
    noEdges = true;
    if (typeof edges[e] != 'undefined') {
        for (const next of edges[e].slice().reverse()) {
            if (!visited.includes(next) && exist[next] && d < limit) {
                noEdges = false;
                visit.unshift([next, d + 1]);
                parent[next] = e;
            }
        }
    }
}
