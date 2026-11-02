const partners=[
 {id:1,name:'Fundação Amazônia Sustentável (FAS)',type:'Fundação / Instituto',area:'Meio ambiente',region:'Norte',resources:['Materiais','Serviços','Conhecimento técnico'],icon:'♧',description:'Organização que atua na conservação ambiental e no desenvolvimento sustentável na Amazônia.'},
 {id:2,name:'Fundação Bracell',type:'Fundação / Instituto empresarial',area:'Educação',region:'Sudeste',resources:['Financeiro','Materiais','Conhecimento técnico'],icon:'✦',description:'Iniciativas relacionadas à educação e ao desenvolvimento social nos territórios de atuação da Bracell.'},
 {id:3,name:'Instituto InterCement',type:'Fundação / Instituto empresarial',area:'Desenvolvimento comunitário',region:'Centro-Oeste',resources:['Financeiro','Serviços','Conhecimento técnico'],icon:'◎',description:'Atuação relacionada ao investimento social privado e ao desenvolvimento comunitário.'}
];
let role='OSC', selectedPartner=partners[0], selectedRequestId='req-1001', selectedRequestTitle='Projeto de apoio educacional', uploadedDocsByRequest={'req-1001':{},'req-1002':{},'req-1003':{}}, currentScreen='welcome';
const demoCredentials={email:'osc@viabiliza.demo',password:'demo123'};
const sessionRegisteredUsers=[];
const userRequests=[
 {id:'req-1001',title:'Projeto de conservação e educação socioambiental',partnerId:1,status:'Documentação pendente',summary:'A solicitação demonstrativa está aguardando o envio dos documentos obrigatórios.'},
 {id:'req-1002',title:'Projeto de desenvolvimento comunitário',partnerId:3,status:'Documentação pendente',summary:'Há documentos que precisam ser anexados para continuar a análise.'},
 {id:'req-1003',title:'Projeto de educação e desenvolvimento de lideranças',partnerId:2,status:'Em análise',summary:'Solicitação demonstrativa registrada e aguardando análise do parceiro.'}
];
function getUploads(){if(!uploadedDocsByRequest[selectedRequestId])uploadedDocsByRequest[selectedRequestId]={};return uploadedDocsByRequest[selectedRequestId];}
const docs=[
 {id:'oficio-proposta',name:'Ofício de solicitação da proposta da OSC para Secretário da SEDEC',description:'Solicitação formal da proposta encaminhada ao Secretário da SEDEC.',accept:'.pdf,.png,.jpg,.jpeg',optional:false},
 {id:'requerimento-apoio',name:'Requerimento de Apoio Financeiro (ANEXO II)',description:'Requerimento conforme o modelo do Anexo II.',accept:'.pdf,.png,.jpg,.jpeg',optional:false},
 {id:'emenda-parlamentar',name:'Ofício de emenda parlamentar',description:'Anexar somente quando a proposta estiver vinculada a uma emenda parlamentar.',accept:'.pdf,.png,.jpg,.jpeg',optional:true},
 {id:'justificativa-exclusividade',name:'Justificativa de Exclusividade da OSC para inexigibilidade de chamamento público',description:'Justificativa documental de exclusividade, conforme o caso da proposta.',accept:'.pdf,.png,.jpg,.jpeg',optional:false},
 {id:'capacidade-tecnica',name:'Comprovante de capacidade técnica e operacional da OSC',description:'Documentação que comprove a capacidade técnica e operacional da organização.',accept:'.pdf,.png,.jpg,.jpeg',optional:false},
 {id:'experiencia-previa',name:'Comprovação de experiência prévia',description:'Documentação que demonstre experiência anterior pertinente.',accept:'.pdf,.png,.jpg,.jpeg',optional:false},
 {id:'estatuto-diretoria',name:'Estatuto, atas e documentação da diretoria',description:'Documentos institucionais e de composição da diretoria.',accept:'.pdf,.png,.jpg,.jpeg',optional:false},
 {id:'comprovante-endereco',name:'Comprovante de endereço da OSC',description:'Comprovante de endereço atualizado da organização.',accept:'.pdf,.png,.jpg,.jpeg',optional:false}
];
const requiredDocCount=docs.filter(d=>!d.optional).length;
function startRegistration(){
 setRole('OSC');
 const form=document.getElementById('registerForm');
 if(form)form.reset();
 clearRegistrationErrors();
 go('register');
}
function go(id){
 if((id==='search'||id==='requests'||id==='request')&&role!=='OSC'){id='dashboard';}
 document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
 const el=document.getElementById(id);
 if(el){el.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
 currentScreen=id;
 const workspace=document.getElementById('workspace');
 workspace.classList.toggle('authenticated',['dashboard','search','requests','request'].includes(id));
 document.querySelector('.top-actions').classList.toggle('hidden',workspace.classList.contains('authenticated'));
 renderNav();
 if(id==='dashboard')renderDashboard();
 if(id==='search')renderResults();
 if(id==='requests')renderRequests();
 if(id==='request')renderDocs();
}
function renderNav(){
 document.querySelectorAll('.osc-nav').forEach(el=>el.classList.toggle('hidden',role!=='OSC'));
 document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===currentScreen||(currentScreen==='request'&&el.dataset.nav==='requests')));
 const note=document.getElementById('sideRoleNote');if(note)note.textContent='Perfil ativo: '+role;
 const badge=document.getElementById('dashboardRoleBadge');if(badge)badge.textContent='Perfil: '+role;
}
function logoutToWelcome(){role='OSC';setRole('OSC');go('welcome');}
function setRole(r){
 const previousRole=role;
 role=r;
 if(previousRole!==r)clearRegistrationErrors();
 document.querySelectorAll('.type-option').forEach(b=>b.classList.toggle('active',b.dataset.role===r));
 const isOSC=r==='OSC',isCompany=r==='Empresa privada',isGovernment=r==='Órgão público';
 const areaField=document.getElementById('areaField'),area=document.getElementById('area');
 const secretariatField=document.getElementById('secretariatField'),secretariat=document.getElementById('secretariat');
 const deptField=document.getElementById('deptField'),department=document.getElementById('department');
 areaField.hidden=!isOSC;area.required=isOSC;
 secretariatField.hidden=!isGovernment;secretariat.required=isGovernment;
 deptField.hidden=!(isCompany||isGovernment);department.required=isCompany||isGovernment;
 document.getElementById('nameLabel').textContent=isOSC?'Nome da organização *':isCompany?'Nome da empresa *':'Nome do órgão público *';
 document.getElementById('orgName').placeholder=isOSC?'Ex.: Instituto Caminhos do Amanhã':isCompany?'Ex.: Empresa Exemplo S.A.':'Ex.: Secretaria ou órgão público';
 document.getElementById('areaLabel').textContent='Área de atuação *';
 document.getElementById('needLabel').textContent=isOSC?'Necessidade específica de parceria *':'Objetivo/área de interesse *';
 document.getElementById('need').placeholder=isOSC?'Conte que tipo de parceria ou recurso sua instituição procura.':'Descreva os objetivos, áreas de interesse ou recursos que sua instituição pretende oferecer.';
 department.placeholder=isGovernment?'Ex.: Departamento de Projetos e Convênios':'Ex.: Departamento de Responsabilidade Social';
 const detailsTitle=document.getElementById('registerDetailsTitle');if(detailsTitle)detailsTitle.textContent='Dados do perfil — '+(isOSC?'OSC':isCompany?'empresa privada':'órgão público');
 const detailsSubtitle=document.getElementById('registerDetailsSubtitle');if(detailsSubtitle)detailsSubtitle.textContent='Etapa 2 de 2: preencha os dados '+(isOSC?'da sua organização da sociedade civil.':isCompany?'da sua empresa.':'do órgão público.');
 const needField=document.getElementById('need'); if(needField)needField.previousElementSibling.textContent=isOSC?'Necessidade específica de parceria *':'Objetivo/área de interesse *';
}
function isValidCNPJ(raw){
 const d=raw.replace(/\D/g,'');
 if(d.length!==14||/^([0-9])\1{13}$/.test(d))return false;
 const calc=(base,weights)=>{const sum=base.split('').reduce((total,n,i)=>total+Number(n)*weights[i],0);const rest=sum%11;return rest<2?'0':String(11-rest);};
 const first=calc(d.slice(0,12),[5,4,3,2,9,8,7,6,5,4,3,2]);
 const second=calc(d.slice(0,12)+first,[6,5,4,3,2,9,8,7,6,5,4,3,2]);
 return d.slice(-2)===first+second;
}
// Casos fixos exclusivamente para demonstração; substituir por consulta a um backend antes de uso real.
const demoCnpjRegistry={
 '11222333000181':{situation:'regular'},
 '11222333000100':{situation:'invalid-digits'},
 '12345678000195':{situation:'inapta'}
};
function digitsOnly(value){return (value||'').replace(/\D/g,'');}
function clearRegistrationErrors(){
 const msg=document.getElementById('registerMessage');if(msg)msg.innerHTML='';
 document.querySelectorAll('#registerForm .field.is-invalid').forEach(field=>field.classList.remove('is-invalid'));
 document.querySelectorAll('#registerForm [aria-invalid="true"]').forEach(field=>field.removeAttribute('aria-invalid'));
 document.querySelectorAll('#registerForm .field-error').forEach(error=>{error.textContent='';error.classList.remove('visible');});
}
function setFieldError(id,message){
 const control=document.getElementById(id);if(!control)return;
 const field=control.closest('.field');if(field)field.classList.add('is-invalid');
 control.setAttribute('aria-invalid','true');
 const error=document.getElementById(id+'Error');if(error){error.textContent='ⓘ '+message;error.classList.add('visible');}
}
function clearFieldErrorFor(control){
 const field=control.closest('.field');if(field)field.classList.remove('is-invalid');
 control.removeAttribute('aria-invalid');
 const error=document.getElementById(control.id+'Error');if(error){error.textContent='';error.classList.remove('visible');}
}
function validateRegistration(){
 clearRegistrationErrors();
 const msg=document.getElementById('registerMessage');
 const required=[
  ['orgName',role==='OSC'?'Informe o nome da organização.':role==='Empresa privada'?'Informe o nome da empresa.':'Informe o nome do órgão público.'],
  ['cnpj','Informe o CNPJ.'],
  ['region','Selecione a região.'],
  ['need',role==='OSC'?'Descreva a necessidade de parceria.':'Descreva o objetivo ou a área de interesse.'],
  ['emailReg','Informe um e-mail válido.'],
  ['passReg','A senha precisa ter pelo menos 6 caracteres.'],
  ['passConfirm','Confirme a senha.']
 ];
 if(role==='OSC')required.push(['area','Selecione uma opção.']);
 if(role==='Empresa privada'||role==='Órgão público')required.push(['department','Informe o departamento responsável.']);
 if(role==='Órgão público')required.push(['secretariat','Informe a secretaria responsável.']);
 let invalid=[];
 for(const [id,message] of required){
  const el=document.getElementById(id);if(!el||el.closest('.field').hidden)continue;
  let err='';
  if(!el.value.trim())err=message;
  else if(id==='emailReg'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()))err='Informe um e-mail válido.';
  else if(id==='passReg'&&el.value.length<6)err='A senha precisa ter pelo menos 6 caracteres.';
  else if(id==='passConfirm'&&el.value!==document.getElementById('passReg').value)err='As senhas não coincidem. Digite novamente a senha.';
  else if(id==='cnpj'){
   const digits=digitsOnly(el.value);
   if(!isValidCNPJ(digits))err='CNPJ inválido. Confira os dígitos verificadores.';
   else if(demoCnpjRegistry[digits]?.situation==='inapta')err='CNPJ com situação inapta na Receita Federal (simulado).';
   else if(!demoCnpjRegistry[digits]||demoCnpjRegistry[digits].situation!=='regular')err='Use um dos CNPJs de teste listados abaixo.';
  }
  if(err){setFieldError(id,err);invalid.push({id,err});}
 }
 const email=document.getElementById('emailReg').value.trim().toLowerCase();
 if(!invalid.length&&(email===demoCredentials.email||sessionRegisteredUsers.some(u=>u.email===email))){
  setFieldError('emailReg','Este e-mail já está reservado ou foi usado neste navegador.');invalid.push({id:'emailReg',err:'E-mail já utilizado.'});
 }
 if(invalid.length){
  msg.innerHTML='<div class="error-summary"><strong>Não foi possível concluir o cadastro. Corrija os campos indicados abaixo.</strong></div>';
  document.getElementById(invalid[0].id)?.focus();
  return false;
 }
 return true;
}
document.getElementById('cnpj').addEventListener('input',e=>{
 let d=e.target.value.replace(/\D/g,'').slice(0,14);
 if(d.length>12)d=d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/,'$1.$2.$3/$4-$5');
 else if(d.length>8)d=d.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/,'$1.$2.$3/$4');
 else if(d.length>5)d=d.replace(/^(\d{2})(\d{3})(\d{0,3})$/,'$1.$2.$3');
 else if(d.length>2)d=d.replace(/^(\d{2})(\d{0,3})$/,'$1.$2');
 e.target.value=d;clearFieldErrorFor(e.target);
});
document.querySelectorAll('#registerForm input, #registerForm select, #registerForm textarea').forEach(control=>{
 control.addEventListener('input',()=>clearFieldErrorFor(control));
 control.addEventListener('change',()=>clearFieldErrorFor(control));
});
document.getElementById('registerForm').addEventListener('submit',e=>{
 e.preventDefault();
 if(!validateRegistration())return;
 const selectedRole=role,email=document.getElementById('emailReg').value.trim().toLowerCase(),password=document.getElementById('passReg').value;
 // Nesta versão demonstrativa, novos perfis ficam pendentes; nenhum cadastro é aprovado automaticamente.
 sessionRegisteredUsers.push({email,password,role:selectedRole,cnpj:digitsOnly(document.getElementById('cnpj').value),approved:false,status:'Aguardando aprovação'});
 const pendingEmail=document.getElementById('registrationPendingEmail');
 if(pendingEmail)pendingEmail.textContent=email;
 // Evita manter a senha visível na ficha após o envio da solicitação.
 document.getElementById('passReg').value='';
 document.getElementById('passConfirm').value='';
 go('registration-pending');
});
document.getElementById('loginForm').addEventListener('submit',e=>{
 e.preventDefault();
 const email=document.getElementById('loginEmail').value.trim().toLowerCase();
 const pass=document.getElementById('loginPass').value;
 const selectedRole=document.getElementById('loginRole').value;
 const msg=document.getElementById('loginMessage');
 const isDemo=email===demoCredentials.email&&pass===demoCredentials.password;
 const registered=sessionRegisteredUsers.find(u=>u.email===email&&u.role===selectedRole);
 if(registered&&registered.password===pass&&!registered.approved){msg.innerHTML='<div class="error">Seu cadastro está aguardando a aprovação do administrador. A confirmação será enviada para o e-mail cadastrado.</div>';return;}
 const approvedRegistered=registered&&registered.approved&&registered.password===pass;
 if(!isDemo&&!approvedRegistered){msg.innerHTML='<div class="error">E-mail ou senha inválidos.</div>';return;}
 role=isDemo?selectedRole:registered.role;
 msg.innerHTML='<div class="success">Acesso demonstrativo realizado.</div>';
 setTimeout(()=>go('dashboard'),250);
});
const resetPasswordForm=document.getElementById('resetPasswordForm');
if(resetPasswordForm){
 resetPasswordForm.addEventListener('submit',e=>{
  e.preventDefault();
  const emailInput=document.getElementById('resetEmail');
  const email=emailInput.value.trim();
  const message=document.getElementById('resetMessage');
  const field=emailInput.closest('.field');
  const error=document.getElementById('resetEmailError');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
   emailInput.setAttribute('aria-invalid','true');
   if(field)field.classList.add('is-invalid');
   if(error){error.textContent='Informe um e-mail válido.';error.classList.add('visible');}
   message.innerHTML='<div class="error">Confira o e-mail informado antes de continuar.</div>';
   emailInput.focus();
   return;
  }
  emailInput.removeAttribute('aria-invalid');
  if(field)field.classList.remove('is-invalid');
  if(error){error.textContent='';error.classList.remove('visible');}
  message.innerHTML='<div class="success">Se este e-mail estiver cadastrado, as instruções de redefinição serão enviadas para ele. Neste protótipo, o envio real de e-mail não está integrado.</div>';
 });
}

