//datosjson[2] T=texto, C=Combo, VC=Valor combo, E=Edición, TD=TEXTO DISABLED, ED=EDICION DISABLED
var ingreso=0
var rec=0;
var tamaño=[];

//*****************************
var idioma=
            {
                "sProcessing":     "Procesando...",
                "sLengthMenu":     "Mostrar _MENU_ registros",
                "sZeroRecords":    "No se encontraron resultados",
                "sEmptyTable":     "No hay datos disponibles",
                "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":    "",
                "sSearch":         "Buscar:",
                "sUrl":            "",
                "sInfoThousands":  ",",
                "sLoadingRecords": "Cargando...",
                /* "oPaginate": {
                    "sFirst":    "Primero",
                    "sLast":     "Ultimo",
                    "sNext":     "Siguiente",
                    "sPrevious": "Anterior"
                }, */
                "oAria": {
                    "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                },
                "buttons": {
                    "copyTitle": 'Información copiada',
                    "copyKeys": 'Use your keyboard or menu to select the copy command',
                    "copySuccess": {
                        "_": '%d filas copiadas al portapapeles',
                        "1": '1 fila copiada al portapapeles'
                    },

                    "pageLength": {
                    "_": "Mostrar %d filas",
                    "-1": "Mostrar Todo"
                    }
                }
            };

const datosjson = {
  "fases": ["Fases",['#','Fase','Editar','Eliminar'],['T']],
  "vista_fichas": ["Fichas",['#','# ficha','Inicio','Final','Id_programa','Programa','Codigo','Editar','Eliminar'],['T','T','T','C','VC']],
  "vista_actividad_proyecto": ["Actividades de proyecto",['#','Nombre','Id Fase','Fase','Editar','Eliminar'],['E','C','VC']],
  "profesion": ["Profesiones",['#','Profesión','Editar','Eliminar'],['T']],
  "postgrado": ["Postgrados",['#','Postgrado','Titulo','Editar','Eliminar'],['T','L']],
  "programa": ["Programas",['#','Código','Programa','Editar','Eliminar'],['T','T']],
  "competencias": ["Competencias",['#','Código','Competencia','Perfil','Editar','Eliminar'],['T','E','E']],
  "vista_instructores": ["Instructores",['#','Numid','Nombres','Correo','Perfil','Id','Profesión','Id','Postgrado','Editar','Eliminar'],['T','T','EM','E','C','VC','C','VC']],
  "vista_rap": ["Resultados de aprendizaje",['#','Código','Rap','Horas','H.otras','Conceptos','Id_comp','Cómpetencia','Perfil','Editar','Eliminar'],['T','E','T','T','E','C']],
  "vista_planeacion": ["Planeación",['#','Id','Programa','Id','Actividad de proyecto','Fase','Competencia','Id','Rap','Actividad aprendizaje','Editar','Eliminar'],['C','VC','C','VC','VC','VC','C','VC','E']],
  "vista_programacion": ["Programación",['#','Programa','Id','Ficha','Fase','Actividad de proyecto','Competencia','Rap','Actividad aprendizaje','Id','Instructor','Estado','Ip','Editar','Eliminar'],['TD','C','CV','TD','ED','ED','ED','ED','C','CV','L','ESP']]
}

const Tablas_select={
  //[tabla],[Campo a mostrar en el select][2° Campo a mostrar 0 si no aplica][Etiqueta o titulo a mostrar]
  "vista_actividad_proyecto":[['fases'],[1],[0],['Fase']],
  "vista_instructores":[['profesion','postgrado'],[1,1],[0,2],['Profesion','Postgrado']],
  "vista_fichas": [['programa'],[2],[0],['Programa']],
  "vista_rap": [['competencias'],[2],[0],['Competencia']],
  "vista_planeacion": [['programa','vista_actividad_proyecto','Rap'],[2,1,3],[0,3,4],['Programa','Actividad de proyecto','Resultado de aprendizaje']],
  "vista_programacion":[['vista_fichas','instructores'],[1,2],[5,5],['Ficha','Instructor']]
}

//Objeto para usar listas predeterminadas
const Listas={
  "Titulo":['DOCTORADO','ESPECIALIZACION','ESPECIALIZACION TECNOLOGICA','MAESTRIA'],
  "Estado":['CALIFICADO','EN EJECUCION','PENDIENTE','SIN CALIFICAR']
}

//Columnas a modificar o insertar por tablas
const columnas={
  //tabla de la vista,columnas a actualizar,tabla a actualizar
  "fases":[['fase'],"fases"],
  "vista_actividad_proyecto":[['ap_nombre','ap_fase'],"actividad_proyecto"],
  "vista_fichas":[['ficha_nombre','ficha_inicio','ficha_finalizacion','ficha_programa'],"fichas"],
  "profesion":[['profesion_nombre'],"profesion"],
  "postgrado":[['postgrado_nombre',"postgrado_titulo"],"postgrado"],
  "vista_instructores":[['instructor_numid','instructor_nombres','instructor_correo','instructor_perfil','instructor_profesion','instructor_especialidad'],"instructores"],
  "programa":[['programa_codigo','programa_nombre'],"programa"],
  "competencias":[['competencia_codigo','competencia_nombre','competencia_perfil'],"competencias"],
  "vista_rap":[['rap_codigo','rap_nombre','rap_horas_directas','rap_horas_otras','rap_conceptos','rap_competencia'],"rap"],
  "vista_planeacion":[['planeacion_programa','planeacion_ap','planeacion_rap','planeacion_aa'],"planeacion"],
  "vista_programacion":[['prog_ficha','prog_instructor','prog_estado','prog_planeacion'],'programacion']
}

function leerVariables(vari) {
  q=window.location.search.substring(1);
  //print(nombres," ",apellido)
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
                  //console.log(data.datos.length)
                  let b = "";
                  if (variable=='vista_programacion'){
                    document.getElementById('data').setAttribute("style", " font-size: 10px;");
                    document.getElementById('contextos').setAttribute("style", " font-size: 10px;");
                  }else
                   document.getElementById('data').setAttribute("style", " font-size: 12px;");
                  
                  for (var i = 0; i < data.datos.length; i++) { 
                     
                     //console.log(i,data.datos[i][0])
                     //console.log(i,data.datos[i][1]) 
                     b+=`<tr>`
                     for (var j=0;j<data.datos[i].length; j++){  
                     b+=`<td>${data.datos[i][j]}</td>`;      
                     }
                     b+=`<td><button type='button' class="btn btn-info" onclick="location.href = 'edit.html?variable1=${variable}&variable2=${data.datos[i][0]}'"> <img src='/static/img/edit.png' height ='20' width='20'/></button></td>
                     <td><button type='button' class="btn btn-warning" onclick="eliminar('${variable}',${data.datos[i][0]})"> <img src='/static/img/delete.png' height ='20' width='20'/></button></td></tr>`    
                    }
                    b2="";
                     for (var k=0;k<datosjson[variable][1].length;k++)
                          {
                            b2+=`<th scope="col">${datosjson[variable][1][k]}</th>`;
                            if (k<(datosjson[variable][1].length-2))
                              tamaño.push(k);  
                          }
                    
                  document.getElementById('data').innerHTML = b;
                  document.getElementById('contextos').innerHTML = b2;     
                      
       /* Initialization of datatables */ 
      //   $(document).ready(function () { 
      //       $('#table_id').DataTable(
      //       {
      //               layout: {
      //                 topStart: {
      //                    buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
      //                },
                     
      //                 extend:    'pageLength',
      //                 titleAttr: 'Registros a mostrar',
      //                 className: 'selectTable'
      //             }  
      //        }
      //       ); 
      // });  
        $( document ).ready(function() {
        $('#table_id').DataTable({
          "language": idioma,
          autoWidth: false,
    "lengthMenu": [[10,20,50, -1],[10,20,50,"Mostrar Todo"]],
    dom: 'Bfrt<"col-md-6 inline"i> <"col-md-6 inline"p>',
    columnDefs:[{
      className: "text-center",
      targets: "_all",
      sortable: true
  }],
    buttons: {
          dom: {
            container:{
              tag:'div',
              className:'flexcontent'
            },
            buttonLiner: {
              tag: null
            }
          },
          buttons: [
                    {
                        extend:    'copyHtml5',
                        text:      '<i class="fa fa-clipboard"></i>Copiar',
                        title:datosjson[variable][0],
                        titleAttr: 'Copiar',
                        className: 'btn btn-app export',
                        exportOptions: {columns: tamaño },
                    },
                    {
                        extend:    'pdfHtml5',
                        title:datosjson[variable][0],
                        orientation: 'landscape',
                        text:      '<i class="bi bi-file-earmark-pdf"></i>PDF',
                        titleAttr: 'PDF',
                        className: 'btn btn-app export pdf',
                        exportOptions: {columns: tamaño },
                    },
                    {
                        extend:    'excelHtml5',
                        title:datosjson[variable][0],
                        text:      '<i class="fa fa-file-excel-o"></i>Excel',
                        titleAttr: 'Excel',
                        className: 'btn btn-app export excel',
                        exportOptions: {columns: tamaño },
                    },
                    {
                        extend:    'csvHtml5',
                        title:datosjson[variable][0],
                        text:      '<i class="fa fa-file-text-o"></i>CSV',
                        titleAttr: 'CSV',
                        className: 'btn btn-app export csv',
                        exportOptions: {columns: tamaño },
                    },
                    {
                        extend:    'print',
                        title:datosjson[variable][0],
                        text:      '<i class="fa fa-print"></i>Print',
                        titleAttr: 'Print',
                        className: 'btn btn-app export imprimir',
                        exportOptions: {columns: tamaño },
                    },
                    {
                        extend:    'pageLength',
                        titleAttr: 'Registros a mostrar',
                        className: 'selectTable'
                    }
                ]
        }
    });
} );                        }          
}

