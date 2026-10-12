// Preflight for local source datasets. Never infer station location from a filename.
// Run this before importing weather data into a production-facing database.
const fs=require('fs');
const path=require('path');
const XLSX=require('xlsx');
const sources=[
  {file:'Bhandara.xlsx',known:'Maruteru',region:'West Godavari'},
  {file:'Raigad.xlsx',known:'Ludhiana',region:'Punjab'},
  {file:'Ratnagiri.xlsx',known:'Cuttak',region:'Odisha'}
];
const required=['observation_year','standard_week','pest_value','collection_type','maxt','mint','rh1___','rh2___','rf_mm_','ws_kmph_','ssh_hrs_','evp_mm_','pest_name','location'];
let errors=0;
const csv=path.join(__dirname,'pest data.csv');
if(!fs.existsSync(csv)) { console.error('MISSING: pest data.csv'); errors++; }
else {
  const first=fs.readFileSync(csv,'utf8').split(/\r?\n/,1)[0].replace(/^\uFEFF/,'');
  const columns=first.split(',').map(x=>x.trim());
  const missing=required.filter(c=>!columns.includes(c));
  if(missing.length) { console.error('CSV column mismatch:',missing.join(', ')); errors++; }
  else console.log('OK: required CSV columns exist (coded locations are NOT verified labels)');
}
for(const item of sources){
 const p=path.join(__dirname,item.file);
 if(!fs.existsSync(p)){console.error('MISSING:',item.file);errors++;continue;}
 try {
   const workbook=XLSX.readFile(p,{sheetRows:15});
   const raw=workbook.SheetNames.map(n=>XLSX.utils.sheet_to_json(workbook.Sheets[n],{header:1,defval:''}).slice(0,15).flat().join(' ')).join(' ');
   const found=raw.toLowerCase().includes(item.known.toLowerCase()) || raw.toLowerCase().includes(item.region.toLowerCase());
   console.log(item.file+': '+(found?'metadata references '+item.known+' / '+item.region:'station identity not confirmed from first rows'));
   if(found && process.env.ALLOW_UNVERIFIED_STATIONS!=='1'){
     console.error('BLOCKED: '+item.file+' is named for a Maharashtra district but metadata references '+item.known+'.');
     errors++;
   }
 }catch(e){console.error('Cannot inspect '+item.file+': '+e.message);errors++;}
}
if(errors){
 console.error('Data validation failed with '+errors+' issue(s). Keep original names as source filenames, not geographic claims.');
 console.error('To import intentionally after reviewing metadata, set ALLOW_UNVERIFIED_STATIONS=1.');
 process.exit(1);
}
console.log('Preflight passed. This does not verify encoded pest/location mappings.');
