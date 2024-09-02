//datosjson[2] T=texto, C=Combo, VC=Valor combo, E=Edición

const datosjson = {
  "fases": ["Fases",['#','Fase','Acciones'],['T']],
  "vista_fichas": ["Fichas",['#','# ficha','Inicio','Final','Id_programa','Programa','Codigo','Acciones'],['T','T','T','C','VC']],
  "vista_actividad_proyecto": ["Actividades de proyecto",['#','Nombre','Id Fase','Fase','Acciones'],['E','C','VC']],
  "profesion": ["Profesiones",['#','Profesión','Acciones'],['T']],
  "postgrado": ["Postgrados",['#','Postgrado','Titulo','Acciones'],['T','L']],
  "programa": ["Programas",['#','Código','Programa','Acciones'],['T','T']],
  "competencias": ["Competencias",['#','Código','Competencia','Perfil','Acciones'],['T','E','E']],
  "vista_instructores": ["Instructores",['#','Numid','Nombres','Correo','Perfil','Id','Profesión','Id','Postgrado','Acciones'],['T','T','T','E','C','CV','C','CV']],
  "vista_rap": ["Resultados de aprendizaje",['#','Código','Rap','Horas','H.otras','Conceptos','Id_comp','Cómpetencia','Perfil','Acciones'],['T','E','T','T','E','C']],
  "vista_planeacion": ["Planeación",['#','Id','Programa','Id','Actividad de proyecto','Fase','Competencia','Id','Rap','Actividad aprendizaje','Acciones']],
  "vista_programacion": ["Programación",['#','Programa','Ficha','Fase','Actividad de proyecto','Competencia','Rap','Actividad aprendizaje','Instructor','Estado','Acciones']]
}


 
const Tablas_select={
  //[tabla],[Campo a mostrar en el select][2° Campo a mostrar 0 si no aplica][Etiqueta o titulo a mostrar]
  "vista_actividad_proyecto":[['fases'],[1],[0],['Fase']],
  "vista_instructores":[['profesion','postgrado'],[1,1],[0,2],['Profesion','Postgrado']],
  "vista_fichas": [['programa'],[2],[0],['Programa']],
  "vista_rap": [['competencias'],[2],[0],['Competencia']]
}

function leerVariables(vari) {
  q=window.location.search.substring(1);
  //console.log("url",q)
   var v = q.split("&");
  //console.log(v);
   for (var i=0; i < v.length; i++) {
       var p = v[i].split("="); 
       if (p[0] == vari) {
           return p[1];
       }
   }
   return false;
 }

