from flask import Flask
from flask import render_template
from flask_cors import CORS
from flask import jsonify,request
import pymysql
from datetime import datetime

app=Flask(__name__)
## Nos permite acceder desde una api externa
CORS(app)
## Funcion para conectarnos a la base de datos de mysql

def conectar():
    vhost='localhost'
    vuser='root'
    vpass='1234'
    vdb='academica'
    conn = pymysql.connect(host=vhost, user=vuser, passwd=vpass, db=vdb, charset = 'utf8mb4')
    return conn
# funcion para obtener las columnas de las tablas y asi poder automatizarlas
def obtener_columnas(tabla):
    conn = pymysql.connect(host='localhost', user='root', passwd='1234', db='information_schema', charset = 'utf8mb4')
    sql="""SELECT COLUMN_NAME FROM COLUMNS WHERE TABLE_SCHEMA='academica' AND COLUMN_NAME<>'"""+tabla+"_id" +"""' AND TABLE_NAME='"""+tabla+"""'""" 
    cur = conn.cursor()
    cur.execute(sql)
    columnas=cur.fetchall()
    data=[]
    l=len(columnas)
    cadena1=""
    cadena2=""
    cadena3=""
    cadena4=""
    ciclo=0
    for row in columnas:
        data.append(row[0])
        cadena1+=row[0]
        cadena2+='{'+str(ciclo)+'}'
        #tipod=type(request.json[row[0]])
        #if tipod is str:
        cadena3+="""'"""+request.json[row[0]]+"""'"""
        cadena4+=row[0]+"""='"""+request.json[row[0]]+"""'"""
        #else:
        #    cadena3+=request.json[row[0]]
        ciclo=ciclo+1
        if (ciclo)!=l:
            cadena1+=','
            cadena2+=','
            cadena3+=','
            cadena4+=','
    #print(data)
    ##print("Cadena1 :",cadena1,"Cadena2 :",cadena2,"Cadena3 :",cadena3,"Cadena4 :",cadena4)
    cur.close()
    conn.close()
    return cadena1,cadena2,cadena3,cadena4

# @app.route("/")
# def principal():
#     return render_template("frontend/index.html")
# Ruta para consulta general de las tablas

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/consulta_general/<tabla>")
def consulta_general(tabla=""):
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" SELECT * FROM """ + tabla 
        cur.execute(sql)
        datos=cur.fetchall()
        ##print(datos)
        # data=[]
        # for row in datos:
        #     dato={'fase_id':row[0b],'fase':row[1]}
        #     data.append(dato)
        cur.close()
        conn.close()
        return jsonify({'datos':datos,'mensaje':'Registros encontrados'})
    except Exception as ex:
        print (ex)
        return jsonify({'mensaje':'Error'})

@app.route("/consulta_individual/<tabla>/<codigo>",methods=['GET'])
def consulta_individual(tabla="",codigo=0):
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" SELECT * FROM """+tabla+""" where """+tabla+"_id={0}""".format(codigo) 
        cur.execute(sql)
        datos=cur.fetchone()
        cur.close()
        conn.close()
        if datos!=None:
            #dato={'id_baul':datos[0],'Plataforma':datos[1],'usuario':datos[2],'clave':datos[3]}
            return jsonify({'datos':datos,'mensaje':'Registro encontrado'})  
        else:
            return jsonify({'mensaje':'Registro no encontrado'})     
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})
    
@app.route("/registro/<tabla>",methods=['POST'])
def registro(tabla=''):
    try:
        cadena1,cadena2,cadena3,cadena4=obtener_columnas(tabla)
        conn=conectar()
        cur = conn.cursor()
        #sql="""insert into """+tabla+"""("""+cadena1+""") values ('"""+cadena2+"""')""".format(cadena3)
        sql="""insert into """+tabla+"""("""+cadena1+""") values ("""+str(cadena3)+""")"""
        print(sql)
        cur.execute(sql)
        conn.commit() ## Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje':'Registro agregado'}) 
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})
        
@app.route("/eliminar/<tabla>/<codigo>",methods=['DELETE'])
def eliminar(tabla="",codigo=0):
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" delete from """+tabla+""" where """+tabla+"_id={0}""".format(codigo) 
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje':'eliminado'}) 
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})
    
@app.route("/actualizar/<tabla>/<codigo>",methods=['PUT'])
def actualizar(tabla,codigo):
    try:
        cadena1,cadena2,cadena3,cadena4=obtener_columnas(tabla)
        conn=conectar()
        cur = conn.cursor()
        sql="""update """+tabla+""" set """ +cadena4+""" where """+tabla+"_id={0}""".format(codigo)
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje':'Registro Actualizado'}) 
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})

@app.route("/programacion_ficha/<codigo>",methods=['GET'])
def programacion_ficha(codigo=0):
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" SELECT * FROM vista_programacion_completa where prog_ficha={0} and prog_estado<>'CALIFICADO'""".format(codigo) 
        cur.execute(sql)
        datos=cur.fetchall()
        cur.close()
        conn.close()
        if datos!=None:
            #dato={'id_baul':datos[0],'Plataforma':datos[1],'usuario':datos[2],'clave':datos[3]}
            return jsonify({'datos':datos,'mensaje':'Registro encontrado'})  
        else:
            return jsonify({'mensaje':'Registro no encontrado'})     
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})

@app.route("/horario_ficha/<tabla>/<codigo>",methods=['GET'])
def horario_ficha(tabla,codigo=0):
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" SELECT * FROM """+tabla+""" where horario_ficha={0} order by horario_bloque,horario_dia""".format(codigo) 
        cur.execute(sql)
        datos=cur.fetchall()
        cur.close()
        conn.close()
        if datos!=None:
            print(datos)
            return jsonify({'datos':datos,'mensaje':'Registro encontrado'})  
        else:
            return jsonify({'mensaje':'Registro no encontrado'})     
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})
    
@app.route("/programacion_resumen/<ficha>",methods=['GET'])
def programacion_resumen(ficha=0):
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" SELECT max(programa_nombre) programa,max(ficha_nombre) ficha,max(prog_estado) Estado,count(prog_estado) Total,count(prog_estado)/75*100 porcentaje FROM vista_programacion_completa where ficha_nombre={0} group by ficha_nombre,prog_estado""".format(ficha) 
        cur.execute(sql)
        datos=cur.fetchall()
        cur.close()
        conn.close()
        if datos!=None:
            return jsonify({'datos':datos,'mensaje':'Registro encontrado'})  
        else:
            return jsonify({'mensaje':'Registro no encontrado'})     
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})
    
@app.route("/programacion_resumen_total/",methods=['GET'])
def programacion_resumen_total():
    try:
        conn=conectar()
        cur = conn.cursor()
        sql=""" SELECT max(programa_nombre) programa,max(ficha_nombre) ficha,max(prog_estado) Estado,count(prog_estado) Total,count(prog_estado)/75*100 porcentaje FROM vista_programacion_completa group by ficha_nombre,prog_estado""" 
        cur.execute(sql)
        datos=cur.fetchall()
        cur.close()
        conn.close()
        if datos!=None:
            #dato={'id_baul':datos[0],'Plataforma':datos[1],'usuario':datos[2],'clave':datos[3]}
            return jsonify({'datos':datos,'mensaje':'Registro encontrado'})  
        else:
            return jsonify({'mensaje':'Registro no encontrado'})     
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje':'Error'})
    
if __name__=='__main__':
    app.run(debug=True)