function eliminar(table,codigo){
  swal({
    title: "¿Estas seguro de borrar el registro?",
    text: "Una vez eliminado no podras recuperarlo",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((borrar) => {
    if (borrar) {
      tabla_buscar=columnas[table][1];
      let url = "http://127.0.0.1:5000/eliminar/"+tabla_buscar+"/"+codigo;
      fetch(url, {
        method: 'DELETE',
      })
      .then( response => response.json() )
      .then(res => visualizar(res) )
      const visualizar = (res) => {
          if (res.mensaje!="Error")
            swal("Mensaje", "Registro eliminado exitosamente","success").then(() => {
                swal(window.location.reload());
              });
          else
            swal("Error en la eliminación","Verifique que no sea un registro padre o principal ", "error").then(() => {
              swal(window.location.reload());
            });      
      }
    } else {
      swal("Se ha cancelado la acción");
    }
  });
}

/* Inserción o registro de la información individual en tablas*/
function registrar(table){
  tabla_buscar=columnas[table][1]
  let url = "http://127.0.0.1:5000/registro/"+tabla_buscar;
  var data= {};
  for (var k=0;k<columnas[table][0].length;k++)
                          {
                          j=k+1
                          valor=document.getElementById('E'+j).value; 
                          console.log(valor)
                          clave=columnas[table][0][k]
                          data[clave]=valor;
                          }
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
  contadorle=0
  contador_elemento=0
  l=datosjson[tabla][1].length-3
    col="col-md-6"
  if (l<6 && l%2!=0)
    col="col-md-12";
    document.getElementById('contenido_edit').innerHTML="";
    clase="js-example-basic-single form-select form-select-md";
    //clase="js-example-basic-single";
        for (var k=1;k<datosjson[tabla][1].length-1;k++)
            {
            seleccion=data.datos[k];
            if (datosjson[tabla][2][k-1]=='T' || datosjson[tabla][2][k-1]=='TD' ) { 
              ro="";
              
              if (datosjson[tabla][2][k-1]=='TD') {
                ro="readonly";       
                elemento="D"+k;
              }
              else{
                contador_elemento+=1
              elemento="E"+contador_elemento;
              }
              c=`<div class=${col}>
                    <label for=${elemento} class="col-form-label">${datosjson[tabla][1][k]}</label>
                    <input type="text" id=${elemento} class="form-control" value='${data.datos[k]}' ${ro} required>
                  </div>` 
                  document.getElementById('contenido_edit').innerHTML += c;                              
              }

              if (datosjson[tabla][2][k-1]=='E' || datosjson[tabla][2][k-1]=='ED' ) {         
                ro="";
                if (datosjson[tabla][2][k-1]=='ED') {
                  ro="readonly";
                  elemento="D"+k;}
                  else{
                    contador_elemento+=1
                  elemento="E"+contador_elemento;
                  }
                c=`<div class=${col}>
                      <label for=${elemento}+ class="col-form-label">${datosjson[tabla][1][k]}</label>
                      <textarea required class="form-control" id=${elemento} rows="3" ${ro}>${data.datos[k]}</textarea>
                      </div>` 
                    document.getElementById('contenido_edit').innerHTML += c;                              
                }

            if (datosjson[tabla][2][k-1]=='C') {
              contador_elemento+=1
              elemento="E"+contador_elemento; 
              tabla_buscada=Tablas_select[tabla][0][contador_Tablas_select];
              valor=Tablas_select[tabla][1][contador_Tablas_select];
              valor2=Tablas_select[tabla][2][contador_Tablas_select];
              valor3=Tablas_select[tabla][3][contador_Tablas_select];
              //console.log( tabla_buscada, valor)
              console.log(tabla_buscada,elemento)
              combo(tabla_buscada,elemento,clase,valor,valor2,valor3,seleccion,col)
             //document.getElementById('contenido_edit').innerHTML +=`</div>` 
                    k++;
                    contador_Tablas_select++;
            }   
            
            if (datosjson[tabla][2][k-1]=='L') { 
              contador_elemento+=1
              elemento="E"+contador_elemento;
              contadorle+=1        
              campo=datosjson[tabla][1][k]
              lista_enum(campo,elemento,clase,seleccion,col)             
              }

              if (datosjson[tabla][2][k-1]=='ESP') { 
                contador_elemento+=1
                elemento="E"+contador_elemento;
                c=`<div class=${col}>
                      <label for=${elemento} class="col-form-label">${datosjson[tabla][1][k]}</label>
                      <input type="text" id=${elemento} class="form-control" value='${data.datos[k]}' readonly>
                    </div>` 
                    document.getElementById('contenido_edit').innerHTML += c;                              
                }
                if (datosjson[tabla][2][k-1]=='EM') { 
                    contador_elemento+=1
                  elemento="E"+contador_elemento;
                  c=`<div class=${col}>
                        <label for=${elemento} class="col-form-label">${datosjson[tabla][1][k]}</label>
                        <input type="email" id=${elemento} class="form-control" value='${data.datos[k]}' required>
                      </div>` 
                      document.getElementById('contenido_edit').innerHTML += c;                              
                  }    
            }
    } )
        }   
                         
