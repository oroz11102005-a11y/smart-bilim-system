
function showMsg(text){
  const el=document.getElementById('msg');
  if(el){el.textContent=text;el.classList.remove('hidden');}
}
function routeByRole(role){
  if(role==='student') location.href='student.html';
  else if(role==='teacher') location.href='teacher.html';
  else if(role==='admin') location.href='admin.html';
  else location.href='login.html';
}
async function register(){
  const fullname=document.getElementById('fullname').value.trim();
  const email=document.getElementById('email').value.trim();
  const password=document.getElementById('password').value;
  const role=document.getElementById('role').value;
  const grade=document.getElementById('grade').value;
  if(!fullname||!email||!password){showMsg('Бардык талааны толтуруңуз');return;}
  try{
    if(firebaseReady){
      const cred=await firebase.auth().createUserWithEmailAndPassword(email,password);
      await firebase.firestore().collection('users').doc(cred.user.uid).set({
        fullname,email,role,grade,createdAt:new Date().toISOString()
      });
      localStorage.setItem('smartUser',JSON.stringify({uid:cred.user.uid,fullname,email,role,grade}));
    }else{
      const uid='local_'+Date.now();
      const users=JSON.parse(localStorage.getItem('smartUsers')||'[]');
      users.push({uid,fullname,email,password,role,grade});
      localStorage.setItem('smartUsers',JSON.stringify(users));
      localStorage.setItem('smartUser',JSON.stringify({uid,fullname,email,role,grade}));
    }
    routeByRole(role);
  }catch(e){showMsg(e.message);}
}
async function login(){
  const email=document.getElementById('email').value.trim();
  const password=document.getElementById('password').value;
  try{
    if(firebaseReady){
      const cred=await firebase.auth().signInWithEmailAndPassword(email,password);
      const doc=await firebase.firestore().collection('users').doc(cred.user.uid).get();
      const user={uid:cred.user.uid,...doc.data()};
      localStorage.setItem('smartUser',JSON.stringify(user));
      routeByRole(user.role);
    }else{
      const users=JSON.parse(localStorage.getItem('smartUsers')||'[]');
      const user=users.find(u=>u.email===email&&u.password===password);
      if(!user) throw new Error('Email же пароль туура эмес');
      localStorage.setItem('smartUser',JSON.stringify(user));
      routeByRole(user.role);
    }
  }catch(e){showMsg(e.message);}
}
function currentUser(){return JSON.parse(localStorage.getItem('smartUser')||'null');}
function logout(){
  localStorage.removeItem('smartUser');
  if(firebaseReady) firebase.auth().signOut();
  location.href='login.html';
}
function protectPage(roles){
  const user=currentUser();
  if(!user){location.href='login.html';return;}
  if(!roles.includes(user.role)){routeByRole(user.role);}
}
