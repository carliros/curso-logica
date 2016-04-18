//------------------------------------------------------------------------------
// fitch.js
//------------------------------------------------------------------------------

var proof = makeproof();var target = proof;
var goal = 'true';
//------------------------------------------------------------------------------
// doinitialize
//------------------------------------------------------------------------------

function doinitialize ()
 {var archive = archivetoproof(document.getElementsByTagName('proof')[0]);
  proof = getstart(archive);
  target = proof;
  showproof(proof);
  goal = getgoal(archive);  document.getElementById('goal').innerHTML = '&nbsp;&nbsp;' + goal;
  return true}
function archivetoproof (archive)
 {if (archive.nodeName=='STEP')
     {var sentence = getsubnode(archive,'SENTENCE').textContent;
      var justification = getsubnode(archive,'JUSTIFICATION').textContent;
      var step = seq('step',read(sentence),justification);
      for (var i=0; i<archive.childNodes.length; i++)
          {if (archive.childNodes[i].nodeName=='ANTECEDENT')
              {step[step.length] = archive.childNodes[i].textContent}};
      return step};
  if (archive.nodeName=='PROOF')
     {var subproof = seq('proof');
      for (var i=0; i<archive.childNodes.length; i++)
          {var step = archivetoproof(archive.childNodes[i]);
           if (step) {subproof[subproof.length] = step}};
      return subproof};
  return false}

function getsubnode (node,tag)
 {for (var i=0; i<node.childNodes.length; i++)
      {if (node.childNodes[i].nodeName==tag) {return node.childNodes[i]}};
  return false}

function getstart (subproof)
 {var start = seq('proof');
  for (var i=0; i<subproof.length; i++)
      {if (subproof[i][2]=='Premise') {start[start.length] = subproof[i]}};
  return start}

function getgoal (subproof)
 {return grind(subproof[subproof.length-1][1])}

//------------------------------------------------------------------------------
// showproof
//------------------------------------------------------------------------------

function showproof (proof)
 {var area = document.getElementById('proof');
  var n = area.childNodes.length;
  for (var i=0; i<n; i++) {area.removeChild(area.childNodes[0])};
  area.appendChild(displayproof(proof));
  showbuttons();
  showgrades()}

function displayproof (proof) {var table = document.createElement('table');
  table.setAttribute('width','640');
  table.setAttribute('cellpadding','0');
  table.setAttribute('cellspacing','0');
  table.setAttribute('border','0');
  displayempty(1,table);
  displayitem(0,0,proof,table);
  displayempty(prooflevel(target,proof),table);
  return table}

function displayitem (step,level,item,table)
 {if (item[0]=='proof') {return displaysubproof(step,level,item,table)};
  if (item[0]=='step') {return displaystep(step,level,item,table)};
  return step}

function displaysubproof (step,level,subproof,table) {for (var i=1; i<subproof.length; i++)      {step = displayitem(step,level+1,subproof[i],table)};
  return step}

function displaystep (step,level,item,table) {step=step+1;
  var row = table.insertRow(table.rows.length);
  row.setAttribute('height','30');
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  var widget = document.createElement('input');
  widget.setAttribute('id',step);
  widget.setAttribute('type','checkbox');
  //if (false) {widget.setAttribute('disabled',true)};
  cell.appendChild(widget);  
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell.innerHTML = step + '.';
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.setAttribute('height','30');
  cell.appendChild(displaybarredelement(level,grind(item[1])));
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  var just = '&nbsp;' + item[2];
  if (item.length > 3)     {just += ': ' + item[3];      for (var j=4; j<item.length; j++) {just += ', ' + item[j]}};
  cell.innerHTML = just;
  return step}

function displayempty (level,table) {var row = table.insertRow(table.rows.length)
  row.setAttribute('height','30');
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.setAttribute('height','30');
  cell.appendChild(displaybarredelement(level,''));
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  return true}

function displaybarredelement (level,stuff)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('cellpadding','0');
  var row = table.insertRow(0);
  for (var i=level; i>0; i--)
      {var cell = row.insertCell(row.cells.length);
       cell.setAttribute('height','30');
       cell.setAttribute('style','border-left:2px solid #000000;padding:5px');
       cell.innerHTML = '&nbsp;'};
  var cell = row.insertCell(row.cells.length);
  cell.innerHTML = stuff;
  cell = row.insertCell(1);
  cell.innerHTML = '&nbsp;';
  return table}

