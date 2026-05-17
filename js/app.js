
let activeQuestions=[];
function loadQuiz(){
  const grade=document.getElementById('grade').value;
  const subject=document.getElementById('subject').value;
  activeQuestions=makeQuestions(grade,subject);
  const quiz=document.getElementById('quiz');
  quiz.innerHTML=activeQuestions.map((q,idx)=>`
    <div class="question">
      <h3>${idx+1}. ${q.q} <small>(${q.d})</small></h3>
      ${q.o.map((op,i)=>`<label class="option"><input type="radio" name="q${idx}" value="${i}"> ${op}</label>`).join('')}
    </div>
  `).join('')+`<button class="btn green" onclick="finishQuiz()">Жыйынтык чыгаруу</button>`;
}
async function finishQuiz(){
  const user=currentUser();
  const grade=document.getElementById('grade').value;
  const subject=document.getElementById('subject').value;
  let correct=0;
  activeQuestions.forEach((q,idx)=>{
    const selected=document.querySelector(`input[name="q${idx}"]:checked`);
    if(selected && Number(selected.value)===q.a) correct++;
  });
  const percent=Math.round(correct/activeQuestions.length*100);
  const item={uid:user.uid,fullname:user.fullname,email:user.email,grade,subject:subjects[subject],correct,total:activeQuestions.length,percent,date:new Date().toLocaleString()};
  if(firebaseReady){
    await firebase.firestore().collection('results').add({...item,createdAt:new Date().toISOString()});
  }else{
    const arr=JSON.parse(localStorage.getItem('smartResults')||'[]');
    arr.push(item); localStorage.setItem('smartResults',JSON.stringify(arr));
  }
  const res=document.getElementById('result');
  res.classList.remove('hidden');
  res.innerHTML=`<h2>Жыйынтык</h2><p><b>${user.fullname}</b>, сиз ${activeQuestions.length} суроонун ичинен <b>${correct}</b> туура жооп бердиңиз.</p><p>Балл: <b>${percent}%</b></p>`;
}
function startTimer(minutes){
  let time=minutes*60;
  const el=document.getElementById('timer');
  setInterval(()=>{ if(time<=0)return; time--; const m=String(Math.floor(time/60)).padStart(2,'0'); const s=String(time%60).padStart(2,'0'); el.textContent=`${m}:${s}`; },1000);
}
async function getResults(){
  if(firebaseReady){
    const snap=await firebase.firestore().collection('results').orderBy('createdAt','desc').get();
    return snap.docs.map(d=>d.data());
  }
  return JSON.parse(localStorage.getItem('smartResults')||'[]').reverse();
}
async function loadMonitoring(){
  const data=await getResults();
  window.smartResultsData=data;
  const body=document.getElementById('resultsBody');
  body.innerHTML=data.map((r,i)=>`<tr><td>${i+1}</td><td>${r.fullname}</td><td>${r.grade}</td><td>${r.subject}</td><td>${r.percent}%</td><td>${r.date||''}</td></tr>`).join('');
  document.getElementById('total').textContent=data.length;
  const avg=data.length?Math.round(data.reduce((a,b)=>a+Number(b.percent||0),0)/data.length):0;
  const max=data.length?Math.max(...data.map(r=>Number(r.percent||0))):0;
  document.getElementById('avg').textContent=avg+'%';
  document.getElementById('max').textContent=max+'%';
}
async function loadAdminStats(){
  let users=0, results=0;
  if(firebaseReady){
    users=(await firebase.firestore().collection('users').get()).size;
    results=(await firebase.firestore().collection('results').get()).size;
  }else{
    users=JSON.parse(localStorage.getItem('smartUsers')||'[]').length;
    results=JSON.parse(localStorage.getItem('smartResults')||'[]').length;
  }
  document.getElementById('usersCount').textContent=users;
  document.getElementById('resultsCount').textContent=results;
}