function modificar(table,id){
  tabla_buscar=columnas[table][1]
  let url = "http://127.0.0.1:5000/actualizar/"+tabla_buscar+"/"+id;
var data= {};
  for (var k=0;k<columnas[table][0].length;k++)
                          {
                          j=k+1
                          valor=document.getElementById('E'+j).value; 
                          console.log(valor)
                          clave=columnas[table][0][k]
                          data[clave]=valor;
                          }

//console.log(data)
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

function combo(tabla,elemento,clase,valor,valor2,valor3,seleccion,col){
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
                         
                          cadena+=`<option ${s} value='${data.datos[i][0]}'>${v}</option>`;
                          }
                    cadena+=`</select></div>`;
                   document.getElementById('contenido_edit').innerHTML +=cadena;
                   //console.log(cadena)
                   ingreso+=1;
                 // console.log(ingreso," - ",contador_Tablas_select)
                if (ingreso==contador_Tablas_select+contadorle){
                   $(document).ready(function() {
                    $('.js-example-basic-single').select2();
                });
              }    
                } )
                      }   
                      
function lista_enum(campo,elemento,clase,seleccion,col){
 // console.log(campo)
  /*combo(campo,id del elemento,clase bootstrap,valor predeterminado)*/ 
            var cadena=`<div class='${col}'><label for=${elemento} class="col-form-label">${campo}</label>`             
            cadena+=`<select id=${elemento} class='${clase}'>`;
              for (var i = 0; i < Listas[campo].length; i++) { 
              s=""       
                if (seleccion== Listas[campo][i])
                    s="selected"  
                    cadena+=`<option ${s} value='${Listas[campo][i]}'>${Listas[campo][i]}</option>`;
                    }
              cadena+=`</select></div>`;
              document.getElementById('contenido_edit').innerHTML+=cadena;
              //console.log(cadena)
              ingreso+=1
             // console.log(ingreso," - ",contador_Tablas_select+contadorle)
              if (ingreso==contador_Tablas_select+contadorle){
              $(document).ready(function() {
                $('.js-example-basic-single').select2();
            });
          }
                }  

