//------------------------------------------------------------------------------
// robinson.js
//------------------------------------------------------------------------------

var proof = makeproof();
var goal = '';
//------------------------------------------------------------------------------
// doinitialize
//------------------------------------------------------------------------------

function doinitialize ()
 {var archive = archivetoproof(document.getElementsByTagName('proof')[0]);
  proof = getstart(archive);
  showproof(proof);
  goal = getgoal(archive);  document.getElementById('goal').innerHTML = '&nbsp;&nbsp;' + goal;
  return true}

function archivetoproof (archive)
 {if (archive.nodeName=='STEP')
     {var step = getsubnode(archive,'NUMBER').textContent;
      var sentence = getsubnode(archive,'SENTENCE').textContent;
      var justification = getsubnode(archive,'JUSTIFICATION').textContent;
      var step = seq('step',step,read(sentence),justification);
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
  //for (var i=0; i<subproof.length; i++)
  //    {if (subproof[i][3]=='Premise') {start[start.length] = subproof[i]}};
  return start}

function getgoal (subproof)
 {return grind(subproof[subproof.length-1][2])}

//------------------------------------------------------------------------------
// showproof
//------------------------------------------------------------------------------

function showproof (proof)
 {var area = document.getElementById('proof');
  var n = area.childNodes.length;
  for (var i=0; i<n; i++) {area.removeChild(area.childNodes[0])};
  area.appendChild(displayproof(proof));
  showgrades()}

function displayproof (proof) {var table = document.createElement('table');
  table.setAttribute('width','640');
  table.setAttribute('cellpadding','4');
  table.setAttribute('cellspacing','0');
  table.setAttribute('border','0');
  if (proof.length>2) {displayfirst(table)} else {displayempty(table)};
  for (var i=1; i<proof.length; i++)      {displaystep(proof[i],table)};
  displayempty(table);
  return table}

function displaystep (item,table) {var row = table.insertRow(table.rows.length);
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  var widget = document.createElement('input');
  widget.setAttribute('id',item[1]);
  widget.setAttribute('type','checkbox');
  cell.appendChild(widget);  
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell.innerHTML = item[1] + '.';
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.innerHTML = grind(item[2]);
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  var just = '&nbsp;' + item[3];
  if (item.length > 4)     {just += ': ' + item[4];      for (var j=5; j<item.length; j++) {just += ', ' + item[j]}};
  cell.innerHTML = just;
  return true}

function displayfirst (table) {var row = table.insertRow(table.rows.length)
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  var widget = document.createElement('input');
  widget.setAttribute('type','checkbox');
  widget.setAttribute('onChange','doselectall()');
  cell.appendChild(widget);  
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.innerHTML = '<span style="color:#888888">Select All</span>';
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  return true}

function displayempty (table) {var row = table.insertRow(table.rows.length)
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.innerHTML = '&nbsp;';
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  return true}

//------------------------------------------------------------------------------
// showanswer
//------------------------------------------------------------------------------
function showanswer ()
 {proof = archivetoproof(document.getElementsByTagName('proof')[0]);
  showproof(proof)}
//------------------------------------------------------------------------------
// showbuttons
//------------------------------------------------------------------------------

function showbuttons ()
 {return true}

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
      {if (proof[i][0]=='step' && equalp(proof[i][2],p)) {return true}};
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
//------------------------------------------------------------------------------
// doselectall
//------------------------------------------------------------------------------

function doselectall () {var parity=(proof.length>1 && !document.getElementById(1).checked);
  for (var i=1; i<proof.length; i++)
      {document.getElementById(i).checked = parity};
  return true}//------------------------------------------------------------------------------
// dopremise
//------------------------------------------------------------------------------

function dopremise () {document.getElementById('premise').style.display = ''}function addpremise () {var exp = read(document.getElementById('newpremise').value);  document.getElementById('premise').style.display = 'none';  var cs = clausalize(exp);
  for (var i=0; i<cs.length; i++)
      {proof[proof.length] = makestep(proof.length,cs[i],'Premise')};  showproof(proof)}function unpremise () {document.getElementById('premise').style.display = 'none'}//------------------------------------------------------------------------------

function clausalize (p)
 {if (!symbolp(p) && p[0] == 'clause') {return seq(p)};  return clauses(p)}//------------------------------------------------------------------------------
// dogoal
//------------------------------------------------------------------------------

function dogoal () {document.getElementById('conclusion').style.display = ''}function addgoal () {var exp = read(document.getElementById('newgoal').value);  document.getElementById('conclusion').style.display = 'none';  var cs = goalize(exp);
  for (var i=0; i<cs.length; i++)
      {proof[proof.length] = makestep(proof.length,cs[i],'Negated Goal')};  showproof(proof)}function ungoal () {document.getElementById('conclusion').style.display = 'none'}//------------------------------------------------------------------------------

function goalize (p)
 {if (!symbolp(p) && p[0] == 'clause') {return seq(p)};  return clauses(makenegation(p))}//------------------------------------------------------------------------------
// doreiteration
//------------------------------------------------------------------------------
function doreiteration () {var parents = empty();  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {parents[parents.length] = i}};  if (parents.length==0)     {alert('Select at least one row of the proof and try again.');      return false};  for (var i=0; i<parents.length; i++)      {proof[proof.length]=makestep(proof.length,proof[parents[i]][2],'Reiteration',parents[i])};  showproof(proof);  return true}
//------------------------------------------------------------------------------
// dodelete
//------------------------------------------------------------------------------

