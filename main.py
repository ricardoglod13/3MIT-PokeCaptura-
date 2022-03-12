#Importando librerias
from flask import Flask, render_template, request, redirect, url_for
import json
import mariadb
import time

#Creando el objeto tipo Flask
app = Flask(__name__)
conn = mariadb.connect( 
    host='localhost', 
    port=3306, 
    user='root', 
    password='12345', 
    database='pokeDB')
cursor = conn.cursor()

#Renderizando index.html y creando la ruta
@app.route('/index')
@app.route('/')
def index():
    return render_template('index.html')

#Obteniendo el usuario y si no existe guardandolo en la base de datos
@app.route('/pokeLogin', methods=['POST'])
def pokeCaptura():
    if request.method == 'POST':
        username = request.form['nombre']
        if username:
            user = exist(username)
            if user:
                return json.dumps(user)
            else:
                cursor.execute(f"INSERT INTO usuarios (nombre) VALUES ('{username}')")
                newUser = conn.commit()
                return json.dumps(newUser)
        else:
            return 'El usuario es requerido'

#Ruta de la pagina donde se capturan los pokemones
@app.route('/principal')
def principal():
    return render_template('principal.html')

#Obteniendo los datos del ApiStorage de JavaScript
@app.route('/json', methods=['POST'])
def sendJson():
    if request.method == 'POST':
        global infoDB
        infoDB = request.get_json()
        sql(infoDB)
    return redirect(url_for('principal'))

#Creando ruta para la vista de los usuarios
@app.route('/usuario')
def usuario():
    return render_template('usuario.html')

#Enviando array con los ID de lospokemones del usuario a JavaScript
@app.route('/pokeUsuario', methods=['GET'])
def pokeUsuario():
    username = request.args['username']
    if username:
        user = exist(username)
        if user:
            cursor.execute(f"SELECT id_poke FROM usuarios_pokemones WHERE id_usu = '{user[0]}'")
            executor = cursor.fetchall()
            userPokemons = corregirTxt(executor)
            list_id = []
            for id in userPokemons:
                list_id.append(id['id_poke'])
            return json.dumps(list_id)
        else:
            return 'No existe el usurio'

#Verificando si existeel usuario
def exist(username):
    cursor.execute(f"SELECT * FROM usuarios WHERE nombre = '{username}'")
    return cursor.fetchone()

#Convirtiendo la lista con tuplas en unalista con diccionarios
def corregirTxt(executor):
    insertObject = []
    columnNames = [column[0] for column in cursor.description]
    for record in executor:
        insertObject.append( dict( zip( columnNames , record ) ) )
    return insertObject

#Ingresando la informacion de lospokemones capturado, si y solo si no existen en la base
def sql(infoDB):
    if infoDB != None:
        nombre = infoDB['nombre_usu']
        if nombre != None:
            nombre = json.loads(nombre)
            nombre = nombre['username']
        nombre_poke = infoDB['nombre_poke']
        id_poke = infoDB['id_poke']

        if nombre_poke != None and id_poke != None:
            cursor.execute(f"SELECT id FROM pokemones_capturados WHERE id = '{id_poke}'")
            executor1 = cursor.fetchall()
            if executor1:
                pass
            else:
                cursor.execute(f"INSERT INTO pokemones_capturados (id, nombre) VALUES ('{id_poke}','{nombre_poke}')")
                conn.commit()

        if nombre != None and id_poke != None:
            cursor.execute(f"SELECT id FROM usuarios WHERE nombre = '{nombre}'")
            id_usu = cursor.fetchone()
            id_usu = corregirId(id_usu)
            cursor.execute(f"SELECT id_poke, id_usu FROM usuarios_pokemones WHERE id_usu = '{id_usu}' AND id_poke = '{id_poke}'")
            executor2 = cursor.fetchall()
            if executor2:
                pass
            else:
                cursor.execute(f"INSERT INTO usuarios_pokemones (id_poke, id_usu) VALUES ('{id_poke}', '{id_usu}')")
                conn.commit()
    nombre_poke = None;
    id_poke = None;

#Convitiendo tupla en dato crudo
def corregirId(id_usu):
    id_usu = str(id_usu)
    id_usu = id_usu.strip('(')
    id_usu = id_usu.strip(')')
    id_usu = id_usu.strip(',')
    return id_usu

#Llamando al objeto Flask y corriendo el servidor
if __name__ == '__main__':
    app.run(debug=True)