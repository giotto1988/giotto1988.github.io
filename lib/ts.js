

//const math = require('mathjs')
//import * as math from 'mathjs';



function parse(qx, qy, qz, N1, N2, N3) {
  const reg = /(( )?(\+)?( )? )|\+/g
  let qxi = 0;
  let qxj = 0;
  let qxk = 0;
  let qyi = 0;
  let qyj = 0;
  let qyk = 0;
  let qzi = 0;
  let qzj = 0;
  let qzk = 0;

  let l1 = 0;
  let m1 = 0;
  let n1 = 0;
  let l2 = 0;
  let m2 = 0;
  let n2 = 0;
  let l3 = 0;
  let m3 = 0;
  let n3 = 0;

  const qx_a = qx.split(reg);
  const qy_a = qy.split(reg);
  const qz_a = qz.split(reg);

  const n1_a = N1.split(reg);
  const n2_a = N2.split(reg);
  const n3_a = N3.split(reg);

  const qx_r = parseInputAxis(qx_a)
  const qy_r = parseInputAxis(qy_a)
  const qz_r = parseInputAxis(qz_a)

  const n1_r = parseInputAxis(n1_a)
  const n2_r = parseInputAxis(n2_a)
  const n3_r = parseInputAxis(n3_a)


  let error = '';

  if (qx_r.error ) {
    const m = `Invalid qx input: ${Tx}`;
    error = m;    
    console.log(error);
  }

  if (qy_r.error ) {
    const m = `Invalid qy input: ${Ty}`;
    error = m;    
    console.log(error);
  }

  if (qz_r.error ) {
    const m = `Invalid qz input: ${Tz}`;
    error = m;    
    console.log(error);
  }

  if (n1_r.error ) {
    const m = `Invalid N1 input: ${N1}`;
    error = m;    
    console.log(error);
  }

  if (n2_r.error ) {
    const m = `Invalid N2 input: ${N2}`;
    error = m;    
    console.log(error);
  }

  if (n3_r.error ) {
    const m = `Invalid N3 input: ${N3}`;
    error = m;    
    console.log(error);
  }
  
  if (error) {
    return {error, input: {qx, qy, qz, N1, N2, N3}}
  }

  //if (error) {
  //  process.exit(1);
  //}

  qxi = qx_r.i;
  qxj = qx_r.j;
  qxk = qx_r.k;
  qyi = qy_r.i;
  qyj = qy_r.j;
  qyk = qy_r.k;
  qzi = qz_r.i;
  qzj = qz_r.j;
  qzk = qz_r.k;

  l1 = n1_r.i;
  m1 = n1_r.j;
  n1 = n1_r.k;
  l2 = n2_r.i;
  m2 = n2_r.j;
  n2 = n2_r.k;
  l3 = n3_r.i;
  m3 = n3_r.j;
  n3 = n3_r.k;

  const Q = points(qx_r,qy_r, qz_r,n1_r, n2_r, n3_r );

  const N1_unit_vector = unitVectorProff(l1,m1,n1)
  const N2_unit_vector = unitVectorProff(l2,m2,n2)
  const N3_unit_vector = unitVectorProff(l3,m3,n3)

  const tonlerance = .0001

  if (((N1_unit_vector ) < (1 - tonlerance) )|| ((N1_unit_vector ) > (1 + tonlerance) ) ) {
    error = `N1 is not an unique vector`;
  }
  if (((N2_unit_vector ) < (1 - tonlerance) )|| ((N2_unit_vector ) > (1 + tonlerance) ) ) {
    error = `N2 is not an unique vector`;
  }
  if (((N3_unit_vector ) < (1 - tonlerance) )|| ((N3_unit_vector ) > (1 + tonlerance) ) ) {
    error = `N3 is not an unique vector`;
  }


  

  const N12_perp_proof = perpendicularProof(l1, l2, m1, m2, n1, n2);
  const N13_perp_proof = perpendicularProof(l1, l3, m1, m3, n1, n3);
  const N23_perp_proof = perpendicularProof(l2, l3, m2, m3, n2, n3);

  if (((N12_perp_proof) < (0 - tonlerance) )|| ((N12_perp_proof ) > (0 + tonlerance) ) ) {
    error = `N1-N2 are not perpendicular`;
  }

  if (((N13_perp_proof) < (0 - tonlerance) )|| ((N13_perp_proof ) > (0 + tonlerance) ) ) {
    error = `N1-N3 are not perpendicular`;
  }

  if (((N23_perp_proof) < (0 - tonlerance) )|| ((N23_perp_proof ) > (0 + tonlerance) ) ) {
    error = `N2-N3 are not perpendicular`;
  }

  const rotValues = rotationRad(l1,m1,n1);

  console.log(Q)
  console.log(rotValues)
  console.log('done');

  return {T:Q, N1_unit_vector, N2_unit_vector,N3_unit_vector, N12_perp_proof,N13_perp_proof, N23_perp_proof,  rotValues, error , input: {
    qx, qy, qz, N1, N2, N3,
    qxi,
    qxj,
    qxk,
    qyi,
    qyj,
    qyk,
    qzi,
    qzj,
    qzk,
  }}
}




