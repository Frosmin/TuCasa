package com.tucasa.backend;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TucasaApplication {

	public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));


		SpringApplication.run(TucasaApplication.class, args);
		System.out.println("TuCasa v 0.1.0 started....");
	}

}
