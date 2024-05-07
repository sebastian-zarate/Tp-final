# Tp-final

* Se instaló mongodb.
* Se creo carpeta lib (/src/app/lib) con el contenido para la conexión con la base de datos.
* En el Atlas creo el cluster y establesco el método de conexión con la aplicación.


* * Copien su link del atlas (donde dice conectarse con drivers-app) a la variable de entorno en el archivo .env
* en el archivo .gitignore pongan en cualquier línea: .env (para que sea ignorado por git y no se suba a github o algo por el estilo).
* En el archivo schema.prisma se crean las colecciones para la base de datos. Los cambios que quieran actualizar de ese archivo: ejecuten el comando npx prisma generate