function prooflevel (sub,sup)
 {if (sub==sup) {return 1};
  if (sup[0]=='step') {return false};
  for (var i=1; i<sup.length; i++)
      {var answer = prooflevel(sub,sup[i]);
       if (answer) {return answer+1}};
  return false}

//------------------------------------------------------------------------------
// showanswer
//------------------------------------------------------------------------------
function showanswer ()
 {proof = archivetoproof(document.getElementsByTagName('proof')[0]);
  target=getsubproof(proof);
  showproof(proof)}
//------------------------------------------------------------------------------
// showbuttons
//------------------------------------------------------------------------------

function showbuttons ()
 {document.getElementById('dopremise').disabled=true;
  if (target==proof)
     {document.getElementById('doii').disabled=true;
      return true};
  document.getElementById('doii').disabled=false;
  return true}

//------------------------------------------------------------------------------
// showgrades
//------------------------------------------------------------------------------

function showgrades ()
 {var status=document.getElementById('status');
  if (conclusionp(read(goal),proof))
     {status.innerHTML='Complete';
      status.style.color='#00ff00'}
     else {status.innerHTML='Incomplete';
           status.style.color='#ff0000'};
  return true}

function conclusionp (p,proof)
 {for (var i=1; i<proof.length; i++)
      {if (proof[i][0]=='step' && equalp(proof[i][1],p)) {return true}};
  return false}

//------------------------------------------------------------------------------
// toggleinstructions
//------------------------------------------------------------------------------

function toggleinstructions (toggle)
 {if (toggle.innerHTML == 'Hide Instructions')
     {toggle.innerHTML = 'Show Instructions';
      document.getElementById('instructions').style.display='none';
      return true};
  toggle.innerHTML='Hide Instructions';
  document.getElementById('instructions').style.display='';
  return true}

//------------------------------------------------------------------------------
// Operations
//------------------------------------------------------------------------------
function dopremise () {document.getElementById('premise').style.display = ''}function addpremise () {var exp = read(document.getElementById('newpremise').value);  document.getElementById('premise').style.display = 'none';  target[target.length] = makestep(exp,'Premise');  showproof(proof)}function unpremise () {document.getElementById('premise').style.display = 'none'}//------------------------------------------------------------------------------
function doassumption () {document.getElementById('assumption').style.display = ''}function addassumption () {var exp = read(document.getElementById('newassumption').value);  document.getElementById('assumption').style.display = 'none';
  doopen();  target[target.length] = makestep(exp,'Assumption');  showproof(proof)}function unassumption () {document.getElementById('assumption').style.display = 'none'}//------------------------------------------------------------------------------

function doshortcut () {document.getElementById('shortcut').style.display = ''}function addshortcut () {var exp = read(document.getElementById('newconclusion').value);  var just = document.getElementById('newjustification').value;
  var steps=seq();
  getcheckedstepnumbers(0,proof,target,steps);  document.getElementById('shortcut').style.display = 'none';  target[target.length] = makestep(exp,just).concat(steps);  showproof(proof)}

function getcheckedstepnumbers (step,proof,target,steps)
 {for (var i=1; i<proof.length; i++)      {if (proof[i][0]=='step')
          {step=step+1;
           if (document.getElementById(step).checked && subproof(target,proof))
              {steps[steps.length] = step}}
       else step = getcheckedstepnumbers(step,proof[i],target,steps)};
  return step}function unshortcut () {document.getElementById('shortcut').style.display = 'none'}//------------------------------------------------------------------------------

var step = 0;var newstep = 0;function doreiteration ()
 {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {target[target.length]=makestep(steps[i][1],'Reiteration',steps[i][0])};  showproof(proof);  return true}

function getcheckedsteps (step,proof,target,steps)
 {for (var i=1; i<proof.length; i++)      {if (proof[i][0]=='step')
          {step=step+1;
           if (document.getElementById(step).checked && subproof(target,proof))
              {steps[steps.length] = seq(step,proof[i][1])}}
       else step = getcheckedsteps(step,proof[i],target,steps)};
  return step}

