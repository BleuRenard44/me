
async function fetchModels(){ 
  const res = await fetch('/api/models'); 
  const data = await res.json(); 
  renderModels(data); 
  renderModelSelect(data);
}

async function fetchOrders(){ 
  const res = await fetch('/api/orders'); 
  const data = await res.json(); 
  renderOrders(data);
}

document.getElementById('add-model-btn').addEventListener('click', async()=>{
  const name=document.getElementById('model-name').value;
  const baseCost=parseFloat(document.getElementById('base-cost').value);
  const timeCost=parseFloat(document.getElementById('time-cost').value);
  const options=document.getElementById('options').value;
  await fetch('/api/models',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,baseCost,timeCost,options})});
  fetchModels();
});

document.getElementById('add-order-btn').addEventListener('click', async()=>{
  const modelId=parseInt(document.getElementById('model-select').value);
  const quantity=parseInt(document.getElementById('quantity').value);
  const customOptions=document.getElementById('custom-options').value;
  const resModels=await fetch('/api/models'); const models=await resModels.json();
  const model=models.find(m=>m.id===modelId);
  let totalPrice=(model.baseCost+model.timeCost)*quantity;
  if(customOptions.toLowerCase().includes('abs')) totalPrice+=0.5*quantity;
  await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modelId,quantity,customOptions,totalPrice})});
  fetchOrders();
});

function renderModels(models){
  const container=document.getElementById('models-list'); container.innerHTML='';
  models.forEach(m=>{ const div=document.createElement('div'); div.className='model-card'; div.textContent=m.name+' - Base:'+m.baseCost+'€ / Temps:'+m.timeCost+'€'; container.appendChild(div); });
}

function renderModelSelect(models){
  const select=document.getElementById('model-select'); select.innerHTML='';
  models.forEach(m=>{ const opt=document.createElement('option'); opt.value=m.id; opt.textContent=m.name; select.appendChild(opt); });
}

function renderOrders(orders){
  const container=document.getElementById('orders-list'); container.innerHTML='';
  let totalSales=0; orders.forEach(o=>{ 
    const div=document.createElement('div'); div.className='order-card';
    div.textContent='Commande '+o.id+': Modèle '+o.modelId+' x'+o.quantity+' ('+o.customOptions+') - '+o.totalPrice.toFixed(2)+'€ - '+o.status;
    container.appendChild(div); totalSales+=o.totalPrice;
  });
  document.getElementById('total-sales').textContent='Total ventes : '+totalSales.toFixed(2)+'€';
}

fetchModels(); fetchOrders();
