package com.diasporabridge.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.diasporabridge.backend.entities.ParcelRequest;
import com.diasporabridge.backend.repos.ParcelRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ParcelRequestService {
  private final ParcelRequestRepository parcelRepo;

  public Page<ParcelRequest> listForSender(Long senderId, Pageable pageable) {
    return parcelRepo.findBySender_IdOrderByCreatedAtDesc(senderId, pageable);
  }

  public boolean deleteOwned(Long id, Long senderId) {
    return parcelRepo.deleteByIdAndSender_Id(id, senderId) > 0;
  }
}