function subproof (sub,sup)
 {if (sub==sup) {return true};
  if (sup[0]=='step') {return false};
  for (var i=1; i<sup.length; i++)
      {if (subproof(sub,sup[i])) {return true}};
  return false}

//------------------------------------------------------------------------------

function dodelete () {step = 0;
  newstep = 0;
  var concordance = seq(0);
  var newproof = getnewproof(proof,target,concordance);
  proof = newproof;
  target = getsubproof(proof);
  showproof(proof);  return true}

function getnewproof (proof,target,concordance)
 {var newproof = makeproof();
  for (var i=1; i<proof.length; i++)      {if (proof[i][0]=='step')
          {step=step+1;
           if (document.getElementById(step).checked || !checksupport(proof[i],concordance))
              {concordance[step] = false}
           else {newstep=newstep+1;
                 concordance[step]=newstep; 
                 newproof[newproof.length]=proof[i]}}
       else {answer = getnewproof(proof[i],target,concordance);
             if (answer.length>1) {newproof[newproof.length] = answer}}};
  return newproof}

function checksupport (step,concordance) {for (var j=3; j<step.length; j++)      {if (concordance[step[j]]) {step[j] = concordance[step[j]]}       else return false};  return true}function getsubproof (proof)
 {if (proof.length<2) {return proof};
  var step = proof[proof.length-1];
  if (step[0]=='proof') {return getsubproof(step)};
  return proof}
//------------------------------------------------------------------------------

function doopen () {var sub = makeproof();
  target[target.length] = sub;
  target = sub;  showproof(proof)}

//------------------------------------------------------------------------------

function doclose () {var old = target;
  target = superproof(target);
  if (old.length==1) {remover(old,target)};  showproof(proof)}

function superproof (sub)
 {var sup = superproofexp(sub,proof);
  if (sup) {return sup} else {return proof}}

function superproofexp (sub,sup)
 {for (var i=1; i<sup.length; i++)
      {if (sup[i]==sub) {return sup};
       if (sup[i][0]=='proof')
          {var answer = superproofexp(sub,sup[i]);
           if (answer) {return answer}}};
  return false}

function remover (x,y)
 {var n = y.indexOf(x);
  y.splice(n,n);
  return x}

//------------------------------------------------------------------------------

function doni () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one step in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {for (var j=0; j<steps.length; j++)           {var result = ni(steps[i][1],steps[j][1]);            if (result != false)               {target[target.length]=makestep(result,'Negation Introduction',steps[i][0],steps[j][0])}}};  showproof(proof);  return true}

function ni (p,q) {if (!symbolp(p) && p[0]=='implication' && !symbolp(q) && q[0]=='implication' &&
      equalp(p[1],q[1]) && complementaryp(p[2],q[2]))     {return makenegation(p[1])};   return false}

function complementaryp (p,q)
 {return (!symbolp(q) && q[0]=='not' && equalp(p,q[1]))}

//------------------------------------------------------------------------------
function done () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {var result = ne(steps[i][1]);       if (result != false)          {target[target.length]=makestep(result,'Negation Elimination',steps[i][0])}};  showproof(proof);  return true}

function ne (p) {if (!symbolp(p) && p[0] == 'not' && !symbolp(p[1]) && p[1][0] == 'not')     {return p[1][1]}  else return false}//------------------------------------------------------------------------------

function doai () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {for (var j=0; j<steps.length; j++)           {var result = ai(steps[i][1],steps[j][1]);            if (result != false)               {target[target.length]=makestep(result,'And Introduction',steps[i][0],steps[j][0])}}};  showproof(proof);  return true}

function ai (p,q) {return makeconjunction(p,q)}//------------------------------------------------------------------------------
function doae () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {var results = ae(steps[i][1]);       for (var j=0; j<results.length; j++)           {target[target.length]=makestep(results[j],'And Elimination',steps[i][0])}};  showproof(proof);  return true}
function ae (p) {if (!symbolp(p) && p[0] == 'and') {return p.slice(1,p.length)}  return empty()}//------------------------------------------------------------------------------

