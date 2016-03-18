//------------------------------------------------------------------------------
// mendelson.js
//------------------------------------------------------------------------------

var proof = makeproof();
var goal = '';

//------------------------------------------------------------------------------
// toggleinstructions
//------------------------------------------------------------------------------

function toggleinstructions(toggle) {
    if (toggle.innerHTML == 'Hide Instructions') {
        toggle.innerHTML = 'Show Instructions';
        document.getElementById('instructions').style.display = 'none';
        return true
    }
    ;
    toggle.innerHTML = 'Hide Instructions';
    document.getElementById('instructions').style.display = '';
    return true
}

//------------------------------------------------------------------------------
// doinitialize
//------------------------------------------------------------------------------

function doinitialize() {
    var archive = archivetoproof(document.getElementsByTagName('proof')[0]);
    proof = getstart(archive);
    showproof(proof);
    goal = getgoal(archive);
    document.getElementById('goal').innerHTML = '&nbsp;&nbsp;' + goal;
    return true
}

function archivetoproof(archive) {
    if (archive.nodeName == 'STEP') {
        var step = getsubnode(archive, 'NUMBER').textContent;
        var sentence = getsubnode(archive, 'SENTENCE').textContent;
        var justification = getsubnode(archive, 'JUSTIFICATION').textContent;
        var step = seq('step', step, read(sentence), justification);
        for (var i = 0; i < archive.childNodes.length; i++) {
            if (archive.childNodes[i].nodeName == 'ANTECEDENT') {
                step[step.length] = archive.childNodes[i].textContent
            }
        }
        ;
        return step
    }
    ;
    if (archive.nodeName == 'PROOF') {
        var subproof = seq('proof');
        for (var i = 0; i < archive.childNodes.length; i++) {
            var step = archivetoproof(archive.childNodes[i]);
            if (step) {
                subproof[subproof.length] = step
            }
        }
        ;
        return subproof
    }
    ;
    return false
}

function getsubnode(node, tag) {
    for (var i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes[i].nodeName == tag) {
            return node.childNodes[i]
        }
    }
    ;
    return false
}

function getstart(subproof) {
    console.log(subproof)
    var start = seq('proof');
    for (var i = 0; i < subproof.length; i++) {
        if (subproof[i][3] == 'Premise') {
            start[start.length] = subproof[i]
        }
    }
    ;

    console.log(start)
    return start
}

function getgoal(subproof) {
    return grind(subproof[subproof.length - 1][2])
}

//------------------------------------------------------------------------------
// showproof
//------------------------------------------------------------------------------

function showproof(proof) {
    var area = document.getElementById('proof');
    var n = area.childNodes.length;
    for (var i = 0; i < n; i++) {
        area.removeChild(area.childNodes[0])
    }
    ;
    area.appendChild(displayproof(proof));
    showbuttons();
    showgrades()
}

function displayproof(proof) {
    var table = document.createElement('table');
    table.setAttribute('width', '640');
    table.setAttribute('cellpadding', '4');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('border', '0');
    displayempty(table);
    for (var i = 1; i < proof.length; i++) {
        displaystep(proof[i], table)
    }
    ;
    displayempty(table);
    return table
}

function displaystep(item, table) {
    var row = table.insertRow(table.rows.length);
    var cell = row.insertCell(0);
    cell.setAttribute('width', 20);
    var widget = document.createElement('input');
    widget.setAttribute('id', item[1]);
    widget.setAttribute('type', 'checkbox');
    cell.appendChild(widget);
    cell = row.insertCell(1);
    cell.setAttribute('width', 20);
    cell.innerHTML = item[1] + '.';
    cell = row.insertCell(2);
    cell.setAttribute('width', 400);
    cell.innerHTML = grind(item[2]);
    cell = row.insertCell(3);
    cell.setAttribute('width', 200);
    var just = '&nbsp;' + item[3];
    if (item.length > 4) {
        just += ': ' + item[4];
        for (var j = 5; j < item.length; j++) {
            just += ', ' + item[j]
        }
    }
    ;
    cell.innerHTML = just;
    return true
}

