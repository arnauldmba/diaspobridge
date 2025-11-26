package com.diasporabridge.backend;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import com.diasporabridge.backend.entities.ParcelRequest;
import com.diasporabridge.backend.entities.User;
import com.diasporabridge.backend.repos.ParcelRequestRepository;
import com.diasporabridge.backend.repos.UsersRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional @Commit
class ParcelRequestRepositoryTest {

  @Autowired UsersRepository usersRepository;
  @Autowired ParcelRequestRepository parcelRepo;

  @Test
  void createParcelRequest_persists() {
    User sender = usersRepository.save(
        User.builder()
            .email("sender+"+System.currentTimeMillis()+"@mail.com")
            .passwordHash("hash")
            .role(User.Role.SENDER)
            .firstName("Lionel").lastName("Mannheim")
            .isActive(true).emailVerified(true)
            .build()
    );

    ParcelRequest pr = ParcelRequest.builder()
        .sender(sender)
        .itemTitle("Ipad 13")
        .itemType(ParcelRequest.ItemType.PHONE)
        .weightKg(new BigDecimal("1.45"))
        .originCity("Duisburg").originCountry("Germany")
        .destCity("Edea").destCountry("Cameroon")
        .desiredDate(LocalDate.now().plusDays(20))
        .status(ParcelRequest.Status.REQUESTED)
        .note("Bien emballé, fragile")
        .build();

    ParcelRequest saved = parcelRepo.save(pr);
    assertNotNull(saved.getId());
  }
}