function dooi () {document.getElementById('oi').style.display = ''}function addoi () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  var exp = read(document.getElementById('newoi').value);  document.getElementById('oi').style.display = 'none';  for (var i=0; i<steps.length; i++)      {var result = oi(steps[i][1],exp);       target[target.length]=makestep(result,'Or Introduction',steps[i][0]);
       result = oi(exp,steps[i][1]);
       target[target.length]=makestep(result,'Or Introduction',steps[i][0])};  showproof(proof);  return true}

function oi (p,q) {return makedisjunction(p,q)}

function unoi () {document.getElementById('oi').style.display = 'none'}//------------------------------------------------------------------------------
function dooe () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};
  for (var i=0; i<steps.length; i++)      {if (steps[i][1][0]=='or')
          {for (var j=0; j<steps.length; j++)
               {if (!symbolp(steps[j][1]) &&
                    steps[j][1][0]=='implication' &&
                    equalp(steps[j][1][1],steps[i][1][1]))
                   {for (var k=0; k<steps.length; k++)
                        {if (!symbolp(steps[k][1]) &&
                             steps[k][1][0]=='implication' &&
                             equalp(steps[k][1][1],steps[i][1][2]) &&
                             equalp(steps[k][1][2],steps[j][1][2]))
                         target[target.length]=makestep(steps[k][1][2],
                                                        'Or Elimination',
                                                         steps[i][0],
                                                         steps[j][0],
                                                         steps[k][0])}}}}};  showproof(proof);
  return true}

//------------------------------------------------------------------------------
function doii () {if (target==proof)     {alert('Cannot apply Implication Introduction to the top level proof.');      return false};  //var conclusion = makeimplication(target[1][1],target[target.length-1][1]);
  var conclusion = getimplication (target,target[target.length-1][1]);
  var step = getstep(proof,0);
  doclose();
  target[target.length]=makestep(conclusion,'Implication Introduction',step);
  showproof(proof);
  return true}
function getimplication (proof,conclusion)
 {var premise = seq('and');
  for (var i=1; i<proof.length; i++)
      {if (proof[i][0]=='step' && (proof[i][2]=='Premise' || proof[i][2]=='Assumption'))
          {premise[premise.length] = proof[i][1]}};
  if (premise.length==1) {return conclusion};
  if (premise.length==2) {return makeimplication(premise[1],conclusion)};
  return makeimplication(premise,conclusion)}

function getstep (proof,n)
 {for (var i=1; i<proof.length; i++)
      {if (proof[i][0]=='proof') {n = getstep(proof[i],n)} else {n = n+1}};
  return n}

//------------------------------------------------------------------------------

function doie () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {for (var j=0; j<steps.length; j++)           {var result = mp(steps[i][1],steps[j][1]);            if (result != false)               {target[target.length]=makestep(result,'Implication Elimination',steps[i][0],steps[j][0])}}};  showproof(proof);  return true}function mp (p,q) {if (!symbolp(p) && p[0] == 'implication' && equalp(p[1],q))     {return p[2]}  else return false}//------------------------------------------------------------------------------

function dobi () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {for (var j=0; j<steps.length; j++)           {var result = bi(steps[i][1],steps[j][1]);            if (result != false)               {target[target.length]=makestep(result,'Biconditional Introduction',steps[i][0],steps[j][0])}}};  showproof(proof);  return true}function bi (p,q) {if (!symbolp(p) && p[0] == 'implication' &&
      !symbolp(q) && q[0] == 'implication' &&
      equalp(p[1],q[2]) && equalp(p[2],q[1]))     {return makeequivalence(p[1],p[2])};  return false}//------------------------------------------------------------------------------

function dobe () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {var results = be(steps[i][1]);       for (var j=0; j<results.length; j++)           {target[target.length]=makestep(results[j],'Biconditional Elimination',steps[i][0])}};  showproof(proof);  return true}

function be (p) {if (!symbolp(p) && p[0] == 'equivalence')     {return seq(makeimplication(p[1],p[2]),makeimplication(p[2],p[1]))};  return empty()}
//------------------------------------------------------------------------------