function dodelete () {var concordance = new Array(proof.length);  var newproof = makeproof();  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {concordance[i] = false}       else if (checksupport(proof[i],concordance))               {concordance[i]=newproof.length;
                proof[i][1] = newproof.length;                newproof[newproof.length]=proof[i]}}  proof = newproof;  showproof(proof);  return true}function checksupport (step,concordance) {for (var j=4; j<step.length; j++)      {if (concordance[step[j]]) {step[j] = concordance[step[j]]}       else return false};  return true}
//------------------------------------------------------------------------------
// doresolution
//------------------------------------------------------------------------------
function doresolution () {var parents = empty();  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {parents[parents.length] = i}};  if (parents.length==0)     {alert('Select at least one row of the proof and try again.');      return false};  for (var i=0; i<parents.length; i++)      {for (var j=0; j<parents.length; j++)           {var results = resolvents(proof[parents[i]][2],proof[parents[j]][2]);            for (var k=0; k<results.length; k++)                {proof[proof.length]=makestep(proof.length,results[k],'Resolution',parents[i],parents[j])}}};  showproof(proof);  return true}function resolvents (p,q)
 {var results = seq();
  for (var i=1; i<p.length; i++)
      {copy = standardize(p);
       for (var j=1; j<q.length; j++)
           {if (!symbolp(q[j]) && q[j][0]=='not')
               {var bl = unify(copy[i],q[j][1],nil);
                if (bl!=false)
                   {var result = copy.slice(0,i).concat(copy.slice(i+1));
                    result = plug(result.concat(q.slice(1,j),q.slice(j+1)),bl);
                    results[results.length] = uniquify(result)}}}};
  return results}

function uniquify (ins) {var outs = seq();  for (var i=0; i<ins.length; i++) {outs = adjoinit(ins[i],outs)};  return outs}function adjoinit (x,s) {if (find(x,s)) {return s} else {s[s.length] = x; return s}}//------------------------------------------------------------------------------function unify (x,y,bl) {if (x == y) {return bl};  if (varp(x)) {return unifyvar(x,y,bl)};  if (symbolp(x)) {return unifyatom(x,y,bl)};  return unifyexp(x,y,bl)}function unifyvar (x,y,bl) {var dum = assoc(x,bl);  if (dum != false) {return unify(cdr(dum),y,bl)};  if (x == unifyval(y,bl)) {return bl};
  if (occurcheckp(x,y,bl)) {return false};  return acons(x,y,bl)}function unifyval (y,bl) {if (varp(y))     {var dum = assoc(y,bl);      if (dum != false) {return unifyval(cdr(dum),bl)};      return y};  return y}