function displayempty(table) {
    var row = table.insertRow(table.rows.length)
    var cell = row.insertCell(0);
    cell.setAttribute('width', 20);
    var widget = document.createElement('input');
    cell = row.insertCell(1);
    cell.setAttribute('width', 20);
    cell = row.insertCell(2);
    cell.setAttribute('width', 400);
    cell.innerHTML = '&nbsp;';
    cell = row.insertCell(3);
    cell.setAttribute('width', 200);
    return true
}

//------------------------------------------------------------------------------
// showanswer
//------------------------------------------------------------------------------

function showanswer() {
    proof = archivetoproof(document.getElementsByTagName('proof')[0]);
    showproof(proof)
}

//------------------------------------------------------------------------------
// showbuttons
//------------------------------------------------------------------------------

function showbuttons() {
    document.getElementById('dopremise').disabled = true;
    return true
}

//------------------------------------------------------------------------------
// showgrades
//------------------------------------------------------------------------------

function showgrades() {
    var status = document.getElementById('status');
    if (conclusionp(read(goal), proof)) {
        status.innerHTML = 'Complete';
        status.style.color = '#00ff00'
    }
    else {
        status.innerHTML = 'Incomplete';
        status.style.color = '#ff0000'
    }
    ;
    return true
}

function conclusionp(p, proof) {
    for (var i = 1; i < proof.length; i++) {
        if (proof[i][0] == 'step' && equalp(proof[i][2], p)) {
            return true
        }
    }
    ;
    return false
}

//------------------------------------------------------------------------------
// Operations
//------------------------------------------------------------------------------

function dopremise() {
    document.getElementById('premise').style.display = ''
}

function addpremise() {
    var exp = read(document.getElementById('newpremise').value);
    document.getElementById('premise').style.display = 'none';
    proof[proof.length] = makestep(proof.length, exp, 'Premise');
    showproof(proof)
}

function unpremise() {
    document.getElementById('premise').style.display = 'none'
}

//------------------------------------------------------------------------------
// doshortcut
//------------------------------------------------------------------------------

function doshortcut() {
    document.getElementById('shortcut').style.display = ''
}

function addshortcut() {
    var exp = read(document.getElementById('newconclusion').value);
    var just = document.getElementById('newjustification').value;
    var steps = getcheckedsteps(proof);
    proof[proof.length] = makestep(proof.length, exp, just).concat(steps);
    showproof(proof);
    unshortcut()
}

function unshortcut() {
    document.getElementById('shortcut').style.display = 'none'
}

//------------------------------------------------------------------------------
// doreiteration
//------------------------------------------------------------------------------

function doreiteration() {
    var parents = empty();
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            parents[parents.length] = i
        }
    }
    ;
    if (parents.length == 0) {
        alert('Select at least one row of the proof and try again.');
        return false
    }
    ;
    for (var i = 0; i < parents.length; i++) {
        proof[proof.length] = makestep(proof.length, proof[parents[i]][2], 'Reiteration', parents[i])
    }
    ;
    showproof(proof);
    return true
}

//------------------------------------------------------------------------------
// dodelete
//------------------------------------------------------------------------------

function dodelete() {
    var concordance = new Array(proof.length);
    var newproof = makeproof();
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            concordance[i] = false
        }
        else if (checksupport(proof[i], concordance)) {
            concordance[i] = newproof.length;
            proof[i][1] = newproof.length;
            newproof[newproof.length] = proof[i]
        }
    }
    proof = newproof;
    showproof(proof);
    return true
}

function checksupport(step, concordance) {
    for (var j = 4; j < step.length; j++) {
        if (concordance[step[j]]) {
            step[j] = concordance[step[j]]
        }
        else return false
    }
    ;
    return true
}

//------------------------------------------------------------------------------
// doic
//------------------------------------------------------------------------------

function doic() {
    document.getElementById('ic').style.display = ''
}