function doui () {document.getElementById('ui').style.display = ''}function addui () {var nu = read(document.getElementById('uinu').value);  document.getElementById('ui').style.display = 'none';  var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {var result = ui(nu,steps[i][1]);       if (result != false)
          {target[target.length]=makestep(result,'Universal Introduction',steps[i][0])}};  showproof(proof);  return true}

function ui (nu,phi)
 {if (transcleanp(nu,target)) {return makeuniversal(nu,phi)};
  return false}

function transcleanp (nu,subproof)
 {if (!subproof) {return true};
  if (subproof==proof) {return cleanp(nu,subproof)};
  if (cleanp(nu,subproof)) {return transcleanp(nu,superproof(subproof))}
  return false}

function cleanp (nu,subproof)
 {for (var i=1; i<subproof.length; i++)
      {if (subproof[i][2]=='Assumption' && memberp(nu,freevars(subproof[i][1],nil,nil)))
          {return false}};
  return true}

function superproof (sub)
 {var sup = superproofexp(sub,proof);
  if (sup) {return sup} else {return proof}}

function superproofexp (sub,sup)
 {for (var i=1; i<sup.length; i++)
      {if (sup[i]==sub) {return sup};
       if (sup[i][0]=='proof')
          {var answer = superproofexp(sub,sup[i]);
           if (answer) {return answer}}};
  return false}function unui () {document.getElementById('ui').style.display = 'none'}
//------------------------------------------------------------------------------

function doue () {document.getElementById('ue').style.display = ''}function addue () {var tau = read(document.getElementById('uetau').value);  document.getElementById('ue').style.display = 'none';  var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {if (steps[i][1][0]=='forall')
          {var result = substit(tau,steps[i][1][1],steps[i][1][2]);           target[target.length]=makestep(result,'Universal Elimination',steps[i][0])}};  showproof(proof);  return true}

function unue () {document.getElementById('ue').style.display = 'none'}
//------------------------------------------------------------------------------
function doei () {document.getElementById('ei').style.display = ''}function addei () {var tau = read(document.getElementById('egtau').value);  var nu = read(document.getElementById('egnu').value);  document.getElementById('ei').style.display = 'none';  var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {var results = substitutions(tau,nu,steps[i][1]);       for (var j=1; j<results.length; j++)           {var result = makeexistential(nu,results[j]);
            target[target.length]=makestep(result,'Existential Introduction',steps[i][0])}};  showproof(proof);  return true}function unei () {document.getElementById('ei').style.display = 'none'}//------------------------------------------------------------------------------function doee () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {for (var j=0; j<steps.length; j++)           {var result = ee(steps[i][1],steps[j][1]);            if (result != false)               {target[target.length]=makestep(result,'Existential Elimination',steps[i][0],steps[j][0])}}};  showproof(proof);  return true}

function ee (p,q) {if (!symbolp(p) && p[0] == 'exists' &&
      !symbolp(p) && q[0] == 'forall' && q[1]==p[1] &&
      !symbolp(q[2]) && q[2][0] == 'implication' && equalp(q[2][1],p[2]) &&
      !memberp(p[1],freevars(q[2][2],nil,nil)))
     {return q[2][2]};
  return false}
//------------------------------------------------------------------------------
function doqi () {document.getElementById('qi').style.display = ''}function addqi () {var tau = read(document.getElementById('qitau').value);  document.getElementById('qi').style.display = 'none';  var result = makeequality(tau,tau);
  target[target.length]=makestep(result,'Equality Introduction');  showproof(proof);  return true}function unqi () {document.getElementById('qi').style.display = 'none'}//------------------------------------------------------------------------------
// doqe
//------------------------------------------------------------------------------

function doqe () {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};  for (var i=0; i<steps.length; i++)      {var eqn = steps[i][1];
       if (!symbolp(eqn) && eqn[0]=='equal')
          {var sigma = eqn[1];
           var tau = eqn[2];
           for (var j=0; j<steps.length; j++)
               {if (i!=j)
                   {var results = substitutions(sigma,tau,steps[j][1]);                    for (var k=1; k<results.length; k++)                        {target[target.length]=makestep(results[k],'Equality Elimination',steps[j][0],steps[i][0])}}};
           for (var j=0; j<steps.length; j++)
               {if (i!=j)
                   {var results = substitutions(tau,sigma,steps[j][1]);                    for (var k=1; k<results.length; k++)                        {target[target.length]=makestep(results[k],'Equality Elimination',steps[j][0],steps[i][0])}}}}};  showproof(proof);  return true}

