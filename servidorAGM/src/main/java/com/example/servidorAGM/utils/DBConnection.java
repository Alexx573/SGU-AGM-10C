package com.example.servidorAGM.utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class DBConnection {
    @Value("${db.host}")
    private String host;
    @Value("${db.port}")
    private String port;
    @Value("${db.name}")
    private String name;
    @Value("${db.pass}")
    private String password;
    @Value("${db.user}")
    private String user;

    @Bean
    public DataSource getDBConnection() {

        DriverManagerDataSource source = new DriverManagerDataSource();

        source.setDriverClassName("com.mysql.cj.jdbc.Driver");
        String url = "jdbc:mysql://" + host + ":" + port + "/" + name +
                "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        source.setUrl(url);
        source.setUsername(user);
        source.setPassword(password);

        return source;
    }
}