function points(Qx, Qy, Qz, N1, N2, N3 ) {
  
  let QX = {x: 0, y: 0, z: 0 };
  let QY = {x: 0, y: 0, z: 0 };
  let QZ = {x: 0, y: 0, z: 0 };

  {
    const i = (Qx.i*N1.i + Qy.i*N1.j + Qz.i*N1.k);
    const j = (Qx.j*N1.i + Qy.j*N1.j + Qz.j*N1.k);
    const k = (Qx.k*N1.i + Qy.k*N1.j + Qz.k*N1.k);

    const x = math.dot([i,j,k], [N1.i, N1.j, N1.k])
    const y = math.dot([i,j,k], [N2.i, N2.j, N2.k])
    const z = math.dot([i,j,k], [N3.i, N3.j, N3.k])

    QX = {x, y, z};
  }

  {
    const i = (Qx.i*N2.i + Qy.i*N2.j + Qz.i*N2.k);
    const j = (Qx.j*N2.i + Qy.j*N2.j + Qz.j*N2.k);
    const k = (Qx.k*N2.i + Qy.k*N2.j + Qz.k*N2.k);

    const x = math.dot([i,j,k], [N1.i, N1.j, N1.k])
    const y = math.dot([i,j,k], [N2.i, N2.j, N2.k])
    const z = math.dot([i,j,k], [N3.i, N3.j, N3.k])

    QY = {x, y, z};
  }

  {
    const i = (Qx.i*N3.i + Qy.i*N3.j + Qz.i*N3.k);
    const j = (Qx.j*N3.i + Qy.j*N3.j + Qz.j*N3.k);
    const k = (Qx.k*N3.i + Qy.k*N3.j + Qz.k*N3.k);

    const x = math.dot([i,j,k], [N1.i, N1.j, N1.k])
    const y = math.dot([i,j,k], [N2.i, N2.j, N2.k])
    const z = math.dot([i,j,k], [N3.i, N3.j, N3.k])

    QZ = {x, y, z};
  }

  return {QX, QY, QZ}
  
}


function parseInputAxis(strings) {
  const result = {i: 0, j: 0, k:0, error:null};

  if (!strings || strings.constructor !== Array) {
    result.error = "invalid input";
    return result;
  };


  strings.forEach(it => {
    try {      
      if (!it) return;
      it = it.trim();
      //if (it.match(/\b(-)?(sqrt\([0-9]{1,}\))?(\/)?[0-9]{1,}i\b/)) {
        if (it.match(/i/)) {
        return result.i = math.evaluate(it.replace('i', ''));
      }
      //if (it.match(/\b(-)?(sqrt\([0-9]{1,}\))?(\/)?[0-9]{1,}j\b/)) {
      if (it.match(/j/)) {
        return result.j = math.evaluate(it.replace('j', ''));
      }
      //if (it.match(/\b(-)?(sqrt\([0-9]{1,}\))?(\/)?[0-9]{1,}k\b/)) {
      if (it.match(/k/)) {
        return result.k = math.evaluate(it.replace('k', ''));
      }
    }
    catch(e) {
      result.error = `invalid input`;
    }
    
  })

  return result;

}

function unitVectorProff(l, m, n){
  return l*l+m*m+n*n;
}

function perpendicularProof (la, lb, ma, mb, n1, n2) {
  return la*lb+ma*mb+n1*n2
}

function rotationRad(l, m, n) {
  const result = {};
  result.alpha = math.evaluate(`acos(${l})`);
  result.beta = math.evaluate(`acos(${m})`);
  result.gamma = math.evaluate(`acos(${n})`);

  return result;
}


function testM(){
  
  const qx = `100i + 50j -50k`;
  const qy = `50i + 200j 0k`;
  const qz = `-50i 200k`;
  const N1 = `sqrt(3)/2i + 1/4j + sqrt(3)/4k`;
  const N2 = `-1/2i + sqrt(3)/4j + 3/4k`;
  const N3 = `-sqrt(3)/2j + 1/2k`;

  parse(qx,qy,qz, N1, N2, N3)

}

//testM();
