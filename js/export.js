
function downloadExcel(){
  const data=(window.smartResultsData||[]).map((r,i)=>({
    "№":i+1,
    "Окуучу":r.fullname,
    "Email":r.email,
    "Класс":r.grade,
    "Предмет":r.subject,
    "Туура жооп":r.correct,
    "Жалпы суроо":r.total,
    "Балл %":r.percent,
    "Дата":r.date
  }));
  const ws=XLSX.utils.json_to_sheet(data);
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Smart Bilim Results");
  XLSX.writeFile(wb,"smart_bilim_jyyyntyktar.xlsx");
}
