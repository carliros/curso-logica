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
  goal = getgoal(archive);
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

function displayproof (proof)
  table.setAttribute('width','640');
  table.setAttribute('cellpadding','4');
  table.setAttribute('cellspacing','0');
  table.setAttribute('border','0');
  if (proof.length>2) {displayfirst(table)} else {displayempty(table)};
  for (var i=1; i<proof.length; i++)
  displayempty(table);
  return table}

function displaystep (item,table)
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
  if (item.length > 4)
  cell.innerHTML = just;
  return true}

function displayfirst (table)
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

function displayempty (table)
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

 {proof = archivetoproof(document.getElementsByTagName('proof')[0]);
  showproof(proof)}

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

function doselectall ()
  for (var i=1; i<proof.length; i++)
      {document.getElementById(i).checked = parity};
  return true}
// dopremise
//------------------------------------------------------------------------------

function dopremise ()
  for (var i=0; i<cs.length; i++)
      {proof[proof.length] = makestep(proof.length,cs[i],'Premise')};

function clausalize (p)
 {if (!symbolp(p) && p[0] == 'clause') {return seq(p)};
// dogoal
//------------------------------------------------------------------------------

function dogoal ()
  for (var i=0; i<cs.length; i++)
      {proof[proof.length] = makestep(proof.length,cs[i],'Negated Goal')};

function goalize (p)
 {if (!symbolp(p) && p[0] == 'clause') {return seq(p)};
// doreiteration
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// dodelete
//------------------------------------------------------------------------------

function dodelete ()
                proof[i][1] = newproof.length;
//------------------------------------------------------------------------------
// doresolution
//------------------------------------------------------------------------------

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

function uniquify (ins)
  if (occurcheckp(x,y,bl)) {return false};

function occurcheckp (x,y,bl)
 {if (x==y) {return true};
  if (varp(y))
     {var dum = assoc(y,bl);
      if (dum) {return occurcheckp(x,cdr(dum),bl)};
      return false};
  if (symbolp(y)) {return false};
  for (var i=0; i<y.length; i++)
      {if (occurcheckp(x,y[i],bl)) {return true}};
  return false}
// dofactor
//------------------------------------------------------------------------------


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

function doinstantiation ()
function addinstantiation ()
  document.getElementById('instantiation').style.display = 'none';

function uninstantiation ()

//------------------------------------------------------------------------------
// doparamodulation
//------------------------------------------------------------------------------

function doparamodulation ()
               {var results = paramodulants(proof[parents[i]][2],proof[parents[j]][2]);

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

  proof[proof.length]=makestep(proof.length,axiom,'Equality');
// doreset
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
// arrow keys
//------------------------------------------------------------------------------

function handlekey (e)
 {if (e.keyCode == '37' || e.keyCode == '38') {e.preventDefault(); doup()};
  if (e.keyCode == '39' || e.keyCode == '40') {e.preventDefault(); dodown()};
  return false}

//------------------------------------------------------------------------------

function doup ()
  if (!step) {return false};
  if (step==1) {return false};
  if (!upmovablep(proof[step],proof[step-1])) {return false};
  updateproof(step-1,step,proof);
  updatejusts(step-1,step,proof);
  showproof(proof);

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
       for (var j=3; j<proof[i].length; j++)
               else if (proof[i][j]>=movee && proof[i][j]<mover)
                       {proof[i][j] = proof[i][j]*1+1}}};

//------------------------------------------------------------------------------

function dodown ()
  if (!step) {return false};
  if (step==proof.length-1) {return false};
  if (!downmovablep(proof[step],proof[step+1])) {return false};
  downdateproof(step,step+1,proof);
  downdatejusts(step,step+1,proof);
  showproof(proof);

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
 {for (var i=1; i<proof.length; i++)
          else if (proof[i][1]>mover && proof[i][1]<=movee)
                  {proof[i][1] = proof[i][1]*1-1};
       for (var j=3; j<proof[i].length; j++)
               else if (proof[i][j]>mover && proof[i][j]<=movee)
                       {proof[i][j] = proof[i][j]*1-1}}};

//------------------------------------------------------------------------------

function getcheckedstep (proof)
 {for (var i=1; i<proof.length; i++)
  return false}

function getcheckedsteps (proof)
 {var steps = seq();
  for (var i=1; i<proof.length; i++)
  return steps}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