function renderDashboard(){const r=role;const gov=r==='Órgão público';document.getElementById('dashTitle').textContent=gov?'Painel consolidado de parcerias':'Olá! Vamos avançar suas parcerias.';document.getElementById('dashSubtitle').textContent=gov?'Visão ilustrativa das parcerias na jurisdição do órgão.':'Acompanhe suas solicitações e encontre oportunidades.';document.getElementById('mActive').textContent=gov?'18':'04';document.getElementById('mAnalysis').textContent=gov?'07':'02';document.getElementById('mAccepted').textContent=gov?'09':'01';const pending=userRequests.filter(x=>x.status==='Documentação pendente').length;document.getElementById('mDocs').textContent=String(pending).padStart(2,'0');document.getElementById('mDocs').parentElement.classList.toggle('hidden',gov);document.querySelector('.dashboard-grid').classList.toggle('manager-view',gov);document.getElementById('bAnalysis').textContent=gov?'7':'2';document.getElementById('bActive').textContent=gov?'5':'1';document.getElementById('bAccepted').textContent=gov?'9':'1';document.getElementById('bComplete').textContent=gov?'12':'0';document.getElementById('dashboardScope').textContent=gov?'Visão consolidada e ilustrativa das parcerias ativas na jurisdição configurada para o gestor público.':'Esta visão apresenta somente dados vinculados ao perfil autenticado.';document.getElementById('pendingDocsTitle').textContent=`Solicitações aguardando documentos (${pending})`;document.getElementById('docsShortcutCard').classList.toggle('hidden',gov);document.querySelectorAll('.osc-dashboard-item').forEach(el=>el.classList.toggle('hidden',r!=='OSC'));document.getElementById('managerDashboardNote').classList.toggle('hidden',!gov);document.getElementById('currentStatus').textContent=pending?'Documentação pendente':'Nenhuma documentação pendente';document.getElementById('currentStatusBadge').textContent=pending?'Pendente':'Atualizado';document.getElementById('currentStatusBadge').className='status '+(pending?'pending':'accepted');renderNav();}
function renderRequests(){
 const list=document.getElementById('requestList');
 list.innerHTML=userRequests.map(req=>{
  const partner=partners.find(p=>p.id===req.partnerId);
  const count=Object.keys(uploadedDocsByRequest[req.id]||{}).length;
  const status=req.status||'Documentação pendente';
  const accepted=status==='Documentação enviada';
  const inAnalysis=status==='Em análise';
  const statusClass=accepted?'accepted':inAnalysis?'info':'pending';
  const buttonText=(accepted||inAnalysis)?'Consultar solicitação':'Continuar documentação';
  return `<article class="card request-card"><div><div class="eyebrow">${req.id.toUpperCase()}</div><h3>${req.title}</h3><p class="muted small">Parceiro: ${partner?partner.name:'Parceiro demonstrativo'}</p><p class="small">${req.summary}</p><div class="request-meta"><span class="status ${statusClass}">${status}</span><span class="tag">${count} de ${docs.length} itens com arquivo nesta sessão</span></div></div><button class="btn btn-primary" onclick="openRequestDetail('${req.id}')">${buttonText} →</button></article>`;
 }).join('');
}function openRequestDetail(requestId){const req=userRequests.find(x=>x.id===requestId);if(!req)return;selectedRequestId=req.id;selectedRequestTitle=req.title;selectedPartner=partners.find(p=>p.id===req.partnerId)||partners[0];go('request');}
function startRequestFromPartner(){let req=userRequests.find(x=>x.partnerId===selectedPartner.id&&x.status==='Documentação pendente');if(!req){const id='req-'+String(1000+userRequests.length+1);req={id,title:'Solicitação de parceria com '+selectedPartner.name,partnerId:selectedPartner.id,status:'Documentação pendente',summary:'Solicitação criada no fluxo demonstrativo a partir do perfil do parceiro.'};userRequests.push(req);uploadedDocsByRequest[id]={};}openRequestDetail(req.id);}
function renderResults(){const area=document.getElementById('searchArea').value,region=document.getElementById('searchRegion').value,res=document.getElementById('searchResource').value;const found=partners.filter(p=>(!area||p.area===area)&&(!region||p.region===region)&&(!res||p.resources.includes(res)));const arr=found;document.getElementById('resultsArea').innerHTML=arr.map(p=>`<article class="card partner"><div class="partner-logo" aria-hidden="true">${p.icon}</div><div class="partner-info"><h3>${p.name}</h3><p>${p.type} · ${p.region}</p><div class="partner-tags"><span class="tag">${p.area}</span>${p.resources.slice(0,2).map(x=>`<span class="tag">${x}</span>`).join('')}</div></div><button class="btn btn-outline" onclick="openPartner(${p.id})">Ver perfil</button></article>`).join('');document.getElementById('resultCount').textContent=arr.length===1?'1 parceiro encontrado':`${arr.length} parceiros encontrados`;document.getElementById('resultsArea').classList.toggle('hidden',arr.length===0);document.getElementById('emptyArea').classList.toggle('hidden',arr.length!==0);}
function resetFilters(){['searchArea','searchRegion','searchResource'].forEach(id=>document.getElementById(id).value='');renderResults();}
function openPartner(id){selectedPartner=partners.find(p=>p.id===id);document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><article class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-head"><div><div class="eyebrow">Perfil do parceiro</div><h2 id="modalTitle" class="modal-title">${selectedPartner.name}</h2></div><button class="icon-btn" onclick="closeModal()" aria-label="Fechar">×</button></div><p class="muted">${selectedPartner.description}</p><div class="partner-tags"><span class="tag">${selectedPartner.type}</span><span class="tag">${selectedPartner.area}</span><span class="tag">${selectedPartner.region}</span>${selectedPartner.resources.map(x=>`<span class="tag">${x}</span>`).join('')}</div><div class="notice modal-notice">Organização real apresentada como referência. As categorias de área e recursos deste perfil são usadas para demonstrar os filtros e não confirmam a disponibilidade atual de editais, recursos ou parcerias.</div><div class="actions"><button class="btn btn-outline" onclick="closeModal()">Voltar aos resultados</button><button class="btn btn-primary" onclick="closeModal();startRequestFromPartner()">Iniciar solicitação →</button></div></article></div>`;}
function closeModal(){document.getElementById('modalRoot').innerHTML='';}
function renderDocs(){
 document.getElementById('requestPartner').textContent=selectedPartner.name;
 document.getElementById('requestTitle').textContent=selectedRequestTitle;
 document.getElementById('docRows').innerHTML=docs.map(d=>{
  const stored=getUploads()[d.id];
  const label=d.optional?' (quando aplicável)':' *';
  return `<div class="check-row ${d.optional?'optional-doc':''}">
   <div class="check-main">
    <input type="checkbox" id="check-${d.id}" disabled ${stored?'checked':''} aria-hidden="true">
    <label for="file-${d.id}"><strong>${d.name}${label}</strong><small>${d.description}</small><small class="document-status-hint">${d.optional?'Condicional':'Obrigatório'}</small></label>
   </div>
   <div class="upload-control">
    <input class="upload-input" id="file-${d.id}" type="file" accept="${d.accept}" aria-label="Anexar ${d.name}" onchange="onDocChange('${d.id}',this)">
    <small class="upload-file-name" id="filename-${d.id}">${stored?stored.name:'Nenhum arquivo selecionado'}</small>
   </div>
  </div>`;
 }).join('');
 updateDocStatus();
}
function onDocChange(id,input){
 const file=input.files&&input.files[0];
 const msg=document.getElementById('docMessage');
 const d=docs.find(item=>item.id===id);
 if(!file){delete getUploads()[id];msg.innerHTML='';updateDocStatus();return;}
 const allowed=['application/pdf','image/png','image/jpeg'];
 const ext=file.name.split('.').pop().toLowerCase();
 if(!allowed.includes(file.type)&&!['pdf','png','jpg','jpeg'].includes(ext)){
  delete getUploads()[id];
  input.value='';
  const check=document.getElementById('check-'+id);if(check)check.checked=false;
  const nameLabel=document.getElementById('filename-'+id);if(nameLabel)nameLabel.textContent='Nenhum arquivo selecionado';
  msg.innerHTML='<div class="error" role="alert">Formato inválido. Envie PDF, PNG ou JPG para este item.</div>';
  updateDocStatus();
  return;
 }
 getUploads()[id]={name:file.name,type:file.type||ext};
 const check=document.getElementById('check-'+id);if(check)check.checked=true;
 const nameLabel=document.getElementById('filename-'+id);if(nameLabel)nameLabel.textContent=file.name;
 msg.innerHTML='';
 updateDocStatus();
}
function updateDocStatus(){
 const uploads=getUploads();
 const requiredCount=docs.filter(d=>!d.optional&&uploads[d.id]).length;
 const optionalCount=docs.filter(d=>d.optional&&uploads[d.id]).length;
 const ready=requiredCount===requiredDocCount;
 const label=ready?'Pronto para envio':`${requiredCount}/${requiredDocCount} obrigatórios anexados`;
 document.getElementById('docsStatus').textContent=label;
 document.getElementById('docsStatus').className='status '+(ready?'accepted':'pending');
 document.getElementById('sideStatusTitle').textContent=ready?'Documentação pronta':'Documentação pendente';
 document.getElementById('sideStatusText').textContent=ready?(optionalCount?'Todos os documentos obrigatórios foram anexados; o item condicional também foi incluído.':'Todos os documentos obrigatórios foram anexados. O ofício de emenda é opcional quando não se aplicar.'):`Faltam ${requiredDocCount-requiredCount} documento(s) obrigatório(s). O ofício de emenda parlamentar é condicional.`;
}
function submitDocs(){
 const uploads=getUploads();
 const missing=docs.filter(d=>!d.optional&&!uploads[d.id]);
 const msg=document.getElementById('docMessage');
 if(missing.length){
  msg.innerHTML=`<div class="error" role="alert">Envio bloqueado. Anexe os ${missing.length} documento(s) obrigatório(s): ${missing.map(d=>d.name).join('; ')}. O ofício de emenda parlamentar é solicitado somente quando aplicável.</div>`;
  updateDocStatus();
  return;
 }
 msg.innerHTML='<div class="success" role="status">Documentação demonstrativa enviada. Os 7 documentos obrigatórios foram anexados'+(uploads['emenda-parlamentar']?' e o ofício de emenda parlamentar também foi incluído.':' e o ofício de emenda parlamentar foi dispensado por ser condicional.')+' O status foi atualizado nesta sessão; a notificação ao parceiro ainda é simulada.</div>';
 const req=userRequests.find(x=>x.id===selectedRequestId);
 if(req)req.status='Documentação enviada';
 document.getElementById('docsStatus').textContent='Documentação enviada';
 document.getElementById('docsStatus').className='status accepted';
 document.getElementById('sideStatusTitle').textContent='Documentação enviada';
 document.getElementById('sideStatusText').textContent='Aguardando análise do parceiro.';
 const currentStatus=document.getElementById('currentStatus');if(currentStatus)currentStatus.textContent='Documentação enviada';
 const statusBadge=document.getElementById('currentStatusBadge');if(statusBadge){statusBadge.textContent='Enviado';statusBadge.className='status accepted';}
 renderRequests();
}
setRole('OSC');renderResults();renderDashboard();renderDocs();renderRequests();renderNav();
