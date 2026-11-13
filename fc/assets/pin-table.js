(()=>{'use strict';
const data=window.FC_PIN_DATA;if(!data)throw new Error('Current FC pin data missing');
for(const host of document.querySelectorAll('[data-fc-pin-table]')){
 const heading=document.createElement('h2');heading.textContent='Pins and functions';host.append(heading);
 const intro=document.createElement('p');intro.textContent='Seven UARTs including GPS. Match the numbered connector and pin-1 mark; screen direction changes when the board is rotated.';host.append(intro);
 for(const [i,g] of data.groups.entries()){
  const section=document.createElement('details');section.className='pin-group';section.open=i===0;
  const summary=document.createElement('summary');summary.textContent=g.title;section.append(summary);
  const note=document.createElement('p');note.textContent=g.note;section.append(note);
  const table=document.createElement('table');table.className='pin-table';table.setAttribute('aria-label',g.title);
  const head=table.createTHead().insertRow();for(const label of ['Pin / pad','Signal','Function']){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th)}
  const body=table.createTBody();for(const row of g.rows){const tr=body.insertRow(),th=document.createElement('th');th.scope='row';th.textContent=row.pin;tr.append(th);for(const value of [row.net||'NC',row.function]){const td=tr.insertCell();td.textContent=value}}
  section.append(table);host.append(section);
 }
 const scope=document.createElement('p');scope.className='pin-scope';scope.textContent='Includes all external connectors, interboard contacts, microSD and power pads. Service board is separate from the main stack. Power ratings and assembly fit remain design targets pending hardware qualification.';host.append(scope);
}
})();