//------------------------------------------------------------------------------
// dodc
//------------------------------------------------------------------------------
var objectconstants = seq()
var functionconstants = seq()
function dodc () {document.getElementById('dc').style.display = ''}function adddc () {var psi = read(document.getElementById('dcphi').value);  var nu = psi[1];  var phi = psi[2];  document.getElementById('dc').style.display = 'none';  var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};
  var just = dcp(nu,phi,steps);
  var step = makestep(psi,'Domain Closure').concat(just);
  if (just) {target[target.length]=step};  showproof(proof);  return true}

function dcp (nu,phi,steps)
 {var just=seq();
  for (var i=0; i<objectconstants.length; i++)      {var step = included(subst(objectconstants[i],nu,phi),steps);
       if (step==false) {return false};
       just[just.length]=step};
  return just}

function included (chi,steps)
 {for (i=0; i<steps.length; i++)
      {if (equalp(steps[i][1],chi)) {return steps[i][0]}};
  return false}function undc () {document.getElementById('dc').style.display = 'none'}

//------------------------------------------------------------------------------

function getobjectconstants (item)
 {return getobjectsproof(item,seq())}

function getobjectsproof (item,results)
 {if (symbolp(item)) {return results};
  if (item[0]=='step') {return getobjectssent(item[1],results)};
  if (item[0]=='proof')
     {for (var i=1; i<item.length; i++)
          {results = getobjectsproof(item[i],results)};
      return results};
  return getobjectssent(item,results)}

function getobjectssent (p,results)
 {if (symbolp(p)) {return results};
  if (p[0]=='not') {return getobjectslogical(p,results)};
  if (p[0]=='and') {return getobjectslogical(p,results)};
  if (p[0]=='or') {return getobjectslogical(p,results)};
  if (p[0]=='implication') {return getobjectslogical(p,results)};
  if (p[0]=='equivalence') {return getobjectslogical(p,results)};
  if (p[0]=='forall') {return getobjectslogical(p[2],results)};
  if (p[0]=='exists') {return getobjectslogical(p[2],results)};
  if (p[0]=='clause') {return getobjectslogical(p,results)};
  return getobjectsterm(p,results)}

function getobjectslogical (p,results)
 {for (var i=1; i<p.length; i++)
      {results = getobjectssent(p[i],results)};
  return results}

function getobjectsterm (x,results)
 {if (symbolp(x) && !varp(x)) {return adjoin(x,results)};
  if (symbolp(x)) {return results};
  for (var i=1; i<x.length; i++)
      {results = getobjectsterm(x[i],results)};
  return results}//------------------------------------------------------------------------------

function getfunctionconstants (item)
 {return getfunctionsproof(item,seq())}

function getfunctionsproof (item,results)
 {if (symbolp(item)) {return results};
  if (item[0]=='step') {return getfunctionssent(item[1],results)};
  if (item[0]=='proof')
     {for (var i=1; i<item.length; i++)
          {results = getfunctionsproof(item[i],results)};
      return results};
  return getfunctionssent(item,results)}

function getfunctionssent (p,results)
 {if (symbolp(p)) {return results};
  if (p[0]=='not') {return getfunctionslogical(p,results)};
  if (p[0]=='and') {return getfunctionslogical(p,results)};
  if (p[0]=='or') {return getfunctionslogical(p,results)};
  if (p[0]=='implication') {return getfunctionslogical(p,results)};
  if (p[0]=='equivalence') {return getfunctionslogical(p,results)};
  if (p[0]=='forall') {return getfunctionslogical(p[2],results)};
  if (p[0]=='exists') {return getfunctionslogical(p[2],results)};
  if (p[0]=='clause') {return getfunctionslogical(p,results)};
  for (var i=1; i<p.length; i++)
      {results = getfunctionsterm(p[i],results)};
  return results}

