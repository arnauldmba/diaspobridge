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
class BackendApplicationTests {
	
	@Autowired
	private UsersRepository usersRepository;
	@Autowired
	private TransporterTripRepository transporterTripRepository;
	
	@Autowired
	private UserService userService;
	
	
	/**
	 * test l ajouter un transporteur
	 */
	@Test
	void createTransporterTrip_persists() {
	  String email = "transporter+" + System.currentTimeMillis() + "@mail.com";

	  User transporter = new User(
	      null, email, "SecurePass123!",
	      User.Role.TRANSPORTER, "Jean", "Mbappe", "+49151111222333",
	      true, true, null, Instant.now(), Instant.now()
	  );
	  usersRepository.save(transporter);

	  TransporterTrip trip = TransporterTrip.builder()
	      .transporter(transporter)
	      .originCity("Düsseldorf").originCountry("Germany")
	      .destCity("Douala").destCountry("Cameroon")
	      .departDate(LocalDate.of(2025, 11, 20))
	      .maxWeightKg(new BigDecimal("25.5"))
	      .acceptedTypes("DOCUMENT,PHONE,LAPTOP")
	      .note("Je peux aussi transporter des habits.")
	      .isActive(true)
	      .build();

	  TransporterTrip saved = transporterTripRepository.save(trip);
	  assertNotNull(saved.getId());
	}
	
	@Test
	void createTransporterTrip_persists2() {
	  String email = "transporter+" + System.currentTimeMillis() + "@mail.com";

	  User transporter = new User(
	      null, email, "SecurePass123!",
	      User.Role.TRANSPORTER, "Manuel", "Eboue", "+49156519222323",
	      true, true, null, Instant.now(), Instant.now()
	  );
	  usersRepository.save(transporter);

	  TransporterTrip trip = TransporterTrip.builder()
	      .transporter(transporter)
	      .originCity("Francfort").originCountry("Germany")
	      .destCity("Yaounde").destCountry("Cameroon")
	      .departDate(LocalDate.of(2025,07, 01))
	      .maxWeightKg(new BigDecimal("25.5"))
	      .acceptedTypes("DOCUMENT,PHONE,LAPTOP")
	      .note("Appareil numerique uniquement.")
	      .isActive(true)
	      .build();

	  TransporterTrip saved = transporterTripRepository.save(trip);
	  assertNotNull(saved.getId());
	}



}
