**Pasos para mota el proyecto**

	1. Para correr el proyecto debe tener instalado Maridb, Python3, Flask y el conector de mariadb en python.

	2. Flask: en el cmd colocar pip install flask.

	3. Maridb Connector: en el cmd colocar pip install mariadb.	

	4. En algun manejador de base de datos copiar la informacion del archivo 
	create_tables.txt que está en la carpeta database, esto creara la base de datos 
	(Utilice mariaDB ya que no tengo conocimientos en MongoDB).

	5. En el archivo main.py cambiar el user y password de la conexion a la base 
	(ubicados en la linea 12 y 13 respectivamente) por el que se va a utilizar.

	6. Ejecutar el archivo main.py y luego introducir en el navegador http://localhost:5000