function addic() {
    var phi = read(document.getElementById('phi').value);
    var psi = read(document.getElementById('psi').value);
    document.getElementById('ic').style.display = 'none';
    var exp = makeimplication(phi, makeimplication(psi, phi));
    proof[proof.length] = makestep(proof.length, exp, 'Implication_Introduction');
    showproof(proof);
    return true
}

function unic() {
    document.getElementById('ic').style.display = 'none'
}

//------------------------------------------------------------------------------
// doid
//------------------------------------------------------------------------------

function doid() {
    document.getElementById('id').style.display = ''
}

function addid() {
    var phi = read(document.getElementById('idphi').value);
    var psi = read(document.getElementById('idpsi').value);
    var chi = read(document.getElementById('idchi').value);
    document.getElementById('id').style.display = 'none';
    var exp = makeimplication(makeimplication(phi, makeimplication(psi, chi)), makeimplication(makeimplication(phi, psi), makeimplication(phi, chi)));
    proof[proof.length] = makestep(proof.length, exp, 'Implication_Distribution');
    showproof(proof);
    return true
}

function unid() {
    document.getElementById('id').style.display = 'none'
}

//------------------------------------------------------------------------------
// docr
//------------------------------------------------------------------------------

function docr() {
    document.getElementById('cr').style.display = ''
}

function addcr() {
    var phi = read(document.getElementById('crphi').value);
    var psi = read(document.getElementById('crpsi').value);
    document.getElementById('cr').style.display = 'none';
    var exp = makeimplication(makeimplication(makenegation(phi), psi), makeimplication(makeimplication(makenegation(phi), makenegation(psi)), phi));
    proof[proof.length] = makestep(proof.length, exp, 'Contradiction Realization');
    showproof(proof);
    return true
}

function uncr() {
    document.getElementById('cr').style.display = 'none'
}

//------------------------------------------------------------------------------
// doui
//------------------------------------------------------------------------------

function doui() {
    document.getElementById('ui').style.display = ''
}

function addui() {
    var nu = read(document.getElementById('udnu').value);
    var phi = read(document.getElementById('udphi').value);
    var tau = read(document.getElementById('uitau').value);
    document.getElementById('ui').style.display = 'none';
    var psi = subst(tau, nu, phi);
    var exp = makeimplication(makeuniversal(nu, phi), psi);
    proof[proof.length] = makestep(proof.length, exp, 'Universal Instantiation');
    showproof(proof);
    return true
}

function unui() {
    document.getElementById('ui').style.display = 'none'
}

//------------------------------------------------------------------------------
// doud
//------------------------------------------------------------------------------

function doud() {
    document.getElementById('ud').style.display = ''
}

function addud() {
    var nu = read(document.getElementById('udnu').value);
    var phi = read(document.getElementById('udphi').value);
    var psi = read(document.getElementById('udpsi').value);
    document.getElementById('ud').style.display = 'none';
    var exp = makeimplication(makeuniversal(nu, makeimplication(phi, psi)), makeimplication(phi, makeuniversal(nu, psi)));
    proof[proof.length] = makestep(proof.length, exp, 'Universal Distribution');
    showproof(proof);
    return true
}

function unud() {
    document.getElementById('ud').style.display = 'none'
}

//------------------------------------------------------------------------------
// doreflexivity
//------------------------------------------------------------------------------

function doreflexivity() {
    var axiom = read('AX:X=X');
    proof[proof.length] = makestep(proof.length, axiom, 'Reflexivity');
    showproof(proof);
    return true
}

//------------------------------------------------------------------------------
// dosub
//------------------------------------------------------------------------------

function dosub() {
    document.getElementById('sub').style.display = ''
}

function addsub() {
    var mu = read(document.getElementById('submu').value);
    var nu = read(document.getElementById('subnu').value);
    var phi = read(document.getElementById('subphi').value);
    document.getElementById('sub').style.display = 'none';
    var psi = subst(nu, mu, phi);
    var eqn = makeequality(mu, nu)
    var exp = makeimplication(eqn, makeimplication(phi, psi));
    proof[proof.length] = makestep(proof.length, exp, 'Substitution');
    showproof(proof);
    return true
}

function unsub() {
    document.getElementById('sub').style.display = 'none'
}