function leerParametro(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function consulta_general(variable){
    document.getElementById('titulo').innerHTML=datosjson[variable][0]
    let url = "http://127.0.0.1:5000/consulta_general/"+variable;
              fetch(url)
                  .then( response => response.json())
                  .then( data => visualizar(data) )
                  .catch( error => console.log(error) )
              const visualizar = (data) => {
                  console.log(data.datos)
                  console.log(data.datos.length)
                  let b = "";
                  for (var i = 0; i < data.datos.length; i++) { 
                     //console.log(i,data.datos[i][0])
                     //console.log(i,data.datos[i][1]) 
                     b+=`<tr>`
                     for (var j=0;j<data.datos[i].length; j++){  
                     b+=`<td>${data.datos[i][j]}</td>`        
                     }
                     b+=`<td><button type='button' class="btn btn-info" onclick="location.href = 'edit.html?variable1=${variable}&variable2=${data.datos[i][0]}'"> <img src='/static/img/edit.png' height ='30' width='30'/></button>
                     <button type='button' class="btn btn-warning" onclick="eliminar(${data.datos[i][0]})"> <img src='/static/img/delete.png' height ='30' width='30'/></button></td></tr>`    
                    }
                    b2="";
                     for (var k=0;k<datosjson[variable][1].length;k++)
                          {
                            b2+=`<th scope="col">${datosjson[variable][1][k]}</th>`
                          }
                    
                  document.getElementById('data').innerHTML = b;
                  document.getElementById('contextos').innerHTML = b2;     
                      
        /* Initialization of datatables */ 
        $(document).ready(function () { 
            $('#table_id').DataTable(); 
        }); 
                        }          
}

function eliminar(id){
 let url = "http://127.0.0.1:5000/eliminar/"+id;
 fetch(url, {
  method: 'DELETE',
})
.then( response => response.json() )
.then(res => visualizar(res) )
const visualizar = (res) => {
    swal("Mensaje", "Registro "+ res.mensaje+" exitosamente", "success").then(() => {
        swal(window.location.reload());
      });
}
}

function registrar(){
    let url = "http://127.0.0.1:5000/registro/";
    plat=document.getElementById("plataforma").value
    usua=document.getElementById("usuario").value
    clav=document.getElementById("clave").value
var data = { "plataforma": plat,
             "usuario":usua,
             "clave":clav
 };
 console.log(data)
fetch(url, {
  method: "POST", // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .catch((error) => console.error("Error:", error))
  .then((response) => visualizar(response));
  const visualizar = (response) => {
    console.log("Success:", response)
    if (response.mensaje=="Error")
        swal("Mensaje", "Error en el registro", "error")
    else
        swal("Mensaje", "Registro agregado exitosamente", "success")
}
}

function consulta_individual(tabla,codigo){
 //console.log(id,variable)
document.getElementById('titulo2').innerHTML="Editar "+datosjson[tabla][0]
let url = "http://127.0.0.1:5000/consulta_individual/"+tabla+"/"+codigo;
fetch(url)
  .then( response => response.json())
  .then( data => visualizar(data) )
  .catch( error => console.log(error) )
  
const visualizar = (data => {
  console.log(data)
  contador_Tablas_select=0
  l=datosjson[tabla][1].length-2
    col="col-md-6"
  if (l<6 && l%2!=0)
    col="col-md-12";
    document.getElementById('contenido_edit').innerHTML="";
    clase="form-select form-select-md selectpicker";
        for (var k=1;k<datosjson[tabla][1].length-1;k++)
            {
            elemento="E"+k;
            seleccion=data.datos[k];
            if (datosjson[tabla][2][k-1]=='T') {         
              elemento="E"+k;
              c=`<div class=${col}>
                    <label for=${elemento}+ class="col-form-label">${datosjson[tabla][1][k]}</label>
                    <input type="text" id=${elemento} class="form-control" value='${data.datos[k]}'>
                  </div>` 
                  document.getElementById('contenido_edit').innerHTML += c;                              
              }

              if (datosjson[tabla][2][k-1]=='E') {         
                elemento="E"+k;
                c=`<div class=${col}>
                      <label for=${elemento}+ class="col-form-label">${datosjson[tabla][1][k]}</label>
                      <textarea class="form-control" id=${elemento} rows="3">${data.datos[k]}</textarea>
                      </div>` 
                    document.getElementById('contenido_edit').innerHTML += c;                              
                }

                if (datosjson[tabla][2][k-1]=='L') {         
                  //c=`<div class=${col}><label for=${elemento}+ class="col-form-label">${datosjson[tabla][1][k]}</label>`
                  //document.getElementById('contenido_edit').innerHTML +=c
                  campo=datosjson[tabla][1][k]
                  clase="selectpicker";
                  lista_enum(campo,elemento,clase,seleccion,col)             
                  }

            if (datosjson[tabla][2][k-1]=='C') { 
              tabla_buscada=Tablas_select[tabla][0][contador_Tablas_select];
              valor=Tablas_select[tabla][1][contador_Tablas_select];
              valor2=Tablas_select[tabla][2][contador_Tablas_select];
              valor3=Tablas_select[tabla][3][contador_Tablas_select];
              console.log( tabla_buscada, valor)
              combo(tabla_buscada,elemento,clase,valor,valor2,valor3,seleccion,datosjson[tabla][1][k],col)
             //document.getElementById('contenido_edit').innerHTML +=`</div>` 
                    k++;
                    contador_Tablas_select++;
            }                          
            }
    } )
        }   
                         
function modificar(id){
  let url = "http://127.0.0.1:5000/actualizar/"+id;
  plat=document.getElementById("plataforma").value
  usua=document.getElementById("usuario").value
  clav=document.getElementById("clave").value
var data = { "plataforma": plat,
           "usuario":usua,
           "clave":clav
};
console.log(data)
fetch(url, {
method: "PUT", // or 'PUT'
body: JSON.stringify(data), // data can be `string` or {object}!
headers: {
  "Content-Type": "application/json",
},
})
.then((res) => res.json())
.catch((error) => console.error("Error:", error))
.then((response) => visualizar(response));
const visualizar = (response) => {
  console.log("Success:", response)
  if (response.mensaje=="Error")
      swal("Mensaje", "Error en el registro", "error")
  else
      swal("Mensaje", "Registro actualizado exitosamente", "success")
}
}

function combo(tabla,elemento,clase,valor,valor2,valor3,seleccion,campo,col){
  /*combo(tabla,id del elemento,clase bootstrap,valor a mostrar,segundo valor a mostrar,titulo etiqueta,valor predeterminado), Titulo*/
  let url = "http://127.0.0.1:5000/consulta_general/"+tabla;
            fetch(url)
                .then( response => response.json())
                .then( data => visualizar(data) )
                .catch( error => console.log(error) )
            const visualizar = (data => {
                console.log(data.datos)   
                var cadena=`<div class=${col}> <label for=${elemento} class="col-form-label">${valor3}</label>`          
                cadena+=`<select id=${elemento} class='${clase}'>`;
                    for (var i = 0; i < data.datos.length; i++) { 
                    s=""       
                      if (seleccion== data.datos[i][0])
                          s="selected"  
                      if (valor2==0)
                         v=data.datos[i][valor]
                      else
                         v=data.datos[i][valor]+" - "+data.datos[i][valor2]
                         
                          cadena+=`<option ${s} value=${data.datos[i][0]}>${v}</option>`;
                          }
                    cadena+=`</select></div>`;
                   document.getElementById('contenido_edit').innerHTML +=cadena;
                   console.log(cadena)
                } )
                      }   
                      
// function lista_enum(campo,elemento,clase,seleccion,col){
//   /*combo(campo,id del elemento,clase bootstrap,valor predeterminado)*/ 
//             var cadena=`<div class='${col}'><label for=${elemento} class="col-form-label">${campo}</label>`             
//             cadena+=`<select id=${elemento} class='${clase}' data-show-subtext="true" data-live-search="true">`;
//               for (var i = 0; i < Listas[campo].length; i++) { 
//               s=""       
//                 if (seleccion== Listas[campo][i])
//                     s="selected"  
//                     cadena+=`<option ${s} value='${Listas[campo][i]}'>${Listas[campo][i]}</option>`;
//                     }
//               cadena+=`</select></div>`;
//               document.getElementById('contenido_edit').innerHTML+=cadena;
//               console.log(cadena)
//                 }  
                         
// function encriptar(cadena) {
//   const msgBuffer = new TextEncoder().encode(cadena); // Codifica la cadena a utf-8
//   const hashBuffer = crypto.subtle.digest("SHA-256", msgBuffer); // Genera el hash SHA-256 del buffer de mensajes
//   const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convierte el hash buffer en un array de bytes
//  return hashArray;
// }

// function desencriptar(cadena) {
//   const hashArray = Array.from(new Uint8Array(cadena)); // Convierte el hash buffer en un array de bytes
//   const hashBuffer = crypto.subtle.digest("SHA-256", msgBuffer); // Genera el hash SHA-256 del buffer de mensajes
//   const msgBuffer = new TextEncoder().encode(cadena); // Codifica la cadena a utf-8
//   return msgBuffer;
// }














