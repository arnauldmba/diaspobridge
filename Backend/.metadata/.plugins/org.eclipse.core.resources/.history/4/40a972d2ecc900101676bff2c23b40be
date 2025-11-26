package com.diasporabridge.backend.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.diasporabridge.backend.entities.TransporterTrip;
import com.diasporabridge.backend.repos.TransporterTripRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransporterTripServiceImpl implements TransporterTripService {
	
	//@Autowired 
	private final TransporterTripRepository transporterTripRepository;

	@Override
	public TransporterTrip saveTransporterTrip(TransporterTrip transporterTrip) {
		return transporterTripRepository.save(transporterTrip);
	}

	@Override
	public TransporterTrip updateTransporterTrip(TransporterTrip transporterTrip) {
		return transporterTripRepository.save(transporterTrip);
	}

	@Override
	public void deleteTransporterTrip(TransporterTrip transporterTrip) {
		transporterTripRepository.delete(transporterTrip);
	}

	@Override
	public void deleteTransporterTripById(Long id) {
		transporterTripRepository.deleteById(id);
	}

	@Override
	public List<TransporterTrip> getAllTransporterTrip() {
		return transporterTripRepository.findAll();
	}
	
	@Override
	public List<TransporterTrip> getActiveTrips() {
	    return transporterTripRepository.findByIsActiveTrue(Pageable.unpaged()).getContent();
	}

	@Override
	public Page<TransporterTrip> searchTrips(String origin, String dest, LocalDate fromDate, LocalDate toDate,
			boolean activeOnly, Pageable pageable) {
		return transporterTripRepository.searchTrips(origin, dest, fromDate, toDate, activeOnly, pageable);
	}
	
	@Override
	public Optional<TransporterTrip> getTransporterTripById(Long id) {
	    return transporterTripRepository.findById(id);
	}

}