//------------------------------------------------------------------------------
// doie
//------------------------------------------------------------------------------

function doie() {
    var parents = empty();
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            parents[parents.length] = i
        }
    }
    ;
    if (parents.length == 0) {
        alert('Select at least one row of the proof and try again.');
        return false
    }
    ;
    for (var i = 0; i < parents.length; i++) {
        for (var j = 0; j < parents.length; j++) {
            var result = mp(proof[parents[i]][2], proof[parents[j]][2]);
            if (result != false) {
                proof[proof.length] = makestep(proof.length, result, 'Implication Elimination', parents[i], parents[j])
            }
        }
    }
    ;
    showproof(proof);
    return true
}

function mp(p, q) {
    if (!symbolp(p) && p[0] == 'implication' && equalp(p[1], q)) {
        return p[2]
    }
    else return false
}

//------------------------------------------------------------------------------
// doug
//------------------------------------------------------------------------------

function doug() {
    document.getElementById('ug').style.display = ''
}

function addug() {
    var nu = read(document.getElementById('ugnu').value);
    document.getElementById('ug').style.display = 'none';
    var parents = empty();
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            parents[parents.length] = i
        }
    }
    ;
    if (parents.length == 0) {
        alert('Select at least one row of the proof and try again.');
        return false
    }
    ;
    for (var i = 0; i < parents.length; i++) {
        var result = makeuniversal(nu, proof[parents[i]][2]);
        proof[proof.length] = makestep(proof.length, result, 'Universal Generalization', parents[i])
    }
    ;
    showproof(proof);
    return true
}

function unug() {
    document.getElementById('ug').style.display = 'none'
}

//------------------------------------------------------------------------------
// doreset
//------------------------------------------------------------------------------

function doreset() {
    doinitialize()
}

//------------------------------------------------------------------------------
// doxml
//------------------------------------------------------------------------------

function doxml() {
    var win = window.open();
    //win.document.open('text/html');
    win.document.writeln('<xmp>');
    //win.document.writeln('<?xml version="1.0"?>');
    //win.document.writeln('<?xml-stylesheet type="text/xsl" href="http://logic.stanford.edu/logica/stylesheets/proof.xsl"?>');
    step = 0;
    win.document.write(xmlize(proof, 0));
    win.document.writeln('</xmp>');
    win.document.close()
}

function xmlize(item, n) {
    if (item[0] == 'step') {
        return xmlstep(item, n)
    }
    ;
    if (item[0] == 'proof') {
        return xmlproof(item, n)
    }
    ;
    return ''
}

function xmlstep(line, n) {
    step = step + 1;
    var exp = '';
    exp += spaces(n) + '<step>\n';
    exp += spaces(n) + '  <number>' + line[1] + '</number>\n';
    exp += spaces(n) + '  <sentence>' + grind(line[2]) + '</sentence>\n';
    exp += spaces(n) + '  <justification>' + prettify(line[3]) + '</justification>\n';
    for (var j = 4; j < line.length; j++) {
        exp += spaces(n) + '  <antecedent>' + line[j] + '</antecedent>\n'
    }
    ;
    exp += spaces(n) + '</step>\n';
    return exp
}

function xmlproof(proof, n) {
    var exp = '';
    exp += spaces(n) + '<proof>\n';
    for (var i = 1; i < proof.length; i++) {
        exp += xmlize(proof[i], n + 1)
    }
    ;
    exp += spaces(n) + '</proof>\n';
    return exp
}

function spaces(n) {
    exp = '';
    for (var i = 0; i < n; i++) {
        exp += '  '
    }
    ;
    return exp
}

//------------------------------------------------------------------------------
// arrow keys
//------------------------------------------------------------------------------

function handlekey(e) {
    if (e.keyCode == '37' || e.keyCode == '38') {
        e.preventDefault();
        doup()
    }
    ;
    if (e.keyCode == '39' || e.keyCode == '40') {
        e.preventDefault();
        dodown()
    }
    ;
    return false
}

//------------------------------------------------------------------------------

