package com.diasporabridge.backend;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.ParcelRequest;
import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.ParcelRequestRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;
import com.diasporabridge.backend.repos.UsersRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional @Commit
public class MatchRequestRepositoryTest {
	
	@Autowired UsersRepository usersRepository;
	@Autowired ParcelRequestRepository parcelRepo;
	@Autowired TransporterTripRepository tripRepo;
	@Autowired MatchRepository matchRepository; 
	
	String email = "sender+" + UUID.randomUUID() + "@mail.com";

	@Test
	void createMatch_persists() {
		// Crée un sender, un transporter, un parcel, un trip, etc.
	    User sender = usersRepository.save(new User(null, "sender-"+email, "pw", User.Role.SENDER, "John", "Doe", null, true, true, null, Instant.now(), Instant.now()));
	    User transporter = usersRepository.save(new User(null, "transporter-"+email, "pw", User.Role.TRANSPORTER, "Marc", "Ngassa", null, true, true, null, Instant.now(), Instant.now()));

	    ParcelRequest parcel = parcelRepo.save(ParcelRequest.builder()
	        .sender(sender)
	        .itemTitle("MacBook Pro")
	        .itemType(ParcelRequest.ItemType.LAPTOP)
	        .originCity("Essen")
	        .originCountry("Germany")
	        .destCity("Yaoundé")
	        .destCountry("Cameroon")
	        .build());

	    TransporterTrip trip = tripRepo.save(TransporterTrip.builder()
	        .transporter(transporter)
	        .originCity("Düsseldorf")
	        .originCountry("Germany")
	        .destCity("Yaoundé")
	        .destCountry("Cameroon")
	        .departDate(LocalDate.now().plusDays(10))
	        .build());

	    Match match = Match.builder()
	        .parcel(parcel)
	        .trip(trip)
	        .proposedBy(Match.ProposedBy.SENDER)
	        .priceEur(new BigDecimal("50.00"))
	        .status(Match.MatchStatus.PENDING)
	        .build();

	    matchRepository.save(match);
	}

}
