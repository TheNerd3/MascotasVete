export const environment = {
  production: false,
  // Backend corriendo directo desde el IDE (mvnw spring-boot:run), sin
  // Docker. Si el backend corre en Docker (ver docker-compose.yml del
  // repo MascotasVeteBack), cambiar esta URL a
  // http://localhost:8085/api/v1 (el prefijo "/api/v1" lo agrega el
  // context path con el que Tomcat despliega el WAR).
  apiUrl: 'http://localhost:8080',
};