function getfunctionslogical (p,results)
 {for (var i=1; i<p.length; i++)
      {results = getfunctionssent(p[i],results)};
  return results}

function getfunctionsterm (x,results)
 {if (symbolp(x)) {return results};
  results = adjoin(x[0],results);
  for (var i=1; i<x.length; i++)
      {results = getfunctionsterm(x[i],results)};
  return results}//------------------------------------------------------------------------------

function doind () {document.getElementById('ind').style.display = ''}function addind () {var psi = read(document.getElementById('indphi').value);  var nu = psi[1];  var phi = psi[2];  document.getElementById('ind').style.display = 'none';  var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)     {alert('Select at least one row in the current subproof or a superproof and try again.');      return false};
  var step = makestep(psi,'Induction');
  var base = dcp(nu,phi,steps);
  var inductive = ind(nu,phi,steps);
  if (base && inductive) {target[target.length]=step.concat(base,inductive)};  showproof(proof);  return true}

function ind (nu,phi,steps)
 {var just=seq();
  for (var i=0; i<functionconstants.length; i++)      {var step = coveredp(functionconstants[i],nu,phi,steps);
       if (step==false) {return false};
       just[just.length]=step};
  return just}

function coveredp (pi,nu,phi,steps)
 {var pattern = seq('implication',phi,subst(seq(pi,nu),nu,phi));
  for (i=0; i<steps.length; i++)
      {var item = steps[i][1];
       if (!symbolp(item) && item[0]=='forall' && similarp(pattern,item[2],nu,item[1]))
          {return steps[i][0]}};
  return false}

function similarp (p,q,x,y) {if (p==x) {return q==y};
  if (symbolp(p)) {if (symbolp(q)) {return p==q} else {return false}};  if (symbolp(q)) {return false};
  if (p.length != q.length) {return false};  for (var i=0; i<p.length; i++) {if (!similarp(p[i],q[i],x,y)) {return false}};  return true}

function unind () {document.getElementById('ind').style.display = 'none'}//------------------------------------------------------------------------------
// doreset
//------------------------------------------------------------------------------
function doreset () {doinitialize()}

//------------------------------------------------------------------------------
// doxml
//------------------------------------------------------------------------------

function doxml () {var win = window.open();  //win.document.open('text/html');  win.document.writeln('<xmp>');  //win.document.writeln('<?xml version="1.0"?>');  //win.document.writeln('<?xml-stylesheet type="text/xsl" href="http://logic.stanford.edu/logica/stylesheets/proof.xsl"?>');
  step = 0;  win.document.write(xmlize(proof,0));
  win.document.writeln('</xmp>');  win.document.close()}function xmlize (item,n) {if (item[0]=='step') {return xmlstep(item,n)};
  if (item[0]=='proof') {return xmlproof(item,n)};
  return ''}

function xmlstep (line,n)
 {step=step+1;
  var exp = '';
  exp += spaces(n) + '<step>\n';  exp += spaces(n) + '  <number>' + step + '</number>\n';  exp += spaces(n) + '  <sentence>' + grind(line[1]) + '</sentence>\n';  exp += spaces(n) + '  <justification>' + prettify(line[2]) + '</justification>\n';  for (var j=3; j<line.length; j++)      {exp += spaces(n) + '  <antecedent>' + line[j] + '</antecedent>\n'};  exp += spaces(n) + '</step>\n';  return exp}function xmlproof (proof,n)
 {var exp = '';  exp += spaces(n) + '<proof>\n';  for (var i=1; i<proof.length; i++)
      {exp += xmlize(proof[i],n+1)};  exp += spaces(n) + '</proof>\n';  return exp}

function spaces (n)
 {exp = '';
  for (var i=0; i<n; i++) {exp += '  '};
  return exp}

//------------------------------------------------------------------------------
// Miscellaneous
//------------------------------------------------------------------------------

function printseq (p) {if (typeof p == 'number') {return p};  if (typeof p == 'string') {return '"' + p + '"'};  var n = p.length;  var exp = '(';  if (n>0) {exp += printseq(p[0])};  for (var i=1; i<n; i++)      {exp = exp + ' ' + printseq(p[i])}  exp += ')';  return exp}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
