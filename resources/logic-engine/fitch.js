//------------------------------------------------------------------------------
// fitch.js
//------------------------------------------------------------------------------

var proof = makeproof();
var goal = 'true';

// doinitialize
//------------------------------------------------------------------------------

function doinitialize ()
 {var archive = archivetoproof(document.getElementsByTagName('proof')[0]);
  proof = getstart(archive);
  target = proof;
  showproof(proof);
  goal = getgoal(archive);
  return true}

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

function displayproof (proof)
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

function displaysubproof (step,level,subproof,table)
  return step}

function displaystep (step,level,item,table)
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
  if (item.length > 3)
  cell.innerHTML = just;
  return step}

function displayempty (level,table)
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

 {proof = archivetoproof(document.getElementsByTagName('proof')[0]);
  target=getsubproof(proof);
  showproof(proof)}

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


  doopen();

function doshortcut ()
  var steps=seq();
  getcheckedstepnumbers(0,proof,target,steps);

function getcheckedstepnumbers (step,proof,target,steps)
 {for (var i=1; i<proof.length; i++)
          {step=step+1;
           if (document.getElementById(step).checked && subproof(target,proof))
              {steps[steps.length] = step}}
       else step = getcheckedstepnumbers(step,proof[i],target,steps)};
  return step}

var step = 0;
 {var steps=seq();
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function getcheckedsteps (step,proof,target,steps)
 {for (var i=1; i<proof.length; i++)
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

function dodelete ()
  newstep = 0;
  var concordance = seq(0);
  var newproof = getnewproof(proof,target,concordance);
  proof = newproof;
  target = getsubproof(proof);
  showproof(proof);

function getnewproof (proof,target,concordance)
 {var newproof = makeproof();
  for (var i=1; i<proof.length; i++)
          {step=step+1;
           if (document.getElementById(step).checked || !checksupport(proof[i],concordance))
              {concordance[step] = false}
           else {newstep=newstep+1;
                 concordance[step]=newstep; 
                 newproof[newproof.length]=proof[i]}}
       else {answer = getnewproof(proof[i],target,concordance);
             if (answer.length>1) {newproof[newproof.length] = answer}}};
  return newproof}

function checksupport (step,concordance)
 {if (proof.length<2) {return proof};
  var step = proof[proof.length-1];
  if (step[0]=='proof') {return getsubproof(step)};
  return proof}


function doopen ()
  target[target.length] = sub;
  target = sub;

//------------------------------------------------------------------------------

function doclose ()
  target = superproof(target);
  if (old.length==1) {remover(old,target)};

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

function doni ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function ni (p,q)
      equalp(p[1],q[1]) && complementaryp(p[2],q[2]))

function complementaryp (p,q)
 {return (!symbolp(q) && q[0]=='not' && equalp(p,q[1]))}

//------------------------------------------------------------------------------

  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function ne (p)

function doai ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function ai (p,q)

  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
function ae (p)

function dooi ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
       result = oi(exp,steps[i][1]);
       target[target.length]=makestep(result,'Or Introduction',steps[i][0])};

function oi (p,q)

function unoi ()

  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
  for (var i=0; i<steps.length; i++)
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
                                                         steps[k][0])}}}}};
  return true}

//------------------------------------------------------------------------------

  var conclusion = getimplication (target,target[target.length-1][1]);
  var step = getstep(proof,0);
  doclose();
  target[target.length]=makestep(conclusion,'Implication Introduction',step);
  showproof(proof);
  return true}

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

function doie ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function dobi ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
      !symbolp(q) && q[0] == 'implication' &&
      equalp(p[1],q[2]) && equalp(p[2],q[1]))

function dobe ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function be (p)
//------------------------------------------------------------------------------

function doui ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
          {target[target.length]=makestep(result,'Universal Introduction',steps[i][0])}};

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
  return false}
//------------------------------------------------------------------------------

function doue ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
          {var result = substit(tau,steps[i][1][1],steps[i][1][2]);

function unue ()
//------------------------------------------------------------------------------

  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
            target[target.length]=makestep(result,'Existential Introduction',steps[i][0])}};
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)

function ee (p,q)
      !symbolp(p) && q[0] == 'forall' && q[1]==p[1] &&
      !symbolp(q[2]) && q[2][0] == 'implication' && equalp(q[2][1],p[2]) &&
      !memberp(p[1],freevars(q[2][2],nil,nil)))
     {return q[2][2]};
  return false}


  target[target.length]=makestep(result,'Equality Introduction');
// doqe
//------------------------------------------------------------------------------

function doqe ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
       if (!symbolp(eqn) && eqn[0]=='equal')
          {var sigma = eqn[1];
           var tau = eqn[2];
           for (var j=0; j<steps.length; j++)
               {if (i!=j)
                   {var results = substitutions(sigma,tau,steps[j][1]);
           for (var j=0; j<steps.length; j++)
               {if (i!=j)
                   {var results = substitutions(tau,sigma,steps[j][1]);

//------------------------------------------------------------------------------
// dodc
//------------------------------------------------------------------------------

var functionconstants = seq()

  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
  var just = dcp(nu,phi,steps);
  var step = makestep(psi,'Domain Closure').concat(just);
  if (just) {target[target.length]=step};

function dcp (nu,phi,steps)
 {var just=seq();
  for (var i=0; i<objectconstants.length; i++)
       if (step==false) {return false};
       just[just.length]=step};
  return just}

function included (chi,steps)
 {for (i=0; i<steps.length; i++)
      {if (equalp(steps[i][1],chi)) {return steps[i][0]}};
  return false}

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
  return results}

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
  return results}

function doind ()
  getcheckedsteps(0,proof,target,steps);
  if (steps.length==0)
  var step = makestep(psi,'Induction');
  var base = dcp(nu,phi,steps);
  var inductive = ind(nu,phi,steps);
  if (base && inductive) {target[target.length]=step.concat(base,inductive)};

function ind (nu,phi,steps)
 {var just=seq();
  for (var i=0; i<functionconstants.length; i++)
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

function similarp (p,q,x,y)
  if (symbolp(p)) {if (symbolp(q)) {return p==q} else {return false}};
  if (p.length != q.length) {return false};

function unind ()
// doreset
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// doxml
//------------------------------------------------------------------------------

function doxml ()
  step = 0;
  win.document.writeln('</xmp>');
  if (item[0]=='proof') {return xmlproof(item,n)};
  return ''}

function xmlstep (line,n)
 {step=step+1;
  var exp = '';
  exp += spaces(n) + '<step>\n';
 {var exp = '';
      {exp += xmlize(proof[i],n+1)};

function spaces (n)
 {exp = '';
  for (var i=0; i<n; i++) {exp += '  '};
  return exp}

//------------------------------------------------------------------------------
// Miscellaneous
//------------------------------------------------------------------------------

function printseq (p)

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------