function occurcheckp (x,y,bl)
 {if (x==y) {return true};
  if (varp(y))
     {var dum = assoc(y,bl);
      if (dum) {return occurcheckp(x,cdr(dum),bl)};
      return false};
  if (symbolp(y)) {return false};
  for (var i=0; i<y.length; i++)
      {if (occurcheckp(x,y[i],bl)) {return true}};
  return false}function unifyatom (x,y,bl) {if (varp(y)) {return unifyvar(y,x,bl)}  else return false}function unifyexp(x,y,bl) {if (varp(y)) {return unifyvar(y,x,bl)}  if (symbolp(y)) {return false};  var m = x.length;  var n = y.length;    if (m != n) {return false};  for (var i=0; i<m; i++)      {bl = unify(x[i],y[i],bl);       if (bl == false) {return false}};  return bl}//------------------------------------------------------------------------------function plug (x,bl) {if (varp(x)) {return plugvar(x,bl)};  if (symbolp(x)) {return x};  return plugexp(x,bl)}function plugvar (x,bl) {var dum = assoc(x,bl);  if (dum == false) {return x};  return plug(cdr(dum),bl)}function plugexp (x,bl) {var n = x.length;  var exp = new Array(n);  for (var i=0; i<n; i++)      {exp[i] = plug(x[i],bl)};  return exp}//------------------------------------------------------------------------------var alist;function standardize (x) {alist = nil;  return standardizeit(x)}function standardizeit (x) {if (varp(x)) {return standardizevar(x)};  if (symbolp(x)) {return x};  return standardizeexp(x)}function standardizevar (x) {var dum = assoc(x,alist);  if (dum != false) {return cdr(dum)};  var rep = newvar();  alist = acons(x,rep,alist);  return rep}function standardizeexp (x) {var n = x.length;  var exp = new Array(n);  for (var i=0; i<n; i++)      {exp[i] = standardizeit(x[i])};  return exp}//------------------------------------------------------------------------------
// dofactor
//------------------------------------------------------------------------------
function dofactor () {var parents = empty();  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {parents[parents.length] = i}};  if (parents.length==0)     {alert('Select at least one row of the proof and try again.');      return false};  for (var i=0; i<parents.length; i++)      {var results = factors(proof[parents[i]][2]);       for (var k=0; k<results.length; k++)           {proof[proof.length]=makestep(proof.length,results[k],'Factoring',parents[i])}};  showproof(proof);  return true}

function factors (p)
 {var results = seq();
  for (var i=1; i<p.length; i++)
      {for (var j=i+1; j<p.length; j++)
           {if (j!=i)
               {var bl = unify(p[i],p[j],nil);
                if (bl!=false)
                   {var result = p.slice(0,j).concat(p.slice(j+1));
                    result = plug(result,bl);
                    results[results.length] = uniquify(result)}}}};
  return results}

//------------------------------------------------------------------------------
// doinstantiation
//------------------------------------------------------------------------------

function doinstantiation () {document.getElementById('instantiation').style.display = ''}
function addinstantiation () {var nu = read(document.getElementById('instantiationnu').value);  var tau = read(document.getElementById('instantiationtau').value);
  document.getElementById('instantiation').style.display = 'none';  var parents = empty();  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {parents[parents.length] = i}};  if (parents.length==0)     {alert('Select at least one row in the proof and try again.');      return false};  for (var i=0; i<parents.length; i++)      {var results = substitutions(nu,tau,proof[parents[i]][2]);       for (var k=1; k<results.length; k++)           {proof[proof.length]=makestep(proof.length,results[k],'Instantiation',parents[i])}};  showproof(proof);  return true}

function uninstantiation () {document.getElementById('instantiation').style.display = 'none'}

//------------------------------------------------------------------------------
// doparamodulation
//------------------------------------------------------------------------------

function doparamodulation () {var parents = empty();  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {parents[parents.length] = i}};  if (parents.length==0)     {alert('Select at least one row of the proof and try again.');      return false};  for (var i=0; i<parents.length; i++)      {for (var j=0; j<parents.length; j++)           {if (i!=j)
               {var results = paramodulants(proof[parents[i]][2],proof[parents[j]][2]);                for (var k=0; k<results.length; k++)                    {proof[proof.length]=makestep(proof.length,results[k],'Paramodulation',parents[i],parents[j])}}}};  showproof(proof);  return true}

function paramodulants (p,q)
 {var results = seq();
  copy = standardize(p);
  for (var i=1; i<p.length; i++)
      {if (!symbolp(p[i]) && p[i][0]=='equal')
          {var sigma = p[i][1];
           var tau = p[i][2];
           var rewrites = substitutions(sigma,tau,q);
           for (var k=1; k<rewrites.length; k++)
               {var result = rewrites[k].concat(copy.slice(1,i));
                result = result.concat(copy.slice(i+1));
                results[results.length] = uniquify(result)};
           var rewrites = substitutions(tau,sigma,q);
           for (var k=1; k<rewrites.length; k++)
               {var result = rewrites[k].concat(copy.slice(1,i));
                result = result.concat(copy.slice(i+1));
                results[results.length] = uniquify(result)}}};
  return results}

