//returns true if date1 occurs later than date2
function compareDates(date1, date2){

    // console.log('Inside func..'+date1+" "+date2);
    y1 = date1.slice(0,4);
    y2 = date2.slice(0,4);
    // console.log(y1,y2);
    if(y1>y2){return true;}
    if(y1<y2){return false;}
  
    m1 = date1.slice(5,7);
    m2 = date2.slice(5,7);
    // console.log(m1,m2);
    if(m1>m2){return true;}
    if(m1<m2){return false;}
  
    d1 = date1.slice(8,10);
    d2 = date2.slice(8,10);
    // console.log(d1,d2);
    if(d1>=d2){return true;}
    if(d1<d2){return false;}
  }

function compareDatesV2(date1, date2) {

  // console.log('Inside func..'+date1+" "+date2);
  y1 = date1.slice(0, 4);
  y2 = date2.slice(0, 4);
  // console.log(y1,y2);
  if (y1 > y2) { return true; }
  if (y1 < y2) { return false; }

  m1 = date1.slice(5, 7);
  m2 = date2.slice(5, 7);
  // console.log(m1,m2);
  if (m1 > m2) { return true; }
  if (m1 < m2) { return false; }

  d1 = date1.slice(8, 10);
  d2 = date2.slice(8, 10);
  // console.log(d1,d2);
  if (d1 > d2) { return true; }
  if (d1 < d2) { return false; }
}

module.exports = { compareDates: compareDates, compareDatesV2: compareDatesV2};