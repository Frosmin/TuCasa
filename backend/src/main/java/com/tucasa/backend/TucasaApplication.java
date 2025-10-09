package com.tucasa.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TucasaApplication {

	public static void main(String[] args) {
		SpringApplication.run(TucasaApplication.class, args);
		System.out.println("TuCasa v 0.1.0 started....");
	}

}