//------------------------------------------------------------------------------
// doequality
//------------------------------------------------------------------------------
function doequality () {var axiom = read('{X=X}');
  proof[proof.length]=makestep(proof.length,axiom,'Equality');  showproof(proof);  return true}//------------------------------------------------------------------------------
// doreset
//------------------------------------------------------------------------------
function doreset () {doinitialize()}//------------------------------------------------------------------------------
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
  exp += spaces(n) + '<step>\n';  exp += spaces(n) + '  <number>' + line[1] + '</number>\n';  exp += spaces(n) + '  <sentence>' + grind(line[2]) + '</sentence>\n';  exp += spaces(n) + '  <justification>' + prettify(line[3]) + '</justification>\n';  for (var j=4; j<line.length; j++)      {exp += spaces(n) + '  <antecedent>' + line[j] + '</antecedent>\n'};  exp += spaces(n) + '</step>\n';  return exp}function xmlproof (proof,n)
 {var exp = '';  exp += spaces(n) + '<proof>\n';  for (var i=1; i<proof.length; i++)
      {exp += xmlize(proof[i],n+1)};  exp += spaces(n) + '</proof>\n';  return exp}

function spaces (n)
 {exp = '';
  for (var i=0; i<n; i++) {exp += '  '};
  return exp}

//------------------------------------------------------------------------------
// arrow keys
//------------------------------------------------------------------------------

function handlekey (e)
 {if (e.keyCode == '37' || e.keyCode == '38') {e.preventDefault(); doup()};
  if (e.keyCode == '39' || e.keyCode == '40') {e.preventDefault(); dodown()};
  return false}

//------------------------------------------------------------------------------

function doup () {var step = getcheckedstep(proof);
  if (!step) {return false};
  if (step==1) {return false};
  if (!upmovablep(proof[step],proof[step-1])) {return false};
  updateproof(step-1,step,proof);
  updatejusts(step-1,step,proof);
  showproof(proof);  document.getElementById(step-1).checked = true;  return true}

function upmovablep (mover,movee)
 {var step = movee[1];
  for (var j=3; j<mover.length; j++)
      {if (mover[j]*1>=step) {return false}};
  return true}

function updateproof (movee,mover,proof)
 {var temp = proof[movee];
  proof[movee] = proof[mover];
  proof[mover] = temp;
  return true}

function updatejusts (movee,mover,proof)
 {for (var i=1; i<proof.length; i++)
      {if (proof[i][1]==mover) {proof[i][1]=movee}
          else if (proof[i][1]>=movee && proof[i][1]<mover)
                  {proof[i][1] = proof[i][1]*1+1};
       for (var j=3; j<proof[i].length; j++)           {if (proof[i][j]==mover) {proof[i][j]=movee}
               else if (proof[i][j]>=movee && proof[i][j]<mover)
                       {proof[i][j] = proof[i][j]*1+1}}};  return true}

//------------------------------------------------------------------------------

function dodown () {var step = getcheckedstep(proof);
  if (!step) {return false};
  if (step==proof.length-1) {return false};
  if (!downmovablep(proof[step],proof[step+1])) {return false};
  downdateproof(step,step+1,proof);
  downdatejusts(step,step+1,proof);
  showproof(proof);  document.getElementById(step+1).checked = true;  return true}

function downmovablep (mover,movee)
 {var step = mover[1];
  for (var j=3; j<movee.length; j++)
      {if (movee[j]*1>=step) {return false}};
  return true}

function downdateproof (movee,mover,proof)
 {var temp = proof[movee];
  proof[movee] = proof[mover];
  proof[mover] = temp;
  return true}

function downdatejusts (mover,movee,proof)
 {for (var i=1; i<proof.length; i++)      {if (proof[i][1]==mover) {proof[i][1]=movee}
          else if (proof[i][1]>mover && proof[i][1]<=movee)
                  {proof[i][1] = proof[i][1]*1-1};
       for (var j=3; j<proof[i].length; j++)           {if (proof[i][j]==mover) {proof[i][j]=movee}
               else if (proof[i][j]>mover && proof[i][j]<=movee)
                       {proof[i][j] = proof[i][j]*1-1}}};  return true}

//------------------------------------------------------------------------------

function getcheckedstep (proof)
 {for (var i=1; i<proof.length; i++)      {if (document.getElementById(proof[i][1]).checked) {return i}};
  return false}

function getcheckedsteps (proof)
 {var steps = seq();
  for (var i=1; i<proof.length; i++)      {if (document.getElementById(i).checked) {steps[steps.length] = i}};
  return steps}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

