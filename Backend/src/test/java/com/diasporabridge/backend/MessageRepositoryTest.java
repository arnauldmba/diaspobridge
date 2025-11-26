package com.diasporabridge.backend;


import com.diasporabridge.backend.entities.Match;
import com.diasporabridge.backend.entities.Message;
import com.diasporabridge.backend.entities.ParcelRequest;
import com.diasporabridge.backend.entities.ParcelRequest.ItemType;
import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.MatchRepository;
import com.diasporabridge.backend.repos.MessageRepository;
import com.diasporabridge.backend.repos.ParcelRequestRepository;
import com.diasporabridge.backend.repos.TransporterTripRepository;
import com.diasporabridge.backend.repos.UsersRepository;
import com.diasporabridge.backend.services.UserService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import jakarta.persistence.EntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // on garde H2 config dans application-test.yml
class MessageRepositoryTest {

  @Autowired EntityManager em;
  @Autowired UsersRepository userRepo;
  @Autowired MatchRepository matchRepo;
  @Autowired MessageRepository messageRepo;
  @Autowired private TransporterTripRepository tripRepo;
  @Autowired ParcelRequestRepository parcelRepo;
  String uid = java.util.UUID.randomUUID().toString().substring(0,8);


  @Test
  void chatEntreDeuxParticipants_ok() throws Exception {
    // --- Arrange : 2 users + parcel + trip + match ---
    User sender = userRepo.save(User.builder()
    	.email("sender+" + uid + "@mail.com").passwordHash("x").role(User.Role.SENDER).build());

    User transporter = userRepo.save(User.builder()
    	.email("transporter+" + uid + "@mail.com").passwordHash("x").role(User.Role.TRANSPORTER).build());

    ParcelRequest parcel = new ParcelRequest();
    parcel.setSender(sender);
    parcel.setOriginCountry("DE");
    parcel.setOriginCity("Essen");
    parcel.setDestCountry("CM");
    parcel.setDestCity("Douala");
    parcel.setItemTitle("Laptop 15\"");
    parcel.setItemType(ItemType.LAPTOP);     // 👈 si NOT NULL aussi
    parcel.setWeightKg(BigDecimal.valueOf(2.5));
    parcelRepo.save(parcel);

    TransporterTrip trip = tripRepo.save(TransporterTrip.builder()
        .transporter(transporter)
        .destCountry("CM").destCity("Douala")
        .departDate(LocalDate.of(2025, 11, 20))
        .build());

    Match match = matchRepo.save(Match.builder()
        .parcel(parcel)
        .trip(trip)
        .build());

    // --- Act : on envoie 3 messages ---
    Message m1 = new Message();
    m1.setMatch(match);
    m1.setSender(sender);
    m1.setBody("Salut, tu pars quand ?");
    messageRepo.save(m1); // sentAt rempli par @PrePersist
    Thread.sleep(5); // (petit delta pour l'ordre, facultatif)

    Message m2 = new Message();
    m2.setMatch(match);
    m2.setSender(transporter);
    m2.setBody("Je pars samedi matin.");
    messageRepo.save(m2);
    Thread.sleep(5);

    Message m3 = new Message();
    m3.setMatch(match);
    m3.setSender(sender);
    m3.setBody("Super, on s’organise !");
    messageRepo.save(m3);

    // --- Assert : lecture ASC, puis DESC ---
    Page<Message> asc = messageRepo.findByMatchIdOrderBySentAtAsc(
        match.getId(), PageRequest.of(0, 10));
    assertEquals(3, asc.getTotalElements());
    assertEquals("Salut, tu pars quand ?", asc.getContent().get(0).getBody());
    assertEquals("Je pars samedi matin.",  asc.getContent().get(1).getBody());
    assertEquals("Super, on s’organise !", asc.getContent().get(2).getBody());

    Page<Message> desc = messageRepo.findByMatchIdOrderBySentAtDesc(
        match.getId(), PageRequest.of(0, 2)); // pagination: 2 derniers
    assertEquals(3, desc.getTotalElements());
    assertEquals(2, desc.getNumberOfElements());
    assertEquals("Super, on s’organise !", desc.getContent().get(0).getBody());
    assertEquals("Je pars samedi matin.",  desc.getContent().get(1).getBody());

    // Filtre par sender dans le match
    Page<Message> onlySender = messageRepo.findByMatchIdAndSenderIdOrderBySentAtDesc(
        match.getId(), sender.getId(), PageRequest.of(0, 10));
    assertEquals(2, onlySender.getTotalElements());
  }

  
}