function doup() {
    var step = getcheckedstep(proof);
    if (!step) {
        return false
    }
    ;
    if (step == 1) {
        return false
    }
    ;
    if (!upmovablep(proof[step], proof[step - 1])) {
        return false
    }
    ;
    updateproof(step - 1, step, proof);
    updatejusts(step - 1, step, proof);
    showproof(proof);
    document.getElementById(step - 1).checked = true;
    return true
}

function upmovablep(mover, movee) {
    var step = movee[1];
    for (var j = 3; j < mover.length; j++) {
        if (mover[j] * 1 >= step) {
            return false
        }
    }
    ;
    return true
}

function updateproof(movee, mover, proof) {
    var temp = proof[movee];
    proof[movee] = proof[mover];
    proof[mover] = temp;
    return true
}

function updatejusts(movee, mover, proof) {
    for (var i = 1; i < proof.length; i++) {
        if (proof[i][1] == mover) {
            proof[i][1] = movee
        }
        else if (proof[i][1] >= movee && proof[i][1] < mover) {
            proof[i][1] = proof[i][1] * 1 + 1
        }
        ;
        for (var j = 3; j < proof[i].length; j++) {
            if (proof[i][j] == mover) {
                proof[i][j] = movee
            }
            else if (proof[i][j] >= movee && proof[i][j] < mover) {
                proof[i][j] = proof[i][j] * 1 + 1
            }
        }
    }
    ;
    return true
}

//------------------------------------------------------------------------------

function dodown() {
    var step = getcheckedstep(proof);
    if (!step) {
        return false
    }
    ;
    if (step == proof.length - 1) {
        return false
    }
    ;
    if (!downmovablep(proof[step], proof[step + 1])) {
        return false
    }
    ;
    downdateproof(step, step + 1, proof);
    downdatejusts(step, step + 1, proof);
    showproof(proof);
    document.getElementById(step + 1).checked = true;
    return true
}

function downmovablep(mover, movee) {
    var step = mover[1];
    for (var j = 3; j < movee.length; j++) {
        if (movee[j] * 1 >= step) {
            return false
        }
    }
    ;
    return true
}

function downdateproof(movee, mover, proof) {
    var temp = proof[movee];
    proof[movee] = proof[mover];
    proof[mover] = temp;
    return true
}

function downdatejusts(mover, movee, proof) {
    for (var i = 1; i < proof.length; i++) {
        if (proof[i][1] == mover) {
            proof[i][1] = movee
        }
        else if (proof[i][1] > mover && proof[i][1] <= movee) {
            proof[i][1] = proof[i][1] * 1 - 1
        }
        ;
        for (var j = 3; j < proof[i].length; j++) {
            if (proof[i][j] == mover) {
                proof[i][j] = movee
            }
            else if (proof[i][j] > mover && proof[i][j] <= movee) {
                proof[i][j] = proof[i][j] * 1 - 1
            }
        }
    }
    ;
    return true
}

//------------------------------------------------------------------------------

function getcheckedstep(proof) {
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(proof[i][1]).checked) {
            return i
        }
    }
    ;
    return false
}

function getcheckedsteps(proof) {
    var steps = seq();
    for (var i = 1; i < proof.length; i++) {
        if (document.getElementById(i).checked) {
            steps[steps.length] = i
        }
    }
    ;
    return steps
}

//------------------------------------------------------------------------------
// Debugger
//------------------------------------------------------------------------------

function tryit() {
    var str = document.getElementById('scriptarea').value;
    document.getElementById('valuearea').innerHTML = eval(str)
}

function printit(p) {
    if (p == 'rule') {
        return '<='
    }
    ;
    if (p == null) {
        return ''
    }
    ;
    if (varp(p)) {
        return '?' + p
    }
    ;
    if (symbolp(p)) {
        return p
    }
    ;
    var n = p.length;
    var exp = '(';
    if (n > 0) {
        exp += printit(p[0])
    }
    ;
    for (var i = 1; i < n; i++) {
        exp = exp + ' ' + printit(p[i])
    }
    exp += ')';
    return exp
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