function vista_registro(tabla){
  //console.log(id,variable)
  document.getElementById('titulo2').innerHTML="Registrar "+datosjson[tabla][0]
    contador_Tablas_select=0
    contadorle=0
    contador_elemento=0
    l=datosjson[tabla][1].length-3
      col="col-md-6"
    if (l<6 && l%2!=0)
      col="col-md-12";
      document.getElementById('contenido_edit').innerHTML="";
      clase="js-example-basic-single form-select form-select-md";
      //clase="js-example-basic-single";
          for (var k=1;k<datosjson[tabla][1].length-1;k++)
              {
              seleccion="";
              if (datosjson[tabla][2][k-1]=='T' || datosjson[tabla][2][k-1]=='TD' ) { 
                ro="";
                if (datosjson[tabla][2][k-1]=='TD') {
                  ro="readonly";       
                  elemento="D"+k;
                }
                else{
                  contador_elemento+=1
                elemento="E"+contador_elemento;
                }
                c=`<div class=${col}>
                      <label for=${elemento} class="col-form-label">${datosjson[tabla][1][k]}</label>
                      <input type="text" id=${elemento} class="form-control" ${ro} required>
                    </div>` 
                    document.getElementById('contenido_edit').innerHTML += c;                              
                }
  
                if (datosjson[tabla][2][k-1]=='E' || datosjson[tabla][2][k-1]=='ED' ) {         
                  ro="";
                  if (datosjson[tabla][2][k-1]=='ED') {
                    ro="readonly";
                    elemento="D"+k;}
                    else{
                      contador_elemento+=1
                    elemento="E"+contador_elemento;
                    }
                  c=`<div class=${col}>
                        <label for=${elemento}+ class="col-form-label">${datosjson[tabla][1][k]}</label>
                        <textarea required class="form-control" id=${elemento} rows="3" ${ro}></textarea>
                        </div>` 
                      document.getElementById('contenido_edit').innerHTML += c;                              
                  }
  
              if (datosjson[tabla][2][k-1]=='C') {
                contador_elemento+=1
                elemento="E"+contador_elemento; 
                tabla_buscada=Tablas_select[tabla][0][contador_Tablas_select];
                valor=Tablas_select[tabla][1][contador_Tablas_select];
                valor2=Tablas_select[tabla][2][contador_Tablas_select];
                valor3=Tablas_select[tabla][3][contador_Tablas_select];
                //console.log( tabla_buscada, valor)
                console.log(tabla_buscada,elemento)
                combo(tabla_buscada,elemento,clase,valor,valor2,valor3,seleccion,col)
              //document.getElementById('contenido_edit').innerHTML +=`</div>` 
                      k++;
                      contador_Tablas_select++;
              }   
              
              if (datosjson[tabla][2][k-1]=='L') { 
                contador_elemento+=1
                elemento="E"+contador_elemento;
                contadorle+=1        
                campo=datosjson[tabla][1][k]
                lista_enum(campo,elemento,clase,seleccion,col)             
                }
  
                if (datosjson[tabla][2][k-1]=='ESP') { 
                  contador_elemento+=1
                  elemento="E"+contador_elemento;
                  c=`<div class=${col}>
                        <label for=${elemento} class="col-form-label">${datosjson[tabla][1][k]}</label>
                        <input type="text" id=${elemento} class="form-control" readonly>
                      </div>` 
                      document.getElementById('contenido_edit').innerHTML += c;                              
                  }
                  if (datosjson[tabla][2][k-1]=='EM') { 
                      contador_elemento+=1
                    elemento="E"+contador_elemento;
                    c=`<div class=${col}>
                          <label for=${elemento} class="col-form-label">${datosjson[tabla][1][k]}</label>
                          <input type="email" id=${elemento} class="form-control" required>
                        </div>` 
                        document.getElementById('contenido_edit').innerHTML += c;                              
                    }    
              }
      } 

      function consulta_avance(){
        const estados=[];
        const valores=[];
        //let miGraficoPie = null;
        ficha=document.getElementById('input1').value
        if (ficha==""){
          alert("Por favor digite una ficha");
        }
          else{
        let url = "http://127.0.0.1:5000//programacion_resumen/"+ficha;
                  fetch(url)
                      .then( response => response.json())
                      .then( data => visualizar(data) )
                      .catch( error => console.log(error) )
                  const visualizar = (data) => {
                    avance=data.datos;
                    console.log(avance)
                      for (var i = 0; i < avance.length; i++) { 
                        console.log(avance[i][2])
                        estados.push(avance[i][2]);
                        valores.push(avance[i][3]);
                      }
                  }
        const ctx = document.getElementById('miGraficoPie').getContext('2d');          
        // if (miGraficoPie !== null) {
        //   miGraficoPie.destroy();
        //  }
         
        miGraficoPie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: estados,
                datasets: [{
                    label: 'Estado de avance de la ficha',
                    data: valores,
                    backgroundColor: ['#33ff33', '#ffff33', '#3399ff','#ff5833'],
                    borderColor: ['#33ff33', '#ffff33', '#3399ff','#ff5833'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    datalabels: {
                        color: '#fff',
                        anchor: 'end',
                        align: 'start',
                        offset: -10,
                        borderWidth: 2,
                        borderColor: '#fff',
                        borderRadius: 25,
                        backgroundColor: (context) => context.dataset.backgroundColor,
                        font: {
                            weight: 'bold',
                            size: '16'
                        },
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = (value / total * 100).toFixed(1);
                            const label = context.chart.data.labels[context.dataIndex];
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
        miGraficoPie.destroy();
      }
      }

      