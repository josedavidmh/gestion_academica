var contador_combo_horario=0
var ingreso=0;
var cb;
clase="js-example-basic form-select form-select-md";

const bloques={
        "bloque":['Bloque A 06:00 - 09:00 am','Bloque B 09:00 - 12:00 am','Bloque C 01:00 - 04:00 pm','Bloque D 04:00 - 07:00 pm'],
        "idBloque":['A','B','C','D']
    }

const dias={
      "dia":['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES']
}

const column_horario={
             "claves":['horario_dia','horario_instructor','horario_fecha_inicio','horario_fecha_final','horario_ficha','horario_bloque','rap1','rap2','rap3','rap4']
}

function cargar_fichas(){
    var cb = document.getElementById("ficha");
    agregar_opcion('vista_fichas',"ficha",1,5,0,'NA')
    document.getElementById('ficha').options.item(0).selected = 'selected';
    document.getElementById("btnGuardar").disabled=true
}

document.addEventListener("DOMContentLoaded", function() {
    cargar_fichas();
    for(indice=0;indice<20;indice++)
        agregar_opcion('vista_instructores','instructor',2,4,indice,'NA')
 });
 
function horario(vficha,vstart,vend){ 
    if (vficha=='na'){
        swal("Mensaje","Por favor establesca un rango de fecha y seleccione una ficha para continuar", "warning")  
    }
    else{
    for(indice=0;indice<80;indice++)
        agregar_opcion('vista_programacion_completa','rap',8,9,indice,vficha)

    consulta_horario(vficha,vstart,vend)
    document.getElementById("btnGuardar").disabled=false
    }
}

function agregar_opcion(tabla_buscada,id_select,valor,valor2,indice,campo){
    var combo = document.getElementsByName(id_select)[indice];
    document.getElementsByName(id_select)[indice].options.item(0).selected = 'selected';
    let url=""
    /*combo(tabla,id del elemento,valor a mostrar,segundo valor a mostrar,valor predeterminado,campo_buscado*/
    if (campo!='NA'){
         url = "http://127.0.0.1:5000/programacion_ficha/"+campo;
         limpia_combo(combo);
    }
    else{
        url = "http://127.0.0.1:5000/consulta_general/"+tabla_buscada;  
    }
                  fetch(url)
                  .then( response => response.json())
                  .then( data =>  visualizar(data) )
                  .catch( error => console.log(error))
              const visualizar = (data => {
                      for (var l = 0; l < data.datos.length; l++) { 
                        if (valor2==0)
                           v=data.datos[l][valor]
                        else
                           v=data.datos[l][valor]+" - "+data.datos[l][valor2]
                        //cadena_combo+=`<option ${s} value='${data.datos[l][0]}'>${v}</option>`;
                        option = document.createElement("option");
                        option.text = v;
                        if (campo!='NA')
                                option.value=data.datos[l][7] 
                        else
                                option.value=data.datos[l][0] 
                            
                        //if (seleccion== data.datos[l][0])
                         //  option.selected=""
                        if ((campo!='NA') && (option.value==1))
                            hj=0
                        else
                            combo.add(option);       
                    }              
       }  ) 
    }

function consulta_horario(vficha,vstart,vend){
    fecha_inicio = moment(vstart).format("YYYY/MM/DD");
    fecha_final = moment(vend).format("YYYY/MM/DD");
    //fecha_inicio=transform_fecha(vstart)
    //fecha_final=transform_fecha(vend)
    let modificar=0;
    let url = "http://127.0.0.1:5000/horario_ficha/"+"horario/"+vficha;
                 fetch(url)
                  .then( response => response.json())
                  .then( data =>  visualizar(data) )
                  .catch( error => console.log(error))
                    const visualizar = (data => {
                        console.log(data);  
                        //determinamos una variabe para saber si se modificara o si se insertaran registros
                        for (var l = 0; l < data.datos.length; l++) { 
                            //fecha1=transform_fecha(data.datos[l][3]);
                            //fecha2=transform_fecha(data.datos[l][4]);
                            fecha1=moment(data.datos[l][3]).format("YYYY/MM/DD");
                            fecha2=moment(data.datos[l][4]).format("YYYY/MM/DD");
                            //console.log(fecha_inicio," ",fecha_final," ",fecha1," ",fecha2)
                            if ((fecha1>=fecha_inicio && fecha1<=fecha_final) && (fecha2>=fecha_inicio && fecha2<=fecha_final)){
                                modificar=1;
                                vid= data.datos[l][6]+ data.datos[l][1];
                                console.log("entro", vid)
                                localStorage.setItem(vid,data.datos[l][0]);
                                //console.log(vid," ",data.datos[l][2])}
                                
                                document.getElementById(vid).options.item(data.datos[l][2]).selected = 'selected';
                                //console.log(vid+'RAP1'," ","l",data.datos[l][7])
                                // document.getElementById(vid+'RAP1').options.item(data.datos[l][7]-1).selected = 'selected';
                                // document.getElementById(vid+'RAP2').options.item(data.datos[l][8]-1).selected = 'selected';
                                // document.getElementById(vid+'RAP3').options.item(data.datos[l][9]-1).selected = 'selected';
                                // document.getElementById(vid+'RAP4').options.item(data.datos[l][10]-1).selected = 'selected';
                                document.getElementById(vid+'RAP1').value=data.datos[l][7];
                                document.getElementById(vid+'RAP2').value=data.datos[l][8]
                                document.getElementById(vid+'RAP3').value=data.datos[l][9]
                                document.getElementById(vid+'RAP4').value=data.datos[l][10]
                                $("#"+vid).change();
                                $("#"+vid+'RAP1').change();
                                $("#"+vid+'RAP2').change();
                                $("#"+vid+'RAP3').change();
                                $("#"+vid+'RAP4').change();
                                }
                        }
                        localStorage.setItem("modificar", modificar);
                    })
}

