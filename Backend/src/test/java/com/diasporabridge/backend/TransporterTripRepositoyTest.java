package com.diasporabridge.backend;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.TransporterTripRepository;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.services.UserService;

@SpringBootTest
public class TransporterTripRepositoyTest {
	
	@Autowired private UsersRepository usersRepository;
	@Autowired private TransporterTripRepository transporterTripRepository;
	@Autowired private UserService userService;

	
	@Test
	void createTransporterTrip_persists() {
	  String email = "transporter237-2+" + System.currentTimeMillis() + "@mail.com";

	  User transporter = new User(
	      null, 
	      email, 
	      "SecurePass123!",
	      User.Role.TRANSPORTER, 
	      "Marc", 
	      "Brice", 
	      "+49151111222300",
	      true, 
	      true, 
	      null, 
	      Instant.now(), Instant.now()
	  );
	  usersRepository.save(transporter);

	  TransporterTrip trip = TransporterTrip.builder()
	      .transporter(transporter)
	      .originCity("Achen").originCountry("Germany")
	      .destCity("Nkongsamba").destCountry("Cameroon")
	      .departDate(LocalDate.of(2025, 11, 20))
	      .maxWeightKg(new BigDecimal("25.5"))
	      .acceptedTypes("DOCUMENT,PHONE,LAPTOP")
	      .note("Je ne transporte pas des habits.")
	      .isActive(true)
	      .build();

	  TransporterTrip saved = transporterTripRepository.save(trip);
	  assertNotNull(saved.getId());
	}
}