function enviar_horario(){
    c=localStorage.getItem("modificar");     
        for (b=0;b<bloques['idBloque'].length;b++){
            for(d=0;d<dias['dia'].length;d++){
                ide=bloques['idBloque'][b]+dias['dia'][d]
                var data= {};
                /***horario_bloque*/
                clave=column_horario['claves'][5]
                valor=bloques['idBloque'][b]; 
                data[clave]=valor;
                /***Horario_dia */
                clave=column_horario['claves'][0]
                valor=dias['dia'][d]; 
                data[clave]=valor;
                /***horario_instructor*/
                clave=column_horario['claves'][1]
                valor=document.getElementById(ide).value
                data[clave]=valor;
                /***horario_fecha_inicio*/
                clave=column_horario['claves'][2]
                valor=document.getElementById('start').value
                data[clave]=valor;
                /***horario_fecha_final*/
                clave=column_horario['claves'][3]
                valor=document.getElementById('end').value 
                data[clave]=valor;
                /***horario_ficha*/
                clave=column_horario['claves'][4]
                valor=document.getElementById('ficha').value
                data[clave]=valor;
                /***'rap1'*/
                clave=column_horario['claves'][6]
                valor=document.getElementById(ide+'RAP1').value
                data[clave]=valor;
                console.log(valor)
                /***'rap2'*/
                clave=column_horario['claves'][7]
                valor=document.getElementById(ide+'RAP2').value
                data[clave]=valor;
                /***'rap3'*/
                clave=column_horario['claves'][8]
                valor=document.getElementById(ide+'RAP3').value
                data[clave]=valor;
                /***'rap4'*/
                clave=column_horario['claves'][9]
                valor=document.getElementById(ide+'RAP4').value 
                data[clave]=valor;
                console.log(data);
                
                id_horario=localStorage.getItem(ide);
                registro_horario(data,id_horario)
                if (c==0){
                    swal("Registro Horario","Horario Guardado (El detalle de la acción se encuentra en la consola del explorador)", "success")
                }
                else{
                    swal("Actualización Horario","Horario actualizado (El detalle de la acción se encuentra en la consola del explorador)", "success")  
                }
            }
        }   
    }
    
function registro_horario(data,id){
    c=localStorage.getItem("modificar"); 
    let url,metodo,msgerror,msgsuccess;
    if (c==0){
        url = "http://127.0.0.1:5000/registro/horario";
        metodo="POST";
        msgerror="Error en registro:"
        msgsuccess="Registro agregado:"
    }
    else{
        url = "http://127.0.0.1:5000/actualizar/horario/"+id;
        metodo="put";
        msgerror="Error en la actualización:"
        msgsuccess="Registro actualizado:"
    }
console.log(data)
  fetch(url, {
    method: metodo, 
    body: JSON.stringify(data), 
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => visualizar(response));
    const visualizar = (response) => {
      if (response.mensaje=="Error")
        console.log(msgerror+data.horario_bloque+data.horario_dia)
      else
        console.log(msgsuccess+data.horario_bloque+data.horario_dia)
  }
  }

function reinicio_ficha(){
  document.getElementById('ficha').value='na';
  $("#ficha").change();
}

function transform_fecha(fecha){
    fecha = new Date(fecha);
    fecha= moment(fecha).format("YYYY/MM/DD");
    return fecha;
}
function limpia_combo(nombre_combo){
for (let i = nombre_combo.options.length; i > 0; i--) {
    nombre_combo.remove(i);
  }      
}
